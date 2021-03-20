import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { Samples } from './Samples';
import { CirclesCanvas } from './CirclesCanvas';
import { Playground } from './Playground';
import { LiveCode } from './LiveCode';
import { samples, issueSamples } from '../samples';
import { Libraries } from '../libraries';
import { defaultLib } from '../configs';
import useForceUpdate from '../hooks/useForceUpdate';

export const App: React.FC = () => {
  const [selectedLib, setSelectedLib] = useState<Libraries>(defaultLib);
  const [loading, setLoading] = useState<boolean>(true);
  const [forceUpdate] = useForceUpdate();
  const envVisContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    switch (selectedLib) {
      case Libraries.ConcreteJs:
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
        break;

      case Libraries.KonvaJs:
        setLoading(false);
        break;

      default:
        console.error('Please select a Library first');
    }
  }, [forceUpdate, selectedLib]);

  const renderLibButton = (): JSX.Element => {
    return (
      <div className="ui simple dropdown button">
        {selectedLib}
        <i className="dropdown icon"></i>
        <div className="menu">
          {Object.values(Libraries).map(lib => {
            return (
              <div className="item" key={lib} onClick={() => setSelectedLib(lib)}>
                {lib}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

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
    <Router>
      <Header />
      <Switch>
        <Redirect exact from="/" to="/samples" />
        <Route path="/samples">
          <Samples
            samples={samples}
            selectedLib={selectedLib}
            loading={loading}
            renderLibButton={renderLibButton}
            renderContainer={renderContainer}
          />
        </Route>
        <Route path="/issues">
          <Samples
            samples={issueSamples}
            selectedLib={selectedLib}
            loading={loading}
            renderLibButton={renderLibButton}
            renderContainer={renderContainer}
          />
        </Route>
        <Route path="/circles-canvas" exact>
          <CirclesCanvas />
        </Route>
        <Route path="/playground-canvas" exact>
          <Playground />
        </Route>
        <Route path="/live-code" exact>
          <LiveCode
            selectedLib={selectedLib}
            loading={loading}
            renderLibButton={renderLibButton}
            renderContainer={renderContainer}
          />
        </Route>
        <Route path="/live-code/:code" exact>
          <LiveCode
            selectedLib={selectedLib}
            loading={loading}
            renderLibButton={renderLibButton}
            renderContainer={renderContainer}
          />
        </Route>
      </Switch>
      <Footer />
    </Router>
  );
};
