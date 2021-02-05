import { Context } from 'js-slang';
import { Frame } from './components/Frame';
import {
  isArray,
  isArrayData,
  isEmptyEnvironment,
  isFn,
  isFunction,
  isPairData,
  isPrimitiveData
} from './utils';
import { Env, Data } from './types';
import { Level } from './components/Level';
import { ArrayValue } from './components/binding/value/ArrayValue';
import { FnValue } from './components/binding/value/FnValue';
import { GlobalFnValue } from './components/binding/value/GlobalFnValue';
import { PairValue } from './components/binding/value/PairValue';
import { PrimitiveValue } from './components/binding/value/PrimitiveValue';
import { Value } from './components/binding/Value';

/** this class encapsulates the logic for calculating the layout */
export class Layout {
  static envs: Env[];
  static context: Context;
  /** array of levels, which themselves are arrays of frames */
  static levels: Level[];
  /** the Value objects in this layout. note that this corresponds to the data array,
   * that is, value[i] has underlying data data[i] */
  static values: Value[];
  /** the data in this layout (primitives, arrays, functions, etc). note that this corresponds
   * to the value array, that is, data[i] has corresponding Value object value[i] */
  static data: Data[];

  /** processes the runtime context from JS Slang */
  static setContext(context: Context) {
    // clear/initialize data and value arrays
    this.data = [];
    this.values = [];
    this.levels = [];

    // we doubly link the envs so that we can process them 'top-down'
    // and remove references to empty environments
    this.envs = context.runtime.environments;
    this.doublyLinkEnv();
    this.removeEmptyEnvRefs();

    // TODO: fix remove empty envs
    // TODO: refactor childEnvs to enclosingEnvs
    // TODO: remove distinction bet. pairs and arrays
    // TODO: merge global env and lib env

    // initialize levels and frames
    this.initializeLevels();
  }

  /** to each environment, add an array of references to child environments,
   *  making them doubly linked */
  private static doublyLinkEnv() {
    const visitedEnvs: Env[] = [];
    const visitedValues: Data[] = [];

    // recursively process environments while keep tracking of the previous env
    const processEnv = (curr: Env | null, prev: Env | null) => {
      if (!curr) return;

      // add prev env to child env list of curr env
      if (prev) {
        if (curr.childEnvs) {
          if (!curr.childEnvs.includes(prev)) curr.childEnvs.push(prev);
        } else {
          curr.childEnvs = [prev];
        }
      }

      // check if we have already processed this env
      if (visitedEnvs.includes(curr)) return;
      visitedEnvs.push(curr);

      // recursively process values in frame
      Object.values(curr.head).forEach(processValue);
      function processValue(data: Data) {
        // mark as visited to account for cyclic structures
        if (visitedValues.includes(data)) return;
        visitedValues.push(data);

        if (isFn(data)) {
          processEnv(data.environment, null);
        } else if (isArray(data)) {
          data.forEach(processValue);
        }
      }

      processEnv(curr.tail, curr);
    };

    processEnv(this.envs[0], null);
  }

  /** remove references to empty environments */
  private static removeEmptyEnvRefs() {
    this.envs.forEach(env => {
      if (isEmptyEnvironment(env) && env.tail) // TODO: remove env.tail's ref to this

      // remove references to empty envs in our child list
      if (env.childEnvs) {
        env.childEnvs = env.childEnvs.filter(e => !isEmptyEnvironment(e));
      }

      // if we are the global frame or don't point to an empty frame, we are done
      if (!env.tail || !isEmptyEnvironment(env.tail)) return;

      // else, we find the closest non-empty ancestor environment
      let ptr: Env = env.tail;
      while (ptr && isEmptyEnvironment(ptr) && ptr.tail) ptr = ptr.tail;

      // and update the references
      env.tail = ptr;
      if (ptr.childEnvs) ptr.childEnvs.push(env);
    });
  }

  /** initializes levels */
  private static initializeLevels() {
    const globalEnv: Env = this.envs[this.envs.length - 1];
    this.levels = [new Level([new Frame(globalEnv, null, null)])];

    // checks if the any of the frames in a level contains a child
    const containsChildEnv = (level: Level) =>
      level.frames.reduce<boolean>(
        (A, { environment: e }) => A || (!!e.childEnvs && e.childEnvs.length > 0),
        false
      );

    // continue until the previous level's frames have no more child
    while (containsChildEnv(this.levels[this.levels.length - 1])) {
      const frames: Frame[] = [];
      this.levels[this.levels.length - 1].frames.forEach(
        frame =>
          frame.environment.childEnvs &&
          frame.environment.childEnvs.forEach(env => {
            const newFrame = new Frame(env, frame, frames ? frames[frames.length - 1] : null);
            frames.push(newFrame);
            env.frame = newFrame;
          })
      );

      this.levels.push(new Level(frames));
    }
  }

  /** create an instance of the corresponding `Value` if it doesn't already exists,
   *  else, return the existing value */
  static createValue(data: Data): Value {
    // primitives don't have to be memoised
    if (isPrimitiveData(data)) {
      return new PrimitiveValue(data);
    } else {
      // try to find if this value is already created
      const idx = this.data.findIndex(d => d === data);
      if (idx !== -1) return this.values[idx];
        
      // else create a new one
      let newValue: Value = new PrimitiveValue(null);
      if (isPairData(data)) {
        newValue = new PairValue(data);
      } else if (isArrayData(data)) {
        newValue = new ArrayValue(data);
      } else if (isFunction(data)) {
        if (isFn(data)) {
          // normal JS Slang function
          newValue = new FnValue(data);
        } else {
          // function from the global env (has no extra props such as env, fnName)
          newValue = new GlobalFnValue(data);
        }
      }

      // and memoise it
      this.values.push(newValue);
      this.data.push(data);
      return newValue;
    }
  }
}
