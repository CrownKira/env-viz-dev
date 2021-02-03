import { Layout } from '../Layout';
import { Data, Visible, Env } from '../types';
import { Binding } from './binding/Binding';
import { Value } from './binding/Value';
import { ArrayValue } from './binding/value/ArrayValue';
import { PairValue } from './binding/value/PairValue';

/** this class encapsulates a frame of key-value bindings to be drawn on canvas */
export class Frame implements Visible {
  readonly x: number;
  readonly y: number;
  readonly height: number;
  readonly width: number;
  /** the bindings this frame contains */
  readonly bindings: Binding[];
  /** name of this frame to display */
  readonly name: string;

  constructor(
    /** environment associated with this frame */
    readonly environment: Env,
    /** the parent/enclosing frame of this frame (the frame above it) */
    readonly parentFrame: Frame | null,
    /** the frame to the left of this frame, on the same level. used for calculating this frame's position */
    readonly leftSiblingFrame: Frame | null
  ) {
    // initializes bindings
    this.bindings = [];
    for (let [key, data] of Object.entries(environment.head)) {
      const value = Layout.createValue(data as Data);
      if (value instanceof ArrayValue || value instanceof PairValue) value.init();
      this.bindings.push(new Binding(String(key), value, this));
    }

    // just copy the env name for now
    this.name = environment.name;

    // prob depends on how many bindings this frame has
    this.height = 0;
    this.width = 0;

    this.x = leftSiblingFrame ? leftSiblingFrame.x + this.width + 0 : 0;
    this.y = 0;
  }

  draw() {
    return <></>;
  }
}
