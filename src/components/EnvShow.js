import React from 'react';
import { Link } from 'react-router-dom';

class EnvShow extends React.Component {

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
        //refactor this
        const sampleId = parseInt(this.props.getId());
        if (this.props.samples[sampleId - 1]) {
            window.EnvVisualizer.draw_env(this.props.samples[sampleId - 1].context);
        } else {
            window.EnvVisualizer.draw_env(this.props.samples[0].context);
        }
    };

    handleDownloadClick = () => {
        window.EnvVisualizer.download_env();
    };

    renderButtons = () => {
        const buttons = this.props.samples.map(sample => {
            return <Link key={sample.id} to={`/${this.props.path}/${sample.id}`} className="ui button">{sample.name}</Link>
        });
        return buttons;
    };

    renderCode = () => {
        const sampleId = this.props.getId();
        return (

            <div className="field">
                <label>
                    Code:
                    </label>
                <a href={this.props.samples[sampleId - 1].link} target="_blank" rel="noreferrer">
                    Open in Source Academy
                    </a>
                <textarea readOnly value={this.props.samples[sampleId - 1].code}></textarea>
            </div>

        );
    };

    render() {
        const sampleId = this.props.getId();
        return (
            <>
                <div className="ui horizontal list">
                    {this.renderButtons()}
                    <button id="download" className="ui button" onClick={this.handleDownloadClick}>Download</button>
                </div>
                <div ref={r => (this.$parent = r)} className='sa-env-visualizer'></div>
                <div></div>
                <div className="ui form">
                    <div className="field">
                        <label>Description:</label>
                        <input readOnly type="text" name="description" placeholder="Description" value={this.props.samples[sampleId - 1].description} />
                    </div>
                    {this.renderCode()}
                </div>
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

export default EnvShow;