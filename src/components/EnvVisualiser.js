import React, { useState, useEffect } from 'react';
import createContext from 'js-slang/dist/createContext';
import { runInContext } from 'js-slang/dist/';

export default function EnvVisualiser({ sample }) {
  const { description, code, link } = sample || {};
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let context = createContext(4);
      await runInContext(code, context);
      try {
        window.EnvVisualizer.draw_env({ context: { context } });
        setLoading(false);
      } catch (err) {
        console.error(err, context);
        console.error(code);
      }
    })();
  }, [code]);

  return (
    <>
      {loading ? (
        <p>loading sample context..</p>
      ) : (
        <>
          <button className="ui button" onClick={window.EnvVisualizer.download_env}>
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
}