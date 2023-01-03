import { Stopper } from './types'

export class Stop extends Error implements Stopper {
  constructor(public value?: any) {
    super('stopped');
  }

  public readonly $STOP = true;
}
