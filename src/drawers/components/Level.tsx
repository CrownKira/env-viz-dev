import { Frame } from './Frame';
import { Drawable } from '../types';

/** this class encapsulates a level of frames to be drawn with the same y values */
export class Level implements Drawable {
  constructor(readonly frames: Frame[]) {
    // get the max height of all the frames in this level
    const height = frames.reduce<number>((maxHeight, frame) => Math.max(maxHeight, frame.height), 0);
    // get the total width of all the frames in this level
    const width = frames.reduce<number>((totalWidth, frame) => (totalWidth += frame.width + 0), 0);
  }

  draw() {
    return <></>;
  }
}
