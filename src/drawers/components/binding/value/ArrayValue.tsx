import { Layout } from '../../../Layout';
import { Data, ReferenceType } from '../../../types';
import { Binding } from '../Binding';
import { Value } from '../Value';
import { ArrayUnit } from './ArrayUnit';
import { PrimitiveValue } from './PrimitiveValue';
import { Frame } from '../../Frame';
import { Dimension } from '../../../Dimension';

/** this class encapsulates an array value in source,
 *  defined as a JS array with not 2 elements */
export class ArrayValue extends Value {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  /** array of units this array is made of */
  units: ArrayUnit[] = [];

  constructor(
    /** underlying values this array contains */
    readonly data: Data[],
    readonly frame: Frame,
    /** what this value is being referenced by */
    readonly referencedBy: ReferenceType[]
  ) {
    super();
    Layout.memoizeDataValue(data, this);

    const mainReference = referencedBy[0];
    if (mainReference instanceof Binding) {
      this.x = frame.x + frame.width + Dimension.FrameMarginX;
      this.y = mainReference.y;
    } else {
      if (mainReference.isLastUnit) {
        this.x = mainReference.x + Dimension.DataUnitWidth * 2;
        this.y = mainReference.y;
      } else {
        this.x = mainReference.x;
        this.y = mainReference.y + mainReference.parent.height + Dimension.DataUnitHeight;
      }
    }

    this.width = data.length * Dimension.DataUnitWidth;
    this.height = Dimension.DataUnitHeight;

    for (let idx = data.length - 1; idx >= 0; idx--) {
      const unit = new ArrayUnit(idx, data[idx], this);
      this.width = Math.max(
        this.width,
        unit.value.width +
          (!(unit.value instanceof PrimitiveValue) && idx === this.data.length - 1
            ? (idx + 1) * Dimension.DataUnitWidth + Dimension.DataUnitWidth
            : idx * Dimension.DataUnitWidth)
      );
      this.height = Math.max(
        this.height,
        unit.value instanceof PrimitiveValue || unit.hasCyclicReference
          ? Dimension.DataUnitHeight
          : unit.value.y + unit.value.height - unit.y
      );

      this.units = [unit, ...this.units];
    }
  }

  addReference(reference: ReferenceType): void {
    this.referencedBy.push(reference);
  }

  draw() {
    return <></>;
  }
}
