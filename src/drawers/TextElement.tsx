import { Element } from './Element';

export class TextElement extends Element {
  constructor(
    key: number,
    height: number,
    width: number,
    x: number,
    y: number,
    public text: string,
    public maxWidth: number
  ) {
    super(key, height, width, x, y);
  }
}
