import { Visible } from '../types';
import { Dimension } from '../Dimension';
import { getTextWidth } from '../utils';

/** this class encapsulates a string to be drawn onto the canvas */
export class Text implements Visible {
  readonly height: number; /// the height of text
  readonly width: number; /// the width of text
  readonly fontFamily: string = Dimension.FontFamily;
  readonly fontSize: number = Dimension.FontSize;
  readonly fontStyle: string = Dimension.FontStyle;
  readonly fontVariant: string = Dimension.FontVariant;
  readonly lineHeight: number = 1;

  constructor(
    readonly str: string,
    readonly x: number,
    readonly y: number,
    /** maximum width this text should be. to be calculated by its parent */
    readonly maxWidth: number = Number.MAX_VALUE ///max width of the text, visible to user
  ) {
    // calculate height and width
    this.height = this.fontSize; // prob something to do with font size
    this.width = getTextWidth(str); // max(width of text, maxWidth)
  }

  draw() {
    return <></>;
  }
}
