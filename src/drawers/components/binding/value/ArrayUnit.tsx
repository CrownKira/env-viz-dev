import { Visible, Data } from '../../../types';
import { Layout } from '../../../Layout';
import { Value } from '../Value';
import { ArrayValue } from './ArrayValue';

/** this class encapsulates a single unit (box) of array to be rendered.
 *  this unit is part of a parent, either an ArrayValue */
export class ArrayUnit implements Visible {
  readonly x: number;
  readonly y: number;
  readonly height: number;
  readonly width: number;
  readonly value: Value;

  constructor(
    /** index of this unit in its parent */
    readonly idx: number,
    /** the value this unit contains*/
    // readonly value: Value,
    readonly data: Data,
    /** parent of this unit, either an ArrayValue */
    readonly parent: ArrayValue
  ) {
    const value = Layout.createValue(data, parent.frame, this);
    this.value = value;
    value.referencedBy.push(this);
    // this.x = parent.units[0].x + idx * 0; // change 0 to width of an arr unit
    // this.y = parent.units[0].y;
    this.x = 0;
    this.y = 0;

    this.height = 0;
    this.width = 0;
  }

  draw() {
    return <></>;
  }
}
