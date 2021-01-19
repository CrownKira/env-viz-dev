import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Samples from './Samples';
import CirclesCanvas from './CirclesCanvas';
import Playground from './Playground';
import LiveCode from './LiveCode';
import '../styles/App.css';
import { samples, issueSamples } from '../samples';

export default function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Redirect exact from="/" to="/samples" />
        <Route path="/samples">
          <Samples samples={samples} />
        </Route>
        <Route path="/issues">
          <Samples samples={issueSamples} />
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
}
