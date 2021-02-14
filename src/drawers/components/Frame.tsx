import { Layout } from '../Layout';
import { Data, Visible, Env } from '../types';
import { Binding } from './binding/Binding';
import { Value } from './binding/Value';
import { ArrayValue } from './binding/value/ArrayValue';
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
    let maxBindingWidth = 0;
    for (let [key, data] of Object.entries(environment.head)) {
      const bindingWidth =
        getTextWidth(String(key)) +
        Dimension.TextPaddingX +
        (isPrimitiveData(data) ? getTextWidth(String(data)) : 0);
      // if (bindingWidth > maxBindingWidth) maxBindingWidth = bindingWidth;
      maxBindingWidth = Math.max(maxBindingWidth, bindingWidth); /// or use if
    }
    this.width = maxBindingWidth + Dimension.FramePaddingX * 2;

    // initializes bindings
    let prevBinding: Binding | null = null;
    let totalWidth = this.width;
    for (let [key, data] of Object.entries(environment.head)) {
      // const value = Layout.createValue(data as Data, prevValue, this);
      // if (value instanceof ArrayValue) value.init();
      // const currBinding: Binding = new Binding(String(key), value, this, prevBinding);

      const currBinding: Binding = new Binding(String(key), data, this, prevBinding);
      this.bindings.push(currBinding);
      totalWidth = Math.max(totalWidth, currBinding.width + Dimension.FramePaddingX);
      prevBinding = currBinding;
    }
    this.totalWidth = totalWidth;

    // prob depends on how many bindings this frame has
    this.height = prevBinding
      ? prevBinding.y + prevBinding.height + Dimension.FramePaddingY
      : Dimension.FramePaddingY * 2;

    // just copy the env name for now
    this.name = environment.name;

    // const width = Dimension.TextPaddingX*2;
    // this.bindings.forEach(b=>{
    //   const bindingWidth =
    // });

    // this.width = 0;

    // this.x = leftSiblingFrame ? leftSiblingFrame.x + this.width + 0 : 0;
    // this.y = 0;
    this.x = this.level.x;
    leftSiblingFrame &&
      (this.x += leftSiblingFrame.x + leftSiblingFrame.totalWidth + Dimension.FrameMarginX);
    this.y = this.level.y;
  }

  draw() {
    return <></>;
  }
}
