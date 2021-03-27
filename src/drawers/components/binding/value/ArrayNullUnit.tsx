import React from 'react';
import { Line as KonvaLine } from 'react-konva';
import { Data, ReferenceType } from '../../../EnvVisualizerTypes';
import { Value } from '../Value';
import { Layout } from '../../../Layout';
import { Config } from '../../../Config';

/** this classes encapsulates a null value in Source pairs or arrays */
export class ArrayNullUnit extends Value {
  readonly x: number;
  readonly y: number;
  readonly height: number;
  readonly width: number;
  readonly data: Data = null;
  constructor(readonly referencedBy: ReferenceType[]) {
    super();
    const arrayUnit = referencedBy[0];
    this.x = arrayUnit.x;
    this.y = arrayUnit.y;
    this.height = arrayUnit.height;
    this.width = arrayUnit.width;
  }

  draw(): React.ReactNode {
    return (
      <KonvaLine
        key={Layout.key++}
        points={[this.x, this.y + this.height, this.x + this.width, this.y]}
        stroke={Config.SA_WHITE.toString()}
      />
    );
  }
}
