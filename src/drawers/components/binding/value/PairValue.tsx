import { ValueTypes } from '../../../types';
import { Binding } from '../Binding';
import { Value } from '../Value';
import { ArrayUnit } from './ArrayUnit';

/** this class encapsulates a pair value in source, which we define as a JS array of 2 elements */
export class PairValue extends Value {
  /** the individual units to be displayed */
  readonly units: [ArrayUnit, ArrayUnit];

  constructor(
    /** the underlying pair */
    readonly data: [ValueTypes, ValueTypes],
    /** what this pair is being referenced by */
    readonly referencedBy: Binding | ArrayUnit
  ) {
    super();
    // initialize the units of this pair
    this.units = [new ArrayUnit(0, data[0], this), new ArrayUnit(1, data[1], this)];
  }

  draw() {
    return <></>;
  }
}
