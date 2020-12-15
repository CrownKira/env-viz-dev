import React from 'react';
import '../style/CirclesCanvas.css';
import loadScript from '../loadScript';

class CirclesCanvas extends React.Component {
    //:anything => route parameter   
    //</Switch> only show one route
    componentDidMount() {
        loadScript('/externalLibs/env_visualizer/draw_circles.js');
    }

    render() {
        return (
            <>
                <div id="controls">
                    <button id="moveUp">Move selected up</button>
                    <button id="moveDown">Move selected down</button>
                    <button id="moveToTop">Move selected to top</button>
                    <button id="moveToBottom">Move selected to bottom</button>
                    <button id="destroy">Destroy selected</button>
                    <button id="download">Download</button>
                </div>
                <div id="concreteContainer">
                </div>
            </>

        );
    }
};

export default CirclesCanvas;