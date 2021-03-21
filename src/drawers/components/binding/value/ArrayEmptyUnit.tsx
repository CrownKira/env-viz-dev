import React from 'react';
import { Rect } from 'react-konva';
import { Data, Visible } from '../../../types';
import { Layout } from '../../../Layout';
import { Config } from '../../../Config';
import { ArrayValue } from './ArrayValue';

/** this classes encapsulates an empty array */
export class ArrayEmptyUnit implements Visible {
  readonly x: number;
  readonly y: number;
  readonly height: number;
  readonly width: number;
  readonly data: Data = [];

  constructor(readonly parent: ArrayValue) {
    this.x = this.parent.x;
    this.y = this.parent.y;
    this.height = this.parent.height;
    this.width = this.parent.width;
  }

  draw(): React.ReactNode {
    return (
      <Rect
        key={Layout.key++}
        x={this.x}
        y={this.y}
        width={this.width}
        height={this.height}
        stroke={Config.SA_WHITE.toString()}
      />
    );
  }
}
