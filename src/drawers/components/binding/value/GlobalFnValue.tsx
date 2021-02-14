import { Visible, ReferenceType } from '../../../types';
import { Binding } from '../Binding';
import { Value } from '../Value';
import { ArrayUnit } from './ArrayUnit';
import { Frame } from '../../Frame';
import { Dimension } from '../../../Dimension';
import { Layout } from '../../../Layout';

/** this encapsulates a function from the global frame
 * (which has no extra props such as environment or fnName) */
export class GlobalFnValue extends Value {
  readonly x: number;
  readonly y: number;
  readonly height: number;
  readonly width: number;

  constructor(
    /** underlying function */
    readonly data: () => any,
    readonly frame: Frame,
    /** what this value is being referenced by */
    readonly referencedBy: ReferenceType[]
  ) {
    super();
    Layout.data.push(data);
    Layout.values.push(this);

    const mainReference = referencedBy[0];
    if (mainReference instanceof Binding) {
      this.x = frame.x + frame.width + Dimension.FrameMarginX;
      this.y = mainReference.y;
    } else {
      // this.x = mainReference.x + mainReference.width + Dimension.TextPaddingX;
      // // this.y = mainReference.y;
      // this.x = 0;
      // this.y = 0;
      if (mainReference.isLastUnit) {
        this.x = mainReference.x + Dimension.DataUnitWidth * 2;
        this.y = mainReference.y;
      } else {
        this.x = mainReference.x;
        this.y = mainReference.y + mainReference.parent.height + Dimension.DataUnitHeight;
        /// here the height is the acc height ie the intermediate height
      }
      /// referenced by unit
    }
    // this.referencedBy = [];

    if (referencedBy[0] instanceof Binding) {
      this.x = frame.x + frame.width + Dimension.FrameMarginX;
      this.y = referencedBy[0].y;
    } else {
      // this.x = referencedBy[0].x + referencedBy[0].width + Dimension.TextPaddingX;
      // this.y = referencedBy[0].y;
      this.x = 0;
      this.y = 0;
      /// referenced by unit
    }
    // this.x = binding.name.x + binding.name.width + Dimension.TextPaddingX;
    // this.y = binding.y;
    this.width = Dimension.FnWidth;
    this.height = Dimension.FnHeight;
  }

  addReference(reference: ReferenceType): void {
    this.referencedBy.push(reference);
  }

  draw() {
    return <></>;
  }
}
