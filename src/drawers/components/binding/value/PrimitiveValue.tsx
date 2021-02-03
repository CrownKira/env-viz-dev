import { PrimitiveTypes, ReferenceTypes } from '../../../types';
import { Binding } from '../Binding';
import { Value } from '../Value';
import { ArrayUnit } from './ArrayUnit';
import { Text } from '../../Text';

/** this classes encapsulates a primitive value in Source: number, string or null */
export class PrimitiveValue extends Value {
  /** the text to be rendered */
  readonly text: Text;
  /** what this value is being referenced by */
  readonly referencedBy: ReferenceTypes[];

  constructor(readonly data: PrimitiveTypes) {
    super();
    this.referencedBy = [];
    this.text = new Text(String(data), 0, 0);
  }

  draw() {
    return <></>;
  }
}
