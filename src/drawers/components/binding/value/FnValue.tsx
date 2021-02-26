import { Circle } from 'react-konva';
import { Layout } from '../../../Layout';
import { FnTypes, Env, ReferenceType } from '../../../types';
import { Binding } from '../Binding';
import { Value } from '../Value';
import { Config } from '../../../Config';
import { Arrow } from '../../Arrow';
import React from 'react';

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
  readonly fnRadius: number = Config.FnRadius;
  readonly fnInnerRadius: number = Config.FnInnerRadius;
  readonly centerX: number;

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
      this.x = mainReference.frame.x + mainReference.frame.width + Config.FrameMarginX;
      this.y = mainReference.y;
      this.centerX = this.x + this.fnRadius * 2;
    } else {
      if (mainReference.isLastUnit) {
        this.x = mainReference.x + Config.DataUnitWidth * 2;
        this.y = mainReference.y + Config.DataUnitHeight / 2 - this.fnRadius;
      } else {
        this.x = mainReference.x;
        this.y = mainReference.y + mainReference.parent.height + Config.DataUnitHeight;
      }
      this.centerX = this.x + Config.DataUnitWidth / 2;
      this.x = this.centerX - this.fnRadius * 2;
    }
    this.y += this.fnRadius;

    this.width = this.fnRadius * 4;
    this.height = this.fnRadius * 2;

    this.enclosingEnv = data.environment;
    this.fnName = data.functionName;
  }

  draw(): React.ReactNode {
    return (
      <React.Fragment key={Layout.key++}>
        <Circle
          key={Layout.key++}
          x={this.centerX - this.fnRadius}
          y={this.y}
          radius={this.fnRadius}
          stroke={Config.SA_WHITE.toString()}
        />
        <Circle
          key={Layout.key++}
          x={this.centerX - this.fnRadius}
          y={this.y}
          radius={this.fnInnerRadius}
          fill={Config.SA_WHITE.toString()}
        />
        <Circle
          key={Layout.key++}
          x={this.centerX + this.fnRadius}
          y={this.y}
          radius={this.fnRadius}
          stroke={Config.SA_WHITE.toString()}
        />
        <Circle
          key={Layout.key++}
          x={this.centerX + this.fnRadius}
          y={this.y}
          radius={this.fnInnerRadius}
          fill={Config.SA_WHITE.toString()}
        />
        {this.enclosingEnv.frame && new Arrow(this, this.enclosingEnv.frame).draw()}
      </React.Fragment>
    );
  }
}
