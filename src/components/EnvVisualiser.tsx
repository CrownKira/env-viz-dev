import React, { useState, useEffect } from 'react';
import { Sample } from '../samples';
import { Libraries } from '../libraries';
import generateContext from '../utils/generateContext';
import DrawEnv from '../drawers/DrawEnv';
import { loadingContextText } from '../configs';

interface Props {
  sample: Sample;
  selectedLib: Libraries;
}

export const EnvVisualiser: React.FC<Props> = ({ sample, selectedLib }) => {
  const { description, code, link } = sample || {};
  const [loading, setLoading] = useState<boolean>(true);
  const [context, setContext] = useState<Object | null>(null);

  useEffect(() => {
    switch (selectedLib) {
      case Libraries.ConcreteJs:
        (async () => {
          const context = await generateContext(code);
          setContext(context);
          try {
            (window as any).EnvVisualizer.draw_env({ context: { context } });
            setLoading(false);
          } catch (err) {
            console.error(err, context);
            console.error(code);
          }
        })();
        break;

      case Libraries.KonvaJs:
        setLoading(false);
        break;

      default:
        console.error('Please select a Library first');
    }
  }, [code, selectedLib]);

  const renderCanvas = (): JSX.Element | null => {
    switch (selectedLib) {
      case Libraries.ConcreteJs:
        // no canvas to be rendered for this lib
        return null;

      case Libraries.KonvaJs:
        if (!context) {
          return <p>{loadingContextText}</p>;
        }
        return <DrawEnv context={context} />;

      default:
        return null;
    }
  };

  return (
    <>
      {renderCanvas()}
      {loading ? (
        <p>{loadingContextText}</p>
      ) : (
        <>
          <button className="ui button" onClick={(window as any).EnvVisualizer.download_env}>
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
