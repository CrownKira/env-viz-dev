import { Layout } from '../../Layout';
import { Arrow } from '../Arrow';
import { Frame } from '../Frame';
import { Visible, Data } from '../../types';
import { Value } from './Value';
import { Text } from '../Text';
import { Config } from '../../Config';
import { PrimitiveValue } from './value/PrimitiveValue';
import { ArrayValue } from './value/ArrayValue';
import React from 'react';

/** a `binding` is a key-value pair in a frame */
export class Binding implements Visible {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  /** value associated with this binding */
  readonly value: Value;
  /** key of this binding */
  readonly key: Text;

  constructor(
    /** the key of this binding */
    readonly keyString: string,
    /** the value of this binding */
    readonly data: Data,
    /** frame this binding is in */
    readonly frame: Frame,
    /** previous binding (the binding above it) */
    readonly prevBinding: Binding | null
  ) {
    // derive the coordinates from the binding above it
    if (prevBinding) {
      this.x = prevBinding.x;
      this.y = prevBinding.y + prevBinding.height + Config.TextPaddingY;
    } else {
      this.x = frame.x + Config.FramePaddingX;
      this.y = frame.y + Config.FramePaddingY;
    }

    this.keyString += Config.VariableColon;
    this.value = Layout.createValue(data, this);

    const keyYOffset =
      this.value instanceof ArrayValue
        ? (Config.DataUnitHeight - Config.FontSize) / 2
        : (this.value.height - Config.FontSize) / 2;

    this.key = new Text(this.keyString, this.x, this.y + keyYOffset);

    // derive the width from the right bound of the value
    this.width = this.value.x + this.value.width - this.x;
    this.height = Math.max(this.key.height, this.value.height);
  }

  draw(): React.ReactNode {
    return (
      <>
        {this.key.draw()}
        {this.value.draw()}
        {this.value instanceof PrimitiveValue || new Arrow(this.key, this.value).draw()}
      </>
    );
  }
}
