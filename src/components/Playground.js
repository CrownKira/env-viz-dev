import React, { useEffect } from 'react';
import '../styles/Playground.css';
import loadScript from '../utils/loadScript';

export default function Playground() {
  useEffect(
    () => loadScript('/externalLibs/env_visualizer/draw_playground.js', 'draw_playground'),
    []
  );
  return (
    <>
      <div id="playground-container">
        <canvas width="1000" height="1000">
          An alternative text describing what your canvas displays.
        </canvas>
      </div>
      <p>Draw here: public/externalLibs/env_visualizer/draw_playground.js</p>
    </>
  );
}
