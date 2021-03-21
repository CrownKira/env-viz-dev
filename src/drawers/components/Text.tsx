import { Text as KonvaText } from 'react-konva';
import { Layout } from '../Layout';
import { Visible } from '../types';
import { Config } from '../Config';
import { getTextWidth } from '../utils';

interface Options {
  maxWidth: number;
  fontFamily: string;
  fontSize: number;
  fontStyle: string;
  fontVariant: string;
}

const defaultOptions: Options = {
  maxWidth: Number.MAX_VALUE, // maximum width this text should be
  fontFamily: Config.FontFamily.toString(), // default is Arial
  fontSize: Number(Config.FontSize), // in pixels. Default is 12
  fontStyle: Config.FontStyle.toString(), // can be normal, bold, or italic. Default is normal
  fontVariant: Config.FontVariant.toString() // can be normal or small-caps. Default is normal
};

/** this class encapsulates a string to be drawn onto the canvas */
export class Text implements Visible {
  readonly height: number;
  readonly width: number;
  readonly options: Options = defaultOptions;

  constructor(
    /** text */
    readonly str: string,
    readonly x: number,
    readonly y: number,
    /** additional options (for customization of text) */
    options: Partial<Options> = {}
  ) {
    this.options = { ...this.options, ...options };
    const { fontSize, fontStyle, fontFamily } = this.options;
    this.height = fontSize;
    this.width = Math.max(
      Config.TextMinWidth,
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
        fill={Config.SA_WHITE.toString()}
      />
    );
  }
}