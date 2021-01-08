import React, { useState, useEffect } from 'react';

export default function EnvVisualiser({ sample }) {
  const { context, description, code, link } = sample;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.EnvVisualizer.draw_env(context);
    setLoading(false);
  }, [context]);

  return (
    <>
      {loading ? (
        <p>loading sample..</p>
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
