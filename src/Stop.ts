export class Stop {
  constructor(public lastValue: any, public omit: boolean = false) {}

  public readonly $STOP = true;
}
