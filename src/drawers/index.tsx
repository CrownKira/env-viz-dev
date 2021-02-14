import React, { useEffect, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import { Context } from 'js-slang';
import { Layout } from './Layout';

interface Props {
  context: Context;
}

const DrawEnvironment: React.FC<Props> = ({ context }) => {
  // so that we only call this once (on mount)
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    Layout.setContext(context);
    console.log('layout : ', Layout.levels);
    setLoading(false);
  }, [context]);

  /* <Circle draggable x={200} y={100} radius={50} fill="green" /> */
  return (
    <Stage width={Layout.width} height={Layout.height}>
      <Layer>{loading ? null : Layout.draw()}</Layer>
    </Stage>
  );
};

export default DrawEnvironment;
