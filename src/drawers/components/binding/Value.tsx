import { Drawable, Data, ReferenceTypes } from '../../types';

/** the value of a `Binding` or an `ArrayUnit` */
export abstract class Value implements Drawable {
  /** draw logic */
  abstract draw(): React.ReactNode;
  /** the underlying data of this value */
  abstract readonly data: Data;
  /** references to this value */
  abstract readonly referencedBy: ReferenceTypes[];
}
