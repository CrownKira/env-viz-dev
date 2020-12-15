(function () {
    // import Concrete from './concrete.js';
    // ***HELPER FUNCTIONS*** //
    function drawSceneCircles() {
        circles.forEach(function (circle) {
            drawSceneCircle(circle); //draw all the circles
        });
        viewport.render(); //render the viewport ie. draw the image on the screen
        //when invoke drawImage(), an image will be drawn on the screen
        //within the canvas!
        //will only draw if call render()
    }

    function drawHitCircles() { //hit is needed to help determine which circle is clicked
        circles.forEach(function (circle) {
            drawHitCircle(circle); //circle is the config here
        });

    }

    function drawSceneCircle(config) {
        var scene = config.layer.scene, //config refers to a circle //get the scene object
            context = scene.context; //get the context object

        scene.clear(); //=== scene.context.clearRect(...) clear the entire canvas, dont overlap anything!
        // if clear scene, then draw, will cause other drawing on the same layer to be invisible
        context.save(); //save all above invoked state (in this case) default state, then restore using restore()
        context.beginPath();
        context.arc(config.x, config.y, 60, 0, Math.PI * 2, false); //draw the circle
        context.fillStyle = config.color;
        context.fill();

        if (config.selected) { //if selected darken stroke
            context.strokeStyle = 'black';
            context.lineWidth = 6;
            context.stroke();
        }

        if (config.hovered) { //if hovered over stroke becomes green
            context.strokeStyle = 'green';
            context.lineWidth = 2;
            context.stroke();
        }
        context.restore(); //restore back to default state //so that it doesnt affect other functions below it 
    }

    function drawHitCircle(config) { //hit and scene should draw the same circle //same location
        var hit = config.layer.hit, //get the hit object
            context = hit.context; // get the context object

        hit.clear(); //clear the canvas
        context.save(); // save the default state: color, etc 
        context.beginPath(); //start drawing...
        context.arc(config.x, config.y, 60, 0, Math.PI * 2, false);
        context.fillStyle = hit.getColorFromIndex(config.key); //config.key is key of the circle
        //randomly assign a color to each circle, all circle different colors
        // these colors needed to obtain the proper key !!
        context.fill();
        context.restore(); //restore the default state
    }

    function getCircleFromKey(key) {
        // return the circle from the array of circles that has the key 
        // matching the input key
        var len = circles.length, //get number of circles
            n, circle; //declare both n and circle//shorthand syntax

        for (n = 0; n < len; n++) { //loop thru every circle
            circle = circles[n]; //get the circle
            if (circle.key === key) { //there's a key for each circle
                return circle;
            }
        }

        return null;
    }

    function getSelectedCircle() {
        // return the selected circle
        var len = circles.length, // get number of circles
            n, circle; // declare...

        for (n = 0; n < len; n++) {
            circle = circles[n];
            if (circle.selected) {
                return circle;
            }
        }

        return null;
    }

    function destroyCircle(key) {
        var len = circles.length,
            n, circle;

        for (n = 0; n < len; n++) { //loop every circle
            circle = circles[n];
            if (circle.key === key) { //if match the key
                circles.splice(n, 1); //ie. remove the circle with the key from the array of circles
                drawSceneCircles();
                drawHitCircles();
                return true; //jump out of the loop and return true
            }
        }

        return false;
    }
    // ***END HELPER FUNCTIONS*** //

    // ***DRAW THE CIRCLES: INVOKE THE FUNCTIONS*** //
    var concreteContainer = document.getElementById('concreteContainer');

    // create viewport //create only one viewport
    var viewport = new Concrete.Viewport({
        width: 400,
        height: 200,
        container: concreteContainer //specify the parent element to contain the canvas
    });

    // create layers
    var layer1 = new Concrete.Layer();
    var layer2 = new Concrete.Layer();
    var layer3 = new Concrete.Layer();

    // add layers
    viewport.add(layer1).add(layer2).add(layer3); //add layers one by one 

    // create a scene graph (you don't need a scene graph for Concrete, but in this
    // example we will use one
    var circles = [
        {
            x: viewport.width / 2, // the x coordinate of center
            y: viewport.height * 2 / 3, // the y coordinate of center of circle
            hovered: false, // hover property
            selected: true, // selected property
            layer: layer1, // layer property, ie. which layer is this at //layer 1 is bottom most layer
            color: 'lightcoral', // red circle
            key: 0 // key of this is 1, ie. the id of the circle, ie. to refer to the circle
        },
        {
            x: viewport.width * 2 / 5,
            y: viewport.height / 3,
            hovered: false,
            selected: false,
            layer: layer2,
            color: 'cadetblue', //using css colors
            key: 1
        },
        {
            x: viewport.width * 3 / 5,
            y: viewport.height / 3,
            hovered: false,
            selected: false,
            layer: layer3, //layer 3 has the highest z-index
            color: 'orange',
            key: 2
        }
    ];

    // draw circles onto hit canvases for mouse detection
    // this is the invisible canvas for mouse detection purposes
    drawHitCircles();

    // draw visible circles
    drawSceneCircles();
    //***DRAW THE CIRCLES***//







    // ***EVENT HANDLERS*** //
    // ***CANVAS HANDLERS*** //
    // add concrete container handlers //the canvas html element is listening to the events
    concreteContainer.addEventListener('mousemove', function (evt) {
        var boundingRect = concreteContainer.getBoundingClientRect(),
            x = evt.clientX - boundingRect.left,
            y = evt.clientY - boundingRect.top,
            key = viewport.getIntersection(x, y), // all these just to get the key
            circle;

        // unhover all circles
        circles.forEach(function (circle) {
            circle.hovered = false;
        });

        if (key >= 0) {
            circle = getCircleFromKey(key);
            circle.hovered = true;
        }

        drawSceneCircles();
    });

    concreteContainer.addEventListener('click', function (evt) {
        // when click the circle, set the selected property to true
        var boundingRect = concreteContainer.getBoundingClientRect(), //get client browser window size
            x = evt.clientX - boundingRect.left,
            y = evt.clientY - boundingRect.top,
            key = viewport.getIntersection(x, y), //return the key based on user click!!
            //determine which circle is clicked
            circle;

        // unselect all circles
        circles.forEach(function (circle) {
            circle.selected = false; //unselect all the circles
        });

        if (key >= 0) { //if >=0 that means a circle is clicked on
            circle = getCircleFromKey(key); //get the circle from key or id
            circle.selected = true; //change the selected prop to true
        }

        drawSceneCircles();
    });

    // ***BUTTON HANDLERS*** // //add event listeners to the buttons
    // add button handlers 
    document.getElementById('moveUp').addEventListener('click', function () {
        var circle = getSelectedCircle();

        if (circle) {
            circle.layer.moveUp(); //move the layer up by swapping the index
        }
        viewport.render();
    });

    document.getElementById('moveDown').addEventListener('click', function () {
        var circle = getSelectedCircle();

        if (circle) {
            circle.layer.moveDown();
        }
        viewport.render();
    });

    document.getElementById('moveToTop').addEventListener('click', function () {
        var circle = getSelectedCircle();

        if (circle) {
            circle.layer.moveToTop();
        }
        viewport.render();
    });

    document.getElementById('moveToBottom').addEventListener('click', function () {
        var circle = getSelectedCircle();

        if (circle) {
            circle.layer.moveToBottom();
        }
        viewport.render();
    });

    document.getElementById('destroy').addEventListener('click', function () {
        var circle = getSelectedCircle();

        if (circle) {
            circle.layer.destroy(); //destroy the layer
        }
        viewport.render();
    });

    document.getElementById('download').addEventListener('click', function () {
        viewport.scene.download({
            fileName: 'three-circles.png' //download
        });
    });
    // ***END EVENT HANDLERS*** //
})();