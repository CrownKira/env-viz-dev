import { Layout } from '../../../Layout';
import { Data, ReferenceTypes } from '../../../types';
import { Binding } from '../Binding';
import { Value } from '../Value';
import { ArrayUnit } from './ArrayUnit';
import { ArrayValue } from './ArrayValue';
import { PrimitiveValue } from './PrimitiveValue';

// TODO: possibly remove this

/** this class encapsulates a pair value in source, which we define as a JS array of 2 elements */
export class PairValue extends Value {
  /** the individual units to be displayed */
  units: [ArrayUnit, ArrayUnit];
  /** what this value is being referenced by */
  readonly referencedBy: ReferenceTypes[];
  /** has this pair been initialized? */
  private initialized: boolean = false;

  constructor(
    /** the underlying pair */
    readonly data: [Data, Data]
  ) {
    super();
    this.referencedBy = [];
    // set units to null first to deal with cyclic structures
    this.units = [
      new ArrayUnit(0, new PrimitiveValue(null), this),
      new ArrayUnit(1, new PrimitiveValue(null), this)
    ];
  }

  // initializes the pair by creating/fetching values for its units
  init() {
    // we ensure this is only called once to deal with cyclic structures
    if (this.initialized) return;
    this.initialized = true;

    const value1 = Layout.createValue(this.data[0]);
    const value2 = Layout.createValue(this.data[1]);
    if (value1 instanceof ArrayValue || value1 instanceof PairValue) value1.init();
    if (value2 instanceof ArrayValue || value2 instanceof PairValue) value2.init();
    this.units = [new ArrayUnit(0, value1, this), new ArrayUnit(1, value2, this)];
  }

  draw() {
    if (!this.initialized) throw new Error('pair must be initialized before being drawn');
    return <></>;
  }
}
