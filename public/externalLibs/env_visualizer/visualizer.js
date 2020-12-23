/*
 * DRAW ON THE PLAYGROUND CANVAS HERE
 */
(function (exports) {
    /*
    |--------------------------------------------------------------------------
    | Configurations
    |--------------------------------------------------------------------------
    */
    const container = document.createElement("div");
    container.id = "env-visualizer-container";
    container.hidden = true;
    document.body.appendChild(container);
    // create viewport
    const viewport = new Concrete.Viewport({
        width: 1000,
        height: 1000,
        container: container,
    });

    const NOBEL = "#999999";
    const BLACK = "#000000";
    const WHITE = "#FFFFFF";
    const CYAN_BLUE = "#2c3e50";
    const GREEN = "#00FF00";
    const RED = "#FF0000";
    const REGENT_GRAY = "#8a9ba8"; //80% opacity
    const REGENT_GRAY_30 = "#8a9ba84d"; //30%
    const REGENT_GRAY_50 = "#8a9ba880"; //50%
    const REGENT_GRAY_80 = "#8a9ba8cc"; //80%
    const CANVAS_PADDING = 75;

    const FONT_SETTING = "14px Roboto Mono, Courier New";
    const FONT_HEIGHT = 14;
    const TEXT_PADDING = 5;
    const TEXT_BOX_WIDTH = 150; // eg. width of function body text

    const FRAME_FONT_SETTING = "14px Roboto Mono, Courier New";
    const FNOBJECT_RADIUS = 12; // radius of function object circle
    const DATA_OBJECT_SIDE = 24; // length of data object triangle
    const DRAWING_LEFT_PADDING = 70; // left padding for entire drawing
    const FRAME_HEIGHT_LINE = 55; // height in px of each line of text in a frame;
    const FRAME_HEIGHT_PADDING = 20; // height in px to pad each frame with
    const FRAME_WIDTH_CHAR = 8; // width in px of each text character in a frame;
    const FRAME_WIDTH_PADDING = 50; // width in px to pad each frame with;
    const FRAME_SPACING = 100; // spacing between horizontally adjacent frameObjects
    const LEVEL_SPACING = 60; // spacing between vertical frame levels
    const OBJECT_FRAME_RIGHT_SPACING = 50; // space to right frame border
    const OBJECT_FRAME_TOP_SPACING = 35; // perpendicular distance to top border
    const PAIR_SPACING = 15; // spacing between pairs
    const INNER_RADIUS = 2; // radius of inner dot within a fn object

    // TEXT SPACING
    const HORIZONTAL_TEXT_MARGIN = 10;
    const VERITCAL_TEXT_MARGIN = 39;

    // DATA STRUCTURE DIMENSIONS
    const DATA_UNIT_WIDTH = 80;
    const DATA_UNIT_HEIGHT = 40;
    const DRAW_ON_STARTUP = [
        drawSceneFrameObjects,
        drawHitFrameObjects,
        drawSceneFnObjects,
        drawHitFnObjects,
        drawSceneDataObjects,
        drawScenePairObjects,
        drawHitPairObjects,
        drawSceneFrameArrows,
        drawSceneFrameObjectArrows,
        drawSceneFnFrameArrows,
        drawSceneTextObjects,
        drawHitTextObjects,
        drawSceneArrows,
        drawHitArrows,
    ];

    let alreadyListened = false;

    /**
     * Create a different layer for each type of element. May be more useful
     * in future for manipulating groups of elements.
     */
    let fnObjectLayer = new Concrete.Layer();
    let dataObjectLayer = new Concrete.Layer();
    let frameObjectLayer = new Concrete.Layer();
    let arrowObjectLayer = new Concrete.Layer();
    let textObjectLayer = new Concrete.Layer();
    let pairObjectLayer = new Concrete.Layer();
    // let arrowLayer = new Concrete.Layer(); //deprecated
    // let hoveredLayer = new Concrete.Layer(); //deprecated
    // hoveredLayer.visible = false;

    const LAYERS = [
        frameObjectLayer,
        fnObjectLayer,
        dataObjectLayer,
        pairObjectLayer,
        arrowObjectLayer,
        textObjectLayer,
    ];

    let fnObjects = [],
        /**
         * Unlike function objects, data objects are represented internally not as
         * objects, but as arrays. As such, we cannot assign properties like x- and
         * y-coordinates directly to them. These properties are stored instead in
         * another array of objects called dataObjectWrappers, which maps 1-to-1 to
         * the objects they represent in dataObjects.
         */
        dataObjects = [],
        dataObjectWrappers = [],
        levels = {},
        builtinsToDraw = [],
        // Initialise list of built-in functions to ignore (i.e. not draw)
        builtins = [];

    //append -Object for objects that need to be drawn on scene (for easier reference)
    let drawnDataObjects = [],
        cycleDetector = [],
        hitCycleDetector = [],
        frameObjects = [],
        textObjects = [],
        arrowObjects = [],
        pairObjects = [];

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
    //frame object key === envkeycounter (starts from 0)
    let dataObjectKey = Math.pow(2, 24) - 1,
        fnObjectKey = Math.pow(2, 22) - 1,
        arrowObjectKey = Math.pow(2, 20) - 1,
        textObjectKey = Math.pow(2, 18) - 1,
        pairObjectKey = Math.pow(2, 16) - 1,
        envKeyCounter = 0;
    // frameObjectKey = Math.pow(2, 14) - 1;

    /*
    |--------------------------------------------------------------------------
    | Draw functions
    |--------------------------------------------------------------------------
    | eg. drawScene, drawHit: plural, single
    | only include those that have their own layers
    */
    // General Scnene
    // --------------------------------------------------.

    // function arrayToString(arr) {
    //     //debugger
    //     const names = arr.map((env) => env.name);
    //     return names.toString();
    // }

    // main function to be exported
    function draw_env(context) {
        // add built-in functions to list of builtins
        const contextEnvs = context.context.context.runtime.environments;

        const allEnvs = [];

        for (let i = contextEnvs.length - 1; i >= 0; i--) {
            allEnvs.push(contextEnvs[i]);
        }

        // TO-DO: refactor this
        // add props to primitive functions
        const globalEnv = allEnvs[0];
        const globalElems = globalEnv.head;

        for (const elem in globalElems) {
            const value = globalElems[elem];
            if (isFunction(value)) {
                value.environment = globalEnv;
                value.node = {};
                value.node.type = "FunctionDeclaration";
                value.functionName = "" + elem;
            }
        }

        builtins = builtins.concat(Object.keys(globalElems));
        builtins = builtins.concat(Object.keys(allEnvs[1].head));

        // add library-specific built-in functions to list of builtins
        const externalSymbols = context.context.context.externalSymbols;
        for (const i in externalSymbols) {
            builtins.push(externalSymbols[i]);
        }

        // ENABLE IN PRODUCTION
        // Hides the default text
        // (document.getElementById('env-visualizer-default-text')).hidden = true;

        // Blink icon
        // const icon = document.getElementById('env_visualiser-icon');
        // icon.classList.add('side-content-tab-alert');

        // reset current drawing
        viewport.layers.forEach(function (layer) {
            //clear layer by layer
            layer.scene.clear();
        });

        // add layers
        LAYERS.forEach((layer) => viewport.add(layer));

        fnObjects = [];
        dataObjects = [];
        dataObjectWrappers = [];
        levels = {};
        builtinsToDraw = [];
        textObjects = [];
        arrowObjects = [];
        pairObjects = [];
        envKeyCounter = 0;

        // parse input from interpreter
        function parseInput(accFrames, environments) {
            let newFrameObjects = [];
            /**
             * environments is the array of environments in the interpreter.
             * newFrameObjects is the current newFrameObjects being created
             * accFrames is all newFrameObjects created so far (including from previous
             * recursive calls of parseInput).
             */

            /**
             * Refactor start
             */

            // Assign the same id to each environment and its corresponding frame
            // environments.forEach(function (e) {
            //     e.envKeyCounter = envKeyCounter;
            //     envKeyCounter++;
            // });

            /**
             * Create a frame for each environment
             * Each frame represents one frame to be drawn
             */
            // Process backwards such that global frame comes first ie. index of global frame === 0
            // initialise frame objects using environments array
            // for (let i = environments.length - 1; i >= 0; i--) {
            // for (let i = 0; i < environments.length; i++) {
            environments.forEach(function (environment) {
                // let environment = environments[i],
                let newFrameObject;
                environment.envKeyCounter = envKeyCounter;
                envKeyCounter++;

                /**
                 * There are two environments named programEnvironment. We only want one
                 * corresponding "Program" frame.
                 */
                if (environment.name === "programEnvironment") {
                    // TO-DO: can place this variable above parseinput function and set it to true for the first programenvironment
                    let isProgEnvPresent = false;
                    // look through existing frame objects, check if program frame already exists
                    newFrameObjects.forEach(function (frameObject) {
                        if (frameObject.name === "Program") {
                            newFrameObject = frameObject;
                            isProgEnvPresent = true;
                        }
                    });
                    if (!isProgEnvPresent) {
                        newFrameObject = initialiseFrameObject(
                            "Program",
                            environment.envKeyCounter
                        );
                        newFrameObjects.push(newFrameObject);
                        accFrames.push(newFrameObject);
                    }
                } else {
                    newFrameObject = initialiseFrameObject(
                        environment.name.replace("Environment", ""),
                        environment.envKeyCounter
                    );
                    newFrameObjects.push(newFrameObject);
                    accFrames.push(newFrameObject);
                }

                // extract elements from the head of the environment into frame
                newFrameObject.elements = {};
                if (newFrameObject.name === "global") {
                    newFrameObject.elements["(predeclared names)"] = "";
                    // don't copy over built-in functions
                } else if (
                    environment.name === "programEnvironment" &&
                    environment.tail.name === "global"
                ) {
                    // do nothing (this environment contains library functions)
                } else {
                    // copy everything (possibly including redeclared built-ins) over
                    const envElements = environment.head;
                    for (const e in envElements) {
                        newFrameObject.elements[e] = envElements[e];
                        if (
                            typeof envElements[e] === "function" &&
                            builtins.indexOf("" + getFnName(envElements[e])) >
                            0 &&
                            getFnName(envElements[e])
                        ) {
                            // this is a built-in function referenced to in a later frame,
                            // e.g. "const a = pair". In this case, add it to the global frame
                            // to be drawn and subsequently referenced.
                            newFrameObjects[0].elements[
                                getFnName(envElements[e])
                            ] = envElements[e];
                        }
                    }
                }
            });

            /**
             * - Assign parent frame of each frame (except global frame)
             * - Assign level of each frame. Frames are organised into distinct
             *   vertical bands. Global frame is at the top (level 0). Every
             *   other frame is 1 level below its parent.
             */
            newFrameObjects.forEach(function (frameObject) {
                if (frameObject.name === "global") {
                    frameObject.parent = null;
                    frameObject.level = 0;
                } else {
                    if (frameObject.name === "Program") {
                        frameObject.parent = getFrameByName(
                            accFrames,
                            "global"
                        );
                    } else {
                        let env = getEnvByKeyCounter(
                            environments,
                            frameObject.key
                        );
                        if (env.tail.name === "programEnvironment") {
                            env = env.tail;
                        }
                        // need to extract non empty parent
                        frameObject.parent = extractLoadedParentFrame(
                            getFrameByKey(accFrames, env.tail.envKeyCounter)
                        );
                    }
                    // TO-DO: description not clear
                    // For loops do not have frameObject.parent, only while loops and functions do
                    if (frameObject.parent) {
                        frameObject.parent.children.push(frameObject.key);
                        frameObject.level =
                            frameObject.parent.level +
                            (isEmptyFrame(frameObject) ? 0 : 1); ///dont increment the level if the frame object is empty
                    }
                }

                // update total number of newFrameObjects in the current level
                if (levels[frameObject.level]) {
                    levels[frameObject.level].count++;
                    levels[frameObject.level].frameObjects.push(frameObject);
                } else {
                    levels[frameObject.level] = { count: 1 };
                    levels[frameObject.level].frameObjects = [frameObject];
                }
            });

            /**
             * Extract function and data objects from newFrameObjects. Each distinct object is
             * drawn next to the first frame where it is referenced; subsequent
             * references point back to the object.
             */

            // dataPairsSeachedForFnObj array is used in findFnInDataObject
            // Helps to terminate search in recursive data structures;
            let dataPairsSeachedForFnObj = [];
            newFrameObjects.forEach(function (frameObject) {
                const elements = frameObject.elements;
                for (const e in elements) {
                    if (
                        typeof elements[e] === "function" && //TO-DO: refactor this, use isFunction func
                        !fnObjects.includes(elements[e])
                    ) {
                        initialiseFrameFnObject(elements[e], frameObject); ///init fnobject with parenttype
                        fnObjects.push(elements[e]);
                    } else if (
                        typeof elements[e] === "object" &&
                        !dataObjects.includes(elements[e])
                    ) {
                        dataObjects.push(elements[e]);
                        dataObjectWrappers.push(
                            initialiseDataObjectWrapper(
                                e,
                                elements[e],
                                frameObject
                            )
                        );
                        // Iterate through elements[e], check if function exists in fnObjects
                        // If no, instantiate and add to fnObjects array
                        // Currently, do not add function objects belonging to arrays (as arrays are not supported yet)
                        if (!is_array(elements[e])) {
                            initialiseFindFnInDataObject();
                            findFnInDataObject(
                                elements[e],
                                elements[e],
                                elements[e]
                            );
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
                    dataPairsSeachedForFnObj.push(list);
                    findFnInDataObject(list[1], list, dataObject);
                    findFnInDataObject(list[0], list, dataObject);
                } else if (isFunction(list) && !fnObjects.includes(list)) {
                    initialiseDataFnObject(list, [dataObject, parent]);
                    fnObjects.push(list);
                }
            }

            /**
             * - Find width and height of each frame
             */

            for (let i = newFrameObjects.length - 1; i >= 0; i--) {
                const frameObject = newFrameObjects[i];
                frameObject.height = getFrameHeight(frameObject);
                frameObject.width = getFrameWidth(frameObject);
                frameObject.fullwidth = getFrameAndObjectWidth(frameObject);
            }

            /**
             * Some functions may have been generated via anonymous functions, whose
             * environments would not have been present in initial array from the
             * interpreter.
             * Find these environments, and recursively process them.
             */
            const topLevelMissingEnvs = []; // extract envs of highest level from all the function objects
            fnObjects.forEach(function (fnObject) {
                let otherEnv = fnObject.environment;
                /**
                 * There may be multiple levels of anonymous function newFrameObjects, e.g.
                 * from the expression (w => x => y => z)(1)(2), where
                 * w => x => ... generates one frame, and
                 * x => y => ... generates another.
                 * The while loop ensure all of these newFrameObjects are extracted.
                 */
                while (!allEnvs.includes(otherEnv)) {
                    topLevelMissingEnvs.push(otherEnv);
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
                    // let paramString;
                    try {
                        params.forEach(function (p) {
                            paramArray.push(p.name);
                        });
                        const paramString =
                            "(" + paramArray.join(", ") + ") => ...";
                        otherEnv.vizName = paramString;
                    } catch (e) {
                        // for some reason or other the function definition expression is
                        // not always available. In that case, just use the frame name
                    }
                    otherEnv = otherEnv.tail;
                }
            });

            function extractEnvs(environment) {
                // a helper func to extract all the missing tail envs from the environment
                // TO-DO: refactor this
                if (
                    environment === null ||
                    environment.name === "programEnvironment" ||
                    environment.name === "global"
                ) {
                    return [];
                } else {
                    // prepend the extracted tail envs
                    return [...extractEnvs(environment.tail), environment];
                }
            }

            //extract envs from the missing envs
            if (topLevelMissingEnvs.length > 0) {
                const allMissingEnvs = [];

                topLevelMissingEnvs.forEach((missingEnv) => {
                    const extractedEnvs = extractEnvs(missingEnv);
                    extractedEnvs.push.apply(allMissingEnvs, extractedEnvs);
                    allEnvs.push.apply(allEnvs, extractedEnvs);
                });

                newFrameObjects = parseInput(accFrames, allMissingEnvs);
            }

            return accFrames;
        }

        frameObjects = parseInput([], allEnvs); //parseinput will extract frames from allenvs and add it to allframes
        /**
         * Find the source frame for each fnObject. The source frame is the frame
         * which generated the function. This may be different from the parent
         * frame, which is the first frame where the object is referenced.
         */
        fnObjects.forEach(function (fnObject) {
            if (fnObject.environment.envKeyCounter === 1) {
                // library functions, points to global frame
                fnObject.source = getFrameByName(frameObjects, "global");
            } else if (fnObject.environment.envKeyCounter === 2) {
                // program environment functions
                fnObject.source = getFrameByName(frameObjects, "Program");
            } else {
                fnObject.source = getFrameByKey(
                    frameObjects,
                    fnObject.environment.envKeyCounter
                );
            }
        });

        positionItems(frameObjects);
        ///at least 300
        // TO-DO: why *1.6??
        let drawingWidth = Math.max(
            getDrawingWidth(levels) + CANVAS_PADDING * 2,
            300
        );
        // TO-DO: FIX DRAWING WIDTH
        viewport.setSize(drawingWidth, getDrawingHeight(levels));
        // "* 1.6" is a partial workaround for drawing being cut off on the right

        // INVOKE ALL
        DRAW_ON_STARTUP.forEach((drawScene) => {
            try {
                drawScene();
            } catch (e) {
                console.error(drawScene, e.message);
            }
        });

        if (!alreadyListened) {
            alreadyListened = true;
            container.addEventListener("mousemove", function (evt) {
                let boundingRect = container.getBoundingClientRect(),
                    x = evt.clientX - boundingRect.left,
                    y = evt.clientY - boundingRect.top,
                    key = viewport.getIntersection(x, y),
                    arrowObject,
                    textObject,
                    fnObject,
                    pairObject,
                    frameObject;

                if (key >= 0) {
                    container.style.cursor = "pointer";
                } else {
                    container.style.cursor = "default";
                }

                // Arrow Mousemove
                // --------------------------------------------------.
                // unhover all arrowObjects
                arrowObjects.forEach(function (arrowObject) {
                    arrowObject.hovered = false;
                });

                if (key >= 0 && key < Math.pow(2, 20)) {
                    arrowObject = getObjFromKey(arrowObjects, key);
                    if (arrowObject) arrowObject.hovered = true;
                }

                drawSceneArrows();

                // Text Mousemove
                // --------------------------------------------------.
                // unhover all textObjects
                textObjects.forEach(function (textObject) {
                    textObject.hovered = false;
                });

                if (key >= 0 && key < Math.pow(2, 18)) {
                    textObject = getObjFromKey(textObjects, key);
                    if (textObject) textObject.hovered = true;
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

                // Pair Mousemove
                // --------------------------------------------------.
                // unhover all fnObjects
                pairObjects.forEach(function (pairObject) {
                    pairObject.hovered = false;
                });

                if (key >= 0 && key < Math.pow(2, 16)) {
                    pairObject = getObjFromKey(pairObjects, key);
                    if (pairObject) pairObject.hovered = true;
                }

                drawScenePairObjects();

                // Frame Mousemove
                // --------------------------------------------------.
                // unhover all frameObjects
                frameObjects.forEach(function (frameObject) {
                    frameObject.hovered = false;
                });

                if (key >= 0) {
                    frameObject = getObjFromKey(frameObjects, key);
                    if (frameObject) frameObject.hovered = true;
                }

                drawSceneFrameObjects();
            });

            container.addEventListener("click", function (evt) {
                let boundingRect = container.getBoundingClientRect(),
                    x = evt.clientX - boundingRect.left,
                    y = evt.clientY - boundingRect.top,
                    key = viewport.getIntersection(x, y),
                    textObject,
                    fnObject;

                // Text Event
                // --------------------------------------------------.
                // unhover all textObjects
                // redraw the scene when clicked
                textObjects.forEach(function (textObject) {
                    textObject.selected = false;
                });

                if (key >= 0 && key < Math.pow(2, 18)) {
                    textObject = getObjFromKey(textObjects, key);
                    if (textObject) textObject.selected = true;
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
            });
        }
    }

    // Frame Scene
    // --------------------------------------------------.
    function drawSceneFrameObjects() {
        var scene = frameObjectLayer.scene;
        scene.clear();
        frameObjects.forEach(function (frameObject) {
            if (!isEmptyFrame(frameObject)) {
                drawSceneFrameObject(frameObject);
            }
        });
        viewport.render();
    }

    function drawHitFrameObjects() {
        frameObjects.forEach(function (frameObject) {
            drawHitFrameObject(frameObject);
        });
    }

    function drawSceneFrameObject(frameObject) {
        const scene = frameObject.layer.scene,
            context = scene.context,
            { x, y, name, elements, width, height, hovered } = frameObject;
        context.save();
        context.font = FRAME_FONT_SETTING;
        context.fillStyle = WHITE;
        context.beginPath();

        // render frame name; rename as needed for aesthetic reasons
        let frameName;
        switch (name) {
            case "forLoopEnvironment":
                frameName = "Body of for-loop";
                break;
            case "forBlockEnvironment":
                frameName = "Control variable of for-loop";
                break;
            case "blockEnvironment":
                frameName = "Block";
                break;
            case "global":
                frameName = "Global";
                break;
            default:
                frameName = name;
        }

        if (frameName.length * 9 < width / 2 || frameName === "global") {
            context.fillText(frameName, x, y - 10);
        } else {
            context.fillText(frameName, x, y - 10);
        }

        // render text in frame
        let i = 0;
        let textX = x + HORIZONTAL_TEXT_MARGIN;
        let textY = y + VERITCAL_TEXT_MARGIN;

        for (const k in elements) {
            if (elements[k] === null && typeof elements[k] === "object") {
                // null primitive in Source
                context.fillText(
                    `${"" + k}: null`,
                    textX,
                    textY + i * FRAME_HEIGHT_LINE
                );
            } else {
                switch (typeof elements[k]) {
                    case "number":
                    case "boolean":
                    case "undefined":
                        context.fillText(
                            `${"" + k}: ${"" + elements[k]}`,
                            textX,
                            textY + i * FRAME_HEIGHT_LINE
                        );
                        break;
                    case "string":
                        if (k === "(predeclared names)") {
                            context.fillText(
                                `${"" + k}`,
                                textX,
                                textY + i * FRAME_HEIGHT_LINE
                            );
                        } else {
                            context.fillText(
                                `${"" + k}: "${"" + elements[k]}"`,
                                textX,
                                textY + i * FRAME_HEIGHT_LINE
                            );
                        }
                        break;
                    default:
                        context.fillText(
                            `${"" + k}:`,
                            textX,
                            textY + i * FRAME_HEIGHT_LINE
                        );
                        i += getUnitHeight(elements[k]);
                }
            }
            i++;
        }

        if (hovered) {
            context.strokeStyle = GREEN;
        } else {
            context.strokeStyle = WHITE;
        }
        context.strokeRect(x, y, width, height);

        context.restore();
    }

    function drawHitFrameObject(frameObject) {
        if (frameObject.elements.length === 0) {
            return;
        }

        const { x, y, width, height, key } = frameObject;
        var hit = frameObjectLayer.hit,
            context = hit.context;
        context.save();
        context.fillStyle = hit.getColorFromIndex(key);
        //...//
        context.fillRect(x, y, width, height);
        //...//
        context.restore();
    }

    // Function Scene
    // --------------------------------------------------.
    function drawSceneFnObjects() {
        let isSelected = false;
        fnObjectLayer.scene.clear();
        for (let i = 0; i < fnObjects.length; i++) {
            const fnObjParent = fnObjects[i].parent;
            if (Array.isArray(fnObjParent) && fnObjParent[0].length !== 2) {
                // Do not draw function if it belongs to an array.
                // (Remove after implementing arrays)
            } else {
                drawSceneFnObject(fnObjects[i]);
                if (fnObjects[i].selected) isSelected = true;
            }
        }

        if (isSelected) {
            // move layer to the top to see the text
            fnObjectLayer.moveToTop();
        } else {
            reorderLayers();
        }

        viewport.render();
    }

    function drawHitFnObjects() {
        for (let i = 0; i < fnObjects.length; i++) {
            drawHitFnObject(fnObjects[i]);
        }
    }

    function drawSceneFnObject(fnObject) {
        const scene = fnObject.layer.scene,
            context = scene.context;

        const x = fnObject.x;
        const y = fnObject.y;
        context.save();

        //background
        context.fillStyle = CYAN_BLUE; // colour of Source Academy background
        context.fillRect(
            x - 2 * FNOBJECT_RADIUS,
            y - FNOBJECT_RADIUS,
            4 * FNOBJECT_RADIUS,
            2 * FNOBJECT_RADIUS
        );

        // inner filled circle
        context.beginPath();
        context.arc(
            x - FNOBJECT_RADIUS,
            y,
            INNER_RADIUS,
            0,
            Math.PI * 2,
            false
        );
        context.fillStyle = NOBEL;
        context.fill();

        context.moveTo(x, y);
        context.arc(
            x - FNOBJECT_RADIUS,
            y,
            FNOBJECT_RADIUS,
            0,
            Math.PI * 2,
            false
        );
        context.strokeStyle =
            !fnObject.hovered && !fnObject.selected ? NOBEL : GREEN;
        context.stroke();

        context.beginPath();
        if (fnObject.selected) {
            // TO-DO: refactor this
            // if (true) { //debug
            let fnString = fnObject.fnString;
            let params;
            let body;
            //filter out the params and body
            if (fnObject.node.type === "FunctionDeclaration") {
                params = fnString.substring(
                    fnString.indexOf("("),
                    fnString.indexOf("{") - 1
                );
                body = fnString.substring(fnString.indexOf("{"));
            } else {
                params = fnString.substring(0, fnString.indexOf("=") - 1);
                body = fnString.substring(fnString.indexOf("=") + 3);
            }

            // fill text into multi line
            context.font = FONT_SETTING;
            context.fillStyle = GREEN;

            // TO-DO: SIMPLIFY THIS
            body = body.split("\n");
            context.fillText(
                `params: ${truncateString(context, params, TEXT_BOX_WIDTH).result
                }`,
                x + 50,
                y
            );
            context.fillText("body:", x + 50, y + 20);
            let i = 0;
            let j = 0;
            while (j < 5 && i < body.length) {
                if (body[i] && body[i].replace(/ /g, "") !== "debugger;") {
                    //dont fill text if it is a debugger line
                    context.fillText(
                        truncateString(context, body[i], TEXT_BOX_WIDTH).result,
                        x + 100,
                        y + 20 * (j + 1)
                    );
                    j++;
                }
                i++;
            }
            if (i < body.length) {
                context.fillText("...", x + 120, y + 120);
            }
        }
        context.moveTo(x + FNOBJECT_RADIUS, y);
        context.arc(
            x + FNOBJECT_RADIUS,
            y,
            INNER_RADIUS,
            0,
            Math.PI * 2,
            false
        );
        context.fill();
        context.moveTo(x + 2 * FNOBJECT_RADIUS, y);
        context.arc(
            x + FNOBJECT_RADIUS,
            y,
            FNOBJECT_RADIUS,
            0,
            Math.PI * 2,
            false
        );
        context.stroke();
        context.restore();
    }

    function drawHitFnObject(fnObject) {
        const hit = fnObject.layer.hit,
            context = hit.context;
        const x = fnObject.x;
        const y = fnObject.y;
        context.save();

        fnObject.x = x;
        fnObject.y = y;
        context.beginPath();
        context.arc(
            x - FNOBJECT_RADIUS,
            y,
            FNOBJECT_RADIUS,
            0,
            Math.PI * 2,
            false
        );
        context.fillStyle = hit.getColorFromIndex(fnObject.key);
        context.fill();
        context.beginPath();
        context.arc(
            x + FNOBJECT_RADIUS,
            y,
            FNOBJECT_RADIUS,
            0,
            Math.PI * 2,
            false
        );
        context.fillStyle = hit.getColorFromIndex(fnObject.key);
        context.fill();

        context.restore();
    }

    // Data Scene
    // --------------------------------------------------.
    function drawScenePairObjects() {
        const scene = pairObjectLayer.scene;
        scene.clear();
        pairObjects.forEach(function (pairObject) {
            drawScenePairObject(pairObject);
        });
        viewport.render();
    }

    function drawHitPairObjects() {
        pairObjects.forEach(function (pairObject) {
            drawHitPairObject(pairObject);
        });
    }

    function drawScenePairObject(pairObject) {
        const { x, y, color, hovered } = pairObject,
            scene = pairObjectLayer.scene,
            context = scene.context;
        context.save();
        //...//
        context.fillStyle = color;
        context.fillRect(x, y, DATA_UNIT_WIDTH, DATA_UNIT_HEIGHT);
        if (hovered) {
            context.strokeStyle = GREEN;
        } else {
            context.strokeStyle = NOBEL;
        }

        context.strokeRect(x, y, DATA_UNIT_WIDTH, DATA_UNIT_HEIGHT);
        context.beginPath();
        context.moveTo(x + DATA_UNIT_WIDTH / 2, y);
        context.lineTo(x + DATA_UNIT_WIDTH / 2, y + DATA_UNIT_HEIGHT);
        context.stroke();
        //...//
        context.restore();
    }

    function drawHitPairObject(pairObject) {
        const { x, y, key } = pairObject,
            hit = pairObjectLayer.hit,
            context = hit.context;
        context.save();
        //...//
        context.fillStyle = hit.getColorFromIndex(key);
        context.fillRect(x, y, DATA_UNIT_WIDTH, DATA_UNIT_HEIGHT);
        context.strokeStyle = hit.getColorFromIndex(key);
        context.strokeRect(x, y, DATA_UNIT_WIDTH, DATA_UNIT_HEIGHT);
        context.beginPath();
        context.moveTo(x + DATA_UNIT_WIDTH / 2, y);
        context.lineTo(x + DATA_UNIT_WIDTH / 2, y + DATA_UNIT_HEIGHT);
        context.stroke();
        //...//
        context.restore();
    }

    function drawSceneDataObjects() {
        // drawDataObjects array is declared as a global array below but must
        // be reset whenever this fn is called
        drawnDataObjects = [];
        dataObjectLayer.scene.clear();
        dataObjects.forEach(function (dataObject) {
            if (dataObject !== null) {
                const result = drawThis(dataObject);
                const draw = result.draw;
                if (draw) {
                    if (is_array(dataObject)) {
                        drawArrayObject(dataObject);
                    } else {
                        drawSceneDataObject(dataObject);
                    }
                    drawnDataObjects.push(dataObject);
                } else {
                    reassignCoordinates(
                        result.mainStructure,
                        result.subStructure
                    );
                }
            }
        });
        viewport.render();
    }

    function drawHitDataObjects() {
        dataObjects.forEach(function (dataObject) {
            if (dataObject !== null) {
                drawHitDataObject(dataObject);
            }
        });
    }

    function drawSceneDataObject(dataObject) {
        const wrapper = dataObjectWrappers[dataObjects.indexOf(dataObject)];
        // define points for drawing data object
        const x0 = wrapper.x - DATA_OBJECT_SIDE,
            y0 = wrapper.y - DATA_OBJECT_SIDE / 2;
        const scene = dataObjectLayer.scene,
            context = scene.context;

        context.save();
        cycleDetector = [];
        initialiseCallGetShiftInfo(dataObject);
        initialisePairObjects(dataObject, scene, wrapper, wrapper.data, x0, y0);
        context.restore();
    }

    function drawHitDataObject(dataObject) {
        const wrapper = dataObjectWrappers[dataObjects.indexOf(dataObject)],
            x0 = wrapper.x - DATA_OBJECT_SIDE,
            y0 = wrapper.y - DATA_OBJECT_SIDE / 2,
            hit = dataObjectLayer.hit,
            context = hit.context;

        context.save();

        hitCycleDetector = [];
        drawHitPairs(dataObject, hit, wrapper, x0, y0);

        context.restore();
    }

    // Arrow Scene
    // --------------------------------------------------.
    function drawSceneArrows() {
        const scene = arrowObjectLayer.scene;
        let hoveredArrow;
        scene.clear();
        arrowObjects.forEach(function (arrowObject) {
            if (arrowObject.hovered) {
                hoveredArrow = arrowObject;
            } else {
                drawSceneArrow(arrowObject);
            }
        });
        if (hoveredArrow) drawSceneArrow(hoveredArrow);
        viewport.render();
    }

    function drawHitArrows() {
        arrowObjects.forEach(function (arrowObject) {
            drawHitArrow(arrowObject);
        });
    }

    function drawSceneArrow(arrowObject) {
        const { nodes, color, hovered } = arrowObject;
        const scene = arrowObjectLayer.scene,
            context = scene.context;
        context.save();
        context.beginPath();

        for (let i = 0; i < nodes.length - 1; i++) {
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
            context.stroke();
        }

        context.restore();
    }

    function drawHitArrow(arrowObject) {
        const { nodes, key } = arrowObject,
            hit = arrowObjectLayer.hit,
            context = hit.context;
        context.save();
        context.beginPath();

        for (let i = 0; i < nodes.length - 1; i++) {
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
        const scene = textObjectLayer.scene;
        scene.clear();
        textObjects.forEach(function (textObject) {
            drawSceneTextObject(textObject);
        });
        viewport.render();
    }

    function drawHitTextObjects() {
        textObjects.forEach(function (textObject) {
            drawHitTextObject(textObject);
        });
    }

    function drawSceneTextObject(textObject) {
        const { string, x, y, color, hovered } = textObject;
        const scene = textObjectLayer.scene,
            context = scene.context;
        context.save();
        //...//
        context.font = FONT_SETTING;

        if (hovered) {
            //... add background to the text
            context.fillStyle = REGENT_GRAY_80;
            context.fillRect(
                x - TEXT_PADDING,
                y - FONT_HEIGHT - TEXT_PADDING / 2,
                context.measureText(string).width + TEXT_PADDING * 2,
                FONT_HEIGHT + TEXT_PADDING
            );
            //...
            context.fillStyle = WHITE;
            context.fillText(string, x, y - TEXT_PADDING / 2);
        } else {
            context.fillStyle = color;
            const { result, truncated } = truncateString(
                context,
                string,
                DATA_UNIT_WIDTH / 2
            );
            if (truncated) {
                context.fillText(result, x - 10, y);
            } else {
                context.fillText(result, x, y);
            }
        }
        //...//
        context.restore();
    }

    function drawHitTextObject(textObject) {
        const { string, x, y, key } = textObject,
            hit = textObjectLayer.hit,
            context = hit.context;
        context.save();
        context.font = FONT_SETTING;
        context.fillStyle = hit.getColorFromIndex(key);
        const textWidth = Math.min(
            context.measureText(string).width + TEXT_PADDING * 2,
            DATA_UNIT_WIDTH / 2
        );
        //...//
        context.fillRect(
            x - TEXT_PADDING,
            y - FONT_HEIGHT,
            textWidth,
            FONT_HEIGHT + TEXT_PADDING
        );
        //...//
        context.restore();
    }

    /*
    |--------------------------------------------------------------------------
    | Helper functions
    |--------------------------------------------------------------------------
    */
    // General Helpers
    // --------------------------------------------------.

    function reorderLayers() {
        LAYERS.forEach((layer) => layer.moveToTop());
    }

    function getObjFromKey(objects, key) {
        let len = objects.length,
            n,
            obj;

        for (n = 0; n < len; n++) {
            obj = objects[n];
            if (obj.key === key) {
                return obj;
            }
        }

        return null;
    }

    function getKeyByValue(object, value) {
        return Object.keys(object).find((key) => object[key] === value);
    }

    /**
     * Assigns an x- and a y-coordinate to every frame and object.
     */
    function positionItems(frameObjects) {
        /**
         * Find and store the height of each level
         * (i.e. the height of the tallest environment)
         */
        for (const l in levels) {
            const level = levels[l];
            let maxHeight = 0,
                fullwidthArray = [];
            level.frameObjects.forEach(function (frameObject) {
                if (frameObject.height > maxHeight) {
                    maxHeight = frameObject.height;
                }
                fullwidthArray.push(frameObject.fullwidth);
            });
            level.height = maxHeight;
            level.widthArray = fullwidthArray;
        }

        /**
         * Calculate x- and y-coordinates for each frame
         */
        const drawingWidth = getDrawingWidth(levels) + 2 * DRAWING_LEFT_PADDING;
        frameObjects.forEach(function (frameObject) {
            let currLevel = frameObject.level;

            /**
             * y-coordinate
             * Simply the total height of all levels above the frameObject, plus a
             * fixed spacing factor (60) per level.
             */
            let y = 30;
            for (let i = 0; i < currLevel; i++) {
                y += levels[i].height + LEVEL_SPACING;
            }
            frameObject.y = y;
        });

        /**
         * x-coordinate
         * All frameObjects are left-aligned. Iterate through each level, assigning the x-coordinate
         * depending on how much space the frameObjects on the left are taking up
         * Potential future improvement: Group frameObjects together in a tree structure, and assign space recurisvely
         * to each frame. However, need to fix max drawing size, which is currently limited.
         */
        for (const l in levels) {
            const level = levels[l];
            const frameWidthArray = level.widthArray;
            level.frameObjects.forEach(function (frameObject) {
                const frameIndex = level.frameObjects.indexOf(frameObject);
                if (frameIndex > 0) {
                    frameObject.x = DRAWING_LEFT_PADDING;
                    for (let i = 0; i < frameIndex; i++) {
                        frameObject.x += frameWidthArray[i] + 20;
                    }
                } else {
                    frameObject.x = DRAWING_LEFT_PADDING;
                }
            });
        }

        /**
         * Calculate coordinates for each fnObject and dataObject.
         */
        for (const d in dataObjects) {
            const wrapper = dataObjectWrappers[d];
            const parent = wrapper.parent;
            wrapper.x = parent.x + parent.width + OBJECT_FRAME_RIGHT_SPACING;
            wrapper.y =
                parent.y +
                findElementPosition(dataObjects[d], parent) *
                FRAME_HEIGHT_LINE +
                OBJECT_FRAME_TOP_SPACING;
        }

        fnObjects.forEach(function (fnObject) {
            // Checks the parent of the function, calculating coordinates accordingly
            let parent = fnObject.parent;
            if (Array.isArray(parent)) {
                // Check if parent has x and y coordinates
                // Otherwise use getShiftInfo to calculate
                if (parent[0] === parent[1]) {
                    let parentWrapper = getWrapperFromDataObject(parent[1]);
                    fnObject.x = parentWrapper.x;
                    fnObject.y = parentWrapper.y + FRAME_HEIGHT_LINE;
                    // If function resides in tail, shift it rightward
                    if (parent[0].length > 1 && parent[0][1] === fnObject) {
                        fnObject.x += DATA_UNIT_WIDTH / 2;
                    }
                } else {
                    let parent_coordinates = getShiftInfo(parent[0], parent[1]);
                    fnObject.x = parent_coordinates.x;
                    fnObject.y = parent_coordinates.y + FRAME_HEIGHT_LINE - 18;
                    if (parent.length > 1 && parent[1][1] === fnObject) {
                        fnObject.x += DATA_UNIT_WIDTH / 2;
                    }
                }
            } else {
                fnObject.x =
                    parent.x + parent.width + OBJECT_FRAME_RIGHT_SPACING;
                fnObject.y =
                    parent.y +
                    findElementPosition(fnObject, parent) * FRAME_HEIGHT_LINE +
                    OBJECT_FRAME_TOP_SPACING;
            }
        });
    }

    /**
     * Space Calculation Functions
     */

    function getListLength(list) {
        if (is_pair(list[1])) {
            return 1 + getListLength(list[1]);
        } else {
            return 1;
        }
    }

    function getNthTail(list, n) {
        // get nth tail in a list
        if (n <= 0) {
            return list;
        } else {
            return getNthTail(list[1], n - 1);
        }
    }

    function is_pair(dataObject) {
        return Array.isArray(dataObject) && dataObject.length === 2;
    }

    function is_null(x) {
        return x === null;
    }

    function is_member(v, list) {
        // check if v is a member of the list
        if (is_null(list)) {
            return false;
        } else {
            return v === list[0] || is_member(v, list[1]);
        }
    }

    // Calculates width of a list/array
    function getListWidth(parentlist) {
        //TO-DO: fix underestimation of list width in sample 4
        //fix after implement array repr
        // parentlist is either a list or an array

        let otherObjects = [];
        let pairsinCurrentObject = [];
        let objectStored = false;
        dataObjects.forEach((x) => {
            if (x === parentlist) {
                objectStored = true;
            }
            if (objectStored) {
            } else if (x !== parentlist) {
                otherObjects.push(x);
            }
        });

        let parentDataStructure = [];

        function getUnitWidth(list) {
            let substructureExists = false;

            // calculate each data obj independently
            // dont calculate if list is substructure of other objects
            otherObjects.forEach((x) => {
                if (checkSubStructure(x, list)) {
                    ///check if this list is a substructure of other data objects
                    substructureExists = true;
                }
            });

            // input: list or array
            // make sure head cannot point back!
            if (!parentDataStructure.includes(list) && !substructureExists) {
                parentDataStructure.push(list);
                const len = getListLength(list);
                let max_len = len;
                for (let i = len - 1; i >= 0; i--) {
                    const head = getNthTail(list, i)[0];

                    //...//
                    let isSameLevel = false;
                    // check if same lvl
                    for (let j = 0; j < len; j++) {
                        if (head === getNthTail(list, j)) {
                            isSameLevel = true;
                            break;
                        }
                    }
                    //...//
                    if (is_pair(head) && !isSameLevel) {
                        max_len = Math.max(max_len, getUnitWidth(head) + i);
                    }
                }
                return max_len;
            } else {
                return 0;
            }
        }

        if (parentlist.length !== 2) {
            // If parentlist is array, check that it is not a substructure of any other data structure
            let substructureExists = false;
            otherObjects.forEach((x) => {
                if (checkSubStructure(x, parentlist)) {
                    substructureExists = true;
                }
            });

            if (substructureExists) {
                return 0;
            } else {
                return DATA_UNIT_WIDTH;
            }
        } else {
            // parentlist is a list (not array)
            let pairCount = getUnitWidth(parentlist);
            return pairCount * (DATA_UNIT_WIDTH + PAIR_SPACING);
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
        dataObjects.forEach((x) => {
            if (x === parentlist) {
                objectStored = true;
            } else if (!objectStored) {
                otherObjects.push(x);
            }
        });

        function recursiveHelper(list) {
            // Check if list is simply a substructure of any previously defined data structure, or a previously traversed pair
            let substructureExists = false;
            otherObjects.forEach((x) => {
                if (checkSubStructure(x, list)) {
                    substructureExists = true;
                }
            });

            if (substructureExists || dataPairs.includes(list)) {
                return 0;
            }

            dataPairs.push(list);

            if (Array.isArray(list) && list.length !== 2) {
                return 0;
            } else if (Array.isArray(list)) {
                let tailIsFn = false;

                if (isFunction(list[1])) {
                    let fnObject = fnObjects[fnObjects.indexOf(list[1])];
                    if (fnObject.parent[1] === list) {
                        tailIsFn = true;
                    }
                }

                if (Array.isArray(list[0])) {
                    let substructureExistsHead = false;
                    otherObjects.forEach((x) => {
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
                            return 1 + recursiveHelper(list[0]) + tail_height;
                        }
                    }
                } else if (isFunction(list[0])) {
                    let fnObject = fnObjects[fnObjects.indexOf(list[0])];
                    let parenttype = fnObject.parenttype;
                    let tail_height = 0;
                    if (tailIsFn) {
                        tail_height = 1;
                    } else {
                        tail_height = recursiveHelper(list[1]);
                    }

                    if (parenttype === "frame" || tail_height > 0) {
                        // Need to check if function is defined in current data structure or frame
                        // If tail_height > 0, tail_height >= height of current pair, so return tail_height
                        return tail_height;
                    } else if (
                        fnObject.parent[0] === parentlist &&
                        fnObject.parent[1] === list
                    ) {
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
        return recursiveHelper(parentlist);
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
        dataObjects.forEach((x) => {
            if (x === currentObj) {
                objectStored = true;
            }
            if (objectStored) {
            } else if (x !== currentObj) {
                otherObjects.push(x);
            }
        });

        function fillDataPairs(currPair) {
            if (
                currPair === sublist ||
                !Array.isArray(currPair) ||
                currPair.length !== 2
            ) {
                // Do nothing, stop recursing
            } else if (!dataPairs.includes(currPair)) {
                dataPairs.push(currPair);
                fillDataPairs(dataPairs[1]);
                fillDataPairs(dataPairs[0]);
            }
        }

        // Need to push currentObj into dataPairs, might not be added in fillDataPairs if currentObj = sublist
        dataPairs.push(currentObj);
        fillDataPairs(currentObj);

        // Similar as (getUnitHeight)
        function recursiveHelper(list) {
            let substructureExists = false;
            otherObjects.forEach((x) => {
                if (checkSubStructure(x, list)) {
                    substructureExists = true;
                }
            });

            if (substructureExists || dataPairs.includes(list)) {
                return 0;
            }

            dataPairs.push(list);

            if (Array.isArray(list) && list.length !== 2) {
                return 0;
            } else if (Array.isArray(list)) {
                let tailIsFn = false;

                if (isFunction(list[1])) {
                    let fnObject = fnObjects[fnObjects.indexOf(list[1])];
                    if (fnObject.parent[1] === list) {
                        tailIsFn = true;
                    }
                }

                if (Array.isArray(list[0])) {
                    let substructureExistsHead = false;
                    otherObjects.forEach((x) => {
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
                            return 1 + head_height + tail_height;
                        }
                    }
                }

                if (isFunction(list[0])) {
                    let fnObject = fnObjects[fnObjects.indexOf(list[0])];
                    let parenttype = fnObject.parenttype;
                    let tail_height = 0;
                    if (tailIsFn) {
                        tail_height = 1;
                    } else {
                        tail_height = recursiveHelper(list[1]);
                    }

                    if (parenttype === "frame" || tail_height > 0) {
                        return tail_height;
                    } else if (
                        fnObject.parent[0] === currentObj &&
                        fnObject.parent[1] === list
                    ) {
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
        return recursiveHelper(sublist);
    }

    // Calculates list/array height
    // Used in frame height calculations
    function getListHeight(list) {
        let x = (getUnitHeight(list) + 1) * (DATA_UNIT_HEIGHT + PAIR_SPACING);
        return x;
    }

    function getFrameHeight(frameObject) {
        // Assumes line spacing is separate from data object spacing
        let elem_lines = 0;
        let data_space = 0;

        for (const elem in frameObject.elements) {
            if (isFunction(frameObject.elements[elem])) {
                elem_lines += 1;
            } else if (Array.isArray(frameObject.elements[elem])) {
                const parent = getWrapperFromDataObject(
                    frameObject.elements[elem]
                ).parent;

                if (parent === frameObject) {
                    data_space += getListHeight(frameObject.elements[elem]);
                } else {
                    data_space += FRAME_HEIGHT_LINE;
                }
            } else {
                elem_lines += 1;
            }
        }

        return (
            data_space + elem_lines * FRAME_HEIGHT_LINE + FRAME_HEIGHT_PADDING
        );
    }

    // Calculates width of frame only
    function getFrameWidth(frameObject) {
        //TO-DO: fix global frame width
        let maxLength = 0;
        const elements = frameObject.elements;
        for (const e in elements) {
            if (true) {
                let currLength;
                const literals = ["number", "string", "boolean"];
                if (literals.includes(typeof elements[e])) {
                    currLength =
                        e.length +
                        elements[e].toString().length +
                        (typeof elements[e] === "string" ? 2 : 0);
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
    function getFrameAndObjectWidth(frameObject) {
        if (frameObject.elements.length === 0) {
            // TO-DO: dont keep invoking the calculation function
            // return getFrameWidth(frameObject);
            return frameObject.width;
        } else {
            let maxWidth = 0;
            for (const e in frameObject.elements) {
                // Can be either primitive, function or array
                if (isFunction(frameObject.elements[e])) {
                    if (frameObject.elements[e].parent === frameObject) {
                        maxWidth = Math.max(
                            maxWidth,
                            DATA_UNIT_WIDTH + TEXT_BOX_WIDTH
                        );
                    }
                } else if (Array.isArray(frameObject.elements[e])) {
                    //TO-DO: fix wrong calculation, underestimate for sample 4
                    const parent =
                        dataObjectWrappers[
                            dataObjects.indexOf(frameObject.elements[e])
                        ].parent;
                    if (parent === frameObject) {
                        maxWidth = Math.max(
                            maxWidth,
                            getListWidth(frameObject.elements[e])
                        );
                    }
                }
            }
            return (
                // getFrameWidth(frameObject) +
                frameObject.width + OBJECT_FRAME_RIGHT_SPACING + maxWidth
            );
        }
    }

    function getDrawingWidth(levels) {
        function getTotalWidth(frameObject) {
            // Compare fullwidth + width of children
            // TO-DO: refactor and rename some vars
            const children_level = frameObject.level + 1;
            let children = levels[children_level];
            let children_length = 0;

            if (children !== undefined) {
                children = levels[children_level].frameObjects.filter(
                    (f) => f.parent === frameObject
                );
                if (children === undefined) {
                    return frameObject.fullwidth;
                }
                for (const c in children) {
                    children_length +=
                        getTotalWidth(children[c]) + FRAME_SPACING; //New: added frame spacing to the totalwidth of each children
                }

                // TO-DO: what is this for ? why reset children length?
                // TO-DO: don't add framespacing to the last children
                children_length -= FRAME_SPACING;
            } else {
                return frameObject.fullwidth;
            }

            return Math.max(frameObject.fullwidth, children_length);
        }
        // TO-DO: multiple frames in a level ?
        // recursively determine the longest width between this frameobject
        // and all the subsequent children frames
        return getTotalWidth(levels[0].frameObjects[0]);
    }

    function getDrawingHeight(levels) {
        let y = 30;
        for (const l in levels) {
            y += levels[l].height + LEVEL_SPACING;
        }
        return y;
    }

    function drawLine(context, startX, startY, endX, endY) {
        context.save();
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.stroke();
        context.restore();
    }

    // Frame Helpers
    // --------------------------------------------------.
    // For both function objects and data objects
    function extractLoadedParentFrame(frameObject) {
        // extract a frame object that is non empty
        if (isEmptyFrame(frameObject)) {
            return extractLoadedParentFrame(frameObject.parent);
        } else {
            return frameObject;
        }
    }

    function drawSceneFrameObjectArrows() {
        frameObjects.forEach(function (frameObject) {
            let elements = frameObject.elements;
            for (const e in elements) {
                if (typeof elements[e] === "function") {
                    drawSceneFrameFnArrow(frameObject, e, elements[e]);
                } else if (
                    typeof elements[e] === "object" &&
                    elements[e] !== null
                ) {
                    drawSceneFrameDataArrow(frameObject, e, elements[e]);
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
        frameObjects.forEach(function (frameObject) {
            if (!isEmptyFrame(frameObject)) {
                drawSceneFrameArrow(frameObject);
            }
        });
        viewport.render();
    }

    /**
     * Trivial - the arrow just points straight to a fixed position relative to
     * the frame.
     */
    function drawSceneFrameDataArrow(frameObject, name, dataObject) {
        const wrapper = dataObjectWrappers[dataObjects.indexOf(dataObject)];

        // simply draw straight arrow from frame to function
        const x0 = frameObject.x + name.length * FRAME_WIDTH_CHAR + 25;
        const y0 =
            frameObject.y +
            findElementNamePosition(name, frameObject) * FRAME_HEIGHT_LINE +
            35,
            xf =
                wrapper.x < x0
                    ? wrapper.x - FNOBJECT_RADIUS * 2 - 3 + DATA_UNIT_WIDTH
                    : wrapper.x - FNOBJECT_RADIUS * 2 - 3;
        const yf = wrapper.y;

        // drawArrow(context, x0, y0, xf, yf);

        arrowObjects.push(
            initialiseArrowObject([
                initialiseArrowNode(x0, y0),
                initialiseArrowNode(xf, yf),
            ])
        );
    }

    /**
     * For each function variable, either the function is defined in the scope
     * the same frame, in which case drawing the arrow is simple, or it is in
     * a different frame. If so, more care is needed to route the arrow back up
     * to its destination.
     */
    function drawSceneFrameFnArrow(frameObject, name, fnObject) {
        //frame to fnobject
        const yf = fnObject.y;

        if (fnObject.parent === frameObject) {
            // fnObject belongs to current frame
            // simply draw straight arrow from frame to function
            const x0 = frameObject.x + name.length * FRAME_WIDTH_CHAR + 25;
            const y0 =
                frameObject.y +
                findElementNamePosition(name, frameObject) *
                FRAME_HEIGHT_LINE +
                35,
                xf = fnObject.x - FNOBJECT_RADIUS * 2 - 3; // left circle

            arrowObjects.push(
                initialiseArrowObject([
                    initialiseArrowNode(x0, y0),
                    initialiseArrowNode(xf, yf),
                ])
            );
        } else {
            /**
             * fnObject belongs to different frame.
             * Three "offset" factors are used: startOffset, the index position of
             * the source variable in the starting frame; fnOffset, the position
             * of the target fnObject in the destination frame; and frameOffset, the
             * position of the frame within its level. Offsetting the line
             * by these factors prevents overlaps between arrowObjects that are pointing to
             * different objects.
             */
            const startOffset = findElementPosition(fnObject, frameObject);
            const fnOffset = findElementPosition(fnObject, fnObject.parent);
            const frameOffset = findFrameIndexInLevel(frameObject);
            const x0 = frameObject.x + name.length * 8 + 22,
                y0 =
                    frameObject.y +
                    findElementNamePosition(name, frameObject) *
                    FRAME_HEIGHT_LINE +
                    35;
            const xf = fnObject.x + FNOBJECT_RADIUS * 2 + 3,
                x1 = frameObject.x + frameObject.width + 10 + frameOffset * 20,
                y1 = y0;
            const x2 = x1,
                y2 = frameObject.y - 20 + frameOffset * 5;
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

            levels[frameObject.level - 1].frameObjects.forEach(function (
                frameObject
            ) {
                const leftBound = frameObject.x;
                let rightBound = frameObject.x + frameObject.width;
                // if (frame.fnObjects.length !== 0) {
                // rightBound += 84;
                // }
                if (x3 > leftBound && x3 < rightBound) {
                    // overlap
                    x3 = rightBound + 10 + fnOffset * 7;
                }
            });
            const x4 = x3,
                y4 = yf;

            arrowObjects.push(
                initialiseArrowObject([
                    initialiseArrowNode(x0, y0),
                    initialiseArrowNode(x1, y1),
                    initialiseArrowNode(x2, y2),
                    initialiseArrowNode(x3, y3),
                    initialiseArrowNode(x4, y4),
                    initialiseArrowNode(xf, yf),
                ])
            );
        }
    }

    function drawSceneFnFrameArrow(fnObject) {
        // TO-DO: refactor this
        let startCoord = [fnObject.x + PAIR_SPACING, fnObject.y];
        // Currently, if fnObject is defined in an array, do not draw the arrow (remove after arrays are implemented)
        if (
            !(Array.isArray(fnObject.parent) && fnObject.parent[0].length !== 2)
        ) {
            const frameObject = extractLoadedParentFrame(fnObject.source);

            function isSameLevel(fnObject, frameObject) {
                // TO-DO: refactor and rename this
                return (
                    fnObject.y < frameObject.y + frameObject.height &&
                    fnObject.y > frameObject.y
                );
            }

            let x0 = fnObject.x + FNOBJECT_RADIUS,
                y0 = startCoord[1],
                x1,
                y1,
                x2,
                y2;

            if (
                fnObject.x > frameObject.x &&
                fnObject.x < frameObject.x + frameObject.width
            ) {
                /// point to a fat frame down or up:
                x1 = x0 + 15;
                y1 = y0;
                x2 = x1;
                y2 =
                    frameObject.y +
                    (fnObject.y > frameObject.y ? frameObject.height : 0);
            } else {
                x1 = x0;
                y1 =
                    y0 -
                    (isSameLevel(fnObject, frameObject)
                        ? 15
                        : y0 - frameObject.y - frameObject.height / 2);
                x2 =
                    frameObject.x +
                    (frameObject.x > fnObject.x ? 0 : frameObject.width); ///account for right frame
                y2 = y1;
            }

            arrowObjects.push(
                initialiseArrowObject([
                    initialiseArrowNode(x0, y0),
                    initialiseArrowNode(x1, y1),
                    initialiseArrowNode(x2, y2),
                ])
            );
        }
    }

    /**
     * Arrows between child and parent frameObjects.
     * Uses an offset factor to prevent lines overlapping, similar to with
     * frame-function arrowObjects.
     */
    function drawSceneFrameArrow(frameObject) {
        // TO-DO: point straight to the parent of the parent if parent is empty
        if (frameObject.parent === null) return null;

        function extractParent(parent) {
            // TO-DO: refactor and rename this
            if (isEmptyFrame(parent)) {
                return extractParent(parent.parent);
            } else {
                return parent;
            }
        }

        const parent = extractParent(frameObject.parent);

        const offset = levels[parent.level].frameObjects.indexOf(
            frameObject.parent
        );
        const x0 = frameObject.x + 40,
            y0 = frameObject.y,
            x1 = x0,
            y1 = (parent.y + parent.height + y0) / 2 + offset * 4,
            x2 = parent.x + 40;
        let y2, x3, y3;
        y2 = y1;
        x3 = x2;
        y3 = parent.y + parent.height + 3; // offset by 3 for aesthetic reasons
        arrowObjects.push(
            initialiseArrowObject(
                [
                    initialiseArrowNode(x0, y0),
                    initialiseArrowNode(x1, y1),
                    initialiseArrowNode(x2, y2),
                    initialiseArrowNode(x3, y3),
                ],
                WHITE
            )
        );
    }

    function findFrameIndexInLevel(frameObject) {
        const level = frameObject.level;
        return levels[level].frameObjects.indexOf(frameObject);
    }

    function isEmptyFrame(frameObject) {
        const elements = frameObject.elements;
        return (
            Object.keys(elements).length === 0 &&
            elements.constructor === Object
        );
    }

    // function isEmptyFrame(frameObject) {
    //     // TO-DO: why cant just check if it has elements?
    //     let hasObject = false;
    //     fnObjects.forEach(function (f) {
    //         if (f.parent === frameObject) {
    //             hasObject = true;
    //         }
    //     });
    //     dataObjectWrappers.forEach(function (d) {
    //         if (d.parent === frameObject) {
    //             hasObject = true;
    //         }
    //     });
    //     return (
    //         !hasObject &&
    //         frameObject.children.length === 0 &&
    //         Object.keys(frameObject.elements).length === 0
    //     );
    // }

    // Calculates the unit position of an element (data/primitive/function)
    function findElementPosition(element, frameObject) {
        ///find the sub level of the elem in the frame
        ///unit pos ie. sub level in the frame, element pos follows a grid system
        let index = 0;
        for (const elem in frameObject.elements) {
            if (frameObject.elements[elem] === element) {
                break;
            }
            if (isFunction(frameObject.elements[elem])) {
                index += 1;
            } else if (Array.isArray(frameObject.elements[elem])) {
                const parent = getWrapperFromDataObject(
                    frameObject.elements[elem]
                ).parent;

                if (parent === frameObject) {
                    index += getUnitHeight(frameObject.elements[elem]) + 1;
                } else {
                    index += 1;
                }
            } else {
                index += 1;
            }
        }
        return index;
    }

    // Calculates the unit position of the name of the element (in the frame box)
    function findElementNamePosition(elementName, frameObject) {
        let lineNo = Object.keys(frameObject.elements).indexOf(elementName);
        let index = 0;
        for (let i = 0; i < lineNo; i++) {
            if (isFunction(Object.values(frameObject.elements)[i])) {
                index += 1;
            } else if (Array.isArray(Object.values(frameObject.elements)[i])) {
                const parent =
                    dataObjectWrappers[
                        dataObjects.indexOf(
                            Object.values(frameObject.elements)[i]
                        )
                    ].parent;
                if (parent === frameObject) {
                    index +=
                        getUnitHeight(Object.values(frameObject.elements)[i]) +
                        1;
                } else {
                    index += 1;
                }
            } else {
                index += 1;
            }
        }
        return index;
    }

    function initialiseFrameObject(frameName, key) {
        // key of frame object is same as its corresponding envkeycounter
        // ie. this frame is the last in the env
        const frameObject = {
            key,
            name: frameName,
            hovered: false,
            selected: false,
            layer: frameObjectLayer,
            color: WHITE,
            children: [],
        };
        return frameObject;
    }

    function getFrameByKey(frameObjects, key) {
        for (const i in frameObjects) {
            if (frameObjects[i].key === key) {
                return frameObjects[i];
            }
        }
        return null;
    }

    function getEnvByKeyCounter(frameObjects, key) {
        for (const i in frameObjects) {
            if (frameObjects[i].envKeyCounter === key) {
                return frameObjects[i];
            }
        }
        return null;
    }

    function getFrameByName(frameObjects, name) {
        for (const i in frameObjects) {
            if (frameObjects[i].name === name) {
                return frameObjects[i];
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
        if (
            fn.node === undefined ||
            (fn.node.type === "FunctionDeclaration" && !fn.functionName)
        ) {
            return undefined;
        } else if (fn.node.type === "FunctionDeclaration") {
            return fn.functionName;
        } else {
            return fn.toString().split("(")[0].split(" ")[1];
        }
    }

    function isArrowFunction(fn) {
        return fn.node.type === "ArrowFunctionExpression";
    }

    function isFunction(functionToCheck) {
        return (
            functionToCheck &&
            {}.toString.call(functionToCheck) === "[object Function]"
        );
    }

    function initialiseFnObject(fnObject, parent) {
        // TO-DO: a fnobject can have multiple parents, refactor this using es6 syntax
        // add more props to the fnobject
        fnObject.key = fnObjectKey--;
        try {
            fnObject.fnString = fnObject.fun.toString();
        } catch (e) {
            fnObject.fnString = fnObject.toString();
        }
        fnObject.hovered = false;
        fnObject.selected = false;
        fnObject.layer = fnObjectLayer;
        fnObject.color = WHITE;
        fnObject.parent = parent;
    }

    function initialiseDataFnObject(fnObject, parent) {
        initialiseFnObject(fnObject, parent);
        fnObject.parenttype = "data";
    }

    function initialiseFrameFnObject(fnObject, parent) {
        initialiseFnObject(fnObject, parent);
        fnObject.parenttype = "frame";
    }

    // Data Helpers
    // --------------------------------------------------.

    function initialisePairObject(x, y, color = CYAN_BLUE) {
        // TO-DO: consider adding layer prop
        const pairObject = {
            key: pairObjectKey,
            hovered: false,
            selected: false,
            color,
            x,
            y,
        };
        pairObjectKey--;
        return pairObject;
    }

    function initialisePairObjects(
        dataObject,
        scene,
        wrapper,
        wrapperData,
        startX,
        startY
    ) {
        // wrapperData is only relevant for tracing the origin of function objects in lists
        // not useful for anything else
        const context = scene.context;
        context.save();

        pairObjects.push(initialisePairObject(startX, startY));

        context.font = FONT_SETTING;
        // cycleDetector is an array used to detected dataobjects that connect to themselves
        cycleDetector.push(dataObject);

        // repeat the same process for the tail of the pair
        if (Array.isArray(dataObject[1])) {
            let cycleDetected = false;
            let mainStructure = null;
            let subStructure = null;
            cycleDetector.forEach((x) => {
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
                const newStartX = startX + (3 / 4) * DATA_UNIT_WIDTH;
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

                    arrowObjects.push(
                        initialiseArrowObject([
                            initialiseArrowNode(x0, y0),
                            initialiseArrowNode(x1, y1),
                            initialiseArrowNode(x2, y2),
                            initialiseArrowNode(x3, y3),
                        ])
                    );
                } else if (yCoord - 22 > newStartY) {
                    // arrow points down
                    // const boxEdgeCoord = inBoxCoordinates(newStartX, newStartY, xCoord, yCoord - DATA_UNIT_HEIGHT, false);
                    const x0 = newStartX,
                        y0 = newStartY,
                        x1 = xCoord,
                        y1 = yCoord - DATA_UNIT_HEIGHT;

                    arrowObjects.push(
                        initialiseArrowObject([
                            initialiseArrowNode(x0, y0),
                            initialiseArrowNode(x1, y1),
                        ])
                    );
                } else {
                    // arrow points up
                    // const boxEdgeCoord = inBoxCoordinates(newStartX, newStartY, xCoord, yCoord, false);
                    const x0 = newStartX,
                        y0 = newStartY,
                        x1 = xCoord,
                        y1 = yCoord;

                    arrowObjects.push(
                        initialiseArrowObject([
                            initialiseArrowNode(x0, y0),
                            initialiseArrowNode(x1, y1),
                        ])
                    );
                }
            } else {
                const result = drawThis(dataObject[1]);
                const draw = result.draw;
                if (draw) {
                    if (is_array(dataObject[1])) {
                        drawNestedArrayObject(
                            startX + DATA_UNIT_WIDTH + PAIR_SPACING,
                            startY
                        );
                    } else {
                        initialisePairObjects(
                            dataObject[1],
                            scene,
                            wrapper,
                            wrapperData[1],
                            startX + DATA_UNIT_WIDTH + PAIR_SPACING,
                            startY
                        );
                    }

                    arrowObjects.push(
                        initialiseArrowObject([
                            initialiseArrowNode(
                                startX + (3 * DATA_UNIT_WIDTH) / 4,
                                startY + DATA_UNIT_HEIGHT / 2
                            ),
                            initialiseArrowNode(
                                startX + DATA_UNIT_WIDTH + PAIR_SPACING,
                                startY + DATA_UNIT_HEIGHT / 2
                            ),
                        ])
                    );
                } else {
                    const coordinates = getShiftInfo(
                        result.mainStructure,
                        result.subStructure
                    );
                    const xCoord = coordinates.x;
                    const yCoord = coordinates.y;
                    const x0 = startX + (3 * DATA_UNIT_WIDTH) / 4,
                        y0 = startY + DATA_UNIT_HEIGHT / 2,
                        x1 = xCoord,
                        y1 = yCoord;

                    arrowObjects.push(
                        initialiseArrowObject([
                            initialiseArrowNode(x0, y0),
                            initialiseArrowNode(x1, y1),
                        ])
                    );
                }
            }
        } else if (dataObject[1] === null) {
            drawLine(
                context,
                startX + DATA_UNIT_WIDTH,
                startY,
                startX + DATA_UNIT_WIDTH / 2,
                startY + DATA_UNIT_HEIGHT
            );
        } else if (typeof wrapperData[1] === "function") {
            // draw arrow layer
            if (
                startX + (3 / 4) * DATA_UNIT_WIDTH <=
                wrapperData[1].x + 4 * FNOBJECT_RADIUS
            ) {
                const x0 = startX + (3 / 4) * DATA_UNIT_WIDTH,
                    y0 = startY + DATA_UNIT_HEIGHT / 2,
                    x1 = startX + (3 / 4) * DATA_UNIT_WIDTH,
                    y1 = wrapperData[1].y + 2 * FNOBJECT_RADIUS,
                    x2 = wrapperData[1].x + 4 * FNOBJECT_RADIUS,
                    y2 = wrapperData[1].y + 2 * FNOBJECT_RADIUS,
                    x3 = wrapperData[1].x + 4 * FNOBJECT_RADIUS,
                    y3 = wrapperData[1].y,
                    x4 = wrapperData[1].x + 2 * FNOBJECT_RADIUS,
                    y4 = wrapperData[1].y;

                arrowObjects.push(
                    initialiseArrowObject([
                        initialiseArrowNode(x0, y0),
                        initialiseArrowNode(x1, y1),
                        initialiseArrowNode(x2, y2),
                        initialiseArrowNode(x3, y3),
                        initialiseArrowNode(x4, y4),
                    ])
                );
            } else {
                const x0 = startX + (3 / 4) * DATA_UNIT_WIDTH,
                    y0 = startY + DATA_UNIT_HEIGHT / 2,
                    x1 = startX + (3 / 4) * DATA_UNIT_WIDTH,
                    y1 = wrapperData[1].y,
                    x2 = wrapperData[1].x + 2 * FNOBJECT_RADIUS,
                    y2 = wrapperData[1].y;

                arrowObjects.push(
                    initialiseArrowObject([
                        initialiseArrowNode(x0, y0),
                        initialiseArrowNode(x1, y1),
                        initialiseArrowNode(x2, y2),
                    ])
                );
            }
        } else {
            textObjects.push(
                initialiseTextObject(
                    dataObject[1],
                    startX + (2 * DATA_UNIT_WIDTH) / 3,
                    startY + (2 * DATA_UNIT_HEIGHT) / 3
                )
            );
        }

        // draws data in the head and tail
        if (Array.isArray(dataObject[0])) {
            let cycleDetected = false;
            let mainStructure = null;
            let subStructure = null;
            cycleDetector.forEach((x) => {
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

                    arrowObjects.push(
                        initialiseArrowObject([
                            initialiseArrowNode(x0, y0),
                            initialiseArrowNode(x1, y1),
                            initialiseArrowNode(x2, y2),
                            initialiseArrowNode(x3, y3),
                        ])
                    );
                } else if (yCoord - 22 > newStartY) {
                    // arrow points down
                    const x0 = newStartX,
                        y0 = newStartY,
                        x1 = xCoord,
                        y1 = yCoord - DATA_UNIT_HEIGHT;

                    arrowObjects.push(
                        initialiseArrowObject([
                            initialiseArrowNode(x0, y0),
                            initialiseArrowNode(x1, y1),
                        ])
                    );
                } else {
                    // arrow points up
                    const x0 = newStartX,
                        y0 = newStartY,
                        x1 = xCoord,
                        y1 = yCoord;

                    arrowObjects.push(
                        initialiseArrowObject([
                            initialiseArrowNode(x0, y0),
                            initialiseArrowNode(x1, y1),
                        ])
                    );
                }
            } else {
                const result = drawThis(dataObject[0]);
                const draw = result.draw;
                // check if need to draw the data object or it has already been drawn
                if (draw) {
                    let shiftY = callGetShiftInfo(dataObject[0]);

                    if (is_array(dataObject[0])) {
                        drawNestedArrayObject(startX, wrapper.y + shiftY);
                    } else {
                        initialisePairObjects(
                            dataObject[0],
                            scene,
                            wrapper,
                            wrapperData[0],
                            startX,
                            wrapper.y + shiftY
                        );
                    }

                    arrowObjects.push(
                        initialiseArrowObject([
                            initialiseArrowNode(
                                startX + DATA_UNIT_WIDTH / 4,
                                startY + DATA_UNIT_HEIGHT / 2
                            ),
                            initialiseArrowNode(
                                startX + DATA_UNIT_WIDTH / 4,
                                wrapper.y + shiftY - 2
                            ),
                        ])
                    );
                } else {
                    if (is_array(dataObject[0])) {
                        const coordinates = getShiftInfo(
                            result.mainStructure,
                            result.subStructure
                        );
                        const xCoord = coordinates.x - 10;
                        const yCoord = coordinates.y - 10;

                        const x0 = startX + DATA_UNIT_WIDTH / 4,
                            y0 = startY + DATA_UNIT_HEIGHT / 2,
                            x1 = xCoord,
                            y1 = yCoord;

                        arrowObjects.push(
                            initialiseArrowObject([
                                initialiseArrowNode(x0, y0),
                                initialiseArrowNode(x1, y1),
                            ])
                        );
                    } else {
                        const coordinates = getShiftInfo(
                            result.mainStructure,
                            result.subStructure
                        );
                        const xCoord = coordinates.x;
                        const yCoord = coordinates.y;

                        const x0 = startX + DATA_UNIT_WIDTH / 4,
                            y0 = startY + DATA_UNIT_HEIGHT / 2,
                            x1 = xCoord,
                            y1 = yCoord;

                        arrowObjects.push(
                            initialiseArrowObject([
                                initialiseArrowNode(x0, y0),
                                initialiseArrowNode(x1, y1),
                            ])
                        );
                    }
                }
            }
        } else if (dataObject[0] === null) {
            drawLine(
                context,
                startX + DATA_UNIT_WIDTH / 2,
                startY,
                startX,
                startY + DATA_UNIT_HEIGHT
            );
        } else if (typeof wrapperData[0] === "function") {
            // draw line up to fn height
            if (
                startX + DATA_UNIT_WIDTH / 4 <=
                wrapperData[0].x + 4 * FNOBJECT_RADIUS
            ) {
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

                arrowObjects.push(
                    initialiseArrowObject([
                        initialiseArrowNode(x0, y0),
                        initialiseArrowNode(x1, y1),
                        initialiseArrowNode(x2, y2),
                        initialiseArrowNode(x3, y3),
                        initialiseArrowNode(x4, y4),
                    ])
                );
            } else {
                const x0 = startX + DATA_UNIT_WIDTH / 4,
                    y0 = startY + DATA_UNIT_HEIGHT / 2,
                    x1 = startX + DATA_UNIT_WIDTH / 4,
                    y1 = wrapperData[0].y,
                    x2 = wrapperData[0].x + 2 * FNOBJECT_RADIUS,
                    y2 = wrapperData[0].y;

                arrowObjects.push(
                    initialiseArrowObject([
                        initialiseArrowNode(x0, y0),
                        initialiseArrowNode(x1, y1),
                        initialiseArrowNode(x2, y2),
                    ])
                );
            }
        } else {
            textObjects.push(
                initialiseTextObject(
                    dataObject[0],
                    startX + DATA_UNIT_WIDTH / 6,
                    startY + (2 * DATA_UNIT_HEIGHT) / 3
                )
            );
        }

        context.restore();
    }

    function drawHitPairs(dataObject, hit, wrapper, x0, y0) {
        // simplified version of drawScenePairs so that we can detect when hover over pair
        const context = hit.context;

        context.save();
        context.fillStyle = hit.getColorFromIndex(wrapper.key);
        context.fillRect(x0, y0, DATA_UNIT_WIDTH, DATA_UNIT_HEIGHT);
        // hitCycleDetector is used to prevent this function from entering an infinite loop
        // when data structures connect to themselves
        hitCycleDetector.push(dataObject);

        // not a perfect tracing over the original dataObject but good enough
        if (
            Array.isArray(dataObject[0]) &&
            drawnDataObjects.includes(dataObject[0]) &&
            !hitCycleDetector.includes(dataObject[0])
        ) {
            drawHitPairs(
                dataObject[0],
                hit,
                wrapper,
                x0,
                y0 + DATA_UNIT_HEIGHT + PAIR_SPACING
            );
        }

        if (
            Array.isArray(dataObject[1]) &&
            drawnDataObjects.includes(dataObject[1]) &&
            !hitCycleDetector.includes(dataObject[1])
        ) {
            drawHitPairs(
                dataObject[1],
                hit,
                wrapper,
                x0 + DATA_UNIT_WIDTH + PAIR_SPACING,
                y0
            );
        }
        context.restore();
    }

    function getDataObjectFromKey(key) {
        for (const d in dataObjects) {
            if (dataObjects[d].key === key) {
                return dataObjects[d];
            }
        }
    }

    // Current check to check if data structure is an array
    // Howeverm does not work with arrays of size 2
    function is_array(dataObject) {
        return Array.isArray(dataObject) ? dataObject.length !== 2 : false;
    }

    function getWrapperFromDataObject(dataObject) {
        return dataObjectWrappers[dataObjects.indexOf(dataObject)];
    }

    function initialiseDataObjectWrapper(objectName, objectData, parent) {
        const dataObjectWrapper = {
            key: dataObjectKey--,
            name: objectName,
            hovered: false,
            selected: false,
            layer: dataObjectLayer,
            color: WHITE,
            parent: parent,
            data: objectData,
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
            } else if (is_array(d1)) {
                return false;
            } else if (parentDataStructure.includes(d1)) {
                return false;
            } else {
                parentDataStructure.push(d1);
                return helper(d1[0], d2) || helper(d1[1], d2);
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
        return (
            getShiftInfo(callGetShiftInfoData, d2).y -
            (dataObjectWrappers[dataObjects.indexOf(callGetShiftInfoData)].y +
                (3 / 4) * DATA_UNIT_HEIGHT) -
            PAIR_SPACING
        );
    }

    function getShiftInfo(d1, d2) {
        // given that d2 is a sub structure of d1, return a coordinate object
        // to indicate the x and y coordinate with respect to d1
        const result = {
            x: dataObjectWrappers[dataObjects.indexOf(d1)].x,
            y:
                dataObjectWrappers[dataObjects.indexOf(d1)].y +
                (3 / 4) * DATA_UNIT_HEIGHT,
        };

        // If parent object is array, point to placeholder object rather than within object
        if (d1.length !== 2) {
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
                    result.y +=
                        (rightHeight + 1) * (DATA_UNIT_HEIGHT + PAIR_SPACING);
                    d1 = d1[0];
                } else {
                    result.x += DATA_UNIT_WIDTH + PAIR_SPACING;
                    d1 = d1[1];
                }
            } else {
                searchedPairs.push(d1);

                // Check the tail first
                // Increment x coordinate if found in tail, and y coordinate if found in head
                if (checkSubStructure(d1[1], d2)) {
                    d1 = d1[1];
                    result.x += DATA_UNIT_WIDTH + PAIR_SPACING;
                } else {
                    let rightHeight = getBasicUnitHeight(d1[1]);
                    result.y +=
                        (rightHeight + 1) * (DATA_UNIT_HEIGHT + PAIR_SPACING);
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
            subStructure: null,
        };
        for (const d in drawnDataObjects) {
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

    // since arrowObjects across data structures will now be drawn in the arrow Layer
    // need a function calculate the coordinates the small portion of the arrow from
    // center of box to edge of box
    function inBoxCoordinates(x0, y0, xf, yf, head) {
        const distX = Math.abs(x0 - xf);
        const distY = Math.abs(y0 - yf);
        const half_width =
            (xf > x0 && head) || (x0 >= xf && !head)
                ? (3 / 4) * DATA_UNIT_WIDTH
                : (1 / 4) * DATA_UNIT_WIDTH;
        const half_height = DATA_UNIT_HEIGHT / 2;
        // asume arrowObjects goes out from side of box instead of top
        let xFinal = xf > x0 ? x0 + half_width : x0 - half_width;
        let yFinal =
            yf < y0
                ? y0 - distY * (half_width / distX)
                : y0 + distY * (half_width / distX);
        if (yFinal < y0 - half_height) {
            // doesn't go out from side but rather from top
            yFinal = y0 - half_height;
            xFinal =
                xf > x0
                    ? x0 + distX * (half_height / distY)
                    : x0 - distX * (half_height / distY);
        } else if (yFinal > y0 + half_height) {
            // doesn't go out from side but rather from bottom
            yFinal = y0 + half_height;
            xFinal =
                xf > x0
                    ? x0 + distX * (half_height / distY)
                    : x0 - distX * (half_height / distY);
        }
        return { x: xFinal, y: yFinal };
    }

    function drawArrayObject(dataObject) {
        const wrapper = dataObjectWrappers[dataObjects.indexOf(dataObject)];

        drawNestedArrayObject(
            wrapper.x - DATA_OBJECT_SIDE,
            wrapper.y - DATA_UNIT_HEIGHT / 2
        );
    }

    function drawNestedArrayObject(xcoord, ycoord) {
        const scene = dataObjectLayer.scene,
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
        context.fillText("...", x0 + 50, y0 + DATA_UNIT_HEIGHT / 2);
        context.strokeStyle = NOBEL;
        context.lineWidth = 2;
        context.stroke();
    }

    // Text Helpers
    // --------------------------------------------------.
    function truncateString(c, str, maxWidth) {
        let width = c.measureText(str).width,
            ellipsis = "…",
            ellipsisWidth = c.measureText(ellipsis).width,
            result,
            truncated = false;
        str = "" + str;

        if (width <= maxWidth || width <= ellipsisWidth) {
            result = str;
        } else {
            let len = str.length;
            while (width >= maxWidth - ellipsisWidth && len-- > 0) {
                str = str.substring(0, len);
                width = c.measureText(str).width;
            }
            result = str + ellipsis;
            truncated = true;
        }

        return { result, truncated };
    }

    function initialiseTextObject(string, x, y, color = NOBEL) {
        const textObject = {
            key: textObjectKey,
            string,
            hovered: false,
            selected: false,
            layer: textObjectLayer,
            color,
            x,
            y,
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

    function initialiseArrowObject(nodes, color = NOBEL) {
        // TO-DO: consider adding layer here also
        const arrowObject = {
            key: arrowObjectKey,
            hovered: false,
            selected: false,
            color,
            nodes,
        };
        arrowObjectKey--;
        return arrowObject;
    }

    function initialiseArrowNode(x, y) {
        return { x, y };
    }

    /*
    | --------------------------------------------------------------------------
    | Export
    |--------------------------------------------------------------------------
    */

    function download_env() {
        viewport.scene.download({
            fileName: "environment-model.png",
        });
    }

    exports.EnvVisualizer = {
        draw_env: draw_env,
        init: function (parent) {
            container.hidden = false;
            parent.appendChild(container);
        },
        download_env: download_env,
    };

    setTimeout(() => { }, 1000);
})(window);
