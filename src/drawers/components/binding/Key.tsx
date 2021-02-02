import { Drawable } from '../../types';
import { Text } from '../Text';
import { Binding } from './Binding';

/** the key of a binding in a frame */
export class Key implements Drawable {
  /** the text to draw */
  readonly text: Text;

  constructor(
    /** the string of this key */
    readonly str: string,
    /** the binding this key is part of */
    readonly binding: Binding
  ) {
    this.text = new Text(str, binding.frame.x, binding.frame.y);
  }

  draw() {
    return <></>;
  }
}
