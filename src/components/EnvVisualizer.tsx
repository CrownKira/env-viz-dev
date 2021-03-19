import React from 'react';
import { Sample } from '../samples';
import { Libraries } from '../libraries';
import DrawEnv from '../drawers';
import useContext from '../hooks/useContext';
import { loadingContextText } from '../configs';

interface Props {
  sample: Sample;
  selectedLib: Libraries;
}

export const EnvVisualizer: React.FC<Props> = ({ sample, selectedLib }) => {
  const { description, code, link } = sample || {};
  const [context] = useContext(code, selectedLib);

  const renderCanvas = (): JSX.Element | null => {
    switch (selectedLib) {
      case Libraries.ConcreteJs:
        (async () => {
          try {
            (window as any).EnvVisualizer.draw_env(context);
          } catch (err) {
            console.error(err, context);
            console.error(code);
          }
        })();
        return null;

      case Libraries.KonvaJs:
        return <DrawEnv context={context} />;

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
        <p>{loadingContextText}</p>
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
