import { Layout } from '../../Layout';
import { Frame } from '../Frame';
import { Visible, Data } from '../../types';
import { Value } from './Value';
import { Text } from '../Text';
import { Dimension } from '../../Dimension';

/** a `binding` is a key-value pair in a frame */
export class Binding implements Visible {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  /** name */
  readonly name: Text;
  /** value */
  readonly value: Value;

  constructor(
    /** the key of this binding */
    readonly key: string,
    /** the value of this binding */
    readonly data: Data,
    /** frame this binding is in */
    readonly frame: Frame,
    /** previous binding (the binding above it) */
    readonly prevBinding: Binding | null
  ) {
    // derive the coordinates from the binding above it
    if (prevBinding) {
      this.x = prevBinding.x;
      this.y = prevBinding.y + prevBinding.height + Dimension.TextPaddingY;
    } else {
      this.x = frame.x + Dimension.FramePaddingX;
      this.y = frame.y + Dimension.FramePaddingY;
    }

    this.name = new Text(key + ': ', this.x, this.y);
    this.value = Layout.createValue(data, this);

    // derive the width from the right bound of the value
    this.width = this.value.x + this.value.width - this.x;
    this.height = Math.max(this.name.height, this.value.height);
  }

  draw(): React.ReactNode {
    return (
      <>
        {this.name.draw()}
        {this.value.draw()}
      </>
    );
  }
}
