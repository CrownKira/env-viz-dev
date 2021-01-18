import React, { useEffect } from 'react';
import '../styles/CirclesCanvas.css';
import loadScript from '../utils/loadScript';

export default function CirclesCanvas() {
  useEffect(() => {
    const script = loadScript('/externalLibs/env_visualizer/draw_circles.js', 'draw_circles');
    return () => (script.outerHTML = '');
  }, []);
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
      <div id="concreteContainer"></div>
      <p>Taken from: https://codepen.io/ericdrowell/pen/PNKydJ</p>
    </>
  );
}
