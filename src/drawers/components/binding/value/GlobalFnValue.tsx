import { Circle } from 'react-konva';
import { Layout } from '../../../Layout';
import { ReferenceType } from '../../../types';
import { Binding } from '../Binding';
import { Value } from '../Value';
import { Config } from '../../../Config';
import { Arrow } from '../../Arrow';
import React from 'react';

/** this encapsulates a function from the global frame
 * (which has no extra props such as environment or fnName) */
export class GlobalFnValue extends Value {
  readonly x: number;
  readonly y: number;
  readonly height: number;
  readonly width: number;
  readonly radius: number = Config.FnRadius;
  readonly innerRadius: number = Config.FnInnerRadius;
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
    const mainReference = this.referencedBy[0];
    if (mainReference instanceof Binding) {
      this.x = mainReference.frame.x + mainReference.frame.width + Config.FrameMarginX;
      this.y = mainReference.y;
      this.centerX = this.x + this.radius * 2;
    } else {
      if (mainReference.isLastUnit) {
        this.x = mainReference.x + Config.DataUnitWidth * 2;
        this.y = mainReference.y + Config.DataUnitHeight / 2 - this.radius;
      } else {
        this.x = mainReference.x;
        this.y = mainReference.y + mainReference.parent.height + Config.DataUnitHeight;
      }
      this.centerX = this.x + Config.DataUnitWidth / 2;
      this.x = this.centerX - this.radius * 2;
    }
    this.y += this.radius;

    this.width = this.radius * 4;
    this.height = this.radius * 2;
  }

  draw(): React.ReactNode {
    return (
      <React.Fragment key={Layout.key++}>
        <Circle
          key={Layout.key++}
          x={this.centerX - this.radius}
          y={this.y}
          radius={this.radius}
          stroke={Config.SA_WHITE.toString()}
        />
        <Circle
          key={Layout.key++}
          x={this.centerX - this.radius}
          y={this.y}
          radius={this.innerRadius}
          fill={Config.SA_WHITE.toString()}
        />
        <Circle
          key={Layout.key++}
          x={this.centerX + this.radius}
          y={this.y}
          radius={this.radius}
          stroke={Config.SA_WHITE.toString()}
        />
        <Circle
          key={Layout.key++}
          x={this.centerX + this.radius}
          y={this.y}
          radius={this.innerRadius}
          fill={Config.SA_WHITE.toString()}
        />
        {Layout.globalEnv.frame && new Arrow(this, Layout.globalEnv.frame).draw()}
      </React.Fragment>
    );
  }
}
