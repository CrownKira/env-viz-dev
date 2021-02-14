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

  draw() {
    return <></>;
  }
}
