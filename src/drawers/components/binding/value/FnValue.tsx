import { Circle } from 'react-konva';
import { Layout } from '../../../Layout';
import { FnTypes, Env, ReferenceType } from '../../../types';
import { Binding } from '../Binding';
import { Value } from '../Value';
import { Dimension } from '../../../Dimension';

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
  readonly fnRadius: number = Dimension.FnRadius;
  readonly fnInnerRadius: number = Dimension.FnInnerRadius;
  readonly centreX: number;
  // readonly arrows: Arrow[] = [];

  constructor(
    /** underlying JS Slang function (contains extra props) */
    readonly data: FnTypes,
    /** what this value is being referenced by */
    readonly referencedBy: ReferenceType[]
  ) {
    super();
    Layout.memoizeValue(this);

    // derive the coordinates from the main reference (binding / array unit)
    const mainReference = referencedBy[0];
    if (mainReference instanceof Binding) {
      this.x = mainReference.frame.x + mainReference.frame.width + Dimension.FrameMarginX;
      this.y = mainReference.y;
      this.centreX = this.x + this.fnRadius * 2;
    } else {
      if (mainReference.isLastUnit) {
        this.x = mainReference.x + Dimension.DataUnitWidth * 2;
        this.y = mainReference.y + Dimension.DataUnitHeight / 2 - this.fnRadius;
      } else {
        this.x = mainReference.x;
        this.y = mainReference.y + mainReference.parent.height + Dimension.DataUnitHeight;
      }
      this.centreX = this.x + Dimension.DataUnitWidth / 2;
      this.x = this.centreX - this.fnRadius * 2;
    }
    this.y += this.fnRadius;

    // add arrow to the main ref
    // this.arrows.push(new Arrow(this, mainReference));

    this.width = this.fnRadius * 4;
    this.height = this.fnRadius * 2;

    this.enclosingEnv = data.environment;
    this.fnName = data.functionName;
  }

  addReference(reference: ReferenceType): void {
    this.referencedBy.push(reference);
    // this.arrows.push(new Arrow(this, reference));
  }

  draw(): React.ReactNode {
    return (
      <>
        <Circle
          key={Layout.key++}
          x={this.centreX - this.fnRadius}
          y={this.y}
          radius={this.fnRadius}
          fill="red"
        />
        <Circle
          key={Layout.key++}
          x={this.centreX - this.fnRadius}
          y={this.y}
          radius={this.fnInnerRadius}
          fill="black"
        />
        <Circle
          key={Layout.key++}
          x={this.centreX + this.fnRadius}
          y={this.y}
          radius={this.fnRadius}
          fill="red"
        />
        <Circle
          key={Layout.key++}
          x={this.centreX + this.fnRadius}
          y={this.y}
          radius={this.fnInnerRadius}
          fill="black"
        />
      </>
    );
  }
}
