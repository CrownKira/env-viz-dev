import { PrimitiveTypes, ReferenceTypes, Visible } from '../../../types';
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
  /** what this value is being referenced by */
  readonly referencedBy: ReferenceTypes[];

  constructor(readonly data: PrimitiveTypes, readonly frame: Frame, readonly binding: Binding) {
    super();
    this.referencedBy = [];
    this.x = binding.name.x + binding.name.width + Dimension.TextPaddingX;
    this.y = binding.y;
    this.width = Dimension.TextWidth;
    this.height = Dimension.TextHeight;
    this.text = new Text(String(data), this.x, this.y);
  }

  draw() {
    return <></>;
  }
}
