import React, { useState } from 'react';
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

export const App: React.FC = () => {
  const [selectedLib, setSelectedLib] = useState<Libraries>(defaultLib);

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

  const setUpLib = (
    envVisContainer: React.RefObject<HTMLDivElement>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    forceUpdate: () => void
  ): void => {
    envVisContainer && envVisContainer.current && (envVisContainer.current.innerHTML = '');

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

      case Libraries.KonvsJs:
        break;

      default:
        console.error('Please select a Library first');
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
            renderLibButton={renderLibButton}
            selectedLib={selectedLib}
            setUpLib={setUpLib}
          />
        </Route>
        <Route path="/issues">
          <Samples
            samples={issueSamples}
            renderLibButton={renderLibButton}
            selectedLib={selectedLib}
            setUpLib={setUpLib}
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
            renderLibButton={renderLibButton}
            setUpLib={setUpLib}
          />
        </Route>
        <Route path="/live-code/:code" exact>
          <LiveCode
            selectedLib={selectedLib}
            renderLibButton={renderLibButton}
            setUpLib={setUpLib}
          />
        </Route>
      </Switch>
      <Footer />
    </Router>
  );
};
