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
  /** what this value is being referenced by */
  readonly referencedBy: Binding[];

  constructor(
    /** underlying function */
    readonly data: () => any
  ) {
    super();
    this.referencedBy = [];
    this.y = 0;
    this.x = 0;
    this.width = 0;
    this.height = 0;
  }

  draw() {
    return <></>;
  }
}
