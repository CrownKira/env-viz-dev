import React from 'react';
import CONTEXT1 from '../contexts/code_sample1';
import CONTEXT2 from '../contexts/code_sample2';
import CONTEXT3 from '../contexts/code_sample3';
import CONTEXT4 from '../contexts/code_sample4';
import '../styles/EnvVisualizer.css'

class EnvVisualizer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { loading: true };
        this.$parent = React.createRef();
    }

    componentDidMount() {
        this.tryToLoad();
    }

    renderCanvas = context => window.draw_env(context);

    render() {
        return (
            <>
                <div>
                    <button className="ui button" onClick={() => this.renderCanvas(CONTEXT1)}>Sample 1</button>
                    <button className="ui button" onClick={() => this.renderCanvas(CONTEXT2)}>Sample 2</button>
                    <button className="ui button" onClick={() => this.renderCanvas(CONTEXT3)}>Sample 3</button>
                    <button className="ui button" onClick={() => this.renderCanvas(CONTEXT4)}>Sample 4</button>
                    <button className="ui button disabled">Sample 5</button>
                </div>
                <div ref={r => (this.$parent = r)} className='sa-env-visualizer'></div>
                <p>Taken from: https://github.com/source-academy/cadet-frontend/wiki/Environment-Model-Visualiser</p>
            </>
        );
    }

    tryToLoad = () => {
        const element = window.EnvVisualizer;
        if (this.$parent && element) {
            element.init(this.$parent);
            this.setState((state, props) => {
                return { loading: false };
            });
            this.renderCanvas(CONTEXT1);
        } else {
            // Try again in 1 second
            window.setTimeout(this.tryToLoad, 1000);
        }
    };
}

export default EnvVisualizer;