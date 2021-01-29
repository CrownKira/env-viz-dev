import React from 'react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <div className="ui secondary pointing menu">
      <Link to="/" className="item">
        Environment Visualizer - BETA
      </Link>

      <div className="right menu">
        <div className="ui simple dropdown item">
          Library
          <i className="dropdown icon"></i>
          <div className="menu">
            <div className="item">ConcreteJs</div>
            <div className="item">KonvaJs</div>
          </div>
        </div>
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
        <Link to="/live-code" className="item">
          Live Code
        </Link>
      </div>
    </div>
  );
};
