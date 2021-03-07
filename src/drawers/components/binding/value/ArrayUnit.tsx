import React from 'react';
import { Rect } from 'react-konva';
import { Arrow } from '../../Arrow';
import { Layout } from '../../../Layout';
import { Visible, Data } from '../../../types';
import { Value } from '../Value';
import { ArrayValue } from './ArrayValue';
import { Config } from '../../../Config';
import { PrimitiveValue } from './PrimitiveValue';

/** this class encapsulates a single unit (box) of array to be rendered.
 *  this unit is part of a parent, either an ArrayValue */
export class ArrayUnit implements Visible {
  readonly x: number;
  readonly y: number;
  readonly height: number;
  readonly width: number;
  readonly value: Value;
  /** check if this is the last unit in the array */
  readonly isLastUnit: boolean;
  /** check if this unit is the main reference of the value */
  readonly isMainReference: boolean;
  /** check if the value is already drawn (to prevent cyclic issues) */
  private isDrawn: boolean = false;

  constructor(
    /** index of this unit in its parent */
    readonly idx: number,
    /** the value this unit contains*/
    readonly data: Data,
    /** parent of this unit, either an ArrayValue */
    readonly parent: ArrayValue
  ) {
    this.x = parent.x + idx * Config.DataUnitWidth;
    this.y = parent.y;
    this.isLastUnit = idx === parent.data.length - 1;
    this.value = Layout.createValue(data, this);
    this.isMainReference = this.value.referencedBy.length > 1;
    this.height = Config.DataUnitHeight;
    this.width = Config.DataUnitWidth;
  }

  draw(): React.ReactNode {
    if (this.isDrawn) return null;
    this.isDrawn = true;
    return (
      <>
        <Rect
          x={this.x}
          y={this.y}
          width={this.width}
          height={this.height}
          stroke={Config.SA_WHITE.toString()}
          key={Layout.key++}
        />
        {this.value.draw()}
        {this.value instanceof PrimitiveValue || new Arrow(this, this.value).draw()}
      </>
    );
  }
}
