## Overview

This tool generates drawings of the environment model of a program at a particular point in its execution. The model aims to follow as closely as possible the structure [defined in the official module textbook](https://source-academy.github.io/sicp/chapters/3.2.html).

To generate the model, select a breakpoint in the gutter on the left, then run the program. Click the "Env Visualizer" button to switch to the environment model tab and view the model.

Function objects can be hovered over to view their associated parameters and function body. 
Data structures such as arrays and pairs are visualised using the box-and-pointer-notation. Each compound object is shown as a pointer to a box. 
The box for a pair has two parts, the left containing the head and the right containing the tail.
The box for an array comprises multiple parts, each representing the corresponding index in the array. 
Arrows linking different data structures can be hovered over to see clearly where they point to.

## Technical Details

The visualiser works closely with JS Slang. Whenever the interpreter meets a breakpoint, the current program context is sent to both the debugger and the visualiser. The visualizer receives the context in the form of an `EnvTree`, which represents all of the frames created in the program's execution. Each node in the tree represents a frame, which in turn is a table of bindings (as defined in the textbook). The parent pointer of each node is hence a pointer to its enclosing environment. The tree is rooted at the node representing the global function bindings.

The visualizer depends on [`KonvaJS`](https://konvajs.org/) and its corresponding `React` bindings from [`react-konva`](https://konvajs.org/docs/react/index.html). The feature resides under `src/features/envVisualizer` and is exposed via [`EnvVisualizer.tsx`](https://github.com/source-academy/cadet-frontend/blob/master/src/features/envVisualizer/EnvVisualizer.tsx) in that directory.

We make use of Typescript and try to follow OOP concepts with JS ES6 classes. Drawing logic and dimension calculations etc pertaining to a certain type of value (array, for example) are encapsulated within their own class files. Overall, this has led to better correctness, extensibility, maintainability, and collaboration (its predecessor was a single file with ~3K LoC).

For a rough outline, we have a `Layout` class that encapsulates the canvas and calculations. The [`Layout`](https://github.com/source-academy/cadet-frontend/blob/master/src/features/envVisualizer/EnvVisualizerLayout.tsx) contains an array of [`Level`](https://github.com/source-academy/cadet-frontend/blob/master/src/features/envVisualizer/components/Level.tsx)s, where the `Level`s each contain an array of [`Frame`](https://github.com/source-academy/cadet-frontend/blob/master/src/features/envVisualizer/components/Frame.tsx)s. A `Frame` has [`Binding`](https://github.com/source-academy/cadet-frontend/blob/master/src/features/envVisualizer/components/Binding.tsx)s, which consists of a key (string) and the associated data. The data can be of any type: functions, arrays, pairs, etc. Hence, we have [wrapper classes](https://github.com/source-academy/cadet-frontend/tree/master/src/features/envVisualizer/components/values) for each of these types, encapsulating the logic for dimension calculations and drawing for that specific type.

These calculations (how wide and high, what coordinates to place) are done mostly in the constructor. Hence, the order of initialising the objects is important, as there are dependencies such as "I want to place myself slightly to the right of my left sibling" and "my height is determined by the sum of heights of my children" etc.

After the objects are initialised and the dimensions/coordinates are calculated, `Layout.draw()` is invoked, which in turns triggers a cascade of `draw()` invocations in its children and their children etc.

## Limitations

- **Testing**: While there is snapshot testing implemented currently, it may not be very comprehensive and complete. It may be possible for wrong/broken layouts to pass the tests. By nature, testing of this tool may ultimately require visual inspection. It is not clear how to programmatically verify the visual 'correctness'.
- **Arrows**: The current implementation of arrows has room for improvement. Due to the various possible types and arrangements of where the arrow is pointing `from` and `to`, it is not trivial to devise a generic way/algorithm to handle all these cases. Furthermore, in complicated visualizations, numerous overlapping arrows/lines make it hard to discern which belongs to which. There may very well be cases where the arrow may end up looking 'funky' or weird. With that being said, it should still point `from` and `to` the correct targets.
- **Garbage Collected Functions**: Over the course of the program's execution, many functions may be created. However, it may so happen that they are no longer referenced in later parts of the program, following which they will be garbage collected. Our tool will hence be unable to visualize such functions.
- **Large Canvas Scrolling**: Our current implementation is slow at handling large canvas such as the environment model of a metacircular evaluator. A possible way to optimise this is to emulate the scrollbars using canvas, to render only the visible portion of the environment model at a time.  To get started, you may want to refer to [Large Canvas Scrolling Demo using Konva](https://konvajs.org/docs/sandbox/Canvas_Scrolling.html).


## Testing

Snapshot testing is implemented [here](https://github.com/source-academy/cadet-frontend/blob/master/src/features/envVisualizer/__tests__/EnvVisualizer.tsx). It executes some previously problematic or tricky code samples and calculates the layout. It then checks that the general structure of the layout and data in the frames is correct. However, it may be worth noting that this may not be a fully comprehensive test. It aims to prevent glaring errors but subtly wrong visualizations may still pass.

For a more comprehensive test, a manual visual inspection may still be required. We have amassed a collection of code samples to test against.

## Future Improvements

* ~Solve the limitation of not being able to show all historically created frames as mentioned above (will need changes to `js-slang`)~ _done by SA2122_
* ~Visualisation of arrays~ _done by SA2122_
* ~Representation of functions belonging to the global frame (e.g. const x = pair) should be implemented~ _done by SA2122_
* ~Improve text formatting in data structures (eliminate the problem of long text being cut off)~ _done by SA2122_
* ~Allow arrows to be hovered over individually instead of all at once (this involves coding each arrow as its own object with its own properties)~ _done by SA2122_
* Toggle between 'show all frames created' and 'show current frames only'
* Store previous visualizations and add buttons to go back and forth
* Show array indexes
* Downloading visualizations
* Arrows (see above)
* Testing (see above)
* Large Canvas Scrolling (see above) 
* Garbage Collected Functions (see above) - this should be toggle-able, as no GC may mean performance issues for programs that heavily use TCO for example
