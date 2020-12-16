import React from 'react';
import { Link } from 'react-router-dom';
import CONTEXT1 from '../contexts/code_sample1';
import CONTEXT2 from '../contexts/code_sample2';
import CONTEXT3 from '../contexts/code_sample3';
import CONTEXT4 from '../contexts/code_sample4';
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
        switch (this.props.match.params.id) {
            case '1':
                window.draw_env(CONTEXT1);
                break;
            case '2':
                window.draw_env(CONTEXT2);
                break;
            case '3':
                window.draw_env(CONTEXT3);
                break;
            case '4':
                window.draw_env(CONTEXT4);
                break;
            default:
                window.draw_env(CONTEXT1);
        }
    };

    render() {
        return (
            <>
                <Link to="/samples/1" className="ui button">Sample 1</Link>
                <Link to="/samples/2" className="ui button">Sample 2</Link>
                <Link to="/samples/3" className="ui button">Sample 3</Link>
                <Link to="/samples/4" className="ui button">Sample 4</Link>
                <Link to="/samples/5" className="ui button disabled">Sample 5</Link>
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
            this.renderCanvas();
        } else {
            // Try again in 1 second
            window.setTimeout(this.tryToLoad, 1000);
        }
    };
}

export default SampleShow;