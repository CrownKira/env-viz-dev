import { Visible } from '../../../types';
import { Binding } from '../Binding';
import { Value } from '../Value';
import { ArrayUnit } from './ArrayUnit';

/** this encapsulates a function from the global frame
 * (which has no extra props such as environment or fnName) */
export class GlobalFnValue extends Value implements Visible {
  readonly x: number;
  readonly y: number;
  readonly height: number;
  readonly width: number;

  constructor(
    /** underlying function */
    readonly data: () => any,
    /** what this function is being referenced by */
    readonly referencedBy: Binding | ArrayUnit
  ) {
    super();
    this.y = 0;
    this.x = 0;
    this.width = 0;
    this.height = 0;
  }

  draw() {
    return <></>;
  }
}
