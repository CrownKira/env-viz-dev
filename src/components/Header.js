import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <div className="ui secondary pointing menu">
            <Link to="/" className="item">
                EnvVizDev
            </Link>

            <div className="right menu">
                <Link to="/samples/1" className="item">
                    Samples
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
};

export default Header;