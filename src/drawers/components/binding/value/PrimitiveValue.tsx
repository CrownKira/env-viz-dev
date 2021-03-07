import { PrimitiveTypes, ReferenceType } from '../../../types';
import { Binding } from '../Binding';
import { Value } from '../Value';
import { Text } from '../../Text';
import { Config } from '../../../Config';
import { getTextWidth } from '../../../utils';
import React from 'react';
import { Layout } from '../../../Layout';

/** this classes encapsulates a primitive value in Source: number, string or null */
export class PrimitiveValue extends Value {
  readonly x: number;
  readonly y: number;
  readonly height: number;
  readonly width: number;
  /** the text to be rendered */
  readonly text: Text;

  constructor(
    /** data */
    readonly data: PrimitiveTypes,
    /** what this value is being referenced by */
    readonly referencedBy: ReferenceType[]
  ) {
    super();

    // derive the coordinates from the main reference (binding / array unit)
    const mainReference = referencedBy[0];
    if (mainReference instanceof Binding) {
      this.x = mainReference.x + getTextWidth(mainReference.keyString) + Config.TextPaddingX;
      this.y = mainReference.y;
    } else {
      this.x = mainReference.x + (Config.DataUnitWidth - getTextWidth(String(data))) / 2;
      this.y = mainReference.y + (Config.DataUnitHeight - Config.FontSize) / 2;
    }

    this.text = new Text(String(data), this.x, this.y);
    this.width = this.text.width;
    this.height = this.text.height;
  }

  draw(): React.ReactNode {
    return <>{this.text.draw()}</>;
  }
}
