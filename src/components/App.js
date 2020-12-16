import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import Header from './Header';
import EnvVisualizer from './EnvVisualizer';
import CirclesCanvas from './CirclesCanvas';
import Playground from './Playground';
import history from '../history';
import '../styles/App.css';


const App = () => {
    return (
        <div>
            <Router history={history}>
                <div>
                    <Header />
                    <Switch>
                        <Route path="/" exact component={EnvVisualizer} />
                        <Route path="/circles-canvas" exact component={CirclesCanvas} />
                        <Route path="/playground-canvas" exact component={Playground} />
                    </Switch>
                </div>
            </Router>
        </div>
    );
};

export default App;