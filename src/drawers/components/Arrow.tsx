import { Visible } from '../types';

/** this class encapsulates an arrow to be drawn between 2 points */
export class Arrow implements Visible {
  readonly x: number;
  readonly y: number;
  readonly height: number;
  readonly width: number;

  constructor(readonly from: Visible, readonly to: Visible) {
    this.x = from.x;
    this.y = from.y;
    this.width = Math.abs(to.x - from.x);
    this.height = Math.abs(to.y - from.y);
  }

  draw() {
    return <></>;
  }
}
