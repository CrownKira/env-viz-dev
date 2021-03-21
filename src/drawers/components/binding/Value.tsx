import { Visible, Data, ReferenceType } from '../../types';

/** the value of a `Binding` or an `ArrayUnit` */
export abstract class Value implements Visible {
  /** draw logic */
  abstract draw(): React.ReactNode;

  /** references to this value */
  abstract readonly referencedBy: ReferenceType[];

  /** add reference (binding / array unit) to this value */
  addReference(newReference: ReferenceType): void {
    this.referencedBy.push(newReference);
  };

  /** the underlying data of this value */
  abstract readonly data: Data;

  /** coordinates and dimensions */
  abstract readonly x: number;
  abstract readonly y: number;
  abstract readonly height: number;
  abstract readonly width: number;
}