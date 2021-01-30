export class Frame {
  constructor(
    public key: number,
    public height: number,
    public width: number,
    public x: number,
    public y: number,
    public childrenFrames: Frame[],
    public parentFrame: Frame
  ) {}
}
