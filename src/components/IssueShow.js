import React from 'react';
import { ISSUES } from '../contexts';
import EnvShow from './EnvShow';
import '../styles/EnvVisualizer.css'

class IssueShow extends React.Component {
    getId = () => {
        const id = this.props.match.params.id;
        return id ? id : 1;
    };
    render() {
        return <EnvShow path={'issues'} samples={ISSUES} getId={this.getId} />
    }
}

export default IssueShow;