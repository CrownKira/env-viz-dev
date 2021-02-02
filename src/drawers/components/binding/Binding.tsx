import { Frame } from '../Frame';
import { Drawable, ValueTypes } from '../../types';
import { Key } from './Key';
import { Value } from './Value';
import { createValue } from '../../utils';

/** a `binding` is a key-value pair that exists in a frame */
export class Binding implements Drawable {
  readonly key: Key;
  readonly value: Value;

  constructor(
    /** the string that represents the key of this binding */
    keyStr: string,
    /** the underlying data of the value of this binding */
    data: ValueTypes,
    /** frame this binding is in */
    readonly frame: Frame
  ) {
    this.key = new Key(keyStr, this);
    this.value = createValue(data, this);
  }

  draw() {
    return <></>;
  }
}
