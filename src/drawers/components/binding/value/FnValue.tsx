import { FnTypes, Env, ReferenceType } from '../../../types';
import { Binding } from '../Binding';
import { Value } from '../Value';
import { Dimension } from '../../../Dimension';
import { Layout } from '../../../Layout';
import { Frame } from '../../Frame';
import { Rect } from 'react-konva';

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

    this.enclosingEnv = data.environment;
    this.fnName = data.functionName;
  }

  addReference(reference: ReferenceType): void {
    this.referencedBy.push(reference);
  }

  draw(): React.ReactNode {
    return (
      <Rect
        key={Layout.key++}
        x={this.x}
        y={this.y}
        width={this.width}
        height={this.height}
        fill="red"
      />
    );
  }
}
