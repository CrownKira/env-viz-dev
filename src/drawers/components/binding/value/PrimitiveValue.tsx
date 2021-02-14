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
    if (referencedBy[0] instanceof Binding) {
      this.x = referencedBy[0].name.x + referencedBy[0].name.width + Dimension.TextPaddingX;
      this.y = referencedBy[0].y;
    } else {
      this.x = referencedBy[0].x + referencedBy[0].width + Dimension.TextPaddingX;
      this.y = referencedBy[0].y;
    }
    this.width = Dimension.TextWidth;
    this.height = Dimension.TextHeight;
    this.text = new Text(String(data), this.x, this.y);
  }

  draw() {
    return <></>;
  }
}
