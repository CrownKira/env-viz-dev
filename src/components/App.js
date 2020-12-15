import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import Header from './Header';
import EnvVisualizer from './EnvVisualizer';
import CirclesCanvas from './CirclesCanvas';
import history from '../history';
import '../style/App.css';


const App = () => {
    //:anything => route parameter   
    //</Switch> only show one route
    return (
        <div>
            <Router history={history}>
                <div>
                    <Header />
                    <Switch>
                        <Route path="/" exact component={EnvVisualizer} />
                        <Route path="/circles-canvas" exact component={CirclesCanvas} />
                    </Switch>
                </div>
            </Router>
        </div>

    );
};

export default App;