import { ValueTypes, Visible } from '../../../types';
import { createValue } from '../../../utils';
import { Value } from '../Value';
import { ArrayValue } from './ArrayValue';
import { PairValue } from './PairValue';

/** this class encapsulates a single unit (box) of array to be rendered.
 *  this unit is part of a parent, either an ArrayValue or PairValue */
export class ArrayUnit implements Visible {
  readonly x: number;
  readonly y: number;
  readonly height: number;
  readonly width: number;
  /** underlying value in this unit */
  readonly value: Value;

  constructor(
    /** index of this unit in its parent */
    readonly idx: number,
    /** underlying data of the value this unit contains */
    data: ValueTypes,
    /** parent of this unit, either an ArrayValue or PairValue */
    readonly parent: ArrayValue | PairValue
  ) {
    // initialize the underlying value
    this.value = createValue(data, this);

    this.x = parent.units[0].x + idx * 0; // change 0 to width of an arr unit
    this.y = parent.units[0].y;

    this.height = 0;
    this.width = 0;
  }

  draw() {
    return <></>;
  }
}
