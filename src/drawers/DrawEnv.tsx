import React from 'react';
import { Stage, Layer, Circle } from 'react-konva';

interface Props {
  context: Object;
}

function parseContext(context: Object): Object[] {
  return [context];
}

const DrawEnv: React.FC<Props> = ({ context }) => {
  const parsedContext = parseContext(context);
  console.log(context);
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
