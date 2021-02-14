import { Visible, Data, ReferenceType } from '../../types';

/** the value of a `Binding` or an `ArrayUnit` */
export abstract class Value implements Visible {
  /** draw logic */
  abstract draw(): React.ReactNode;
  /** the underlying data of this value */
  abstract readonly data: Data;
  /** references to this value */
  abstract readonly referencedBy: ReferenceType[];
  abstract readonly x: number;
  abstract readonly y: number;
  abstract readonly height: number;
  abstract readonly width: number;
}
