import { Drawable, ValueTypes } from '../../types';
import { Binding } from './Binding';
import { ArrayUnit } from './value/ArrayUnit';

/** the value of a `Binding` or an `ArrayUnit` */
export abstract class Value implements Drawable {
  /** draw logic */
  abstract draw(): React.ReactNode;
  /** the underlying data of this value */
  abstract readonly data: ValueTypes;
  /** what this value is being referenced by: either part of a binding or
   * an unit of array (from an array or pair value) */
  abstract readonly referencedBy: Binding | ArrayUnit;
}
