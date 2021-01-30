import { Value } from './Value';

export class FnValue extends Value {
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
