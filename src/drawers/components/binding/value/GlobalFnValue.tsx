import { ReferenceType } from '../../../types';
import { Binding } from '../Binding';
import { Value } from '../Value';
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
    Layout.memoizeDataValue(data, this);

    const mainReference = referencedBy[0];
    if (mainReference instanceof Binding) {
      this.x = frame.x + frame.width + Dimension.FrameMarginX;
      this.y = mainReference.y;
    } else {
      if (mainReference.isLastUnit) {
        this.x = mainReference.x + Dimension.DataUnitWidth * 2;
        this.y = mainReference.y;
      } else {
        this.x = mainReference.x;
        this.y = mainReference.y + mainReference.parent.height + Dimension.DataUnitHeight;
      }
    }

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
