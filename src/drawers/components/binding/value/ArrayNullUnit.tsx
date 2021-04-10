import React from 'react';
import { Line as KonvaLine } from 'react-konva';
import { Hoverable, ReferenceType, Visible } from '../../../types';
import { Layout } from '../../../Layout';
import { Config } from '../../../Config';
import { KonvaEventObject } from 'konva/types/Node';
import { setHoveredStyle, setUnhoveredStyle } from '../../../utils';

/** this classes encapsulates a null value in Source pairs or arrays */
export class ArrayNullUnit implements Visible, Hoverable {
  readonly x: number;
  readonly y: number;
  readonly height: number;
  readonly width: number;

  constructor(readonly referencedBy: ReferenceType[]) {
    const arrayUnit = referencedBy[0];
    this.x = arrayUnit.x;
    this.y = arrayUnit.y;
    this.height = arrayUnit.height;
    this.width = arrayUnit.width;
  }

  onMouseEnter = ({ currentTarget }: KonvaEventObject<MouseEvent>) => {
    setHoveredStyle(currentTarget);
  };

  onMouseLeave = ({ currentTarget }: KonvaEventObject<MouseEvent>) => {
    setUnhoveredStyle(currentTarget);
  };

  draw(): React.ReactNode {
    return (
      <KonvaLine
        key={Layout.key++}
        points={[this.x, this.y + this.height, this.x + this.width, this.y]}
        stroke={Config.SA_WHITE.toString()}
        hitStrokeWidth={15}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      />
    );
  }
}
