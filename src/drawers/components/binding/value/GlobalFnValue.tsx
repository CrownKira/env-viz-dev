import { Visible } from '../../../types';
import { Binding } from '../Binding';
import { Value } from '../Value';
import { ArrayUnit } from './ArrayUnit';
import { Frame } from '../../Frame';
import { Dimension } from '../../../Dimension';

/** this encapsulates a function from the global frame
 * (which has no extra props such as environment or fnName) */
export class GlobalFnValue extends Value {
  readonly x: number;
  readonly y: number;
  readonly height: number;
  readonly width: number;
  /** what this value is being referenced by */
  readonly referencedBy: Binding[];

  constructor(
    /** underlying function */
    readonly data: () => any,
    readonly frame: Frame,
    readonly binding: Binding
  ) {
    super();
    this.referencedBy = [];
    this.x = frame.x + frame.width + Dimension.FrameMarginX;
    this.y = binding.y;
    // this.x = binding.name.x + binding.name.width + Dimension.TextPaddingX;
    // this.y = binding.y;
    this.width = Dimension.FnWidth;
    this.height = Dimension.FnHeight;
  }

  draw() {
    return <></>;
  }
}
