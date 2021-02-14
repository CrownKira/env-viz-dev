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
  units: ArrayUnit[];
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

    if (referencedBy[0] instanceof Binding) {
      this.x = frame.x + frame.width + Dimension.FrameMarginX;
      this.y = referencedBy[0].y;
    } else {
      // this.x = referencedBy[0].x + referencedBy[0].width + Dimension.TextPaddingX;
      // this.y = referencedBy[0].y;
      this.x = 0;
      this.y = 0;
      /// referenced by unit
    }

    // this.units = data.map<ArrayUnit>(
    //   (_, idx) => new ArrayUnit(idx, new PrimitiveValue(null, frame, binding), this)
    // );
    Layout.data.push(data);
    Layout.values.push(this);
    let width: number = data.length * Dimension.DataUnitWidth;
    let height: number = Dimension.DataUnitHeight;
    this.units = this.data.map<ArrayUnit>((data, idx) => {
      // const value = Layout.createValue(data, this.frame, this.binding); /// can return recursive value
      const unit = new ArrayUnit(idx, data, this); /// this array unit contains this value
      width = Math.max(
        width,
        unit.value.width +
          (!(unit.value instanceof PrimitiveValue) && idx === this.data.length - 1
            ? (idx + 1) * Dimension.DataUnitWidth + Dimension.DataUnitWidth
            : idx * Dimension.DataUnitWidth)
      );
      height = Math.max(
        height,
        unit.value instanceof PrimitiveValue
          ? Dimension.DataUnitHeight
          : unit.value.y + unit.value.height
      );
      // (isPrimitiveValue(value)? Dimension.DataUnitHeight  : value.y+value.height   )
      return unit;
    });

    // this.x = binding.name.x + binding.name.width + Dimension.TextPaddingX;
    // this.y = binding.y;

    // this.x = binding.name.x + binding.name.width + Dimension.TextPaddingX;
    // this.y = binding.y;
    // const lastUnit = this.units[this.units.length - 1];
    this.width = width;
    this.height = height;
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
