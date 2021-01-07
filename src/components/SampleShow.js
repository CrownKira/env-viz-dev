import React from 'react';
import { SAMPLES } from '../contexts';
import EnvShow from './EnvShow';
import '../styles/EnvVisualizer.css'

class SampleShow extends React.Component {
    getId = () => { // can just pass down as a constant
        const id = this.props.match.params.id;
        return id ? id : 1;
    };
    render() {
        return <EnvShow path={'samples'} samples={SAMPLES} getId={this.getId} />
    }
}

export default SampleShow;