import { Layout } from '../Layout';
import { Frame } from './Frame';
import { Drawable, Env } from '../types';
import { Dimension } from '../Dimension';

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
    /// init x and y first cos frame needs it
    this.x = Dimension.CanvasPaddingX;
    this.y = Dimension.CanvasPaddingY;

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
                frames ? frames[frames.length - 1] : null,
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
    /// frame already constructed
    this.height = this.frames.reduce<number>(
      (maxHeight, frame) => Math.max(maxHeight, frame.height),
      0
    );
    // get the total width of all the frames in this level
    // this.width = this.frames.reduce<number>(
    //   (totalWidth, frame) => (totalWidth += frame.totalWidth + 0),
    //   0
    // );
    const lastFrame = this.frames[this.frames.length - 1];
    this.width = lastFrame.x + lastFrame.totalWidth;

    parentLevel && (this.y += parentLevel.height + parentLevel.y);
  }

  draw() {
    return <></>;
  }
}
