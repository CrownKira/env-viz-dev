import { Context } from 'js-slang';
import { Frame } from './components/Frame';
import { isArray, isEmptyEnvironment, isFn } from './utils';
import { Env, ValueTypes } from './types';
import { Level } from './components/Level';

/** this class encapsulates the logic for calculating the layout */
export class Layout {
  /** main entry of the Layout class: processes the runtime context from JS Slang */
  static processContext(context: Context) {
    // doubly link env so that we can process the environments 'top-down'
    const envs: Env[] = this.doublyLinkEnv(context.runtime.environments);

    // remove references to empty environments
    this.removeEmptyEnvRefs(envs);

    // TODO: merge global env and lib env

    // go thru environments (starting from global) and initialize frames
    const globalEnv: Env = envs[envs.length - 1];
    const levels: Level[] = [new Level([new Frame(globalEnv, null, null)])];
    this.initializeLevels(levels);

    console.log(envs);
    console.log(levels);
  }

  /** to each environment, add an array of references to child environments,
   *  making them doubly linked */
  private static doublyLinkEnv(envs: Env[]) {
    const visitedEnvs: Env[] = [];

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
      function processValue(value: ValueTypes) {
        if (isFn(value)) {
          processEnv(value.environment, null);
        } else if (isArray(value)) {
          value.forEach(processValue);
        }
      }

      processEnv(curr.tail, curr);
    };

    processEnv(envs[0], null);
    return visitedEnvs;
  }

  /** remove references to empty environments */
  private static removeEmptyEnvRefs(envs: Env[]) {
    envs.forEach(env => {
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
  private static initializeLevels(levels: Level[]) {
    // checks if the any of the frames in a level contains a child
    const containsChildEnv = (level: Level) =>
      level.frames.reduce<boolean>(
        (A, { environment: e }) => A || (!!e.childEnvs && e.childEnvs.length > 0),
        false
      );

    // continue until the previous level's frames have no more child
    while (containsChildEnv(levels[levels.length - 1])) {
      const frames: Frame[] = [];
      levels[levels.length - 1].frames.forEach(
        frame =>
          frame.environment.childEnvs &&
          frame.environment.childEnvs.forEach(env => {
            const newFrame = new Frame(env, frame, frames ? frames[frames.length - 1] : null);
            frames.push(newFrame);
            env.frame = newFrame;
          })
      );

      levels.push(new Level(frames));
    }
  }
}
