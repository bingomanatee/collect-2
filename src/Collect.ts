import { collectObj, collectOpts, iterFunction, solverFn } from "./types";
import { type } from "@wonderlandlabs/walrus";
import { makeSolvers, cf } from "./solvers";
import clone from "lodash.clone";

export const c = (...args: any[]) => (new Collect(...args));

cf.create = c;

const solvers = makeSolvers();

export class Collect implements collectObj {
  constructor(value?: any, opts?: collectOpts) {
    this._value = value;
    this.opts = opts;
  }
  opts?: collectOpts;

  private _value?: any;
  get value(): any {
    return this._value;
  }

  set value(value: any) {
    this._type = undefined;
    this._keySolver = undefined;
    this._value = value;
  }

  // ---------- misc. change methodss

  clone(): collectObj {
    return new Collect(clone(this.value));
  }

  _$(v: any) {
    //@TODO: enforce locking
    this._value = v;
    this._type = type.describe(v);
  }

  clear(): collectObj {
    solvers[this.form]?.clear(this);
    return this;
  }

  // ----------- introspection

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
    return solvers[this.form]?.keys(this) ?? [];
  }

  get values(): any[] {
    return solvers[this.form]?.values(this) ?? [];
  }

  keyOf(item: any, allKeys?: boolean) {
    return solvers[this.form]?.keyOf(this, item, allKeys);
  }

  get size(): number {
    return solvers[this.form]?.size(this) ?? 0;
  }

  hasKey(key: any) {
    return solvers[this.form]?.hasKey(this, key);
  }

  set(key: any, value: any): collectObj {
    solvers[this.form]?.set(this, key, value);
    return this;
  }

  get(key: any): any {
    return solvers[this.form]?.get(this, key);
  }

  get iter(): IterableIterator<[any, any]> {
    return solvers[this.form]?.iter(this);
  }

  forEach(iter: iterFunction): collectObj {
    solvers[this.form]?.forEach(this, iter);
    return this;
  }

  map(iter: iterFunction): void {
    return solvers[this.form]?.map(this, iter);
  }

  deleteKey(keyOrKeys: any, preserveKeys?: boolean): collectObj {
    solvers[this.form]?.deleteKey(this, keyOrKeys, preserveKeys);
    return this;
  }

  deleteItem(itemOrItems: any, once?: boolean, preserveKeys?: boolean): collectObj {
    solvers[this.form]?.deleteItem(this, itemOrItems, once, preserveKeys);
    return this;
  }

}
