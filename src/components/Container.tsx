import React, { useEffect, useRef } from 'react';

import useForceUpdate from '../hooks/useForceUpdate';
import { Libraries } from '../libraries';

type Props = {
  selectedLib: Libraries;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Container: React.FC<Props> = ({ selectedLib, setLoading }) => {
  const [forceUpdate] = useForceUpdate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    cleanup();
    switch (selectedLib) {
      case Libraries.ConcreteJs:
        if (containerRef && (window as any).EnvVisualizer) {
          (window as any).EnvVisualizer.init(containerRef.current);
          setLoading(false);
        } else {
          const checkIfLoaded = () => {
            if (containerRef && (window as any).EnvVisualizer) {
              forceUpdate();
            } else {
              setTimeout(checkIfLoaded, 1000);
            }
          };
          checkIfLoaded();
        }
        break;

      case Libraries.KonvaJs:
        setLoading(false);
        break;

      default:
        window.alert('Please select a Library first');
    }
  }, [forceUpdate, selectedLib, setLoading]);

  const cleanup = (): void => {
    // clean up concretejs container
    const container = document.querySelector('#env-visualizer-container');
    if (container !== null && container instanceof HTMLDivElement) container.hidden = true;
  };

  return <div ref={containerRef} id="stage"></div>;
};
