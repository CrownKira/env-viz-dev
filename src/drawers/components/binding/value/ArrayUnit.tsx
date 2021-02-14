import { Visible, Data } from '../../../types';
import { Layout } from '../../../Layout';
import { Value } from '../Value';
import { ArrayValue } from './ArrayValue';
import { Dimension } from '../../../Dimension';

/** this class encapsulates a single unit (box) of array to be rendered.
 *  this unit is part of a parent, either an ArrayValue */
export class ArrayUnit implements Visible {
  readonly x: number;
  readonly y: number;
  readonly height: number;
  readonly width: number;
  readonly value: Value;
  readonly isLastUnit: boolean;
  readonly hasCyclicReference: boolean;

  constructor(
    /** index of this unit in its parent */
    readonly idx: number,
    /** the value this unit contains*/
    readonly data: Data,
    /** parent of this unit, either an ArrayValue */
    readonly parent: ArrayValue
  ) {
    this.x = parent.x + idx * Dimension.DataUnitWidth;
    this.y = parent.y;
    this.isLastUnit = idx === parent.data.length - 1;
    this.value = Layout.createValue(data, parent.frame, this);
    this.hasCyclicReference = this.value.referencedBy.length > 1;
    this.height = Dimension.DataUnitHeight;
    this.width = Dimension.DataUnitWidth;
  }

  draw() {
    return <></>;
  }
}
