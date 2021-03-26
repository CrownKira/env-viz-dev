import React from 'react';
import { Rect } from 'react-konva';
import { Context } from 'js-slang';
import {
  isArray,
  isEmptyEnvironment,
  isFn,
  isFunction,
  isGlobalFn,
  isPrimitiveData
} from './utils';
import { Data, ReferenceType, _EnvTreeNode, _EnvTree } from './types';
import { Level } from './components/Level';
import { ArrayValue } from './components/binding/value/ArrayValue';
import { FnValue } from './components/binding/value/FnValue';
import { GlobalFnValue } from './components/binding/value/GlobalFnValue';
import { PrimitiveValue } from './components/binding/value/PrimitiveValue';
import { Value } from './components/binding/Value';
import { Config } from './Config';
import { Stage, Layer } from 'react-konva';
import { Frame } from 'js-slang/dist/types';

/** this class encapsulates the logic for calculating the layout */
export class Layout {
  /** the height of the stage */
  static height: number;
  /** the width of the stage */
  static width: number;
  /** the environment tree */
  static environmentTree: _EnvTree;
  /** the global environment */
  static globalEnvNode: _EnvTreeNode;
  /** array of levels, which themselves are arrays of frames */
  static levels: Level[];
  /** the Value objects in this layout. note that this corresponds to the data array,
   * that is, `value[i]` has underlying data `data[i]` */
  static values: Value[];
  /** the data in this layout (primitives, arrays, functions, etc). note that this corresponds
   * to the value array, that is, `data[i]` has corresponding Value object `value[i]` */
  static data: Data[];
  /** the unique key assigned to each node */
  static key: number = 0;
  /** memoized layout */
  static prevLayout: React.ReactNode;

  /** processes the runtime context from JS Slang */
  static setContext(context: Context) {
    // clear/initialize data and value arrays
    Layout.data = [];
    Layout.values = [];
    Layout.levels = [];
    Layout.key = 0;
    Layout.environmentTree = context.runtime.environmentTree as _EnvTree;
    Layout.globalEnvNode = Layout.environmentTree.root;

    // remove program environment and merge bindings into global env
    Layout.removeProgramEnv();
    // remove global functions that are not referenced in the program
    Layout.removeUnreferencedGlobalFns();
    // initialize levels and frames
    Layout.initializeLevels();

    // calculate height and width by considering lowest and widest level
    const lastLevel = Layout.levels[Layout.levels.length - 1];
    Layout.height = Math.max(
      Config.CanvasMinHeight,
      lastLevel.y + lastLevel.height + Config.CanvasPaddingY
    );
    Layout.width = Math.max(
      Config.CanvasMinWidth,
      Layout.levels.reduce<number>((maxWidth, level) => Math.max(maxWidth, level.width), 0) +
        Config.CanvasPaddingX * 2
    );
  }

  /** remove program environment containing predefined functions */
  private static removeProgramEnv() {
    if (!Layout.globalEnvNode.children) return;

    const programEnvNode = Layout.globalEnvNode.children[0];
    const globalEnvNode = Layout.globalEnvNode;

    // merge programEnvNode bindings into globalEnvNode
    globalEnvNode.environment.head = {
      ...programEnvNode.environment.head,
      ...globalEnvNode.environment.head
    };

    // update globalEnvNode children
    if (programEnvNode.children) globalEnvNode.resetChildren(programEnvNode.children);

    // go through new bindings and update functions to be global functions
    // by removing extra props such as functionName
    for (let [, value] of Object.entries(globalEnvNode.environment.head)) {
      if (isFn(value)) {
        // HACKY: TS doesn't allow us to delete functionName from value
        // as it breaks the FnTypes contract (that is value, being of type FnTypes,
        // must have functionName prop) so we cast it
        delete (value as { functionName?: string }).functionName;
      }
    }
  }

  /** remove any global functions not referenced elsewhere in the program */
  private static removeUnreferencedGlobalFns() {
    const referencedGlobalFns: (() => any)[] = [];
    const findGlobalFnReferences = (env: _EnvTreeNode) => {
      for (let [, data] of Object.entries(env.environment.head)) {
        if (isGlobalFn(data)) referencedGlobalFns.push(data);
      }
      if (env.children) env.children.forEach(findGlobalFnReferences);
    };

    if (Layout.globalEnvNode.children) {
      Layout.globalEnvNode.children.forEach(findGlobalFnReferences);
    }

    const newFrame: Frame = {};
    for (let [key, data] of Object.entries(Layout.globalEnvNode.environment.head)) {
      if (referencedGlobalFns.includes(data)) {
        newFrame[key] = data;
      }
    }

    Layout.globalEnvNode.environment.head = { [Config.GlobalFrameDefaultText]: '...', ...newFrame };
  }

  /** initializes levels */
  private static initializeLevels() {
    const getNextChildren = (c: _EnvTreeNode): _EnvTreeNode[] => {
      if (isEmptyEnvironment(c.environment)) {
        let nextChildren: _EnvTreeNode[] = [];
        c.children.forEach(gc => {
          nextChildren.push(...getNextChildren(gc as _EnvTreeNode));
        });
        return nextChildren;
      } else {
        return [c];
      }
    };
    let frontier: _EnvTreeNode[] = [Layout.globalEnvNode];
    let prevLevel: Level | null = null;
    while (frontier.length > 0) {
      const currLevel: Level = new Level(prevLevel, frontier);
      this.levels.push(currLevel);
      const nextFrontier: _EnvTreeNode[] = [];
      frontier.forEach(e => {
        e.children.forEach(c => {
          const nextChildren = getNextChildren(c as _EnvTreeNode);
          nextChildren.forEach(c => (c.parent = e));
          nextFrontier.push(...nextChildren);
        });
      });
      prevLevel = currLevel;
      frontier = nextFrontier;
    }
  }

  /** memoize `Value` (used to detect cyclic references in non-primitive `Value`) */
  static memoizeValue(value: Value) {
    Layout.data.push(value.data);
    Layout.values.push(value);
  }

  /** create an instance of the corresponding `Value` if it doesn't already exists,
   *  else, return the existing value */
  static createValue(data: Data, reference: ReferenceType): Value {
    // primitives don't have to be memoized
    if (isPrimitiveData(data)) {
      return new PrimitiveValue(data, [reference]);
    } else {
      // try to find if this value is already created
      const idx = Layout.data.findIndex(d => d === data);
      if (idx !== -1) {
        const existingValue = Layout.values[idx];
        existingValue.addReference(reference);
        return existingValue;
      }

      // else create a new one
      let newValue: Value = new PrimitiveValue(null, [reference]);
      if (isArray(data)) {
        newValue = new ArrayValue(data, [reference]);
      } else if (isFunction(data)) {
        if (isFn(data)) {
          // normal JS Slang function
          newValue = new FnValue(data, [reference]);
        } else {
          // function from the global env (has no extra props such as env, fnName)
          newValue = new GlobalFnValue(data, [reference]);
        }
      }

      return newValue;
    }
  }

  static draw(): React.ReactNode {
    if (Layout.key !== 0) {
      return Layout.prevLayout;
    } else {
      const layout = (
        <Stage width={Layout.width} height={Layout.height} container={'stage'}>
          <Layer>
            <Rect
              x={0}
              y={0}
              width={Layout.width}
              height={Layout.height}
              fill={Config.SA_BLUE.toString()}
              key={Layout.key++}
              listening={false}
            />
            {Layout.levels.map(level => level.draw())}
          </Layer>
        </Stage>
      );
      Layout.prevLayout = layout;
      return layout;
    }
  }
}
