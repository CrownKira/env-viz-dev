import { Layout } from '../Layout';
import { Visible } from '../types';
import { Dimension } from '../Dimension';
import { getTextWidth } from '../utils';
import { Text as KonvaText } from 'react-konva';

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
    this.height = fontSize;
    this.width = Math.max(
      Dimension.TextMinWidth,
      getTextWidth(str, `${fontStyle} ${fontSize}px ${fontFamily}`)
    );
  }

  draw(): React.ReactNode {
    return (
      <KonvaText
        key={Layout.key++}
        x={this.x}
        y={this.y}
        fontFamily={this.options.fontFamily}
        fontSize={this.options.fontSize}
        fontStyle={this.options.fontStyle}
        text={this.str}
        fill="white"
      />
    );
  }
}
