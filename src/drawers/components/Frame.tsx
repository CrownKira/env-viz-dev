import React from 'react';
import { Rect } from 'react-konva';
import { Layout } from '../Layout';
import { Visible, Env } from '../types';
import { Binding } from './binding/Binding';
import { Config } from '../Config';
import { Text } from './Text';
import { Level } from './Level';
import { isPrimitiveData, getTextWidth } from '../utils';
import { Arrow } from './Arrow';

/** this class encapsulates a frame of key-value bindings to be drawn on canvas */
export class Frame implements Visible {
  readonly x: number;
  readonly y: number;
  readonly height: number;
  readonly width: number;
  /** total height = frame height + frame title height */
  readonly totalHeight: number;
  /** width of this frame + max width of the bound values */
  readonly totalWidth: number;
  /** the bindings this frame contains */
  readonly bindings: Binding[] = [];
  /** name of this frame to display */
  readonly name: Text;

  constructor(
    /** environment associated with this frame */
    readonly environment: Env,
    /** the parent/enclosing frame of this frame (the frame above it) */
    readonly parentFrame: Frame | null,
    /** the frame to the left of this frame, on the same level. used for calculating this frame's position */
    readonly leftSiblingFrame: Frame | null,
    /** the level in which this frame resides */
    readonly level: Level
  ) {
    let frameName: string;
    switch (environment.name) {
      case 'global':
        frameName = 'Global';
        break;
      case 'programEnvironment':
        frameName = 'Program';
        break;
      case 'forLoopEnvironment':
        frameName = 'Body of for-loop';
        break;
      case 'forBlockEnvironment':
        frameName = 'Control variable of for-loop';
        break;
      case 'blockEnvironment':
        frameName = 'Block';
        break;
      case 'functionBodyEnvironment':
        frameName = 'Function Body';
        break;
      default:
        frameName = environment.name;
    }
    this.name = new Text(frameName, this.level.x, this.level.y);

    this.x = this.level.x;
    // derive the x coordinate from the left sibling frame
    leftSiblingFrame &&
      (this.x += leftSiblingFrame.x + leftSiblingFrame.totalWidth + Config.FrameMarginX);
    this.y = this.level.y + this.name.height + Config.TextPaddingY / 2;

    // width of the frame = max width of the bindings in the frame + frame padding * 2 (the left and right padding)
    let maxBindingWidth = 0;
    for (let [key, data] of Object.entries(environment.head)) {
      const bindingWidth =
        Math.max(Config.TextMinWidth, getTextWidth(String(key + Config.VariableColon))) +
        Config.TextPaddingX +
        (isPrimitiveData(data) ? Math.max(Config.TextMinWidth, getTextWidth(String(data))) : 0);
      maxBindingWidth = Math.max(maxBindingWidth, bindingWidth);
    }
    this.width = maxBindingWidth + Config.FramePaddingX * 2;

    // initializes bindings (keys + values)
    let prevBinding: Binding | null = null;
    let totalWidth = this.width;
    for (let [key, data] of Object.entries(environment.head)) {
      const currBinding: Binding = new Binding(String(key), data, this, prevBinding);
      this.bindings.push(currBinding);
      prevBinding = currBinding;
      totalWidth = Math.max(totalWidth, currBinding.width + Config.FramePaddingX);
    }
    this.totalWidth = totalWidth;

    // derive the height of the frame from the the position of the last binding
    this.height = prevBinding
      ? prevBinding.y + prevBinding.height + Config.FramePaddingY - this.y
      : Config.FramePaddingY * 2;

    this.totalHeight = this.height + this.name.height + Config.TextPaddingY / 2;
  }

  draw(): React.ReactNode {
    return (
      <>
        {this.name.draw()}
        <Rect
          x={this.x}
          y={this.y}
          width={this.width}
          height={this.height}
          stroke={Config.SA_WHITE.toString()}
          onMouseEnter={e => {
            const stage = e.target.getStage();
            const container = stage ? stage.container() : null;
            container && (container.style.cursor = 'pointer');
          }}
          onMouseLeave={e => {
            const stage = e.target.getStage();
            const container = stage ? stage.container() : null;
            container && (container.style.cursor = 'default');
          }}
          key={Layout.key++}
        />
        {this.bindings.map(binding => binding.draw())}
        {this.parentFrame && new Arrow(this, this.parentFrame).draw()}
      </>
    );
  }
}
