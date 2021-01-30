export abstract class Value {
  constructor(
    public key: number,
    public height: number,
    public width: number,
    public x: number,
    public y: number
  ) {}
}
