import React from 'react';
import { Link } from 'react-router-dom';
import CONTEXTS from '../contexts';
import '../styles/EnvVisualizer.css'

class SampleShow extends React.Component {
    constructor(props) {
        super(props);
        this.state = { loading: true };
        this.$parent = React.createRef();
    }

    componentDidMount() {
        this.tryToLoad();
    }

    componentDidUpdate() {
        this.renderCanvas();
    }

    renderCanvas = () => {
        const id = parseInt(this.props.match.params.id);
        const context = CONTEXTS[id - 1];
        if (context) {
            window.draw_env(context);
        } else {
            window.draw_env(CONTEXTS[0]);
        }
    };

    render() {
        return (
            <>
                <div className="ui horizontal list">
                    <Link to="/samples/1" className="ui button">Sample 1</Link>
                    <Link to="/samples/2" className="ui button">Sample 2</Link>
                    <Link to="/samples/3" className="ui button">Sample 3</Link>
                    <Link to="/samples/4" className="ui button">Sample 4</Link>
                    <Link to="/samples/5" className="ui button disabled">Sample 5</Link>
                    <button id="download" className="ui button">Download</button>
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
        } else {
            // Try again in 1 second
            window.setTimeout(this.tryToLoad, 1000);
        }
    };
}

export default SampleShow;