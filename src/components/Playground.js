import React from 'react';
import '../styles/Playground.css'
import loadScript from '../loadScript';

class Playground extends React.Component {
    componentDidMount() {
        loadScript('/externalLibs/env_visualizer/draw_playground.js');
    }

    render() {
        return (
            <div id="playground-container">
                <canvas width="1000" height="1000">
                    An alternative text describing what your canvas displays.
                </canvas>
            </div>
        );
    }
}

export default Playground;