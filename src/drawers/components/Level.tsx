import { Frame } from './Frame';
import { Drawable } from '../types';
import { Dimension } from '../Dimension';

/** this class encapsulates a level of frames to be drawn with the same y values */
export class Level implements Drawable {
  readonly x: number;
  readonly y: number;
  readonly height: number;
  readonly width: number;

  constructor(
    readonly frames: Frame[],
    /** the parent level of this level (the level above it) */
    readonly parentLevel: Level | null
  ) {
    // get the max height of all the frames in this level
    /// frame already constructed
    this.height = frames.reduce<number>((maxHeight, frame) => Math.max(maxHeight, frame.height), 0);
    // get the total width of all the frames in this level
    this.width = frames.reduce<number>((totalWidth, frame) => (totalWidth += frame.width + 0), 0);
    this.x = Dimension.MarginLeft;
    this.y = Dimension.MarginTop;
    parentLevel && (this.y += parentLevel.height + parentLevel.y);
  }

  draw() {
    return <></>;
  }
}
