import { Value } from './Value';
import { Frame } from './Frame';

export class DataValue extends Value {
  constructor(
    key: number,
    height: number,
    width: number,
    x: number,
    y: number,
    public parentFrame: Frame | null // Fix later
  ) {
    super(key, height, width, x, y);
  }
}
