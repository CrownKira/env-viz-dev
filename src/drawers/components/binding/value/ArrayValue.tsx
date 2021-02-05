import { Layout } from '../../../Layout';
import { Data } from '../../../types';
import { Binding } from '../Binding';
import { Value } from '../Value';
import { ArrayUnit } from './ArrayUnit';
import { PairValue } from './PairValue';
import { PrimitiveValue } from './PrimitiveValue';

/** this class encapsulates an array value in source,
 *  defined as a JS array with not 2 elements */
export class ArrayValue extends Value {
  /** array of units this array is made of */
  units: ArrayUnit[];
  /** what this value is being referenced by */
  readonly referencedBy: Binding[];
  /** has this been initialized? */
  private initialized: boolean = false;

  constructor(
    /** underlying values this array contains */
    readonly data: Data[]
  ) {
    super();
    this.referencedBy = [];
    // set units to null first to deal with cyclic structures
    this.units = data.map<ArrayUnit>(
      (_, idx) => new ArrayUnit(idx, new PrimitiveValue(null), this)
    );
  }

  // initializes the array by creating/fetching values for its units
  init() {
    // we ensure this is only called once to deal with cyclic structures
    if (this.initialized) return;
    this.initialized = true;

    this.units = this.data.map<ArrayUnit>((data, idx) => {
      const value = Layout.createValue(data);
      if (value instanceof ArrayValue || value instanceof PairValue) value.init();
      return new ArrayUnit(idx, value, this);
    });
  }

  draw() {
    // if (!this.initialized) throw
    return <></>;
  }
}
