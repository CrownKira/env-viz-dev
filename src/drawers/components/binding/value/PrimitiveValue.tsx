import { PrimitiveTypes, ReferenceType, Visible } from '../../../types';
import { Binding } from '../Binding';
import { Value } from '../Value';
import { ArrayUnit } from './ArrayUnit';
import { Text } from '../../Text';
import { Frame } from '../../Frame';
import { Dimension } from '../../../Dimension';

/** this classes encapsulates a primitive value in Source: number, string or null */
export class PrimitiveValue extends Value {
  readonly x: number;
  readonly y: number;
  readonly height: number; /// the total height of the wrapper of text
  readonly width: number; /// the total width of the wrapper of text
  /** the text to be rendered */
  readonly text: Text;

  constructor(
    readonly data: PrimitiveTypes,
    readonly frame: Frame,
    /** what this value is being referenced by */
    readonly referencedBy: ReferenceType[]
  ) {
    super();
    // this.referencedBy = [];
    const mainReference = referencedBy[0];
    if (mainReference instanceof Binding) {
      this.x = mainReference.name.x + mainReference.name.width + Dimension.TextPaddingX;
      this.y = mainReference.y;
    } else {
      this.x = mainReference.x;
      this.y = mainReference.y;
    }
    this.width = Dimension.TextWidth;
    this.height = Dimension.TextHeight;
    this.text = new Text(String(data), this.x, this.y);
  }

  addReference(reference: ReferenceType): void {
    this.referencedBy.push(reference);
  }

  draw() {
    return <></>;
  }
}
