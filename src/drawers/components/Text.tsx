import { Layout } from '../Layout';
import { Visible } from '../types';
import { Dimension } from '../Dimension';
import { getTextWidth } from '../utils';
import { Rect } from 'react-konva';

interface Options {
  maxWidth?: number;
  fontFamily?: string;
  fontSize?: number;
  fontStyle?: string;
  fontVariant?: string;
}

/** this class encapsulates a string to be drawn onto the canvas */
export class Text implements Visible {
  readonly height: number;
  readonly width: number;
  readonly fontFamily: string = Dimension.FontFamily;
  readonly fontSize: number = Dimension.FontSize;
  readonly fontStyle: string = Dimension.FontStyle;
  readonly fontVariant: string = Dimension.FontVariant;
  readonly lineHeight: number = 1;
  readonly options: Options;

  constructor(
    readonly str: string,
    readonly x: number,
    readonly y: number,
    {
      /** maximum width this text should be. to be calculated by its parent */
      maxWidth = Number.MAX_VALUE,
      fontFamily = Dimension.FontFamily,
      fontSize = Dimension.FontSize,
      fontStyle = Dimension.FontStyle,
      fontVariant = Dimension.FontVariant
    }: Options = {}
  ) {
    this.options = { maxWidth, fontFamily, fontSize, fontStyle, fontVariant };
    this.height = this.fontSize;
    this.width = Math.max(
      Dimension.TextMinWidth,
      getTextWidth(str, `${fontStyle} ${fontSize}px ${fontFamily}`)
    );
  }

  draw(): React.ReactNode {
    return (
      <Rect
        key={Layout.key++}
        x={this.x}
        y={this.y}
        width={this.width}
        height={this.height}
        fill="pink"
      />
    );
  }
}
