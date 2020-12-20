import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import Header from './Header';
import SampleShow from './SampleShow';
import IssueShow from './IssueShow';
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
                <Route path="/issues/:id" exact component={IssueShow} />
                <Route path="/circles-canvas" exact component={CirclesCanvas} />
                <Route path="/playground-canvas" exact component={Playground} />
            </Switch>
            <footer className="ui one column stackable center aligned page grid">
                <p className="column twelve wide">
                    <a href="https://github.com/CrownKira/sa-env-visualizer-beta">Github</a>
                    <br />
                    <a href="mailto:t.karwi@yahoo.com">t.karwi@yahoo.com</a>
                </p>
            </footer>
        </Router>

    );
};

export default App;