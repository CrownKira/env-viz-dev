import React, { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LZString from 'lz-string';
import { EnvVisualiser } from './EnvVisualiser';
import useForceUpdate from '../utils/forceUpdate';
import { Sample } from '../samples';
import { Libraries } from '../libraries';
import { loadingVisualizerText } from '../configs';

interface Props {
  selectedLib: Libraries;
  renderLibButton: () => JSX.Element;
  setUpLib: (
    envVisContainer: React.RefObject<HTMLDivElement>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    forceUpdate: () => void
  ) => void;
}

export const LiveCode: React.FC<Props> = ({ selectedLib, renderLibButton, setUpLib }) => {
  let { code: encodedCode } = useParams<{ code: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const envVisContainer = useRef<HTMLDivElement>(null);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    setUpLib(envVisContainer, setLoading, forceUpdate);
  }, [forceUpdate, selectedLib, setUpLib]);

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

  const renderContainer = (): JSX.Element | null => {
    switch (selectedLib) {
      case Libraries.ConcreteJs:
        return <div ref={envVisContainer} className="sa-env-visualizer"></div>;

      case Libraries.KonvaJs:
        // no container to be rendered for this lib
        return null;

      default:
        return null;
    }
  };

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
        <div className="ui horizontal list">
          {renderLibButton()}
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
      </div>
      {renderContainer()}
      {loading ? (
        <p>{loadingVisualizerText}</p>
      ) : (
        <EnvVisualiser sample={sample} selectedLib={selectedLib} />
      )}
    </>
  );
};
