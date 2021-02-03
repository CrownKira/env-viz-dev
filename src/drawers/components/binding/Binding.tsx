import { Frame } from '../Frame';
import { Drawable } from '../../types';
import { Value } from './Value';

/** a `binding` is a key-value pair in a frame */
export class Binding implements Drawable {
  /** the text to render */
  readonly text: Text;

  constructor(
    /** the key of this binding */
    readonly key: string,
    /** the value of this binding */
    readonly value: Value,
    /** frame this binding is in */
    readonly frame: Frame
  ) {
    value.referencedBy.push(this);
    this.text = new Text(key);
  }

  draw() {
    return <></>;
  }
}
