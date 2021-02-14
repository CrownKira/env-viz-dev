import { Frame } from '../Frame';
import { Visible, Data } from '../../types';
import { Value } from './Value';
import { Text } from '../Text';
import { PrimitiveValue } from './value/PrimitiveValue';
import { ArrayValue } from './value/ArrayValue';
import { Dimension } from '../../Dimension';
import { Layout } from '../../Layout';

/** a `binding` is a key-value pair in a frame */
export class Binding implements Visible {
  /** the text to render */
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly name: Text;
  readonly value: Value;
  // readonly isInFrame: boolean;

  constructor(
    /** the key of this binding */
    readonly key: string, /// the name!
    /** the value of this binding */
    readonly data: Data,
    /** frame this binding is in */
    readonly frame: Frame,
    readonly prevBinding: Binding | null
  ) {
    if (prevBinding) {
      this.x = prevBinding.x;
      this.y = prevBinding.y + prevBinding.height + Dimension.TextPaddingY;
    } else {
      this.x = frame.x + Dimension.FramePaddingX;
      this.y = frame.y + Dimension.FramePaddingY;
    }
    this.name = new Text(key, this.x, this.y);

    this.value = Layout.createValue(data, frame, this);
    // value.referencedBy.push(this);
    // this.value = value;

    this.width = this.value.x + this.value.width - this.x;
    this.height = Math.max(this.name.height, this.value.height);

    // this.value.x = this.x;
    // this.value.y = this.y;
    // this.isInFrame = value instanceof PrimitiveValue;
  }

  // private setValueDimension():void {
  //   this.value.x = this.x;
  //   this.value.y = this.y;
  // }

  draw() {
    return <></>;
  }
}
