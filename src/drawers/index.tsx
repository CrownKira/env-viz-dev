import React, { useEffect } from 'react';
import { Stage, Layer, Circle } from 'react-konva';
import { Context } from 'js-slang';
import { Layout } from './Layout';

interface Props {
  context: Context;
}

const DrawEnvironment: React.FC<Props> = ({ context }) => {
  // so that we only call this once (on mount)
  useEffect(() => {
    Layout.setContext(context);
    console.log('layout : ', Layout.levels);
    // console.log('values', Layout.values);
    // console.log('data: ', Layout.data);
  }, [context]);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Circle draggable x={200} y={100} radius={50} fill="green" />
      </Layer>
    </Stage>
  );
};

export default DrawEnvironment;
