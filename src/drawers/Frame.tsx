import { Value } from './Value';

export class Frame {
  constructor(
    public key: number,
    public height: number,
    public width: number,
    public x: number,
    public y: number,
    public elements: Value[],
    public childFrames: Frame[],
    public parentFrame: Frame | null, // Fix later
    public environment: any
  ) {}
}
