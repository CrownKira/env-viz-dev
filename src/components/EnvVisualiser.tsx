import React, { useState, useEffect } from 'react';
import { Sample } from '../samples';
import { Libraries } from '../libraries';
import generateContext from '../utils/generateContext';
import DrawEnv from '../drawers';
import { Context } from 'js-slang';

interface Props {
  sample: Sample;
  selectedLib: Libraries;
  context: Context<any> | undefined;
  setContext: React.Dispatch<React.SetStateAction<Context<any> | undefined>>;
  // loading: boolean;
  // setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

/// canvas and the container
export const EnvVisualiser: React.FC<Props> = ({ sample, selectedLib, context, setContext }) => {
  const { description, code, link } = sample || {};
  // const [context, setContext] = useState<Context | undefined>();

  useEffect(() => {
    /// after render
    /// get context if change in code
    /// to get the context !!
    console.log('test', selectedLib);
    switch (selectedLib) {
      case Libraries.ConcreteJs:
        (async () => {
          console.log(await generateContext(code)); // to see original context passed in
          const context = await generateContext(code);
          setContext(context);
          try {
            (window as any).EnvVisualizer.draw_env(context);
            // setLoading(false);
          } catch (err) {
            console.error(err, context);
            console.error(code);
          }
        })();
        break;

      case Libraries.KonvaJs:
        (async () => {
          console.log(await generateContext(code)); // to see original context passed in
          const context = await generateContext(code);
          setContext(context);
          // setLoading(false);
        })();
        break;

      default:
        console.error('Please select a Library first');
    }
  }, [code, selectedLib, setContext]);

  const renderCanvas = (): JSX.Element | null => {
    switch (selectedLib) {
      case Libraries.ConcreteJs:
        // no canvas to be rendered for this lib
        return null;

      case Libraries.KonvaJs:
        return context ? <DrawEnv context={context} /> : null;

      default:
        return null;
    }
  };

  const handleDownloadClick = (): void => {
    switch (selectedLib) {
      case Libraries.ConcreteJs:
        (window as any).EnvVisualizer.download_env();
        break;

      case Libraries.KonvaJs:
        window.alert('not supported for Konva yet');
        break;

      default:
    }
  };

  return (
    <>
      {!context ? (
        <p>{'loading sample context...'}</p>
      ) : (
        <>
          {renderCanvas()}
          <button className="ui button" onClick={handleDownloadClick}>
            Download
          </button>
          <div className="ui form">
            <div className="field">
              <label>Description:</label>
              <input
                readOnly
                type="text"
                name="description"
                placeholder="Description"
                value={description}
              />
            </div>
            <div className="field">
              <label>Code:</label>
              <a href={link} target="_blank" rel="noreferrer">
                Open in Source Academy
              </a>
              <pre>{code}</pre>
            </div>
          </div>
          <p>
            Taken from:
            https://github.com/source-academy/cadet-frontend/wiki/Environment-Model-Visualiser
          </p>
        </>
      )}
    </>
  );
};
