import React from 'react';
import { Layout } from '../Layout';
import { Frame } from './Frame';
import { Drawable } from '../types';
import { Dimension } from '../Dimension';
import { Rect } from 'react-konva';

/** this class encapsulates a level of frames to be drawn with the same y values */
export class Level implements Drawable {
  readonly x: number;
  readonly y: number;
  readonly height: number;
  readonly width: number;
  readonly frames: Frame[];

  constructor(
    /** the parent level of this level (the level above it) */
    readonly parentLevel: Level | null
  ) {
    this.x = Dimension.CanvasPaddingX;
    this.y = Dimension.CanvasPaddingY;

    parentLevel && (this.y += parentLevel.height + parentLevel.y);

    const frames: Frame[] = [];
    if (parentLevel) {
      parentLevel &&
        parentLevel.frames.forEach(
          frame =>
            frame.environment.childEnvs &&
            frame.environment.childEnvs.forEach(env => {
              const newFrame = new Frame(
                env,
                frame,
                frames.length > 0 ? frames[frames.length - 1] : null,
                this
              );
              frames.push(newFrame);
              env.frame = newFrame;
            })
        );
    } else {
      const env = Layout.globalEnv;
      const newFrame = new Frame(env, null, null, this);
      frames.push(newFrame);
      env.frame = newFrame;
    }
    this.frames = frames;

    // get the max height of all the frames in this level
    this.height = this.frames.reduce<number>(
      (maxHeight, frame) => Math.max(maxHeight, frame.height),
      0
    );
    const lastFrame = this.frames[this.frames.length - 1];
    this.width = lastFrame.x + lastFrame.totalWidth;
  }

  draw(): React.ReactNode {
    return (
      <>
        <Rect
          key={Layout.key++}
          x={this.x}
          y={this.y}
          width={this.width}
          height={this.height}
          fill="green"
        />
        {this.frames.map(frame => frame.draw())}
      </>
    );
  }
}
