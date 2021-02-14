import { Layout } from '../../../Layout';
import { Data, ReferenceType } from '../../../types';
import { Binding } from '../Binding';
import { Value } from '../Value';
import { ArrayUnit } from './ArrayUnit';
import { PrimitiveValue } from './PrimitiveValue';
import { Frame } from '../../Frame';
import { Dimension } from '../../../Dimension';
import { isPrimitiveData } from '../../../utils';

/** this class encapsulates an array value in source,
 *  defined as a JS array with not 2 elements */
export class ArrayValue extends Value {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  /** array of units this array is made of */
  units: ArrayUnit[] = [];
  // /** what this value is being referenced by */
  // readonly referencedBy: ReferenceType[];
  /** has this been initialized? */
  private initialized: boolean = false;

  constructor(
    /** underlying values this array contains */
    readonly data: Data[],
    readonly frame: Frame,
    /** what this value is being referenced by */
    readonly referencedBy: ReferenceType[]
  ) {
    super();
    // this.referencedBy = [];
    // set units to null first to deal with cyclic structures
    // this.x = frame.x + frame.width + Dimension.FrameMarginX;
    // this.y = binding.y;
    Layout.data.push(data);
    Layout.values.push(this);

    const mainReference = referencedBy[0]; /// can be binding or unit
    if (mainReference instanceof Binding) {
      this.x = frame.x + frame.width + Dimension.FrameMarginX;
      this.y = mainReference.y;
    } else {
      // this.x = mainReference.x + mainReference.width + Dimension.TextPaddingX;
      // // this.y = mainReference.y;
      // this.x = 0;
      // this.y = 0;
      if (mainReference.isLastUnit) {
        this.x = mainReference.x + Dimension.DataUnitWidth * 2;
        this.y = mainReference.y;
      } else {
        this.x = mainReference.x;
        this.y = mainReference.parent.height + Dimension.DataUnitHeight;
        /// here the height is the acc height ie the intermediate height
      }
      /// referenced by unit
    }

    // this.units = data.map<ArrayUnit>(
    //   (_, idx) => new ArrayUnit(idx, new PrimitiveValue(null, frame, binding), this)
    // );

    this.width = data.length * Dimension.DataUnitWidth;
    this.height = Dimension.DataUnitHeight;

    for (let idx = data.length - 1; idx >= 0; idx--) {
      const unit = new ArrayUnit(idx, data[idx], this); /// this array unit contains this value
      this.width = Math.max(
        /// will be able to obtain intermediate width this way
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
          : unit.value.y + unit.value.height
      );

      this.units = [unit, ...this.units];
    }

    // this.x = binding.name.x + binding.name.width + Dimension.TextPaddingX;
    // this.y = binding.y;

    // this.x = binding.name.x + binding.name.width + Dimension.TextPaddingX;
    // this.y = binding.y;
    // const lastUnit = this.units[this.units.length - 1];
    // this.width = width;
    // this.height = height;
  }

  addReference(reference: ReferenceType): void {
    this.referencedBy.push(reference);
  }

  // // initializes the array by creating/fetching values for its units
  // init() {
  //   /// after init, all units will be constructed
  //   // we ensure this is only called once to deal with cyclic structures
  //   if (this.initialized) return;
  //   this.initialized = true;

  //   this.units = this.data.map<ArrayUnit>((data, idx) => {
  //     const value = Layout.createValue(data, this.frame, this.binding);
  //     if (value instanceof ArrayValue) value.init();
  //     return new ArrayUnit(idx, value, this);
  //   });
  // }

  draw() {
    // if (!this.initialized) throw
    return <></>;
  }
}
