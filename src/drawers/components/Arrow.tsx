import { Arrow as KonvaArrow } from 'react-konva';
import { Dimension } from '../Dimension';
import { Visible } from '../types';
import { ArrayUnit } from './binding/value/ArrayUnit';
import { ArrayValue } from './binding/value/ArrayValue';
import { FnValue } from './binding/value/FnValue';
import { Text } from './Text';

/** this class encapsulates an arrow to be drawn between 2 points */
export class Arrow implements Visible {
  readonly x: number;
  readonly y: number;
  readonly height: number;
  readonly width: number;
  readonly points: number[];

  constructor(readonly from: Visible, readonly to: Visible) {
    this.x = from.x;
    this.y = from.y;

    if (from instanceof Text) {
      this.points = [from.x + from.width, from.y + from.height / 2];
      if (to instanceof ArrayValue) {
        this.points.push(to.x, to.y + Dimension.DataUnitHeight / 2);
      } else {
        this.points.push(to.x, to.y);
      }
    } else if (from instanceof ArrayUnit) {
      this.points = [from.x + Dimension.DataUnitWidth / 2, from.y + Dimension.DataUnitHeight / 2];
      if (to instanceof FnValue) {
        if (from.x < to.x) {
          this.points.push(to.x, to.y);
        } else {
          this.points.push(to.centreX, to.y);
        }
      } else if (to instanceof ArrayValue) {
        if (from.y === to.y && Math.abs(from.x - to.x) > Dimension.DataUnitWidth * 2) {
          this.points.push(
            from.x + Dimension.DataUnitWidth / 2,
            from.y - Dimension.DataUnitHeight / 2,
            to.x + Dimension.DataUnitWidth / 2,
            to.y - Dimension.DataUnitHeight / 2,
            to.x + Dimension.DataUnitWidth / 2,
            to.y
          );
        } else if (from.y < to.y) {
          this.points.push(to.x + Dimension.DataUnitWidth / 2, to.y);
        } else {
          this.points.push(to.x, to.y + Dimension.DataUnitHeight / 2);
        }
      } else {
        this.points.push(to.x, to.y);
      }
    } else {
      this.points = [from.x, from.y, to.x, to.y];
    }

    this.width = Math.abs(to.x - from.x);
    this.height = Math.abs(to.y - from.y);
  }

  draw(): React.ReactNode {
    return <KonvaArrow points={this.points} fill="red" stroke="black" />;
  }
}
