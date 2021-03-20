import React, { useEffect, useRef } from 'react';
import { Libraries } from '../libraries';
import useForceUpdate from '../hooks/useForceUpdate';

interface Props {
  selectedLib: Libraries;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Container: React.FC<Props> = ({ selectedLib, setLoading }) => {
  const [forceUpdate] = useForceUpdate();
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    cleanup();
    switch (selectedLib) {
      case Libraries.ConcreteJs:
        if (container && (window as any).EnvVisualizer) {
          (window as any).EnvVisualizer.init(container.current);
          setLoading(false);
        } else {
          const checkIfLoaded = () => {
            if (container && (window as any).EnvVisualizer) {
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

  return <div ref={container} id="stage"></div>;
};
