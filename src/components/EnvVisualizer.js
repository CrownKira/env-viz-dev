import React from 'react';
import CONTEXT1 from '../contexts/code_sample1';
import CONTEXT2 from '../contexts/code_sample2';
import CONTEXT3 from '../contexts/code_sample3';
import '../styles/EnvVisualizer.css'

class EnvVisualizer extends React.Component {
    // something like this.$parent = React.createRef();
    // private $parent: HTMLElement | null = null;

    constructor(props) {
        super(props);
        this.state = { loading: true };
        this.$parent = React.createRef();
    }

    componentDidMount() {
        this.tryToLoad();
    }

    loadCanvas = context => window.draw_env(context);

    render() {
        return (
            <>
                <div>
                    <button className="ui button" onClick={() => this.loadCanvas(CONTEXT1)}>Sample 1</button>
                    <button className="ui button" onClick={() => this.loadCanvas(CONTEXT2)}>Sample 2</button>
                    <button className="ui button" onClick={() => this.loadCanvas(CONTEXT3)}>Sample 3</button>
                    <button className="ui button disabled" onClick={() => this.loadCanvas('code_sample4')}>Sample 4</button>
                    <button className="ui button disabled" onClick={() => this.loadCanvas('code_sample5')}>Sample 5</button>
                </div>
                <div ref={r => (this.$parent = r)} className='sa-env-visualizer'></div>
            </>
        );
    }

    tryToLoad = () => {
        const element = window.EnvVisualizer;
        // console.log("parent is: ", this.$parent)
        // this.$parent is the wrapping html element of this component
        if (this.$parent && element) {
            // if parent element is loaded and envvisualiser is added to the dom
            // Env Visualizer has been loaded into the DOM
            element.init(this.$parent);
            this.setState((state, props) => {
                return { loading: false };
            });
            // loadScript('/externalLibs/env_visualizer/code_sample1.js');
            this.loadCanvas(CONTEXT1);
        } else {
            // Try again in 1 second
            window.setTimeout(this.tryToLoad, 1000);
        }
    };
}

export default EnvVisualizer;