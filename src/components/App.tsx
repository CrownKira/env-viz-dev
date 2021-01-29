import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { Samples } from './Samples';
import { CirclesCanvas } from './CirclesCanvas';
import { Playground } from './Playground';
import { LiveCode } from './LiveCode';
import { samples, issueSamples } from '../samples';

export const App: React.FC = () => {
  const renderLibButton = () => {
    return (
      <div className="ui simple dropdown button">
        Library
        <i className="dropdown icon"></i>
        <div className="menu">
          <div className="item">KonvaJs</div>
          <div className="item">ConcreteJs</div>
        </div>
      </div>
    );
  };

  return (
    <Router>
      <Header />
      <Switch>
        <Redirect exact from="/" to="/samples" />
        <Route path="/samples">
          <Samples samples={samples} renderLibButton={renderLibButton} />
        </Route>
        <Route path="/issues">
          <Samples samples={issueSamples} renderLibButton={renderLibButton} />
        </Route>
        <Route path="/circles-canvas" exact>
          <CirclesCanvas />
        </Route>
        <Route path="/playground-canvas" exact>
          <Playground />
        </Route>
        <Route path="/live-code" exact>
          <LiveCode />
        </Route>
        <Route path="/live-code/:code" exact>
          <LiveCode />
        </Route>
      </Switch>
      <Footer />
    </Router>
  );
};
