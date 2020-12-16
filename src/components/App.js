import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import Header from './Header';
import SampleShow from './SampleShow';
import CirclesCanvas from './CirclesCanvas';
import Playground from './Playground';
import history from '../history';
import '../styles/App.css';


const App = () => {
    return (
        <Router history={history}>
            <Header />
            <Switch>
                <Route path="/" exact component={SampleShow} />
                <Route path="/samples/:id" exact component={SampleShow} />
                <Route path="/circles-canvas" exact component={CirclesCanvas} />
                <Route path="/playground-canvas" exact component={Playground} />
            </Switch>
        </Router>
    );
};

export default App;