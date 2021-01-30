import React from 'react';
import { Stage, Layer, Circle } from 'react-konva';
import { isNull, isEmptyObject, isFnValue, isUndefined, isDataValue } from './utils';
import { Frame } from './Frame';
import { Level } from './Level';
import { DataValue } from './DataValue';
import { FnValue } from './FnValue';
import { TextValue } from './TextValue';

interface Props {
  context: any; // Fix later
}

function getLevel(env: any): number {
  // return the level index of the env
  let level = 0;
  let currEnv = env;
  while (!isNull(currEnv.tail)) {
    currEnv = currEnv.tail;
    if (!isEmptyObject(currEnv.head)) level++;
  }
  return level;
}

function makeLevel(frames: any): any {
  return new Level(0, 0, 0, 0, 0, frames);
}

function makeFrame(env: any): any {
  // return Frame Object
  const elements = env.head;
  const newElements: any = {};

  for (const [name, value] of Object.entries(elements)) {
    newElements[name] = makeValue(value);
  }
  return new Frame(0, 0, 0, 0, 0, newElements, [], null, env);
}

function makeValue(value: any): any {
  // return Value Object
  if (isFnValue(value)) {
    return new FnValue(0, 0, 0, 0, 0, 'string');
  } else if (isDataValue(value)) {
    return new DataValue(0, 0, 0, 0, 0, null);
  } else if (isNull(value)) {
    return null;
  } else {
    return new TextValue(0, 0, 0, 0, 0, 'string', 0);
  }
}

function parseEnv(env: any): any {
  // return { leveledFrames, leveledEnvs }
  const leveledFrames: any = [];
  const leveledEnvs: any = [];

  if (isNull(env)) return { leveledFrames, leveledEnvs };

  function write(index: any, frameEnv: any, frame: any): any {
    if (isUndefined(leveledEnvs[index])) {
      leveledEnvs[index] = [];
      leveledFrames[index] = [];
    }
    if (!leveledEnvs[index].includes(frameEnv)) {
      leveledEnvs[index].push(frameEnv);
      leveledFrames[index].push(frame);
    }
  }

  const currValues = Object.values(env.head);
  const currFnValues = currValues.filter((value: any): any => isFnValue(value));
  const parsedMissingEnvs = currFnValues.map((fnValue: any): any =>
    parseEnv(fnValue.environments ? fnValue.environments[0] : null)
  );

  parsedMissingEnvs.forEach((parsedMissingEnv: any): any => {
    const { leveledFrames: leveledMissingFrames } = parsedMissingEnv;
    for (let i = 0; i < leveledMissingFrames.length; i++) {
      const frames = leveledMissingFrames[i];
      frames.forEach((frame: any): any => {
        write(i, frame.environment, frame);
      });
    }
  });

  write(getLevel(env), env, makeFrame(env));

  const parsedTailEnvs = parseEnv(env.tail);
  const { leveledFrames: leveledTailFrames } = parsedTailEnvs;

  for (let i = 0; i < leveledTailFrames.length; i++) {
    const frames = leveledTailFrames[i];
    frames.forEach((frame: any): any => {
      write(i, frame.environment, frame);
    });
  }

  return { leveledFrames, leveledEnvs };
}

function parseFrames(leveledFrames: any): any {
  // return an array of Level Objects
  const levels = [];
  for (let i = 0; i < leveledFrames.length; i++) {
    const frames = leveledFrames[i];
    levels[i] = makeLevel(frames);
  }

  return levels;
}

function parseContext(context: any): Object[] {
  // return an array of Level Objects
  const contextEnvs = context.context.runtime.environments;
  const globalEnv = contextEnvs[contextEnvs.length - 1];
  const libEnv = contextEnvs[contextEnvs.length - 2];

  libEnv.name = 'global';
  libEnv.tail = null;
  libEnv.head = { ...globalEnv.head, ...libEnv.head };

  const { leveledFrames } = parseEnv(contextEnvs[0]);
  const levels = parseFrames(leveledFrames);

  return levels;
}

const DrawEnv: React.FC<Props> = context => {
  const parsedContext = parseContext(context);
  console.log('parsed context is: ', parsedContext);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Circle x={200} y={100} radius={50} fill="green" />
      </Layer>
    </Stage>
  );
};

export default DrawEnv;
