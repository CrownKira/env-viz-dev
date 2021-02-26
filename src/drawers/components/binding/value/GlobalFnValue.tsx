import { Circle } from 'react-konva';
import { Layout } from '../../../Layout';
import { ReferenceType } from '../../../types';
import { Binding } from '../Binding';
import { Value } from '../Value';
import { Dimension } from '../../../Dimension';
import { Arrow } from '../../Arrow';

/** this encapsulates a function from the global frame
 * (which has no extra props such as environment or fnName) */
export class GlobalFnValue extends Value {
  readonly x: number;
  readonly y: number;
  readonly height: number;
  readonly width: number;
  readonly fnRadius: number = Dimension.FnRadius;
  readonly fnInnerRadius: number = Dimension.FnInnerRadius;
  readonly centerX: number;

  constructor(
    /** underlying function */
    readonly data: () => any,
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
      this.centerX = this.x + this.fnRadius * 2;
    } else {
      if (mainReference.isLastUnit) {
        this.x = mainReference.x + Dimension.DataUnitWidth * 2;
        this.y = mainReference.y + Dimension.DataUnitHeight / 2 - this.fnRadius;
      } else {
        this.x = mainReference.x;
        this.y = mainReference.y + mainReference.parent.height + Dimension.DataUnitHeight;
      }
      this.centerX = this.x + Dimension.DataUnitWidth / 2;
      this.x = this.centerX - this.fnRadius * 2;
    }
    this.y += this.fnRadius;

    this.width = this.fnRadius * 4;
    this.height = this.fnRadius * 2;
  }

  draw(): React.ReactNode {
    return (
      <>
        <Circle
          key={Layout.key++}
          x={this.centerX - this.fnRadius}
          y={this.y}
          radius={this.fnRadius}
          stroke={Dimension.SA_WHITE + ''}
        />
        <Circle
          key={Layout.key++}
          x={this.centerX - this.fnRadius}
          y={this.y}
          radius={this.fnInnerRadius}
          fill={Dimension.SA_WHITE + ''}
        />
        <Circle
          key={Layout.key++}
          x={this.centerX + this.fnRadius}
          y={this.y}
          radius={this.fnRadius}
          stroke={Dimension.SA_WHITE + ''}
        />
        <Circle
          key={Layout.key++}
          x={this.centerX + this.fnRadius}
          y={this.y}
          radius={this.fnInnerRadius}
          fill={Dimension.SA_WHITE + ''}
        />
        { Layout.globalEnv.frame && new Arrow(this, Layout.globalEnv.frame).draw() }
      </>
    );
  }
}
