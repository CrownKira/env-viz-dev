import { ValueTypes } from '../../../types';
import { Binding } from '../Binding';
import { Value } from '../Value';
import { ArrayUnit } from './ArrayUnit';

/** this class encapsulates an array value in source,
 *  defined as a JS array with not 2 elements */
export class ArrayValue extends Value {
  /** array of units this array is made of */
  readonly units: ArrayUnit[];

  constructor(
    /** underlying values this array contains */
    readonly data: ValueTypes[],
    /** what this array is being referenced by */
    readonly referencedBy: Binding | ArrayUnit
  ) {
    super();
    // initialize units of this array
    this.units = data.map<ArrayUnit>((ele, idx) => new ArrayUnit(idx, ele, this));
  }

  draw() {
    return <></>;
  }
}
