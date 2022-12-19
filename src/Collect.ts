import { collectObj, collectOpts, solverFn, solverSpace } from "./types";
import { type } from "@wonderlandlabs/walrus";

const Solvers: solverSpace = {};

Solvers.void = {
  keys() {
    return []
  },
  size() {
    return 0
  }
}

Solvers.scalar = { ...Solvers.void };
Solvers.function = { ...Solvers.void };

const IntegerKeySolver = {
  ...Solvers.void,
  keys(c: collectObj) {
    const keys: number[] = [];
    const size: number = c.size;
    for (let key = 0; key < size; ++key) {
      keys.push(key)
    }
    return keys;
  },
  size() {
    throw new Error('size must be overridden over IntegerKeySolver')
  }
}

Solvers.array = {
  ...IntegerKeySolver,
  size(c: collectObj) {
    return c.value.length;
  }
};

const SizeBased = {
  size(c: collectObj) {
    return c.value.size;
  },
}

Solvers.set = {
  ...IntegerKeySolver,
  ...SizeBased
}

Solvers.map = {
  ...SizeBased,
  keys(c) {
    return Array.from(c.value.keys());
  }
}

Solvers.object = {
  keys(c: collectObj) {
    return Array.from(Object.keys(c.value));
  },
  size(c: collectObj) {
    return c.keys.length;
  }
}

export class Collect {
  constructor(value?: any, opts?: collectOpts) {
    this._value = value;
    this.opts = opts;
  }

  get value(): any {
    return this._value;
  }

  set value(value: any) {
    this._type = undefined;
    this._keySolver = undefined;
    this._value = value;
  }

  private _value?: any;
  opts?: collectOpts;

  private _type?: any;
  get type(): string {
    if (!this._type) {
      this._type = type.describe(this.value);
    }
    return this._type?.type || '';
  }

  get form(): string {
    if (!this._type) {
      this._type = type.describe(this.value);
    }
    return this._type?.form || '';
  }

  private _keySolver?: solverFn;

  get keys(): any[] {
    return Solvers[this.form]?.keys(this) ?? [];
  }

  get size(): number {
    return Solvers[this.form]?.size(this) ?? 0;
  }
}
