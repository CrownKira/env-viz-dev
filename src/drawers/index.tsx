import React from 'react';
import { Stage, Layer, Circle } from 'react-konva';
import { isEmptyArray, extractEnvs } from './utils';

interface Props {
  context: any; // Fix later
}

// function parseEnv(envs: any): any {
//   // return an array of fully extracted envs
//   // [[...], [...], [...]] // from fnelement too
//   // extract the envs out as much as possible and push them to newEnvs array
//   for (let i = envs.length - 1; i >= 0; i--) {
//     const currEnv = envs[i];
//     const prevEnv = i === 0 ? null : envs[i - 1];
//     if (currEnv.tail !== prevEnv) {
//       return [...extractEnvs(currEnv), ...envs.slice(i + 1)];
//     }
//   }

//   return envs;
// }

function parseContext(context: any): Object[] {
  // return an array of level object
  // Fix later
  const environments = extractEnvs(context.context.runtime.environments[0]);
  // const parsedEnv = parseEnv(environments);
  console.log(environments);
  return [context];
}

const DrawEnv: React.FC<Props> = context => {
  const parsedContext = parseContext(context);
  // console.log(parsedContext);
  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Circle x={200} y={100} radius={50} fill="green" />
      </Layer>
    </Stage>
  );
};

export default DrawEnv;
