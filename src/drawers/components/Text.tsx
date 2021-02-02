import { Visible } from '../types';

/** this class encapsulates a string to be drawn onto the canvas */
export class Text implements Visible {
  readonly height: number;
  readonly width: number;

  constructor(
    readonly str: String,
    readonly x: number,
    readonly y: number,
    /** maximum width this text should be. to be calculated by its parent */
    readonly maxWidth: number = 0
  ) {
    // calculate height and width
    this.height = 0; // prob something to do with font size
    this.width = 0; // max(width of text, maxWidth)
  }

  draw() {
    return <></>;
  }
}
