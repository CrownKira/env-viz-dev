import { Element } from './Element';
import { Frame } from './Frame';

export class DataElement extends Element {
  constructor(
    key: number,
    height: number,
    width: number,
    x: number,
    y: number,
    public parentFrame: Frame
  ) {
    super(key, height, width, x, y);
  }
}
