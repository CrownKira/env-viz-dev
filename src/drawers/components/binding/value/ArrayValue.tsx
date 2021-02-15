import { Layout } from '../../../Layout';
import { Data, ReferenceType } from '../../../types';
import { Binding } from '../Binding';
import { Value } from '../Value';
import { ArrayUnit } from './ArrayUnit';
import { PrimitiveValue } from './PrimitiveValue';
import { Dimension } from '../../../Dimension';

/** this class encapsulates an array value in source,
 *  defined as a JS array with not 2 elements */
export class ArrayValue extends Value {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  /** check if the value is already drawn (to prevent cyclic issues) */
  private isDrawn: boolean = false;
  /** array of units this array is made of */
  units: ArrayUnit[] = [];

  constructor(
    /** underlying values this array contains */
    readonly data: Data[],
    /** what this value is being referenced by */
    readonly referencedBy: ReferenceType[]
  ) {
    super();
    Layout.memoizeDataValue(data, this);

    // derive the coordinates from the main reference (binding / array unit)
    const mainReference = referencedBy[0];
    if (mainReference instanceof Binding) {
      this.x = mainReference.frame.x + mainReference.frame.width + Dimension.FrameMarginX;
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

    // initialise array units from the last index
    for (let idx = data.length - 1; idx >= 0; idx--) {
      const unit = new ArrayUnit(idx, data[idx], this);

      // update the dimensions, so that array value can derive their coordinates
      // from the intermediate dimensions
      // update the width
      this.width = Math.max(
        this.width,
        unit.value.width +
          (!(unit.value instanceof PrimitiveValue) && idx === this.data.length - 1
            ? (idx + 1) * Dimension.DataUnitWidth + Dimension.DataUnitWidth
            : idx * Dimension.DataUnitWidth)
      );

      // update the height
      this.height = Math.max(
        this.height,
        unit.value instanceof PrimitiveValue || unit.isMainReference
          ? Dimension.DataUnitHeight
          : unit.value.y + unit.value.height - unit.y
      );

      this.units = [unit, ...this.units];
    }
  }

  addReference(reference: ReferenceType): void {
    this.referencedBy.push(reference);
  }

  draw(): React.ReactNode {
    if (this.isDrawn) return null;
    this.isDrawn = true;
    return <>{this.units.map(unit => unit.draw())}</>;
  }
}
