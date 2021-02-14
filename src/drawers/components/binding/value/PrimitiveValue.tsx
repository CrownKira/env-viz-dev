import { PrimitiveTypes, ReferenceType } from '../../../types';
import { Layout } from '../../../Layout';
import { Binding } from '../Binding';
import { Value } from '../Value';
import { Text } from '../../Text';
import { Frame } from '../../Frame';
import { Dimension } from '../../../Dimension';
import { Rect } from 'react-konva';

/** this classes encapsulates a primitive value in Source: number, string or null */
export class PrimitiveValue extends Value {
  readonly x: number;
  readonly y: number;
  readonly height: number;
  readonly width: number;
  /** the text to be rendered */
  readonly text: Text;

  constructor(
    readonly data: PrimitiveTypes,
    readonly frame: Frame,
    /** what this value is being referenced by */
    readonly referencedBy: ReferenceType[]
  ) {
    super();
    const mainReference = referencedBy[0];
    if (mainReference instanceof Binding) {
      this.x = mainReference.name.x + mainReference.name.width + Dimension.TextPaddingX;
      this.y = mainReference.y;
    } else {
      this.x = mainReference.x;
      this.y = mainReference.y;
    }
    this.text = new Text(String(data), this.x, this.y);
    this.width = this.text.width;
    this.height = this.text.height;
  }

  addReference(reference: ReferenceType): void {
    this.referencedBy.push(reference);
  }

  draw(): React.ReactNode {
    return <>{this.text.draw()}</>;
  }
}
