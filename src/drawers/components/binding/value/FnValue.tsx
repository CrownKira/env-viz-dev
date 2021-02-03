import { Visible, FnTypes, Env } from '../../../types';
import { Binding } from '../Binding';
import { Value } from '../Value';
import { ArrayUnit } from './ArrayUnit';

/** this class encapsulates a JS Slang function (not from the global frame) that
 *  contains extra props such as environment and fnName */
export class FnValue extends Value implements Visible {
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
    readonly data: FnTypes
  ) {
    super();
    this.referencedBy = [];
    this.y = 0;
    this.x = 0;
    this.width = 0;
    this.height = 0;

    this.enclosingEnv = data.environment;
    this.fnName = data.functionName;
  }

  draw() {
    return <></>;
  }
}
