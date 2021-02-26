import { Arrow as KonvaArrow } from 'react-konva';
import { Dimension } from '../Dimension';
import { Layout } from '../Layout';
import { Visible } from '../types';
import { ArrayUnit } from './binding/value/ArrayUnit';
import { ArrayValue } from './binding/value/ArrayValue';
import { FnValue } from './binding/value/FnValue';
import { GlobalFnValue } from './binding/value/GlobalFnValue';
import { Frame } from './Frame';
import { Text } from './Text';

/** this class encapsulates an arrow to be drawn between 2 points */
export class Arrow implements Visible {
  readonly x: number;
  readonly y: number;
  readonly height: number;
  readonly width: number;
  readonly points: number[];
  readonly dashEnabled: boolean = false;

  constructor(readonly from: Visible, readonly to: Visible) {
    this.x = from.x;
    this.y = from.y;

    if (from instanceof Frame) {
      this.points = [
        from.x + Dimension.FramePaddingX,
        from.y,
        to.x + Dimension.FramePaddingX,
        to.y + to.height
      ];
    } else if (from instanceof FnValue || from instanceof GlobalFnValue) {
      if (to.y < from.y && from.y < to.y + to.height) {
        this.points = [
          from.x + Dimension.FnRadius * 3,
          from.y,
          from.x + Dimension.FnRadius * 3,
          from.y - Dimension.FnRadius * 2,
          to.x + to.width,
          from.y - Dimension.FnRadius * 2
        ];
      } else if (to.y < from.y) {
        this.points = [
          from.x + Dimension.FnRadius * 3,
          from.y,
          to.x + to.width / 2,
          to.y + to.height
        ];
      } else {
        this.points = [from.x + Dimension.FnRadius * 3, from.y, to.x + to.width / 2, to.y];
      }
    } else if (from instanceof Text) {
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
          this.points.push(to.centerX, to.y);
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
        } else if (from.y > to.y) {
          this.points.push(to.x + Dimension.DataUnitWidth / 2, to.y + Dimension.DataUnitHeight);
        } else {
          this.points.push(to.x, to.y + Dimension.DataUnitHeight / 2);
        }
      } else {
        this.points.push(to.x, to.y);
      }
    } else {
      this.points = [from.x, from.y, to.x, to.y];
    }

    if (
      this.points.length === 4 &&
      this.points[0] !== this.points[2] &&
      this.points[1] !== this.points[3]
    ) {
      this.dashEnabled = true;
    }

    this.width = Math.abs(to.x - from.x);
    this.height = Math.abs(to.y - from.y);
  }

  draw(): React.ReactNode {
    return (
      <KonvaArrow
        points={this.points}
        dash={[10, 5]}
        dashEnabled={this.dashEnabled}
        fill={Dimension.SA_WHITE.toString()}
        stroke={Dimension.SA_WHITE.toString()}
        key={Layout.key++}
      />
    );
  }
}
