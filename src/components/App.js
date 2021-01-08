import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Samples from './Samples';
import CirclesCanvas from './CirclesCanvas';
import Playground from './Playground';
import '../styles/App.css';
import { SAMPLES, ISSUES } from '../contexts/';

export default function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Redirect exact from="/" to="/samples" />
        <Route path="/samples">
          <Samples samples={SAMPLES} />
        </Route>
        <Route path="/issues">
          <Samples samples={ISSUES} />
        </Route>
        <Route path="/circles-canvas" exact>
          <CirclesCanvas />
        </Route>
        <Route path="/playground-canvas" exact>
          <Playground />
        </Route>
      </Switch>
      <Footer />
    </Router>
  );
}
