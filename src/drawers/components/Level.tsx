import React from 'react';
import { Rect } from 'react-konva';
import { Layout } from '../Layout';
import { Frame } from './Frame';
import { Visible } from '../types';
import { Dimension } from '../Dimension';

/** this class encapsulates a level of frames to be drawn with the same y values */
export class Level implements Visible {
  readonly x: number;
  readonly y: number;
  readonly height: number;
  readonly width: number;
  /** all the frames in this level */
  readonly frames: Frame[];

  constructor(
    /** the parent level of this level (the level above it) */
    readonly parentLevel: Level | null
  ) {
    this.x = Dimension.CanvasPaddingX;
    this.y = Dimension.CanvasPaddingY;
    parentLevel && (this.y += parentLevel.height + parentLevel.y);

    // initialise frames
    const frames: Frame[] = [];
    if (parentLevel) {
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
      // empty parent level means this is the first level
      // and hence contains only the global frame
      const { globalEnv } = Layout;
      const newFrame = new Frame(globalEnv, null, null, this);
      frames.push(newFrame);
      globalEnv.frame = newFrame;
    }

    this.frames = frames;

    // get the max height of all the frames in this level
    this.height = this.frames.reduce<number>(
      (maxHeight, frame) => Math.max(maxHeight, frame.totalHeight),
      0
    );
    const lastFrame = this.frames[this.frames.length - 1];
    // derive the width of this level from the last frame
    this.width = lastFrame.x + lastFrame.totalWidth - this.x + Dimension.LevelPaddingX;
  }

  draw(): React.ReactNode {
    return (
      <React.Fragment key={Layout.key++}>
        <Rect x={this.x} y={this.y} width={this.width} height={this.height} />
        {this.frames.map(frame => frame.draw())}
      </React.Fragment>
    );
  }
}
