/*
 * DRAW ON THE PLAYGROUND CANVAS HERE
 */
(function (exports) {
    /*
    |--------------------------------------------------------------------------
    | Configurations
    |--------------------------------------------------------------------------
    */
    var container = document.createElement('div');
    container.id = 'env-visualizer-container';
    container.hidden = true;
    document.body.appendChild(container);
    // create viewport
    var viewport = new Concrete.Viewport({
        width: 1000,
        height: 1000,
        container: container
    });

    // OVERFLOW
    // var canvas = viewport.scene.canvas;;
    // var context = viewport.scene.context;
    // var dragging = false;
    // var lastX;
    // var marginLeft = 0;

    // for (var i = 0; i < 1000; i++) {
    //     context.beginPath();
    //     context.arc(Math.random() * 10000, Math.random() * 250, 20.0, 0, 2 * Math.PI, false);
    //     context.stroke();
    // }

    // canvas.addEventListener('mousedown', function (e) {
    //     var evt = e || event;
    //     dragging = true;
    //     lastX = evt.clientX;
    //     e.preventDefault();
    // }, false);

    // window.addEventListener('mousemove', function (e) {
    //     var evt = e || event;
    //     if (dragging) {
    //         var delta = evt.clientX - lastX;
    //         lastX = evt.clientX;
    //         marginLeft += delta;
    //         canvas.style.marginLeft = marginLeft + "px";
    //     }
    //     e.preventDefault();
    // }, false);

    // window.addEventListener('mouseup', function () {
    //     dragging = false;
    // }, false);

    // END OVERFLOW


    const NOBEL = '#999999';
    const BLACK = '#000000';
    const WHITE = '#FFFFFF';
    const CYAN_BLUE = '#2c3e50';
    // const GREEN = '#008000';
    const GREEN = '#00FF00';
    const REGENT_GRAY = '#8a9ba8'; //80% opacity
    const REGENT_GRAY_30 = '#8a9ba84d'; //30%
    const REGENT_GRAY_50 = '#8a9ba880'; //50%
    const REGENT_GRAY_80 = '#8a9ba8cc'; //80%

    const FONT_SETTING = '14px Roboto Mono, Courier New';
    const FONT_HEIGHT = 14;
    const TEXT_PADDING = 5;

    const FRAME_FONT_SETTING = '14px Roboto Mono, Courier New';
    const FNOBJECT_RADIUS = 12; // radius of function object circle
    const DATA_OBJECT_SIDE = 24; // length of data object triangle
    const DRAWING_LEFT_PADDING = 70; // left padding for entire drawing
    const FRAME_HEIGHT_LINE = 55; // height in px of each line of text in a frame;
    const FRAME_HEIGHT_PADDING = 20; // height in px to pad each frame with
    const FRAME_WIDTH_CHAR = 8; // width in px of each text character in a frame;
    const FRAME_WIDTH_PADDING = 50; // width in px to pad each frame with;
    const FRAME_SPACING = 100; // spacing between horizontally adjacent frames
    const LEVEL_SPACING = 60; // spacing between vertical frame levels
    const OBJECT_FRAME_RIGHT_SPACING = 50; // space to right frame border
    const OBJECT_FRAME_TOP_SPACING = 35; // perpendicular distance to top border
    const PAIR_SPACING = 15; // spacing between pairs
    const INNER_RADIUS = 2; // radius of inner dot within a fn object

    // TEXT SPACING
    const HORIZONTAL_TEXT_MARGIN = 10
    const VERITCAL_TEXT_MARGIN = 39

    // DATA STRUCTURE DIMENSIONS
    const DATA_UNIT_WIDTH = 80;
    const DATA_UNIT_HEIGHT = 40;
    const DRAW_ON_STARTUP = [
        drawSceneFrames,
        drawSceneFnObjects,
        drawHitFnObjects,
        drawSceneDataObjects,
        // drawHitDataObjects,
        drawSceneFrameArrows,
        drawSceneFrameObjectArrows,
        drawSceneFnFrameArrows,
        drawSceneTextObjects,
        drawHitTextObjects,
        drawSceneArrows,
        drawHitArrows
    ];

    let alreadyListened = false;

    /**
     * Create a different layer for each type of element. May be more useful
     * in future for manipulating groups of elements.
     */
    var fnObjectLayer = new Concrete.Layer();
    var dataObjectLayer = new Concrete.Layer();
    var frameLayer = new Concrete.Layer();
    var arrowLayer = new Concrete.Layer(); //depreciated
    var hoveredLayer = new Concrete.Layer(); //depreciated
    var arrowObjectLayer = new Concrete.Layer();
    var textObjectLayer = new Concrete.Layer();
    hoveredLayer.visible = false;

    const LAYERS = [
        frameLayer,
        fnObjectLayer,
        dataObjectLayer,
        arrowObjectLayer,
        textObjectLayer
    ]

    let fnObjects = [];
    /**
     * Unlike function objects, data objects are represented internally not as
     * objects, but as arrays. As such, we cannot assign properties like x- and
     * y-coordinates directly to them. These properties are stored instead in
     * another array of objects called dataObjectWrappers, which maps 1-to-1 to
     * the objects they represent in dataObjects.
     */
    let dataObjects = [];
    let dataObjectWrappers = [];
    let levels = {};
    let builtinsToDraw = [];
    let envKeyCounter = 0;

    let drawnDataObjects = [];
    let cycleDetector = [];
    let hitCycleDetector = [];
    let frames = [];
    let texts = [];
    var arrows = [];

    /**
     * Keys (unique IDs) for data objects, user-defined function objects,
     * and built-in function objects must all be differentiated.
     * dataObject and builtinFnObject keys need to be manually assigned.
     * Since ConcreteJS hit detection uses [0, 2^24) as its range of keys
     * (and -1 for not found), take 2^24 - 1 as the key for
     * the first dataObject and decrement from there.
     * Take 2^23 - 1 as the key for the first builtinFnObject and
     * decrement from there.
     */
    let dataObjectKey = Math.pow(2, 24) - 1;
    let fnObjectKey = Math.pow(2, 22) - 1;
    let arrowObjectKey = Math.pow(2, 20) - 1;
    let textObjectKey = Math.pow(2, 18) - 1;

    // Initialise list of built-in functions to ignore (i.e. not draw)
    var builtins = [];

    /*
    |--------------------------------------------------------------------------
    | Draw functions 
    |--------------------------------------------------------------------------
    | eg. drawScene, drawHit: plural, single
    | only include those that have their own layers
    */
    // General Scnene
    // --------------------------------------------------.
    // main function to be exported
    function draw_env(context) {
        // add built-in functions to list of builtins
        let originalEnvs = context.context.context.runtime.environments;
        let allEnvs = [];
        originalEnvs.forEach(function (e) {
            allEnvs.push(e);
        });
        builtins = builtins.concat(Object.keys(allEnvs[allEnvs.length - 1].head));
        builtins = builtins.concat(Object.keys(allEnvs[allEnvs.length - 2].head));

        // add library-specific built-in functions to list of builtins
        const externalSymbols = context.context.context.externalSymbols;
        for (let i in externalSymbols) {
            builtins.push(externalSymbols[i]);
        }

        // Hides the default text
        // (document.getElementById('env-visualizer-default-text')).hidden = true;

        // Blink icon
        // const icon = document.getElementById('env_visualiser-icon');
        // icon.classList.add('side-content-tab-alert');

        // reset current drawing
        viewport.layers.forEach(function (layer) { //clear layer by layer
            layer.scene.clear();
        });

        fnObjects = [];
        dataObjects = [];
        dataObjectWrappers = [];
        levels = {};
        builtinsToDraw = [];
        texts = [];
        arrows = [];

        // parse input from interpreter
        function parseInput(allFrames, envs) {
            let environments = envs;
            let frames = [];
            /**
             * environments is the array of environments in the interpreter.
             * frames is the current frames being created
             * allFrames is all frames created so far (including from previous
             * recursive calls of parseInput).
             */

            /**
             * For some reason, some environments are not present in the top level
             * array of environments in the input context. Here, we extract those
             * missing environments.
             */
            let i = environments.length - 4; // skip global and program environments
            while (i >= 0) {
                const currEnv = allEnvs[i];
                if (!allEnvs.includes(currEnv.tail)) {
                    if (environments === allEnvs) {
                        allEnvs.splice(i + 1, 0, currEnv.tail);
                    } else {
                        allEnvs.splice(i + 1, 0, currEnv.tail);
                        environments.splice(i + 1, 0, currEnv.tail);
                    }
                    i += 2;
                }
                i--;
            }
            // add layers
            LAYERS.forEach(layer => viewport.add(layer));
            /**
             * Refactor start
             */

            // Assign the same id to each environment and its corresponding frame
            environments.forEach(function (e) {
                e.envKeyCounter = envKeyCounter;
                envKeyCounter++;
            });

            /**
             * Create a frame for each environment
             * Each frame represents one frame to be drawn
             */
            // Process backwards such that global frame comes first
            for (let i = environments.length - 1; i >= 0; i--) {
                let environment = environments[i];
                let frame;

                /**
                 * There are two environments named programEnvironment. We only want one
                 * corresponding "Program" frame.
                 */
                if (environment.name === "programEnvironment") {
                    let isProgEnvPresent = false;
                    frames.forEach(function (f) {
                        if (f.name === "Program") {
                            frame = f;
                            isProgEnvPresent = true;
                        }
                    });
                    if (!isProgEnvPresent) {
                        frame = createEmptyFrame("Program");
                        frame.key = environment.envKeyCounter;
                        frames.push(frame);
                        allFrames.push(frame);
                    }
                } else {
                    frame = createEmptyFrame(environment.name);
                    frame.key = environment.envKeyCounter;
                    frames.push(frame);
                    allFrames.push(frame);
                }

                // extract elements from environment into frame
                frame.elements = {};
                if (frame.name === "global") {
                    frame.elements['(predeclared names)'] = '';
                    // don't copy over built-in functions
                } else if (environment.name === "programEnvironment"
                    && environment.tail.name === "global") {
                    // do nothing (this environment contains library functions)
                } else {
                    // copy everything (possibly including redeclared built-ins) over
                    const envElements = environment.head;
                    for (let e in envElements) {
                        frame.elements[e] = envElements[e];
                        if (typeof envElements[e] === "function"
                            && builtins.indexOf('' + getFnName(envElements[e])) > 0
                            && getFnName(envElements[e])) {
                            // this is a built-in function referenced to in a later frame,
                            // e.g. "const a = pair". In this case, add it to the global frame
                            // to be drawn and subsequently referenced.
                            frames[0].elements[getFnName(envElements[e])] = envElements[e];
                        }
                    }
                }
            }

            /**
             * - Assign parent frame of each frame (except global frame)
             * - Assign level of each frame. Frames are organised into distinct
             *   vertical bands. Global frame is at the top (level 0). Every
             *   other frame is 1 level below its parent.
             */
            frames.forEach(function (frame) {
                if (frame.name === "global") {
                    frame.parent = null;
                    frame.level = 0;
                } else {
                    if (frame.name === "Program") {
                        frame.parent = getFrameByName(allFrames, "global");
                    } else {
                        let env = getEnvByKeyCounter(environments, frame.key);
                        if (env.tail.name === "programEnvironment") {
                            env = env.tail;
                        }
                        frame.parent = getFrameByKey(allFrames, env.tail.envKeyCounter);
                    }
                    // For loops do not have frame.parent, only while loops and functions do
                    if (frame.parent) {
                        frame.parent.children.push(frame.key);
                        frame.level = frame.parent.level + 1;
                    }
                }

                // update total number of frames in the current level
                if (levels[frame.level]) {
                    levels[frame.level].count++;
                    levels[frame.level].frames.push(frame);
                } else {
                    levels[frame.level] = { count: 1 };
                    levels[frame.level].frames = [frame];
                }
            });

            /**
             * Extract function and data objects from frames. Each distinct object is
             * drawn next to the first frame where it is referenced; subsequent
             * references point back to the object.
             */

            // dataPairsSeachedForFnObj array is used in findFnInDataObject
            // Helps to terminate search in recursive data structures;
            let dataPairsSeachedForFnObj = [];
            frames.forEach(function (frame) {
                const elements = frame.elements;
                for (let e in elements) {
                    if (typeof elements[e] === "function"
                        && !fnObjects.includes(elements[e])) {
                        initialiseFrameFnObject(elements[e], frame)
                        fnObjects.push(elements[e])
                    } else if (typeof elements[e] === "object"
                        && !dataObjects.includes(elements[e])) {
                        dataObjects.push(elements[e])
                        dataObjectWrappers.push(
                            initialiseDataObjectWrapper(e, elements[e], frame)
                        );
                        // Iterate through elements[e], check if function exists in fnObjects
                        // If no, instantiate and add to fnObjects array
                        // Currently, do not add function objects belonging to arrays (as arrays are not supported yet)
                        if (!is_Array(elements[e])) {
                            initialiseFindFnInDataObject();
                            findFnInDataObject(elements[e], elements[e], elements[e])
                        }
                    }
                }
            });

            function initialiseFindFnInDataObject() {
                dataPairsSeachedForFnObj = [];
            }

            function findFnInDataObject(list, parent, dataObject) {
                if (dataPairsSeachedForFnObj.includes(list)) {
                    return false;
                } else if (Array.isArray(list)) {
                    dataPairsSeachedForFnObj.push(list)
                    findFnInDataObject(list[1], list, dataObject)
                    findFnInDataObject(list[0], list, dataObject)
                } else if (isFunction(list) && !fnObjects.includes(list)) {
                    initialiseDataFnObject(list, [dataObject, parent])
                    fnObjects.push(list);
                }
            }

            /**
             * - Find width and height of each frame
             */

            for (let i = frames.length - 1; i >= 0; i--) {
                let frame = frames[i];
                frame.height = getFrameHeight(frame);
                frame.width = getFrameWidth(frame);
                frame.fullwidth = getFrameAndObjectWidth(frame);
            }

            /**
             * Some functions may have been generated via anonymous functions, whose
             * environments would not have been present in initial array from the
             * interpreter.
             * Find these environments, and recursively process them.
             */
            const missing = []; // think of a better name
            fnObjects.forEach(function (fnObject) {
                let otherEnv = fnObject.environment;
                /**
                 * There may be multiple levels of anonymous function frames, e.g.
                 * from the expression (w => x => y => z)(1)(2), where
                 * w => x => ... generates one frame, and
                 * x => y => ... generates another.
                 * The while loop ensure all of these frames are extracted.
                 */
                while (!allEnvs.includes(otherEnv)) {
                    missing.push(otherEnv);
                    allEnvs.push(otherEnv);
                    // find function definition expression to use as frame name

                    if (!otherEnv.callExpression) {
                        // When the environment is a loop, it doesn't have a call expression
                        break;
                    }

                    let pointer = otherEnv.callExpression.callee;
                    let i = 0;
                    while (pointer.callee) {
                        pointer = pointer.callee;
                        i++;
                    }
                    while (i > 0) {
                        pointer = pointer.body;
                        i--;
                    }
                    const params = pointer.params;
                    let paramArray = [];
                    let paramString;
                    try {
                        params.forEach(function (p) {
                            paramArray.push(p.name);
                        });
                        const paramString = "(" + paramArray.join(", ") + ") => ...";
                        otherEnv.vizName = paramString;
                    } catch (e) {
                        // for some reason or other the function definition expression is
                        // not always available. In that case, just use the frame name
                    }
                    otherEnv = otherEnv.tail;
                };
            });
            if (missing.length > 0) {
                frames = (parseInput(allFrames, missing));
            }

            return allFrames;
        }

        frames = parseInput([], allEnvs);
        /**
         * Find the source frame for each fnObject. The source frame is the frame
         * which generated the function. This may be different from the parent
         * frame, which is the first frame where the object is referenced.
         */
        fnObjects.forEach(function (fnObject) {
            if (fnObject.environment.name === "programEnvironment") {
                fnObject.source = getFrameByName(frames, "Program");
            } else {
                fnObject.source = getFrameByKey(frames, fnObject.environment.envKeyCounter);
            }
        });

        positionItems(frames);
        let drawingWidth = Math.max(getDrawingWidth(levels) * 1.6, 300)
        viewport.setSize(drawingWidth, getDrawingHeight(levels));
        // "* 1.6" is a partial workaround for drawing being cut off on the right


        // INVOKE ALL
        // TODO: ABSTRACT the repetated pattern, declare a constant array in the configuration section
        DRAW_ON_STARTUP.forEach(drawScene => drawScene());

        if (!alreadyListened) {
            alreadyListened = true;
            container.addEventListener('mousemove', function (evt) {
                var boundingRect = container.getBoundingClientRect(),
                    x = evt.clientX - boundingRect.left,
                    y = evt.clientY - boundingRect.top,
                    key = viewport.getIntersection(x, y),
                    fnObject,
                    dataObject,
                    text,
                    arrow;

                if (key >= 0) {
                    container.style.cursor = 'pointer';
                } else {
                    container.style.cursor = 'default';
                }

                // Arrow Mousemove
                // --------------------------------------------------.
                // unhover all arrows
                arrows.forEach(function (arrow) {
                    arrow.hovered = false;
                });

                if (key >= 0 && key < Math.pow(2, 20)) {
                    arrow = getObjFromKey(arrows, key);
                    if (arrow) arrow.hovered = true;

                }

                drawSceneArrows();

                // Text Mousemove
                // --------------------------------------------------.
                // unhover all texts
                texts.forEach(function (text) {
                    text.hovered = false;
                });

                if (key >= 0 && key < Math.pow(2, 18)) {
                    text = getObjFromKey(texts, key);
                    if (text) text.hovered = true;
                }

                drawSceneTextObjects();


                // Fn Mousemove
                // --------------------------------------------------.
                // unhover all fnObjects
                fnObjects.forEach(function (fnObject) {
                    fnObject.hovered = false;
                });

                if (key >= 0 && key < Math.pow(2, 23)) {
                    fnObject = getObjFromKey(fnObjects, key);
                    if (fnObject) fnObject.hovered = true;
                }

                drawSceneFnObjects();


                // Disable temporarily
                // --------------------------------------------------.
                // // unhover all circles
                // fnObjects.forEach(function (fnObject) {
                //     fnObject.hovered = false;
                // });

                // for (d in dataObjects) {
                //     dataObjectWrappers[d].hovered = false;
                // }

                // if (key >= 0) {
                //     hoveredLayer.visible = true;
                //     viewport.render();
                // }
                // else {
                //     hoveredLayer.visible = false;
                //     viewport.render();
                // }

                // if (key >= 0 && key < Math.pow(2, 23)) {
                //     fnObject = getFnObjectFromKey(key);
                //     try {
                //         fnObject.hovered = true;
                //     } catch (e) { }
                // } else if (key >= Math.pow(2, 23)) {
                //     dataObject = getDataObjectFromKey(key);
                //     try {
                //         getWrapperFromDataObject(dataObject).hovered = true;
                //     } catch (e) { }
                // }
                // drawSceneFnObjects();
                // drawSceneDataObjects();
            });

            container.addEventListener('click', function (evt) {
                var boundingRect = container.getBoundingClientRect(),
                    x = evt.clientX - boundingRect.left,
                    y = evt.clientY - boundingRect.top,
                    key = viewport.getIntersection(x, y),
                    fnObject,
                    dataObject,
                    text;

                console.log(key);
                // Text Event
                // --------------------------------------------------.
                // unhover all texts
                // redraw the scene when clicked
                texts.forEach(function (text) {
                    text.selected = false;
                });

                if (key >= 0 && key < Math.pow(2, 18)) {
                    text = getObjFromKey(texts, key);
                    if (text) text.selected = true;
                }

                drawSceneTextObjects();

                // Fn Event
                // --------------------------------------------------.
                // unselect all fnObjects
                fnObjects.forEach(function (fnObject) {
                    fnObject.selected = false;
                });

                if (key >= 0 && key < Math.pow(2, 23)) {
                    fnObject = getObjFromKey(fnObjects, key);
                    if (fnObject) fnObject.selected = true;
                }

                drawSceneFnObjects();

                // Disable temporarily
                // --------------------------------------------------.
                // unhover all circles
                // fnObjects.forEach(function (fnObject) {
                //     fnObject.selected = false;
                // });

                // for (d in dataObjects) {
                //     dataObjectWrappers[d].hovered = false;
                // }

                // if (key >= 0 && key < Math.pow(2, 23)) {
                //     fnObject = getFnObjectFromKey(key);
                //     try {
                //         fnObject.selected = true;
                //     } catch (e) { }
                // } else if (key > Math.pow(2, 23)) {
                //     dataObject = getDataObjectFromKey(key);
                //     try {
                //         getWrapperFromDataObject(dataObject).selected = true;
                //         draw_data(dataObject.data);
                //     } catch (e) { }
                // }

                // drawSceneFnObjects();
                // drawSceneDataObjects();
            });
        }
        // add concrete container handlers
        frames.reverse();
        viewport.render();
    }

    // Frame Scene
    // --------------------------------------------------.
    function drawSceneFrames() {
        frames.forEach(function (frame) {
            if (!isEmptyFrame(frame)) {
                drawSceneFrame(frame);
            }
        });
        viewport.render();
    }

    function drawSceneFrame(frame) {
        var config = frame;
        var scene = config.layer.scene,
            context = scene.context;
        context.save();
        context.font = FRAME_FONT_SETTING;
        context.fillStyle = WHITE;
        var x, y;
        x = config.x;
        y = config.y;
        context.beginPath();

        // render frame name; rename as needed for aesthetic reasons
        let frameName;
        switch (config.name) {
            case 'forLoopEnvironment':
                frameName = 'Body of for-loop';
                break;
            case 'forBlockEnvironment':
                frameName = 'Control variable of for-loop';
                break;
            case 'blockEnvironment':
                frameName = 'Block';
                break;
            case 'global':
                frameName = "Global";
                break;
            default:
                frameName = config.name;
        }

        if (frameName.length * 9 < config.width / 2 || frameName === 'global') {
            context.fillText(frameName, x, y - 10);
        } else {
            context.fillText(frameName, x, y - 10);
        }

        // render text in frame
        let elements = config.elements;
        let i = 0;
        let textX = x + HORIZONTAL_TEXT_MARGIN
        let textY = y + VERITCAL_TEXT_MARGIN

        for (let k in elements) {
            if (elements[k] === null && typeof (elements[k]) === "object") {
                // null primitive in Source
                context.fillText(`${'' + k}: null`, textX, textY + i * FRAME_HEIGHT_LINE);
            } else {
                switch (typeof elements[k]) {
                    case 'number':
                    case 'boolean':
                    case 'undefined':
                        context.fillText(`${'' + k}: ${'' + elements[k]}`, textX, textY + i * FRAME_HEIGHT_LINE);
                        break;
                    case 'string':
                        if (k === '(predeclared names)') {
                            context.fillText(`${'' + k}`, textX, textY + i * FRAME_HEIGHT_LINE);
                        } else {
                            context.fillText(`${'' + k}: "${'' + elements[k]}"`, textX, textY + i * FRAME_HEIGHT_LINE);
                        }
                        break;
                    default:
                        context.fillText(`${'' + k}:`, textX, textY + i * FRAME_HEIGHT_LINE);
                        i += getUnitHeight(elements[k]);
                }
            }
            i++;
        }

        context.strokeStyle = WHITE;
        context.strokeRect(x, y, config.width, config.height);
        //context.lineWidth = 2;
        // context.stroke();

        if (config.selected) {
            context.strokeStyle = WHITE;
            //context.lineWidth = 6;
            context.stroke();
        }

        if (config.hovered) {
            context.strokeStyle = GREEN;
            //context.lineWidth = 2;
            context.stroke();
        }
        context.restore();
    }

    function drawHitFrame(config) {
        if (config.variables.length === 0) {
            return;
        }
        var hit = config.layer.hit,
            context = hit.context,
            x,
            y;

        context.save();
        if (config.tail != null) {
            x = frames[config.tail].x;
            y = frames[config.tail].y + 200;
            config.x = x;
            config.y = y;
        } else {
            x = config.x;
            y = config.y;
        }

        context.beginPath();
        context.fillStyle = hit.getColorFromIndex(config.key);
        context.fillRect(x, y, 150, 100);
        context.restore();
    }

    // Function Scene
    // --------------------------------------------------.
    function drawSceneFnObjects() {
        fnObjectLayer.scene.clear();
        for (let i = 0; i < fnObjects.length; i++) {
            const fnObjParent = fnObjects[i].parent
            if (Array.isArray(fnObjParent) && fnObjParent[0].length != 2) {
                // Do not draw function if it belongs to an array. (Remove after implementing arrays)
            } else {
                drawSceneFnObject(i);
            }
        }
        viewport.render();
    }

    function drawHitFnObjects() {
        for (let i = 0; i < fnObjects.length; i++) {
            drawHitFnObject(i);
        }
    }

    function drawSceneFnObject(pos) {
        var config = fnObjects[pos];
        var scene = config.layer.scene,
            context = scene.context;

        const x = config.x;
        const y = config.y;
        context.save()

        //background
        context.fillStyle = CYAN_BLUE; // colour of Source Academy background
        context.fillRect(x - 2 * FNOBJECT_RADIUS, y - FNOBJECT_RADIUS, 4 * FNOBJECT_RADIUS, 2 * FNOBJECT_RADIUS);

        // inner filled circle
        context.beginPath();
        context.arc(x - FNOBJECT_RADIUS, y, INNER_RADIUS, 0, Math.PI * 2, false);
        context.fillStyle = NOBEL;
        context.fill();

        context.moveTo(x, y);
        context.arc(x - FNOBJECT_RADIUS, y, FNOBJECT_RADIUS, 0, Math.PI * 2, false);
        context.strokeStyle = (!config.hovered && !config.selected) ? NOBEL : GREEN;
        context.stroke();

        context.beginPath();
        if (config.selected) {
            // if (true) { //debug
            let fnString;
            //convert to string
            try {
                fnString = config.fun.toString();
            } catch (e) {
                fnString = config.toString();
            }
            let params;
            let body;
            //filter out the params and body 
            if (config.node.type === "FunctionDeclaration") {
                // console.log('fndeclaration');
                params = fnString.substring(fnString.indexOf('('), fnString.indexOf('{') - 1);
                body = fnString.substring(fnString.indexOf('{'));
            } else {
                // console.log('lambdaexpression');
                params = fnString.substring(0, fnString.indexOf('=') - 1);
                body = fnString.substring(fnString.indexOf('=') + 3);
            }

            // fill text into multi line
            const textObjectContext = textObjectLayer.scene.context;
            textObjectContext.font = FONT_SETTING;
            textObjectContext.fillStyle = GREEN;
            body = body.split('\n');
            textObjectContext.fillText(`params: ${params === '' ? '()' : params}`, x + 50, y);
            textObjectContext.fillText(`body:`, x + 50, y + 20);
            let i = 0;
            while (i < 5 && i < body.length) {
                textObjectContext.fillText(body[i], x + 100, y + 20 * (i + 1));
                i++;
            }
            if (i < body.length) {
                textObjectContext.fillText('...', x + 120, y + 120);
            }
        }
        context.moveTo(x + FNOBJECT_RADIUS, y);
        context.arc(x + FNOBJECT_RADIUS, y, INNER_RADIUS, 0, Math.PI * 2, false);
        context.fill();
        context.moveTo(x + 2 * FNOBJECT_RADIUS, y);
        context.arc(x + FNOBJECT_RADIUS, y, FNOBJECT_RADIUS, 0, Math.PI * 2, false);
        context.stroke();
        // drawLine(context, x + FNOBJECT_RADIUS, y, x + FNOBJECT_RADIUS, y - FNOBJECT_RADIUS);
        // context.moveTo(x + FNOBJECT_RADIUS, y);
        // context.lineTo(x + FNOBJECT_RADIUS, y - FNOBJECT_RADIUS);
        context.restore();
    }

    function drawHitFnObject(pos) {
        var config = fnObjects[pos];
        var hit = config.layer.hit,
            context = hit.context;
        const x = config.x;
        const y = config.y;
        context.save();

        config.x = x;
        config.y = y;
        context.beginPath();
        context.arc(x - FNOBJECT_RADIUS, y, FNOBJECT_RADIUS, 0, Math.PI * 2, false);
        context.fillStyle = hit.getColorFromIndex(config.key);
        context.fill();
        context.beginPath();
        context.arc(x + FNOBJECT_RADIUS, y, FNOBJECT_RADIUS, 0, Math.PI * 2, false);
        context.fillStyle = hit.getColorFromIndex(config.key);
        context.fill();

        context.restore();
    }

    // Data Scene
    // --------------------------------------------------.
    function drawSceneDataObjects() {
        // drawDataObjects array is declared as a global array below but must
        // be reset whenever this fn is called
        drawnDataObjects = [];
        dataObjectLayer.scene.clear();
        dataObjects.forEach(function (dataObject) {
            if (dataObject != null) {
                const result = drawThis(dataObject);
                const draw = result.draw;
                if (draw) {
                    if (is_Array(dataObject)) {
                        drawArrayObject(dataObject);
                    } else {
                        drawSceneDataObject(dataObject);
                    }
                    drawnDataObjects.push(dataObject);
                } else {
                    reassignCoordinates(result.mainStructure, result.subStructure);
                }
            }
        });
        viewport.render();
    }

    function drawHitDataObjects() {
        dataObjects.forEach(function (dataObject) {
            if (dataObject != null) {
                drawHitDataObject(dataObject);
            }
        });
    }

    function drawSceneDataObject(dataObject) {
        const wrapper = dataObjectWrappers[dataObjects.indexOf(dataObject)];
        // define points for drawing data object
        const x0 = wrapper.x - DATA_OBJECT_SIDE,
            y0 = wrapper.y - DATA_OBJECT_SIDE / 2;
        var scene = dataObjectLayer.scene,
            context = scene.context;

        context.save();
        cycleDetector = [];
        initialiseCallGetShiftInfo(dataObject)
        drawScenePairs(dataObject, scene, wrapper, wrapper.data, x0, y0);
        context.restore();
        //reorder layers
        // arrowLayer.moveToBottom();
        // fnObjectLayer.moveToTop();
        // dataObjectLayer.moveToTop();
        // hoveredLayer.moveToTop();
        // viewport.render();
    }

    function drawHitDataObject(dataObject) {
        const wrapper = dataObjectWrappers[dataObjects.indexOf(dataObject)];
        const x0 = wrapper.x - DATA_OBJECT_SIDE,
            y0 = wrapper.y - DATA_OBJECT_SIDE / 2;
        var hit = dataObjectLayer.hit,
            context = hit.context;

        context.save();

        hitCycleDetector = [];
        drawHitPairs(dataObject, hit, wrapper, x0, y0);

        context.restore();
    }

    // Arrow Scene
    // --------------------------------------------------.
    function drawSceneArrows() {
        var scene = arrowObjectLayer.scene,
            hoveredArrow;
        scene.clear();
        arrows.forEach(function (arrow) {
            if (arrow.hovered) {
                hoveredArrow = arrow;
            } else {
                drawSceneArrow(arrow);
            }
        });
        if (hoveredArrow) drawSceneArrow(hoveredArrow);
        viewport.render();
    }

    function drawHitArrows() {
        arrows.forEach(function (arrow) {
            drawHitArrow(arrow);
        });
    }

    function drawSceneArrow(config) {
        const { nodes, color, hovered } = config;
        var scene = arrowObjectLayer.scene,
            context = scene.context;
        context.save();
        context.beginPath();

        for (var i = 0; i < nodes.length - 1; i++) {
            context.moveTo(nodes[i].x, nodes[i].y); //start
            context.lineTo(nodes[i + 1].x, nodes[i + 1].y); //final
        }
        // draw arrow head
        drawArrowObjectHead(
            nodes.slice(-2)[0].x,
            nodes.slice(-2)[0].y,
            nodes.slice(-1)[0].x,
            nodes.slice(-1)[0].y
        );
        context.strokeStyle = color;
        context.stroke();

        if (hovered) {
            context.strokeStyle = GREEN;
            // context.lineWidth = 5;
            context.stroke();
        }

        context.restore();
    }

    function drawHitArrow(config) {
        const { nodes, key } = config;
        var hit = arrowObjectLayer.hit,
            context = hit.context;
        context.save();
        context.beginPath();

        for (var i = 0; i < nodes.length - 1; i++) {
            context.moveTo(nodes[i].x, nodes[i].y); //start
            context.lineTo(nodes[i + 1].x, nodes[i + 1].y); //final
        }
        // draw arrow head
        drawArrowObjectHead(
            nodes.slice(-2)[0].x,
            nodes.slice(-2)[0].y,
            nodes.slice(-1)[0].x,
            nodes.slice(-1)[0].y
        );
        context.strokeStyle = hit.getColorFromIndex(key);
        context.lineWidth = 15;
        context.stroke();
        context.restore();
    }

    // Text Scene
    // --------------------------------------------------.
    function drawSceneTextObjects() {
        var scene = textObjectLayer.scene;
        scene.clear();
        texts.forEach(function (text) {
            drawSceneTextObject(text);
        });
        viewport.render();
    }

    function drawHitTextObjects() {
        texts.forEach(function (text) {
            drawHitTextObject(text);
        });
    }

    function drawSceneTextObject(config) {
        const { text, x, y, color, hovered } = config;
        var scene = textObjectLayer.scene,
            context = scene.context;
        context.save()
        //...///
        context.font = FONT_SETTING;

        if (hovered) {
            //... add background to the text
            context.fillStyle = REGENT_GRAY_80;
            context.fillRect(
                x - TEXT_PADDING,
                y - FONT_HEIGHT - TEXT_PADDING / 2,
                context.measureText(text).width + TEXT_PADDING * 2,
                FONT_HEIGHT + TEXT_PADDING
            );
            //...
            context.fillStyle = WHITE;
            context.fillText(text, x, y - TEXT_PADDING / 2);
        } else {
            context.fillStyle = color;
            const { result, truncated } = truncateString(context, text, DATA_UNIT_WIDTH / 2);
            if (truncated) {
                context.fillText(result, x - 10, y);
            } else {
                context.fillText(result, x, y);
            }
        }
        //...///
        context.restore();
    }

    function drawHitTextObject(config) {
        const { text, x, y, key } = config;
        var hit = textObjectLayer.hit,
            context = hit.context;
        context.save();
        context.font = FONT_SETTING;
        context.fillStyle = hit.getColorFromIndex(key);
        const textWidth = Math.min(
            context.measureText(text).width + TEXT_PADDING * 2,
            DATA_UNIT_WIDTH / 2
        );
        //...///
        context.fillRect(
            x - TEXT_PADDING,
            y - FONT_HEIGHT,
            textWidth,
            FONT_HEIGHT + TEXT_PADDING
        );
        //...///
        context.restore();
    }


    /*
    |--------------------------------------------------------------------------
    | Helper functions 
    |--------------------------------------------------------------------------
    */
    // General Helpers
    // --------------------------------------------------.
    function getObjFromKey(objects, key) {
        var len = objects.length,
            n, obj;

        for (n = 0; n < len; n++) {
            obj = objects[n];
            if (obj.key === key) {
                return obj;
            }
        }

        return null;
    }

    function getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }

    /**
     * Assigns an x- and a y-coordinate to every frame and object.
     */
    function positionItems(frames) {
        /**
         * Find and store the height of each level
         * (i.e. the height of the tallest environment)
         */
        for (let l in levels) {
            const level = levels[l];
            let maxHeight = 0;
            let fullwidthArray = [];
            level.frames.forEach(function (frame) {
                if (frame.height > maxHeight) {
                    maxHeight = frame.height;
                }
                fullwidthArray.push(frame.fullwidth)
            });
            level.height = maxHeight;
            level.widthArray = fullwidthArray
        }

        /**
         * Calculate x- and y-coordinates for each frame
         */
        const drawingWidth = getDrawingWidth(levels) + 2 * DRAWING_LEFT_PADDING;
        frames.forEach(function (frame) {
            let currLevel = frame.level;

            /**
             * y-coordinate
             * Simply the total height of all levels above the frame, plus a
             * fixed spacing factor (60) per level.
             */
            let y = 30;
            for (let i = 0; i < currLevel; i++) {
                y += levels[i].height + LEVEL_SPACING;
            }
            frame.y = y;

        });

        /**
        * x-coordinate
        * All frames are left-aligned. Iterate through each level, assigning the x-coordinate
        * depending on how much space the frames on the left are taking up
        * Potential future improvement: Group frames together in a tree structure, and assign space recurisvely
        * to each frame. However, need to fix max drawing size, which is currently limited.
        */
        for (let l in levels) {
            const level = levels[l];
            const frameWidthArray = level.widthArray
            level.frames.forEach(function (frame) {
                const frameIndex = level.frames.indexOf(frame)
                if (frameIndex > 0) {
                    frame.x = DRAWING_LEFT_PADDING
                    for (let i = 0; i < frameIndex; i++) {
                        frame.x += frameWidthArray[i] + 20;
                    }
                } else {
                    frame.x = DRAWING_LEFT_PADDING;
                }
            });
        }

        /**
         * Calculate coordinates for each fnObject and dataObject.
         */
        for (let d in dataObjects) {
            const wrapper = dataObjectWrappers[d];
            const parent = wrapper.parent;
            wrapper.x = parent.x
                + parent.width
                + OBJECT_FRAME_RIGHT_SPACING;
            wrapper.y = parent.y
                + findElementPosition(dataObjects[d], parent) * FRAME_HEIGHT_LINE
                + OBJECT_FRAME_TOP_SPACING;
        }

        fnObjects.forEach(function (fnObject) {
            // Checks the parent of the function, calculating coordinates accordingly
            let parent = fnObject.parent;
            if (Array.isArray(parent)) {
                // Check if parent has x and y coordinates
                // Otherwise use getShiftInfo to calculate
                if (parent[0] === parent[1]) {
                    let parentWrapper = getWrapperFromDataObject(parent[1])
                    fnObject.x = parentWrapper.x
                    fnObject.y = parentWrapper.y + FRAME_HEIGHT_LINE
                    // If function resides in tail, shift it rightward
                    if (parent[0].length > 1 && parent[0][1] === fnObject) {
                        fnObject.x += DATA_UNIT_WIDTH / 2
                    }
                } else {
                    let parent_coordinates = getShiftInfo(parent[0], parent[1])
                    fnObject.x = parent_coordinates.x
                    fnObject.y = parent_coordinates.y + FRAME_HEIGHT_LINE - 18
                    if (parent.length > 1 && parent[1][1] === fnObject) {
                        fnObject.x += DATA_UNIT_WIDTH / 2
                    }
                }
            } else {
                fnObject.x = parent.x
                    + parent.width
                    + OBJECT_FRAME_RIGHT_SPACING;
                fnObject.y = parent.y +
                    findElementPosition(fnObject, parent) * FRAME_HEIGHT_LINE
                    + OBJECT_FRAME_TOP_SPACING;
            }
        });

    }

    // Space Calculation Functions

    // Calculates width of a list/array
    function getListWidth(parentlist) {
        let otherObjects = [];
        let pairsinCurrentObject = [];
        let objectStored = false;
        dataObjects.forEach(x => {
            if (x === parentlist) {
                objectStored = true;
            }
            if (objectStored) {
            } else if (x !== parentlist) {
                otherObjects.push(x)
            }
        })

        function getUnitWidth(list) {
            let substructureExists = false;
            otherObjects.forEach(x => {
                if (checkSubStructure(x, list)) {
                    substructureExists = true;
                }
            })

            if (!Array.isArray(list) || substructureExists) {
                return 0;
            } else {
                if (pairsinCurrentObject.includes(list)) {
                    return 0;
                } else {
                    pairsinCurrentObject.push(list);
                }
                return Math.max(getUnitWidth(list[0]), getUnitWidth(list[1]) + 1)
            }
        }

        if (parentlist.length != 2) {
            // If parentlist is array, check that it is not a substructure of any other data structure
            let substructureExists = false;
            otherObjects.forEach(x => {
                if (checkSubStructure(x, parentlist)) {
                    substructureExists = true;
                }
            })

            if (substructureExists) {
                return 0;
            } else {
                return DATA_UNIT_WIDTH;
            }
        } else {
            let pairCount = getUnitWidth(parentlist);
            return pairCount * (DATA_UNIT_WIDTH + 15);
        }
    }

    // Calculates unit height of list/array, considering references to other data structures
    function getUnitHeight(parentlist) {
        /**
         * otherObjects contains all data objects initialised before parentlist
         * This is to check if any part of parentlist is a substructure of any
         * previously defined data structure, and omit that part from the height calculations
         *
         * dataPairs contains all previously traversed pairs in the data structure
         * This is to avoid infinite loops when it comes to recursive data structures
         */
        let otherObjects = [];
        let dataPairs = [];
        let objectStored = false;
        dataObjects.forEach(x => {
            if (x === parentlist) {
                objectStored = true;
            } else if (!objectStored) {
                otherObjects.push(x)
            }
        })

        function recursiveHelper(list) {
            // Check if list is simply a substructure of any previously defined data structure, or a previously traversed pair
            let substructureExists = false;
            otherObjects.forEach(x => {
                if (checkSubStructure(x, list)) {
                    substructureExists = true;
                }
            })

            if (substructureExists || dataPairs.includes(list)) {
                return 0;
            }

            dataPairs.push(list);

            if (Array.isArray(list) && list.length != 2) {
                return 0;
            } else if (Array.isArray(list)) {
                let tailIsFn = false;

                if (isFunction(list[1])) {
                    let fnObject = fnObjects[fnObjects.indexOf(list[1])]
                    if (fnObject.parent[1] === list) {
                        tailIsFn = true;
                    }
                }

                if (Array.isArray(list[0])) {
                    let substructureExistsHead = false;
                    otherObjects.forEach(x => {
                        if (checkSubStructure(x, list[0])) {
                            substructureExistsHead = true;
                        }
                    });

                    // Calculate and store height of tail first (order of operation is important)
                    const tail_height = recursiveHelper(list[1]);

                    if (substructureExistsHead || dataPairs.includes(list[0])) {
                        // If the head is a substructure, height of head = 0 -> return height of tail
                        if (tailIsFn) {
                            return 1;
                        } else {
                            return tail_height;
                        }
                    } else {
                        if (tailIsFn) {
                            // Height of tail = 1 (as it is a function)
                            // Height of head = 1 + recursiveHelper(list[0])
                            return 1 + (1 + recursiveHelper(list[0]));
                        } else {
                            return (1 + recursiveHelper(list[0])) + tail_height;
                        }
                    }
                } else if (isFunction(list[0])) {
                    let fnObject = fnObjects[fnObjects.indexOf(list[0])]
                    let parenttype = fnObject.parenttype;
                    let tail_height = 0;
                    if (tailIsFn) {
                        tail_height = 1;
                    } else {
                        tail_height = recursiveHelper(list[1])
                    }

                    if (parenttype === "frame" || tail_height > 0) {
                        // Need to check if function is defined in current data structure or frame
                        // If tail_height > 0, tail_height >= height of current pair, so return tail_height
                        return tail_height;
                    } else if (fnObject.parent[0] === parentlist && fnObject.parent[1] === list) {
                        // Means height of tail = 0 and function belongs to current data structure --> height = 1
                        return 1;
                    } else {
                        return 0;
                    }
                }

                // At this point, head must be a primitive --> height(head) = 0
                if (tailIsFn) {
                    return 1;
                } else {
                    return recursiveHelper(list[1]);
                }
            } else {
                return 0;
            }
        }

        // Array height = 1 (which is added on in getFrameHeight)
        return recursiveHelper(parentlist)
    }

    // Calculates unit height of a list
    let currentObj = null;
    function initialiseBasicUnitHeight(dataObject) {
        currentObj = dataObject;
    }

    function getBasicUnitHeight(sublist) {
        let otherObjects = [];
        let dataPairs = [];
        let objectStored = false;
        dataObjects.forEach(x => {
            if (x === currentObj) {
                objectStored = true;
            }
            if (objectStored) {
            } else if (x !== currentObj) {
                otherObjects.push(x)
            }
        })

        function fillDataPairs(currPair) {
            if (currPair === sublist || !Array.isArray(currPair) || currPair.length != 2) {
                // Do nothing, stop recursing
            } else if (!dataPairs.includes(currPair)) {
                dataPairs.push(currPair);
                fillDataPairs(dataPairs[1]);
                fillDataPairs(dataPairs[0]);
            }
        }

        // Need to push currentObj into dataPairs, might not be added in fillDataPairs if currentObj = sublist
        dataPairs.push(currentObj)
        fillDataPairs(currentObj)

        // Similar as (getUnitHeight)
        function recursiveHelper(list) {
            let substructureExists = false;
            otherObjects.forEach(x => {
                if (checkSubStructure(x, list)) {
                    substructureExists = true;
                }
            })

            if (substructureExists || dataPairs.includes(list)) {
                return 0;
            }

            dataPairs.push(list);

            if (Array.isArray(list) && list.length != 2) {
                return 0;
            } else if (Array.isArray(list)) {
                let tailIsFn = false;

                if (isFunction(list[1])) {
                    let fnObject = fnObjects[fnObjects.indexOf(list[1])]
                    if (fnObject.parent[1] === list) {
                        tailIsFn = true;
                    }
                }

                if (Array.isArray(list[0])) {
                    let substructureExistsHead = false;
                    otherObjects.forEach(x => {
                        if (checkSubStructure(x, list[0])) {
                            substructureExistsHead = true;
                        }
                    });

                    const tail_height = recursiveHelper(list[1]);
                    if (substructureExistsHead || dataPairs.includes(list[0])) {
                        if (tailIsFn) {
                            return 1;
                        } else {
                            return tail_height;
                        }
                    } else {
                        const head_height = recursiveHelper(list[0]);
                        if (tailIsFn) {
                            return 1 + (1 + head_height);
                        } else {
                            return (1 + head_height) + tail_height;
                        }
                    }
                }

                if (isFunction(list[0])) {
                    let fnObject = fnObjects[fnObjects.indexOf(list[0])]
                    let parenttype = fnObject.parenttype;
                    let tail_height = 0;
                    if (tailIsFn) {
                        tail_height = 1;
                    } else {
                        tail_height = recursiveHelper(list[1])
                    }

                    if (parenttype === "frame" || tail_height > 0) {
                        return tail_height;
                    } else if (fnObject.parent[0] === currentObj && fnObject.parent[1] === list) {
                        return 1;
                    } else {
                        return 0;
                    }
                }

                if (tailIsFn) {
                    return 1;
                } else {
                    return recursiveHelper(list[1]);
                }
            } else {
                return 0;
            }

        }

        if (isFunction(sublist)) {
            return 1;
        }
        return (recursiveHelper(sublist));
    }

    // Calculates list/array height
    // Used in frame height calculations
    function getListHeight(list) {
        let x = (getUnitHeight(list) + 1) * (DATA_UNIT_HEIGHT + PAIR_SPACING);
        return x;
    }

    function getFrameHeight(frame) {
        // Assumes line spacing is separate from data object spacing
        let elem_lines = 0;
        let data_space = 0;

        for (let elem in frame.elements) {
            if (isFunction(frame.elements[elem])) {
                elem_lines += 1;
            }
            else if (Array.isArray(frame.elements[elem])) {
                const parent = dataObjectWrappers[dataObjects.indexOf(frame.elements[elem])].parent;
                if (parent === frame) {
                    data_space += getListHeight(frame.elements[elem]);
                } else {
                    data_space += FRAME_HEIGHT_LINE;
                }
            } else {
                elem_lines += 1;
            }
        }

        return data_space + elem_lines * FRAME_HEIGHT_LINE + FRAME_HEIGHT_PADDING;
    }

    // Calculates width of frame only
    function getFrameWidth(frame) {
        let maxLength = 0;
        const elements = frame.elements;
        for (let e in elements) {
            if (true) {
                let currLength;
                const literals = ["number", "string", "boolean"];
                if (literals.includes(typeof elements[e])) {
                    currLength = e.length + elements[e].toString().length +
                        (typeof elements[e] === 'string' ? 2 : 0);;
                } else if (typeof elements[e] === "undefined") {
                    currLength = e.length + 9;
                } else {
                    currLength = e.length;
                }
                maxLength = Math.max(maxLength, currLength);
            }
        }
        return maxLength * FRAME_WIDTH_CHAR + FRAME_WIDTH_PADDING;
    }

    // Calculates width of objects + frame
    function getFrameAndObjectWidth(frame) {
        if (frame.elements.length === 0) {
            return getFrameWidth(frame);
        } else {
            let maxWidth = 0;
            for (let e in frame.elements) {

                // Can be either primitive, function or array
                if (isFunction(frame.elements[e])) {
                    if (frame.elements[e].parent === frame) {
                        maxWidth = Math.max(maxWidth, DATA_UNIT_WIDTH);
                    }
                } else if (Array.isArray(frame.elements[e])) {
                    const parent = dataObjectWrappers[dataObjects.indexOf(frame.elements[e])].parent;
                    if (parent === frame) {
                        maxWidth = Math.max(maxWidth, getListWidth(frame.elements[e]))
                    }
                }
            }
            return getFrameWidth(frame) + OBJECT_FRAME_RIGHT_SPACING + maxWidth;
        }
    }

    function getDrawingWidth(levels) {
        function getTotalWidth(frame) {
            // Compare fullwidth + width of children

            const children_level = frame.level + 1
            let children = levels[children_level]
            let children_length = 0;

            if (children != undefined) {
                children = levels[children_level].frames.filter((f) => f.parent === frame);
                if (children === undefined) {
                    return frame.fullwidth;
                }
                for (let c in children) {
                    children_length += getTotalWidth(children[c]);
                }

                children_length += (children.length - 1) * FRAME_SPACING;
            } else {
                return frame.fullwidth;
            }

            return Math.max(frame.fullwidth, children_length);
        }
        return getTotalWidth(levels[1].frames[0])
    }

    function getDrawingHeight(levels) {
        let y = 30;
        for (let l in levels) {
            y += levels[l].height + LEVEL_SPACING;
        }
        return y;
    }

    function drawArrow(context, x0, y0, xf, yf) { //deprecitated
        context.save();
        context.beginPath();
        context.moveTo(x0, y0);
        context.lineTo(xf, yf);
        // draw arrow head
        drawArrowHead(context, x0, y0, xf, yf);
        context.strokeStyle = 'yellow';
        context.stroke();
        context.restore();
    }

    function drawLine(context, startX, startY, endX, endY) {
        context.save();
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.strokeStyle = 'lime';
        context.stroke();
        context.restore();
    }


    // Frame Helpers
    // --------------------------------------------------.
    // For both function objects and data objects
    function drawSceneFrameObjectArrows() {
        frames.forEach(function (frame) {
            let elements = frame.elements;
            for (let e in elements) {
                if (typeof elements[e] === 'function') {
                    drawSceneFrameFnArrow(frame, e, elements[e]);
                } else if (typeof elements[e] === 'object' && elements[e] != null) {
                    drawSceneFrameDataArrow(frame, e, elements[e]);
                }
            }
        });
        viewport.render();
    }

    function drawSceneFnFrameArrows() {
        fnObjects.forEach(function (fnObject) {
            drawSceneFnFrameArrow(fnObject);
        });
        viewport.render();
    }

    function drawSceneFrameArrows() {
        frames.forEach(function (frame) {
            if (!isEmptyFrame(frame)) {
                drawSceneFrameArrow(frame);
            }
        });
        viewport.render();
    }

    /**
     * Trivial - the arrow just points straight to a fixed position relative to
     * the frame.
     */
    function drawSceneFrameDataArrow(frame, name, dataObject) {

        const wrapper = dataObjectWrappers[dataObjects.indexOf(dataObject)];

        // simply draw straight arrow from frame to function
        const x0 = frame.x + name.length * FRAME_WIDTH_CHAR + 25;
        const y0 = frame.y + findElementNamePosition(name, frame) * FRAME_HEIGHT_LINE + 35,
            xf = wrapper.x < x0
                ? wrapper.x - FNOBJECT_RADIUS * 2 - 3 + DATA_UNIT_WIDTH
                : wrapper.x - FNOBJECT_RADIUS * 2 - 3;
        const yf = wrapper.y;

        // drawArrow(context, x0, y0, xf, yf);

        arrows.push(initialiseArrowObject(
            [
                initaliseArrowNode(x0, y0),
                initaliseArrowNode(xf, yf)
            ]
        ));

        /**
         * dataObject belongs to different frame.
         * Two "offset" factors are used: frameOffset, the index position of
         * the source variable in the starting frame, and fnOffset, the position
         * of the target dataObject in the destination frame. Offsetting the line
         * by these factors prevents overlaps between arrows that are pointing to
         * different objects.
  
        const frameOffset = findElementPosition(dataObject, frame);
        const fnOffset = findElementPosition(dataObject, wrapper.parent);
        const x0 = frame.x + name.length * 8 + 22;
        const yf = wrapper.y;
        const y0 = frame.y + findElementNamePosition(name, frame) * FRAME_HEIGHT_LINE + 35;
        const xf = wrapper.x;
        /*
          x1 = frame.x + frame.width + 10 + frameOffset * 20,
          y1 = y0;
        const x2 = x1,
          y2 = frame.y - 20 + frameOffset * 5;
        let x3 = xf + 10 + fnOffset * 7,
          y3 = y2;
        /**
         * From this position, the arrow needs to move upward to reach the
         * target dataObject. Make sure it does not intersect any other object
         * when doing so, or adjust its position if it does.
         * This currently only works for the frame level directly above the origin
         * frame, which suffices in most cases.
         * TO-DO: Improve implementation to handle any number of frame levels.
        */
        /*
        levels[frame.level - 1].frames.forEach(function(frame) {
          const leftBound = frame.x;
          let rightBound = frame.x + frame.width;
          // if (frame.fnObjects.length != 0) {
            // rightBound += 84;
          // }
          if (x3 > leftBound && x3 < rightBound) {
            // overlap
            x3 = rightBound + 10 + fnOffset * 7;
          }
        });
        const x4 = x3,
          y4 = yf;
  
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.lineTo(x2, y2);
        context.lineTo(x3, y3);
        context.lineTo(x4, y4);
        context.lineTo(xf, yf);
        // draw arrow headClone
        drawArrowHead(context, x4, y4, xf, yf);
        context.stroke();
  
        drawLine(context, x0, y0, xf, y0);
        drawArrow(context, xf, y0, xf, yf);
        // duplicate the exact same arrow but in the hovered layer so it only
        // comes into view once you hover over it
        */

    }

    /**
     * For each function variable, either the function is defined in the scope
     * the same frame, in which case drawing the arrow is simple, or it is in
     * a different frame. If so, more care is needed to route the arrow back up
     * to its destination.
     */
    function drawSceneFrameFnArrow(frame, name, fnObject) {
        //frame to fnobject
        const yf = fnObject.y;

        if (fnObject.parent === frame) {
            // fnObject belongs to current frame
            // simply draw straight arrow from frame to function
            const x0 = frame.x + name.length * FRAME_WIDTH_CHAR + 25;
            const y0 = frame.y + findElementNamePosition(name, frame) * FRAME_HEIGHT_LINE + 35,
                xf = fnObject.x - FNOBJECT_RADIUS * 2 - 3; // left circle

            arrows.push(initialiseArrowObject(
                [
                    initaliseArrowNode(x0, y0),
                    initaliseArrowNode(xf, yf)
                ]
            ));

        } else {
            /**
             * fnObject belongs to different frame.
             * Three "offset" factors are used: startOffset, the index position of
             * the source variable in the starting frame; fnOffset, the position
             * of the target fnObject in the destination frame; and frameOffset, the
             * position of the frame within its level. Offsetting the line
             * by these factors prevents overlaps between arrows that are pointing to
             * different objects.
             */
            const startOffset = findElementPosition(fnObject, frame);
            const fnOffset = findElementPosition(fnObject, fnObject.parent);
            const frameOffset = findFrameIndexInLevel(frame);
            const x0 = frame.x + name.length * 8 + 22,
                y0 = frame.y + findElementNamePosition(name, frame) * FRAME_HEIGHT_LINE + 35;
            const xf = fnObject.x + FNOBJECT_RADIUS * 2 + 3,
                x1 = frame.x + frame.width + 10 + frameOffset * 20,
                y1 = y0;
            const x2 = x1,
                y2 = frame.y - 20 + frameOffset * 5;
            let x3 = xf + 12 + fnOffset * 7,
                y3 = y2;
            /**
             * From this position, the arrow needs to move upward to reach the
             * target fnObject. Make sure it does not intersect any other object
             * when doing so, or adjust its position if it does.
             * This currently only works for the frame level directly above the origin
             * frame, which suffices in most cases.
             * TO-DO: Improve implementation to handle any number of frame levels.
             */

            levels[frame.level - 1].frames.forEach(function (frame) {
                const leftBound = frame.x;
                let rightBound = frame.x + frame.width;
                // if (frame.fnObjects.length != 0) {
                // rightBound += 84;
                // }
                if (x3 > leftBound && x3 < rightBound) {
                    // overlap
                    x3 = rightBound + 10 + fnOffset * 7;
                }
            });
            const x4 = x3,
                y4 = yf;

            arrows.push(initialiseArrowObject(
                [
                    initaliseArrowNode(x0, y0),
                    initaliseArrowNode(x1, y1),
                    initaliseArrowNode(x2, y2),
                    initaliseArrowNode(x3, y3),
                    initaliseArrowNode(x4, y4),
                    initaliseArrowNode(xf, yf)
                ]
            ));

        }
    }

    function drawSceneFnFrameArrow(fnObject) {
        var startCoord = [fnObject.x + PAIR_SPACING, fnObject.y];
        // Currently, if fnObject is defined in an array, do not draw the arrow (remove after arrays are implemented)
        if (!(Array.isArray(fnObject.parent) && fnObject.parent[0].length != 2)) {
            let frame = fnObject.parent;
            if (fnObject.parenttype === "data") {
                let parentobj = dataObjects.indexOf(fnObject.parent[0])
                frame = dataObjectWrappers[parentobj].parent
            }

            const x0 = fnObject.x + FNOBJECT_RADIUS,
                y0 = startCoord[1],
                x1 = x0,
                y1 = y0 - 15,
                x2 = frame.x + frame.width + 3,
                y2 = y1;

            arrows.push(initialiseArrowObject(
                [
                    initaliseArrowNode(x0, y0),
                    initaliseArrowNode(x1, y1),
                    initaliseArrowNode(x2, y2)
                ]
            ));
        }
    }

    /**
     * Arrows between child and parent frames.
     * Uses an offset factor to prevent lines overlapping, similar to with
     * frame-function arrows.
     */
    function drawSceneFrameArrow(frame) {
        var config = frame;

        if (config.parent === null) return null;
        const parent = config.parent;
        const offset = levels[parent.level].frames.indexOf(frame.parent);
        const x0 = config.x + 40,
            y0 = config.y,
            x1 = x0,
            y1 = (parent.y + parent.height + y0) / 2 + offset * 4,
            x2 = parent.x + 40;
        let y2, x3, y3;
        y2 = y1;
        x3 = x2;
        y3 = parent.y + parent.height + 3; // offset by 3 for aesthetic reasons
        arrows.push(initialiseArrowObject(
            [
                initaliseArrowNode(x0, y0),
                initaliseArrowNode(x1, y1),
                initaliseArrowNode(x2, y2),
                initaliseArrowNode(x3, y3)
            ],
            WHITE
        ));
    }

    function findFrameIndexInLevel(frame) {
        const level = frame.level;
        return levels[level].frames.indexOf(frame);
    }

    function isEmptyFrame(frame) {
        let hasObject = false;
        fnObjects.forEach(function (f) {
            if (f.parent === frame) {
                hasObject = true;
            }
        });
        dataObjectWrappers.forEach(function (d) {
            if (d.parent === frame) {
                hasObject = true;
            }
        });
        return !hasObject
            && frame.children.length === 0
            && Object.keys(frame.elements).length === 0;
    }

    // Calculates the unit position of an element (data/primitive/function)
    function findElementPosition(element, frame) {
        let index = 0;
        for (let elem in frame.elements) {
            if (frame.elements[elem] === element) {
                break;
            }
            if (isFunction(frame.elements[elem])) {
                index += 1;
            }
            else if (Array.isArray(frame.elements[elem])) {
                const parent = dataObjectWrappers[dataObjects.indexOf(frame.elements[elem])].parent;
                if (parent === frame) {
                    index += getUnitHeight(frame.elements[elem]) + 1
                } else {
                    index += 1;
                }
            } else {
                index += 1
            }
        }
        return index;
    }

    // Calculates the unit position of the name of the element (in the frame box)
    function findElementNamePosition(elementName, frame) {
        let lineNo = Object.keys(frame.elements).indexOf(elementName);
        let index = 0;
        for (let i = 0; i < lineNo; i++) {
            if (isFunction(Object.values(frame.elements)[i])) {
                index += 1;
            }
            else if (Array.isArray(Object.values(frame.elements)[i])) {
                const parent = dataObjectWrappers[dataObjects.indexOf(Object.values(frame.elements)[i])].parent;
                if (parent === frame) {
                    index += getUnitHeight(Object.values(frame.elements)[i]) + 1;
                } else {
                    index += 1;
                }
            } else {
                index += 1
            }
        }
        return index;
    }

    function createEmptyFrame(frameName) {
        const frame = { name: frameName };
        frame.hovered = false;
        frame.layer = frameLayer;
        frame.color = WHITE;
        frame.children = [];
        return frame;
    }

    function getFrameByKey(frames, key) {
        for (let i in frames) {
            if (frames[i].key === key) {
                return frames[i];
            }
        }
        return null;
    }

    function getEnvByKeyCounter(frames, key) {
        for (let i in frames) {
            if (frames[i].envKeyCounter === key) {
                return frames[i];
            }
        }
        return null;
    }

    function getFrameByName(frames, name) {
        for (let i in frames) {
            if (frames[i].name === name) {
                return frames[i];
            }
        }
        return null;
    }



    // Function Helpers
    // --------------------------------------------------.
    // function getFnObjectFromKey(key) {
    //     for (f in fnObjects) {
    //         if (fnObjects[f].key === key) {
    //             return fnObjects[f];
    //         }
    //     }
    // }

    function getFnName(fn) {
        if (fn.node === undefined || fn.node.type === "FunctionDeclaration" && !fn.functionName) {
            return undefined;
        } else if (fn.node.type === "FunctionDeclaration") {
            return fn.functionName;
        } else {
            return fn
                .toString()
                .split('(')[0]
                .split(' ')[1];
        }
    }

    function isArrowFunction(fn) {
        return fn.node.type === "ArrowFunctionExpression";
    }

    function isFunction(functionToCheck) {
        return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
    }


    function initialiseFnObject(fnObject, parent) {
        fnObject.hovered = false;
        fnObject.selected = false;
        fnObject.layer = fnObjectLayer;
        fnObject.color = WHITE;
        fnObject.key = fnObjectKey--;
        fnObject.parent = parent;
    }

    function initialiseDataFnObject(fnObject, parent) {
        initialiseFnObject(fnObject, parent)
        fnObject.parenttype = "data"
    }

    function initialiseFrameFnObject(fnObject, parent) {
        initialiseFnObject(fnObject, parent)
        fnObject.parenttype = "frame"
    }

    // Data Helpers
    // --------------------------------------------------.

    function drawScenePairs(dataObject, scene, wrapper, wrapperData, startX, startY) {
        // wrapperData is only relevant for tracing the origin of function objects in lists
        // not useful for anything else
        var context = scene.context,
            parent = wrapper.parent;
        // makes an opaque rectangle of the same colour as the background
        context.fillStyle = CYAN_BLUE;
        context.fillRect(startX, startY, DATA_UNIT_WIDTH, DATA_UNIT_HEIGHT);
        // draws the pair shape
        context.fillStyle = NOBEL;
        context.strokeStyle = NOBEL;
        context.strokeRect(startX, startY, DATA_UNIT_WIDTH, DATA_UNIT_HEIGHT);
        context.beginPath();
        context.moveTo(startX + DATA_UNIT_WIDTH / 2, startY);
        context.lineTo(startX + DATA_UNIT_WIDTH / 2, startY + DATA_UNIT_HEIGHT);
        context.stroke();
        //context.closePath();
        //context.restore();
        context.font = FONT_SETTING;
        // cycleDetector is an array used to detected dataobjects that connect to themselves
        cycleDetector.push(dataObject);

        // repeat the same process for the tail of the pair
        if (Array.isArray(dataObject[1])) {
            let cycleDetected = false;
            let mainStructure = null;
            let subStructure = null;
            cycleDetector.forEach(x => {
                if (x === dataObject[1]) {
                    cycleDetected = true;
                    mainStructure = cycleDetector[0];
                    subStructure = x;
                }
            });

            if (cycleDetected) {
                const coordinates = getShiftInfo(mainStructure, subStructure);
                const xCoord = coordinates.x - 10;
                const yCoord = coordinates.y;
                const newStartX = startX + 3 / 4 * DATA_UNIT_WIDTH;
                const newStartY = startY + DATA_UNIT_HEIGHT / 2;
                // 22 is DATA_UNIT_HEIGHT/2 + some buffer (not sure where buffer came from)
                if (yCoord - 22 === newStartY) {
                    //cycle is on the same level
                    // x1 = newStartX, 
                    // y1 = startY,
                    const x0 = newStartX,
                        y0 = newStartY,
                        x1 = newStartX,
                        y1 = newStartY - DATA_UNIT_HEIGHT / 2 - 10,
                        x2 = xCoord,
                        y2 = newStartY - DATA_UNIT_HEIGHT / 2 - 10,
                        x3 = xCoord,
                        y3 = yCoord - DATA_UNIT_HEIGHT - 2; // -2 accounts for buffer

                    arrows.push(initialiseArrowObject(
                        [
                            initaliseArrowNode(x0, y0),
                            initaliseArrowNode(x1, y1),
                            initaliseArrowNode(x2, y2),
                            initaliseArrowNode(x3, y3)
                        ]
                    ));
                } else if (yCoord - 22 > newStartY) {
                    // arrow points down
                    // const boxEdgeCoord = inBoxCoordinates(newStartX, newStartY, xCoord, yCoord - DATA_UNIT_HEIGHT, false);
                    const x0 = newStartX,
                        y0 = newStartY,
                        x1 = xCoord,
                        y1 = yCoord - DATA_UNIT_HEIGHT;

                    arrows.push(initialiseArrowObject(
                        [
                            initaliseArrowNode(x0, y0),
                            initaliseArrowNode(x1, y1)
                        ]
                    ));

                } else {
                    // arrow points up
                    // const boxEdgeCoord = inBoxCoordinates(newStartX, newStartY, xCoord, yCoord, false);
                    const x0 = newStartX,
                        y0 = newStartY,
                        x1 = xCoord,
                        y1 = yCoord;

                    arrows.push(initialiseArrowObject(
                        [
                            initaliseArrowNode(x0, y0),
                            initaliseArrowNode(x1, y1)
                        ]
                    ));

                }
            } else {
                const result = drawThis(dataObject[1]);
                const draw = result.draw;
                if (draw) {
                    if (is_Array(dataObject[1])) {
                        drawNestedArrayObject(startX + DATA_UNIT_WIDTH + PAIR_SPACING, startY);
                    } else {
                        drawScenePairs(dataObject[1], scene, wrapper, wrapperData[1], startX + DATA_UNIT_WIDTH + PAIR_SPACING, startY);
                    }

                    arrows.push(initialiseArrowObject(
                        [
                            initaliseArrowNode(
                                startX + 3 * DATA_UNIT_WIDTH / 4,
                                startY + DATA_UNIT_HEIGHT / 2
                            ),
                            initaliseArrowNode(
                                startX + DATA_UNIT_WIDTH + PAIR_SPACING,
                                startY + DATA_UNIT_HEIGHT / 2
                            )
                        ]
                    ));
                } else {
                    const coordinates = getShiftInfo(result.mainStructure, result.subStructure);
                    const xCoord = coordinates.x;
                    const yCoord = coordinates.y;
                    const x0 = startX + 3 * DATA_UNIT_WIDTH / 4,
                        y0 = startY + DATA_UNIT_HEIGHT / 2,
                        x1 = xCoord,
                        y1 = yCoord;

                    arrows.push(initialiseArrowObject(
                        [
                            initaliseArrowNode(x0, y0),
                            initaliseArrowNode(x1, y1)
                        ]
                    ));


                }
            }
        } else if (dataObject[1] === null) {
            drawLine(context, startX + DATA_UNIT_WIDTH, startY, startX + DATA_UNIT_WIDTH / 2, startY + DATA_UNIT_HEIGHT);
        } else if (typeof wrapperData[1] === 'function') {
            // draw arrow layer
            if (startX + 3 / 4 * DATA_UNIT_WIDTH <= wrapperData[1].x + 4 * FNOBJECT_RADIUS) {
                const x0 = startX + 3 / 4 * DATA_UNIT_WIDTH,
                    y0 = startY + DATA_UNIT_HEIGHT / 2,
                    x1 = startX + 3 / 4 * DATA_UNIT_WIDTH,
                    y1 = wrapperData[1].y + 2 * FNOBJECT_RADIUS,
                    x2 = wrapperData[1].x + 4 * FNOBJECT_RADIUS,
                    y2 = wrapperData[1].y + 2 * FNOBJECT_RADIUS,
                    x3 = wrapperData[1].x + 4 * FNOBJECT_RADIUS,
                    y3 = wrapperData[1].y,
                    x4 = wrapperData[1].x + 2 * FNOBJECT_RADIUS,
                    y4 = wrapperData[1].y

                arrows.push(initialiseArrowObject(
                    [
                        initaliseArrowNode(x0, y0),
                        initaliseArrowNode(x1, y1),
                        initaliseArrowNode(x2, y2),
                        initaliseArrowNode(x3, y3),
                        initaliseArrowNode(x4, y4)
                    ]
                ));
            } else {
                const x0 = startX + 3 / 4 * DATA_UNIT_WIDTH,
                    y0 = startY + DATA_UNIT_HEIGHT / 2,
                    x1 = startX + 3 / 4 * DATA_UNIT_WIDTH,
                    y1 = wrapperData[1].y,
                    x2 = wrapperData[1].x + 2 * FNOBJECT_RADIUS,
                    y2 = wrapperData[1].y

                arrows.push(initialiseArrowObject(
                    [
                        initaliseArrowNode(x0, y0),
                        initaliseArrowNode(x1, y1),
                        initaliseArrowNode(x2, y2)
                    ]
                ));
            }
        } else {
            texts.push(
                initialiseTextObject(
                    dataObject[1],
                    startX + 2 * DATA_UNIT_WIDTH / 3,
                    startY + 2 * DATA_UNIT_HEIGHT / 3
                )
            );
        }


        // draws data in the head and tail
        if (Array.isArray(dataObject[0])) {
            let cycleDetected = false;
            let mainStructure = null;
            let subStructure = null;
            cycleDetector.forEach(x => {
                if (x === dataObject[0]) {
                    cycleDetected = true;
                    mainStructure = cycleDetector[0];
                    subStructure = x;
                }
            });

            if (cycleDetected) {
                const coordinates = getShiftInfo(mainStructure, subStructure);
                const xCoord = coordinates.x - 10;
                const yCoord = coordinates.y;
                const newStartX = startX + DATA_UNIT_WIDTH / 4;
                const newStartY = startY + DATA_UNIT_HEIGHT / 2;
                // 22 is DATA_UNIT_HEIGHT/2 + some buffer (not sure where buffer came from)
                if (yCoord - 22 === newStartY) {
                    //cycle is on the same level
                    const x0 = newStartX,
                        y0 = newStartY,
                        x1 = newStartX,
                        y1 = newStartY - DATA_UNIT_HEIGHT / 2 - 10,
                        x2 = xCoord,
                        y2 = newStartY - DATA_UNIT_HEIGHT / 2 - 10,
                        x3 = xCoord,
                        y3 = yCoord - DATA_UNIT_HEIGHT - 2; // -2 accounts for buffer

                    arrows.push(initialiseArrowObject(
                        [
                            initaliseArrowNode(x0, y0),
                            initaliseArrowNode(x1, y1),
                            initaliseArrowNode(x2, y2),
                            initaliseArrowNode(x3, y3)
                        ]
                    ));

                } else if (yCoord - 22 > newStartY) {
                    // arrow points down
                    const x0 = newStartX,
                        y0 = newStartY,
                        x1 = xCoord,
                        y1 = yCoord - DATA_UNIT_HEIGHT;

                    arrows.push(initialiseArrowObject(
                        [
                            initaliseArrowNode(x0, y0),
                            initaliseArrowNode(x1, y1)
                        ]
                    ));

                } else {
                    // arrow points up
                    const x0 = newStartX,
                        y0 = newStartY,
                        x1 = xCoord,
                        y1 = yCoord;

                    arrows.push(initialiseArrowObject(
                        [
                            initaliseArrowNode(x0, y0),
                            initaliseArrowNode(x1, y1)
                        ]
                    ));

                }
            } else {
                const result = drawThis(dataObject[0]);
                const draw = result.draw;
                // check if need to draw the data object or it has already been drawn
                if (draw) {
                    let shiftY = callGetShiftInfo(dataObject[0]);

                    if (is_Array(dataObject[0])) {
                        drawNestedArrayObject(startX, wrapper.y + shiftY);
                    } else {
                        drawScenePairs(dataObject[0], scene, wrapper, wrapperData[0], startX, wrapper.y + shiftY);
                    }

                    arrows.push(initialiseArrowObject(
                        [
                            initaliseArrowNode(
                                startX + DATA_UNIT_WIDTH / 4,
                                startY + DATA_UNIT_HEIGHT / 2
                            ),
                            initaliseArrowNode(
                                startX + DATA_UNIT_WIDTH / 4,
                                wrapper.y + shiftY - 2
                            )
                        ]
                    ));


                } else {
                    if (is_Array(dataObject[0])) {
                        const coordinates = getShiftInfo(result.mainStructure, result.subStructure);
                        const xCoord = coordinates.x - 10;
                        const yCoord = coordinates.y - 10;

                        const x0 = startX + DATA_UNIT_WIDTH / 4,
                            y0 = startY + DATA_UNIT_HEIGHT / 2,
                            x1 = xCoord,
                            y1 = yCoord;

                        arrows.push(initialiseArrowObject(
                            [
                                initaliseArrowNode(x0, y0),
                                initaliseArrowNode(x1, y1)
                            ]
                        ));
                    } else {
                        const coordinates = getShiftInfo(result.mainStructure, result.subStructure);
                        const xCoord = coordinates.x;
                        const yCoord = coordinates.y;

                        const x0 = startX + DATA_UNIT_WIDTH / 4,
                            y0 = startY + DATA_UNIT_HEIGHT / 2,
                            x1 = xCoord,
                            y1 = yCoord;

                        arrows.push(initialiseArrowObject(
                            [
                                initaliseArrowNode(x0, y0),
                                initaliseArrowNode(x1, y1)
                            ]
                        ));
                    }
                }
            }
        } else if (dataObject[0] === null) {
            drawLine(context, startX + DATA_UNIT_WIDTH / 2, startY, startX, startY + DATA_UNIT_HEIGHT);
        } else if (typeof wrapperData[0] === 'function') {
            // draw line up to fn height
            if (startX + DATA_UNIT_WIDTH / 4 <= wrapperData[0].x + 4 * FNOBJECT_RADIUS) {

                const x0 = startX + DATA_UNIT_WIDTH / 4,
                    y0 = startY + DATA_UNIT_HEIGHT / 2,

                    x1 = startX + DATA_UNIT_WIDTH / 4,
                    y1 = wrapperData[0].y + 2 * FNOBJECT_RADIUS,

                    x2 = wrapperData[0].x + 4 * FNOBJECT_RADIUS,
                    y2 = wrapperData[0].y + 2 * FNOBJECT_RADIUS,

                    x3 = wrapperData[0].x + 4 * FNOBJECT_RADIUS,
                    y3 = wrapperData[0].y,
                    x4 = wrapperData[0].x + 2 * FNOBJECT_RADIUS,
                    y4 = wrapperData[0].y;

                arrows.push(initialiseArrowObject(
                    [
                        initaliseArrowNode(x0, y0),
                        initaliseArrowNode(x1, y1),
                        initaliseArrowNode(x2, y2),
                        initaliseArrowNode(x3, y3),
                        initaliseArrowNode(x4, y4)
                    ]
                ));
            } else {
                const x0 = startX + DATA_UNIT_WIDTH / 4,
                    y0 = startY + DATA_UNIT_HEIGHT / 2,
                    x1 = startX + DATA_UNIT_WIDTH / 4,
                    y1 = wrapperData[0].y,
                    x2 = wrapperData[0].x + 2 * FNOBJECT_RADIUS,
                    y2 = wrapperData[0].y

                arrows.push(initialiseArrowObject(
                    [
                        initaliseArrowNode(x0, y0),
                        initaliseArrowNode(x1, y1),
                        initaliseArrowNode(x2, y2)
                    ]
                ));
            }
        } else {
            // context.fillText(dataObject[0], startX + DATA_UNIT_WIDTH / 6, startY + 2 * DATA_UNIT_HEIGHT / 3);
            texts.push(
                initialiseTextObject(
                    dataObject[0],
                    startX + DATA_UNIT_WIDTH / 6,
                    startY + 2 * DATA_UNIT_HEIGHT / 3
                )
            );
        }


        //TODO: REMOVE THESE TWO LINES
        //DONT STACK TWO STROKE() TGT WITHOUT BEGINPATH() IN BETWEEN
        //...
        // context.strokeStyle = NOBEL;
        // //context.lineWidth = 2;
        // context.stroke();
        //...
    }

    function drawHitPairs(dataObject, hit, wrapper, x0, y0) {
        // simplified version of drawScenePairs so that we can detect when hover over pair
        var context = hit.context;

        context.save();
        context.fillStyle = hit.getColorFromIndex(wrapper.key);
        context.fillRect(x0, y0, DATA_UNIT_WIDTH, DATA_UNIT_HEIGHT);
        // hitCycleDetector is used to prevent this function from entering an infinite loop
        // when data structures connect to themselves
        hitCycleDetector.push(dataObject)

        // not a perfect tracing over the original dataObject but good enough
        if (Array.isArray(dataObject[0])
            && drawnDataObjects.includes(dataObject[0])
            && !hitCycleDetector.includes(dataObject[0])) {
            drawHitPairs(dataObject[0], hit, wrapper, x0, y0 + DATA_UNIT_HEIGHT + PAIR_SPACING);
        }

        if (Array.isArray(dataObject[1])
            && drawnDataObjects.includes(dataObject[1])
            && !hitCycleDetector.includes(dataObject[1])) {
            drawHitPairs(dataObject[1], hit, wrapper, x0 + DATA_UNIT_WIDTH + PAIR_SPACING, y0);
        }
        // context.stroke();
        context.restore();
    }

    function getDataObjectFromKey(key) {
        for (let d in dataObjects) {
            if (dataObjects[d].key === key) {
                return dataObjects[d];
            }
        }
    }

    // Current check to check if data structure is an array
    // Howeverm does not work with arrays of size 2
    function is_Array(dataObject) {
        return Array.isArray(dataObject)
            ? dataObject.length != 2
            : false
    }

    function getWrapperFromDataObject(dataObject) {
        return dataObjectWrappers[dataObjects.indexOf(dataObject)];
    }


    function initialiseDataObjectWrapper(objectName, objectData, parent) {
        const dataObjectWrapper = {
            hovered: false,
            selected: false,
            layer: dataObjectLayer,
            color: WHITE,
            key: dataObjectKey--,
            parent: parent,
            data: objectData,
            name: objectName
        };
        return dataObjectWrapper;
    }

    /**
     * Helper functions for drawing different types of elements on the canvas.
     */
    function checkSubStructure(d1, d2) {
        // d1 and d2 are 2 dataObjects, check if d2 is identical to d1
        // or a sub data structure of d1
        let parentDataStructure = [];
        function helper(d1, d2) {
            if (!Array.isArray(d1)) {
                return false;
            } else if (d2 === d1) {
                return true;
            } else if (is_Array(d1)) {
                return false;
            } else if (parentDataStructure.includes(d1)) {
                return false;
            } else {
                parentDataStructure.push(d1);
                return helper(d1[0], d2)
                    || helper(d1[1], d2);
            }
        }
        return helper(d1, d2);
    }

    /**
     * Initialise callGetShiftInfo by storing the parent data structure
     * When callGetShiftInfo is called, callGetShiftInfoData is the parent data structure that d2 is supposed to be found in
     */
    let callGetShiftInfoData;
    function initialiseCallGetShiftInfo(dataStructure) {
        callGetShiftInfoData = dataStructure;
    }

    /**
     * Returns the y coordinate of d2 with respect to its parent data structure
     */
    function callGetShiftInfo(d2) {
        return getShiftInfo(callGetShiftInfoData, d2).y
            - (dataObjectWrappers[dataObjects.indexOf(callGetShiftInfoData)].y + 3 / 4 * DATA_UNIT_HEIGHT)
            - PAIR_SPACING;
    }

    function getShiftInfo(d1, d2) {
        // given that d2 is a sub structure of d1, return a coordinate object
        // to indicate the x and y coordinate with respect to d1
        const result = {
            x: dataObjectWrappers[dataObjects.indexOf(d1)].x,
            y: dataObjectWrappers[dataObjects.indexOf(d1)].y + 3 / 4 * DATA_UNIT_HEIGHT
        }

        // If parent object is array, point to placeholder object rather than within object
        if (d1.length != 2) {
            return result;
        }

        // Save the parent data structure
        let orig = d1;
        // Save all traversed pairs in this array, ensures cyclic data structures are dealt with without infinite loops
        let searchedPairs = [];

        // Initialise basicUnitHeight with the parent data structure
        initialiseBasicUnitHeight(d1);

        while (d2 !== d1) {
            if (searchedPairs.includes(d1)) {
                // Indicates that the data structure is cyclic.
                // Find the coordinates of the current pair using getShiftInfo
                // Reset result.x and result.y
                let currCoords = getShiftInfo(orig, d1);
                result.x = currCoords.x;
                result.y = currCoords.y;

                // Since the tail has been searched already, search the head now
                // Increment x and y coordinates as necessary
                if (checkSubStructure(d1[0], d2)) {
                    let rightHeight = getBasicUnitHeight(d1[1]);
                    result.y += (rightHeight + 1) * (DATA_UNIT_HEIGHT + PAIR_SPACING);
                    d1 = d1[0];
                } else {
                    result.x += DATA_UNIT_WIDTH + PAIR_SPACING;
                    d1 = d1[1];
                }

            } else {
                searchedPairs.push(d1)

                // Check the tail first
                // Increment x coordinate if found in tail, and y coordinate if found in head
                if (checkSubStructure(d1[1], d2)) {
                    d1 = d1[1];
                    result.x += DATA_UNIT_WIDTH + PAIR_SPACING;
                } else {
                    let rightHeight = getBasicUnitHeight(d1[1]);
                    result.y += (rightHeight + 1) * (DATA_UNIT_HEIGHT + PAIR_SPACING);
                    d1 = d1[0];
                }
            }
        }
        return result;
    }

    function drawThis(dataObject) {
        // returns a structure that contains a boolean to indicate whether
        // or not to draw dataObject. If boolean is false, also returns the main
        // and substructure that is involved
        const result = {
            draw: true,
            mainStructure: null,
            subStructure: null
        }
        for (let d in drawnDataObjects) {
            if (checkSubStructure(drawnDataObjects[d], dataObject)) {
                result.draw = false;
                result.mainStructure = drawnDataObjects[d];
                result.subStructure = dataObject;
                return result;
            }
        }
        return result;
    }

    function reassignCoordinates(d1, d2) {
        // if we do not need to draw d2, reassign x and y coordinates to
        // be the corresponding coordinates of d1
        const trueCoordinates = getShiftInfo(d1, d2);
        const wrapper = dataObjectWrappers[dataObjects.indexOf(d2)];
        wrapper.x = trueCoordinates.x;
        wrapper.y = trueCoordinates.y - 5;
    }

    // since arrows across data structures will now be drawn in the arrow Layer
    // need a function calculate the coordinates the small portion of the arrow from
    // center of box to edge of box
    function inBoxCoordinates(x0, y0, xf, yf, head) {
        const distX = Math.abs(x0 - xf);
        const distY = Math.abs(y0 - yf);
        const half_width = ((xf > x0 && head) || (x0 >= xf && !head))
            ? (3 / 4) * DATA_UNIT_WIDTH
            : (1 / 4) * DATA_UNIT_WIDTH;
        const half_height = DATA_UNIT_HEIGHT / 2;
        // asume arrows goes out from side of box instead of top
        let xFinal = xf > x0 ? x0 + half_width : x0 - half_width;
        let yFinal = yf < y0 ? y0 - (distY * (half_width / distX)) : y0 + (distY * (half_width / distX));
        if (yFinal < y0 - half_height) {
            // doesn't go out from side but rather from top
            yFinal = y0 - half_height;
            xFinal = xf > x0 ? x0 + (distX * (half_height / distY)) : x0 - (distX * (half_height / distY));
        } else if (yFinal > y0 + half_height) {
            // doesn't go out from side but rather from bottom
            yFinal = y0 + half_height;
            xFinal = xf > x0 ? x0 + (distX * (half_height / distY)) : x0 - (distX * (half_height / distY));
        }
        return { x: xFinal, y: yFinal };
    }

    function drawArrayObject(dataObject) {
        const wrapper = dataObjectWrappers[dataObjects.indexOf(dataObject)];

        drawNestedArrayObject(wrapper.x - DATA_OBJECT_SIDE, wrapper.y - DATA_UNIT_HEIGHT / 2);
    }

    function drawNestedArrayObject(xcoord, ycoord) {
        var scene = dataObjectLayer.scene,
            context = scene.context;
        // define points for drawing data object
        const x0 = xcoord,
            y0 = ycoord;
        const x1 = x0 + DATA_UNIT_WIDTH,
            y1 = y0;
        const x2 = x1,
            y2 = y1 + DATA_UNIT_HEIGHT;
        const x3 = x0,
            y3 = y2;

        // Internal Lines
        const ly0 = y0;
        const ly1 = y2;
        const l1x = x0 + 15,
            l2x = l1x + 15,
            l3x = l2x + 15;

        context.beginPath();
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.lineTo(x2, y2);
        context.lineTo(x3, y3);
        context.lineTo(x0, y0);
        context.moveTo(l1x, ly0);
        context.lineTo(l1x, ly1);
        context.moveTo(l2x, ly0);
        context.lineTo(l2x, ly1);
        context.moveTo(l3x, ly0);
        context.lineTo(l3x, ly1);

        context.fillStyle = NOBEL;
        context.font = FONT_SETTING;
        context.fillText('...', x0 + 50, y0 + DATA_UNIT_HEIGHT / 2);
        context.strokeStyle = NOBEL;
        context.lineWidth = 2;
        context.stroke();
    }

    // Text Helpers
    // --------------------------------------------------.
    function truncateString(c, str, maxWidth) {
        var width = c.measureText(str).width,
            ellipsis = '…',
            ellipsisWidth = c.measureText(ellipsis).width,
            result,
            truncated = false;

        if (width <= maxWidth || width <= ellipsisWidth) {
            result = str;
        } else {
            var len = str.length;
            while (width >= maxWidth - ellipsisWidth && len-- > 0) {
                str = str.substring(0, len);
                width = c.measureText(str).width;
            }
            result = str + ellipsis;
            truncated = true;
        }

        return { result, truncated };
    }

    function initialiseTextObject(text, x, y, hovered = false, selected = false, color = NOBEL) {
        const textObject = {
            text,
            x,
            y,
            hovered,
            selected,
            color,
            key: textObjectKey
        };
        textObjectKey--;
        return textObject;
    }

    // Arrow Helpers
    // --------------------------------------------------.
    function drawArrowObjectHead(xi, yi, xf, yf) {
        const { context } = arrowObjectLayer.scene;
        const gradient = (yf - yi) / (xf - xi);
        const angle = Math.atan(gradient);
        // context.save();
        // context.strokeStyle = color;//dont need all these, since it comes with the arrow alr !!
        if (xf - xi >= 0) {
            // left to right arrow
            const xR = xf - 10 * Math.cos(angle - Math.PI / 6);
            const yR = yf - 10 * Math.sin(angle - Math.PI / 6);
            context.lineTo(xR, yR);
            context.moveTo(xf, yf);
            const xL = xf - 10 * Math.cos(angle + Math.PI / 6);
            const yL = yf - 10 * Math.sin(angle + Math.PI / 6);
            context.lineTo(xL, yL);
        } else {
            // right to left arrow
            const xR = xf + 10 * Math.cos(angle - Math.PI / 6);
            const yR = yf + 10 * Math.sin(angle - Math.PI / 6);
            context.lineTo(xR, yR);
            context.moveTo(xf, yf);
            const xL = xf + 10 * Math.cos(angle + Math.PI / 6);
            const yL = yf + 10 * Math.sin(angle + Math.PI / 6);
            context.lineTo(xL, yL);
        }
        // context.restore();
    }

    function drawArrowHead(context, xi, yi, xf, yf) {
        const gradient = (yf - yi) / (xf - xi);
        const angle = Math.atan(gradient);
        if (xf - xi >= 0) {
            // left to right arrow
            const xR = xf - 10 * Math.cos(angle - Math.PI / 6);
            const yR = yf - 10 * Math.sin(angle - Math.PI / 6);
            context.lineTo(xR, yR);
            context.moveTo(xf, yf);
            const xL = xf - 10 * Math.cos(angle + Math.PI / 6);
            const yL = yf - 10 * Math.sin(angle + Math.PI / 6);
            context.lineTo(xL, yL);
        } else {
            // right to left arrow
            const xR = xf + 10 * Math.cos(angle - Math.PI / 6);
            const yR = yf + 10 * Math.sin(angle - Math.PI / 6);
            context.lineTo(xR, yR);
            context.moveTo(xf, yf);
            const xL = xf + 10 * Math.cos(angle + Math.PI / 6);
            const yL = yf + 10 * Math.sin(angle + Math.PI / 6);
            context.lineTo(xL, yL);
        }
    }

    function initialiseArrowObject(nodes, color = NOBEL, hovered = false, selected = false) {
        //key is assigned here
        //consider adding layer here also
        const arrowObject = {
            nodes,
            hovered,
            selected,
            color,
            key: arrowObjectKey
        };
        arrowObjectKey--;
        return arrowObject;
    }

    function initaliseArrowNode(x, y) {
        return { x, y };
    }

    /*
    | --------------------------------------------------------------------------
    | Export
    |--------------------------------------------------------------------------
    */

    function download_env() {
        viewport.scene.download({
            fileName: 'environment-model.png'
        });
    }

    exports.EnvVisualizer = {
        draw_env: draw_env,
        init: function (parent) {
            container.hidden = false;
            parent.appendChild(container);
        },
        download_env: download_env
    };

    setTimeout(() => { }, 1000);
})(window);

