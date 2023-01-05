import { collectObj, collectOpts, filterFn, iterFn, reduceFn, solverFn, sortFn } from "./types";
import { type } from "@wonderlandlabs/walrus";
import { makeSolvers } from "./solvers";
import { sandboxObj } from "./sandboxObj";

export const c = (...args: any[]): collectObj => {
  if (args[0] instanceof Collect) {
    if (!args[1]) return args[0];
    return new Collect(args[0].value, args[1]).clone();
  }
  return new Collect(...args);
};

sandboxObj.create = c;

const solvers = makeSolvers();

export class Collect implements collectObj {
  constructor(value?: any, opts?: collectOpts) {
    this._value = value;
    if (opts) {
      this.opts = opts;
    }
  }

  get opts(): collectOpts {
    return this._opts || {}
  }

  set opts(value: collectOpts) {
    this._opts = value
  }

  private _opts?: collectOpts;

  private _value?: any;
  get value(): any {
    return this._value;
  }

  set value(value: any) {
    this._type = undefined;
    this._keySolver = undefined;
    this._value = value;
  }

  get store() {
    console.warn('store is deprecated for .value');
    return this.value;
  }

  // ----------- introspection

  private _type?: any;
  private get typeBase() {
    if (!this._type) {
      this._type = type.describe(this.value);
    }
    return this._type;
  }
  get type(): string {
    return this.typeBase?.type || '';
  }

  get form(): string {
    return this.typeBase?.form || '';
  }

  get family(): string {
    return this.typeBase?.family || '';
  }

  private _keySolver?: solverFn;

  get keys(): any[] {
    return solvers[this.form]?.keys(this) ?? [];
  }

  get values(): any[] {
    return solvers[this.form]?.values(this) ?? [];
  }

  get items(): any[] {
    console.warn('items are deprecated; use .values');
    return this.values;
  }

  keyOf(item: any, allKeys?: boolean) {
    return solvers[this.form]?.keyOf(this, item, allKeys);
  }

  get size(): number {
    return solvers[this.form]?.size(this) ?? 0;
  }

  hasKey(key: any) : boolean {
    return solvers[this.form]?.hasKey(this, key);
  }

  hasValue(item: any): boolean {
    try {
      return solvers[this.form]?.hasValue(this, item);
    } catch (err) {
      console.log('cannot hasValue ', this, 'for ', item);
      throw err;
    }
  }

  first(count?: number) {
    return solvers[this.form]?.first(this, count);
  }

  last(count?: number) {
    return solvers[this.form]?.last(this, count);
  }

  get firstItem(): any {
    return this.first(1).pop();
  }

  get lastItem(): any {
    return this.last(1).pop();
  }

  // ----------- iteration

  get iter(): IterableIterator<[any, any]> {
    return solvers[this.form]?.iter(this);
  }

  forEach(iter: iterFn): collectObj {
    solvers[this.form]?.forEach(this, iter);
    return this;
  }

  reduce(iter: reduceFn, initial?: any): collectObj {
    solvers[this.form].reduce(this, iter, initial);
    return this;
  }

  map(iter: iterFn): collectObj {
    solvers[this.form]?.map(this, iter);
    return this;
  }

  filter(filter: filterFn, preserveKeys?: boolean) {
    solvers[this.form]?.filter(this, filter, preserveKeys);
    return this;
  }

  getReduce(iter: reduceFn, initial?: any): collectObj {
    return solvers[this.form].getReduce(this, iter, initial);
  }

  getMap(iter: iterFn): collectObj {
    return solvers[this.form]?.getMap(this, iter);
  }

  getFilter(filter: filterFn, preserveKeys?: boolean) {
    return solvers[this.form]?.getFilter(this, filter, preserveKeys);
  }

  // ----------- mutation

  clone(deep?: boolean): collectObj {
    return solvers[this.form]?.clone(this, deep);
  }

  cloneEmpty(): collectObj {
    return this.clone(true).clear();
  }

  change(v: any): collectObj {
    if (v instanceof Collect) v = v.clone().value;
    //@TODO: enforce locking
    this._value = v;
    this._type = type.describe(v);
    return this;
  }

  clear(): collectObj {
    solvers[this.form]?.clear(this);
    return this;
  }

  set(key: any, value: any): collectObj {
    solvers[this.form]?.set(this, key, value);
    return this;
  }

  get(key: any): any {
    return solvers[this.form]?.get(this, key);
  }

  deleteKey(keyOrKeys: any, preserveKeys?: boolean): collectObj {
    solvers[this.form]?.deleteKey(this, keyOrKeys, preserveKeys);
    return this;
  }

  deleteItem(itemOrItems: any, once?: boolean, preserveKeys?: boolean): collectObj {
    solvers[this.form]?.deleteItem(this, itemOrItems, once, preserveKeys);
    return this;
  }

  addBefore(itemOrItems: any, key?: any) {
    solvers[this.form]?.addBefore(this, itemOrItems, key);
    return this;
  }

  addAfter(itemOrItems: any, key?: any) {
    solvers[this.form]?.addAfter(this, itemOrItems, key);
    return this;
  }

  sort(sort?: sortFn) {
    solvers[this.form]?.sort(this, sort);
    return this;
  }

  sameKeys(a: any, b: any) {
    if (a === b) {
      return true;
    }
    if (this.opts.keyComp) {
      return this.opts.keyComp(a, b);
    }
    return false;
  }

  sameValues(a: any, b: any) {
    if (a === b) {
      return true;
    }
    return this.opts.valueComp ? this.opts.valueComp(a, b) : false;
  }

  removeFirst(count?: number, entries?: boolean) {
    return solvers[this.form]?.removeFirst(this, count, entries);
  }

  removeLast(count?: number, entries?: boolean) {
    return solvers[this.form]?.removeLast(this, count, entries);
  }

  append(item: any, atKey?: any) {
    solvers[this.form]?.append(this, item, atKey);
    return this;
  }

  selectKeys(keys: any, preserveKeys?: boolean) {
    solvers[this.form]?.selectKeys(this, keys, preserveKeys);
    return this;
  }

  selectValues(values: any, preserveKeys?: boolean) {
    solvers[this.form]?.selectValues(this, values, preserveKeys);
    return this;
  }
}

sandboxObj.Collect = Collect;
