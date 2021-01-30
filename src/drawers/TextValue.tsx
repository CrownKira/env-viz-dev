import { Value } from './Value';

export class TextValue extends Value {
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
