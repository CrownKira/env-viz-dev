import { Layout } from '../../../Layout';
import { Data } from '../../../types';
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
  units: ArrayUnit[];
  /** what this value is being referenced by */
  readonly referencedBy: Binding[];
  /** has this been initialized? */
  private initialized: boolean = false;

  constructor(
    /** underlying values this array contains */
    readonly data: Data[],
    readonly frame: Frame,
    readonly binding: Binding
  ) {
    super();
    this.referencedBy = [];
    // set units to null first to deal with cyclic structures
    this.units = data.map<ArrayUnit>(
      (_, idx) => new ArrayUnit(idx, new PrimitiveValue(null, frame, binding), this)
    );
    // this.x = binding.name.x + binding.name.width + Dimension.TextPaddingX;
    // this.y = binding.y;
    this.x = frame.x + frame.width + Dimension.FrameMarginX;
    this.y = binding.y;
    // this.x = binding.name.x + binding.name.width + Dimension.TextPaddingX;
    // this.y = binding.y;
    this.width = 0;
    this.height = 0;
  }

  // initializes the array by creating/fetching values for its units
  init() {
    // we ensure this is only called once to deal with cyclic structures
    if (this.initialized) return;
    this.initialized = true;

    this.units = this.data.map<ArrayUnit>((data, idx) => {
      const value = Layout.createValue(data, this.frame, this.binding);
      if (value instanceof ArrayValue) value.init();
      return new ArrayUnit(idx, value, this);
    });
  }

  draw() {
    // if (!this.initialized) throw
    return <></>;
  }
}
