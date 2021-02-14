import { Visible, Env } from '../types';
import { Binding } from './binding/Binding';
import { Dimension } from '../Dimension';
import { Level } from './Level';
import { isPrimitiveData, getTextWidth } from '../utils';

/** this class encapsulates a frame of key-value bindings to be drawn on canvas */
export class Frame implements Visible {
  readonly x: number;
  readonly y: number;
  readonly height: number;
  readonly width: number;
  readonly totalWidth: number;
  /** the bindings this frame contains */
  readonly bindings: Binding[] = [];
  /** name of this frame to display */
  readonly name: string;

  constructor(
    /** environment associated with this frame */
    readonly environment: Env,
    /** the parent/enclosing frame of this frame (the frame above it) */
    readonly parentFrame: Frame | null,
    /** the frame to the left of this frame, on the same level. used for calculating this frame's position */
    readonly leftSiblingFrame: Frame | null,
    readonly level: Level
  ) {
    this.x = this.level.x;
    leftSiblingFrame &&
      (this.x += leftSiblingFrame.x + leftSiblingFrame.totalWidth + Dimension.FrameMarginX);
    this.y = this.level.y;

    let maxBindingWidth = 0;
    for (let [key, data] of Object.entries(environment.head)) {
      const bindingWidth =
        getTextWidth(String(key)) +
        Dimension.TextPaddingX +
        (isPrimitiveData(data) ? getTextWidth(String(data)) : 0);
      maxBindingWidth = Math.max(maxBindingWidth, bindingWidth);
    }
    this.width = maxBindingWidth + Dimension.FramePaddingX * 2;

    // initializes bindings
    let prevBinding: Binding | null = null;
    let totalWidth = this.width;
    for (let [key, data] of Object.entries(environment.head)) {
      const currBinding: Binding = new Binding(String(key), data, this, prevBinding);
      this.bindings.push(currBinding);
      totalWidth = Math.max(totalWidth, currBinding.width + Dimension.FramePaddingX);
      prevBinding = currBinding;
    }
    this.totalWidth = totalWidth;

    // prob depends on how many bindings this frame has
    this.height = prevBinding
      ? prevBinding.y + prevBinding.height + Dimension.FramePaddingY - this.y
      : Dimension.FramePaddingY * 2;

    // just copy the env name for now
    this.name = environment.name;
  }

  draw() {
    return <></>;
  }
}
