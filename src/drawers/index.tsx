import React, { useEffect, useState } from 'react';
import { Context } from 'js-slang';
import { Layout } from './Layout';
import useForceUpdate from '../hooks/useForceUpdate';

interface Props {
  context: Context | undefined;
}

const DrawEnvironment: React.FC<Props> = ({ context }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [forceUpdate] = useForceUpdate();

  useEffect(() => {
    setLoading(true);
    if (context) {
      try {
        Layout.setContext(context);
        setLoading(false);
        forceUpdate();
      } catch (err) {
        window.alert(err);
      }
    }
  }, [context, forceUpdate]);

  return <React.Fragment>{loading ? null : Layout.draw()}</React.Fragment>;
};

export default DrawEnvironment;
