import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <div className="ui secondary pointing menu">
      <Link to="/" className="item">
        Environment Visualizer - BETA
      </Link>

      <div className="right menu">
        <Link to="/samples" className="item">
          Samples
        </Link>
        <Link to="/issues" className="item">
          Issues
        </Link>
        <Link to="/circles-canvas" className="item">
          Circles Canvas
        </Link>
        <Link to="/playground-canvas" className="item">
          Playground
        </Link>
      </div>
    </div>
  );
}
