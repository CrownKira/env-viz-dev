import { Visible, FnTypes, Env, ReferenceType } from '../../../types';
import { Binding } from '../Binding';
import { Value } from '../Value';
import { Dimension } from '../../../Dimension';
import { Layout } from '../../../Layout';
import { Frame } from '../../Frame';
import { ArrayUnit } from './ArrayUnit';

/** this class encapsulates a JS Slang function (not from the global frame) that
 *  contains extra props such as environment and fnName */
export class FnValue extends Value {
  readonly x: number;
  readonly y: number;
  readonly height: number;
  readonly width: number;
  /** the parent/enclosing environment of this fn value */
  readonly enclosingEnv: Env;
  /** name of this function */
  readonly fnName: string;

  constructor(
    /** underlying JS Slang function (contains extra props) */
    readonly data: FnTypes,
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

    this.enclosingEnv = data.environment;
    this.fnName = data.functionName;
  }

  draw() {
    return <></>;
  }
}
