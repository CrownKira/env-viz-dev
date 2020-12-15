import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

function dynamicallyLoadScript(url) {
    var script = document.createElement('script')
    script.src = url
    /** Forces scripts to be loaded in order. */
    script.async = false
    script.defer = true
    // make sure document.body exists, since the scripts we load
    // assume that it does
    if (document.body) {
        document.body.appendChild(script)
    } else {
        var observer = new MutationObserver(function () {
            if (document.body) {
                document.body.appendChild(script)
                observer.disconnect();
            }
        });
        observer.observe(document.documentElement, { childList: true });
    }
}


function loadAllLibs() {
    const files = [
        // env visualizer
        '/externalLibs/env_visualizer/ConcreteJs.js',
        '/externalLibs/env_visualizer/visualizer.js'
    ]

    for (var i = 0; i < files.length; i++) {
        dynamicallyLoadScript(files[i])
    }
    console.log('all lib loaded');
}

loadAllLibs();

ReactDOM.render(
    <App />,
    document.querySelector('#root')
);