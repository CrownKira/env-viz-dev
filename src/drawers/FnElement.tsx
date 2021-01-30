import { Element } from './Element';

export class FnElement extends Element {
  constructor(
    key: number,
    height: number,
    width: number,
    x: number,
    y: number,
    public fnString: string
  ) {
    super(key, height, width, x, y);
  }
}
