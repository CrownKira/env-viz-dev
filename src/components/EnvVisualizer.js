import React from 'react';
import loadScript from '../loadScript';
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

    render() {
        return (
            <div ref={r => (this.$parent = r)} className='sa-env-visualizer'></div>
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
            loadScript('/externalLibs/env_visualizer/draw_env.js');
        } else {
            // Try again in 1 second
            window.setTimeout(this.tryToLoad, 1000);
        }
    };
}

export default EnvVisualizer;