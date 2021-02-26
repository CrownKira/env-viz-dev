import { Context } from 'js-slang';
import { isArray, isEmptyEnvironment, isFn, isFunction, isPrimitiveData } from './utils';
import { Env, Data, ReferenceType } from './types';
import { Level } from './components/Level';
import { ArrayValue } from './components/binding/value/ArrayValue';
import { FnValue } from './components/binding/value/FnValue';
import { GlobalFnValue } from './components/binding/value/GlobalFnValue';
import { PrimitiveValue } from './components/binding/value/PrimitiveValue';
import { Value } from './components/binding/Value';
import { Dimension } from './Dimension';
import { Arrow } from './components/Arrow';
import { Rect } from 'react-konva';

/** this class encapsulates the logic for calculating the layout */
export class Layout {
  /** the height of the stage */
  static height: number;
  /** the width of the stage */
  static width: number;
  /** the global environment */
  static globalEnv: Env;
  /** the environment in which the user places the breakpoint */
  static breakpointEnv: Env;
  /** array of levels, which themselves are arrays of frames */
  static levels: Level[];
  /** the Value objects in this layout. note that this corresponds to the data array,
   * that is, `value[i]` has underlying data `data[i]` */
  static values: Value[];
  /** the data in this layout (primitives, arrays, functions, etc). note that this corresponds
   * to the value array, that is, `data[i]` has corresponding Value object `value[i]` */
  static data: Data[];
  /** the unique key assigned to each node */
  static key: number = 0;

  /** processes the runtime context from JS Slang */
  static setContext(context: Context) {
    // clear/initialize data and value arrays
    this.data = [];
    this.values = [];
    this.levels = [];
    this.key = 0;

    const envs = context.runtime.environments;
    this.globalEnv = envs[envs.length - 1];
    this.breakpointEnv = envs[0];

    // we doubly link the envs so that we can process them 'top-down'
    // we then remove references to empty environments
    this.doublyLinkEnv();
    this.removeEmptyEnvRefs();

    // TODO: refactor childEnvs to enclosingEnvs
    // TODO: merge global env and lib env

    // initialize levels and frames
    this.initializeLevels();

    // calculate height and width by considering lowest and widest level
    const lastLevel = this.levels[this.levels.length - 1];
    this.height = Math.max(Dimension.CanvasMinHeight, lastLevel.y + lastLevel.height + Dimension.CanvasPaddingY);
    this.width = Math.max(
      Dimension.CanvasMinWidth,
      this.levels.reduce<number>((maxWidth, level) => Math.max(maxWidth, level.width), 0) + Dimension.CanvasPaddingX * 2
    );
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

    processEnv(this.breakpointEnv, null);
  }

  /** remove references to empty environments */
  private static removeEmptyEnvRefs() {
    const extractNonEmptyEnvs = (env: Env): Env[] => {
      const nonEmptyEnvs: Env[] = [];
      // recursively extract non empty envs of children
      if (env.childEnvs) env.childEnvs.forEach(e => nonEmptyEnvs.push(...extractNonEmptyEnvs(e)));
      // update child envs list, including only non empty ones
      env.childEnvs = nonEmptyEnvs;
      // if we are empty, don't return ourselves
      return isEmptyEnvironment(env) ? nonEmptyEnvs : [env];
    }

    // start extracting from global env
    extractNonEmptyEnvs(this.globalEnv);
  }

  /** initializes levels */
  private static initializeLevels() {
    /** checks if the any of the frames in a level contains a child */
    const containsChildEnv = (level: Level): boolean =>
      level.frames.reduce<boolean>(
        (A, { environment: e }) => A || (!!e.childEnvs && e.childEnvs.length > 0),
        false
      );

    /** get the child levels if any */
    const getNextLevels = (prevLevel: Level): Level[] => {
      const accLevels: Level[] = [];
      if (containsChildEnv(prevLevel)) {
        const currLevel = new Level(prevLevel);
        accLevels.push(currLevel, ...getNextLevels(currLevel));
      }

      return accLevels;
    };

    const globalLevel = new Level(null);
    this.levels.push(globalLevel, ...getNextLevels(globalLevel));
  }

  /** memoize value (applicable to non-primitive value to
   *  prevent running into cyclic issues) */
  static memoizeValue(value: Value) {
    this.data.push(value.data);
    this.values.push(value);
  }

  /** create an instance of the corresponding `Value` if it doesn't already exists,
   *  else, return the existing value */
  static createValue(data: Data, reference: ReferenceType): Value {
    // primitives don't have to be memoized
    if (isPrimitiveData(data)) {
      return new PrimitiveValue(data, [reference]);
    } else {
      // try to find if this value is already created
      const idx = this.data.findIndex(d => d === data);
      if (idx !== -1) {
        const existingValue = this.values[idx];
        existingValue.addReference(reference);
        return existingValue;
      }

      // else create a new one
      let newValue: Value = new PrimitiveValue(null, [reference]);
      if (isArray(data)) {
        newValue = new ArrayValue(data, [reference]);
      } else if (isFunction(data)) {
        if (isFn(data)) {
          // normal JS Slang function
          newValue = new FnValue(data, [reference]);
        } else {
          // function from the global env (has no extra props such as env, fnName)
          newValue = new GlobalFnValue(data, [reference]);
        }
      }

      return newValue;
    }
  }

  static draw(): React.ReactNode {
    return (
      <>
        <Rect
          x={0}
          y={0}
          width={Layout.width}
          height={Layout.height}
          fill={Dimension.SA_BLUE.toString()}
        />
        {Layout.levels.map(level => level.draw())}
      </>
    );
  }
}
