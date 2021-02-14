import { Visible, FnTypes, Env } from '../../../types';
import { Binding } from '../Binding';
import { Value } from '../Value';
import { Dimension } from '../../../Dimension';
import { Frame } from '../../Frame';
import { ArrayUnit } from './ArrayUnit';

/** this class encapsulates a JS Slang function (not from the global frame) that
 *  contains extra props such as environment and fnName */
export class FnValue extends Value {
  readonly x: number;
  readonly y: number;
  readonly height: number;
  readonly width: number;
  /** what this value is being referenced by */
  readonly referencedBy: Binding[];
  /** the parent/enclosing environment of this fn value */
  readonly enclosingEnv: Env;
  /** name of this function */
  readonly fnName: string;

  constructor(
    /** underlying JS Slang function (contains extra props) */
    readonly data: FnTypes,
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

    this.enclosingEnv = data.environment;
    this.fnName = data.functionName;
  }

  draw() {
    return <></>;
  }
}
