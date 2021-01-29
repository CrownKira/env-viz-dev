import React, { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LZString from 'lz-string';
import { EnvVisualiser } from './EnvVisualiser';
import useForceUpdate from '../utils/forceUpdate';
import { Sample } from '../samples';
import { Libraries } from '../libraries';

interface Props {
  selectedLib: Libraries;
}

export const LiveCode: React.FC<Props> = ({ selectedLib }) => {
  let { code: encodedCode } = useParams<{ code: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const envVisContainer = useRef<HTMLDivElement>(null);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    if (envVisContainer && (window as any).EnvVisualizer) {
      (window as any).EnvVisualizer.init(envVisContainer.current);
      setLoading(false);
    } else {
      const checkIfLoaded = () => {
        if (envVisContainer && (window as any).EnvVisualizer) {
          forceUpdate();
        } else {
          setTimeout(checkIfLoaded, 1000);
        }
      };
      checkIfLoaded();
    }
  }, [forceUpdate]);

  const initSample = (code: string): Sample => ({
    description: 'Test your code live here!',
    code,
    link: `https://sourceacademy.nus.edu.sg/playground#chap=4&exec=1000&ext=NONE&prgrm=
        ${LZString.compressToEncodedURIComponent(code)}&variant=default`
  });

  const defaultCode = 'const hello="world";\ndebugger;';
  const [sample, setSample] = useState<Sample>(initSample(defaultCode));
  const [code, setCode] = useState<string>(
    encodedCode ? LZString.decompressFromEncodedURIComponent(encodedCode) || '' : defaultCode
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
            alert(`${window.location.href.match(/.*\/live-code/g)}
                                /${LZString.compressToEncodedURIComponent(code)}`)
          }
        >
          Get link
        </button>
      </div>
      <div ref={envVisContainer} className="sa-env-visualizer"></div>
      {loading ? (
        <p>loading environment visualiser..</p>
      ) : (
        <EnvVisualiser sample={sample} selectedLib={selectedLib} />
      )}
    </>
  );
};
