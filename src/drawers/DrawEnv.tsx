import React from 'react';
import { Stage, Layer, Circle } from 'react-konva';
import { isEmptyArray, extractEnvs } from './utils';

interface Props {
  context: any; // Fix later
}

function parseEnv(envs: any): any {
  let newEnvs: any = []; // Fix later

  for (let i = envs.length - 1; i >= 0; i--) {
    const currEnv = envs[i];
    const prevEnv = i === 0 ? null : envs[i - 1];
    if (currEnv.tail !== prevEnv) {
      newEnvs = [...extractEnvs(currEnv), ...envs.slice(i + 1)];
      break;
    }
  }

  return isEmptyArray(newEnvs) ? envs : newEnvs;
}

function parseContext(context: any): Object[] {
  // Fix later
  const environments = context.context.runtime.environments.reverse();
  const parsedEnv = parseEnv(environments);
  console.log(environments, parsedEnv);
  return [context];
}

const DrawEnv: React.FC<Props> = context => {
  const parsedContext = parseContext(context);
  console.log(parsedContext);
  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Circle x={200} y={100} radius={50} fill="green" />
      </Layer>
    </Stage>
  );
};

export default DrawEnv;
