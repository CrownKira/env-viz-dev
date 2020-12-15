import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <div className="ui secondary pointing menu">
            <Link to="/" className="item">
                EnvVizDev
            </Link>

            <div className="right menu">
                <Link to="/" className="item">
                    Env Visualizer
                </Link>
                <Link to="/circles-canvas" className="item">
                    Circles Canvas
                </Link>
            </div>
        </div>
    );
};

export default Header;