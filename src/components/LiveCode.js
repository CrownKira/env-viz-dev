import React, { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LZString from 'lz-string';
import EnvVisualiser from './EnvVisualiser';
import useForceUpdate from '../utils/forceUpdate';

const LiveCode = () => {
  const { encodedCode } = useParams();
  const [loading, setLoading] = useState(true);
  const envVisContainer = useRef(null);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    if (envVisContainer && window.EnvVisualizer) {
      window.EnvVisualizer.init(envVisContainer.current);
      setLoading(false);
    } else {
      const checkIfLoaded = () => {
        if (envVisContainer && window.EnvVisualizer) {
          forceUpdate();
        } else {
          setTimeout(checkIfLoaded, 1000);
        }
      };
      checkIfLoaded();
    }
  }, [forceUpdate]);

  const initSample = code => ({
    description: 'Test your code live here!',
    code,
    link: `https://sourceacademy.nus.edu.sg/playground#chap=4&exec=1000&ext=NONE&prgrm=${LZString.compressToEncodedURIComponent(
      code
    )}&variant=default`
  });

  const defaultCode = 'const hello="world";\ndebugger;';
  const [sample, setSample] = useState(initSample(defaultCode));
  const [code, setCode] = useState(
    encodedCode ? LZString.decompressFromEncodedURIComponent(encodedCode) : defaultCode
  );

  return (
    <>
      <textarea
        style={{ resize: 'none', fontFamily: 'Courier New, monospace' }}
        wrap="off"
        rows={15}
        cols={100}
        autoFocus
        value={code}
        onChange={e => setCode(e.currentTarget.value)}
      />
      <div style={{ marginBottom: 50 }}>
        <button className="ui button" onClick={e => setSample({ ...sample, code })}>
          Run
        </button>
        <button
          className="ui button"
          onClick={e =>
            alert(`${window.location.href}/${LZString.compressToEncodedURIComponent(code)}`)
          }
        >
          Get link
        </button>
      </div>
      <div ref={envVisContainer} className="sa-env-visualizer"></div>
      {loading ? <p>loading environment visualiser..</p> : <EnvVisualiser sample={sample} />}
    </>
  );
};

export default LiveCode;
