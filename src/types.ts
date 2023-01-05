export type collectOpts = {
  lockType?: boolean;
  debug?: boolean;
  keyComp?: compFn;
  valueComp?: compFn;
}

export type Stopper = {
  $STOP: boolean;
  value?: any;
}

export interface collectObj {
  opts: collectOpts;
  value: any;
  store: any;
  type: string;
  form: string;
  family: string;
  keys: any[];
  values: any[];
  items: any[];
  size: number;
  hasKey: (key: any) => boolean;
  hasValue: (item: any) => boolean;

  change(v: any): collectObj; // an internal method to update the value - not for general use.
  iter: IterableIterator<[any, any]>;
  forEach: (iterFn: iterFn) => collectObj;
  map: (iterFn: iterFn) => collectObj;

  reduce(iterFn: reduceFn, initial?: any): collectObj;

  filter(filter: filterFn, preserveKeys?: boolean): collectObj;

  getMap(iter: iterFn): any;

  getReduce(iter: reduceFn, initial?: any): any;

  getFilter(filter: filterFn): any;

  clone: (deep?: boolean) => collectObj;
  cloneEmpty: () => collectObj;
  get: (key: any) => any;
  set: (key: any, value: any) => collectObj;

  clear(): collectObj;

  keyOf: (item: any, allKeys?: boolean) => any;
  deleteKey: (key: any, preserveKeys?: boolean) => collectObj;
  deleteItem: (item: any, once?: boolean, preserveKeys?: boolean) => collectObj;
  first: (count?: number) => any[];
  last: (count?: number) => any[];
  firstItem: any;
  lastItem: any;

  addBefore(item: any, key?: any): collectObj;

  addAfter(item: any, key?: any): collectObj;

  sort(sf?: sortFn): collectObj;

  sameValues(a: any, b: any): boolean;

  sameKeys(a: any, b: any): boolean;

  removeLast(count?: number, entries?: boolean): any[];

  removeFirst(count?: number, entries?: boolean): any[];

  append(items: any, atKey?: any): collectObj;

  selectKeys(keys: any, preserveKeys?: boolean): collectObj;

  selectValues(keys: any, preserveKeys?: boolean): collectObj;
}

export type generalObj = { [key: string]: any };
export type objIter = [key: string, value: any];

export type solverFn = (collect: collectObj, name?: string) => any;
export type reduceFn = (memo: any, value: any, key: any, collect: collectObj) => any;
export type iterFn = (value: any, key: any, collect: collectObj) => any;
export type filterFn = (value: any, key: any, collect: collectObj) => boolean | Stopper;
export type sortFn = (a: any, b: any) => number;
export type compFn = (a: any, b: any) => boolean;

export interface solverObj {
  // introspection
  keys(c: collectObj): any[];

  values(c: collectObj): any[];

  size(c: collectObj): number;

  set(c: collectObj, key: any, value: any): void;

  get(c: collectObj, key: any): any;

  hasKey(c: collectObj, key: any): boolean;

  hasValue(c: collectObj, item: any): boolean;

  // iteration
  iter(c: collectObj): IterableIterator<[any, any]>;

  forEach(c: collectObj, iter: iterFn): void;

  reduce(c: collectObj, reducer: reduceFn, initial?: any): void;

  getReduce(c: collectObj, reducer: reduceFn, initial?: any): any;

  filter(c: collectObj, filter: filterFn, preserveKeys?: boolean): void;

  getFilter(c: collectObj, filter: filterFn, preserveKeys?: boolean): void;

  map(c: collectObj, iter: iterFn): void;

  getMap(c: collectObj, iter: iterFn): any;

  // mutation

  clone(c: collectObj, deep?: boolean): collectObj;

  clear(c: collectObj): void;

  sort(c: collectObj, sorter?: sortFn): void;

  keyOf(c: collectObj, key: any, allKeys?: boolean): any;

  deleteKey: (c: collectObj, key: any, preserveKeys?: boolean) => void;
  deleteItem: (c: collectObj, item: any, once?: boolean, preserveKeys?: boolean) => void;

  first: (c: collectObj, count?: number) => any[];
  last: (c: collectObj, count?: number) => any[];
  addBefore: (c: collectObj, item: any, key?: any) => void;
  addAfter: (c: collectObj, item: any, key?: any) => void;

  removeLast(c: collectObj, count?: number, entries?: boolean): any[];

  removeFirst(c: collectObj, count?: number, entries?: boolean): any[];

  append(c: collectObj, item: any, atKey?: any): void;

  selectKeys(c: collectObj, keys: any, preserveKeys?: boolean): void;

  selectValues(c: collectObj, items: any, preserveKeys?: boolean): void;
}

export type solverSpace = { [key: string]: solverObj };

export type createFn = (value: any, opts?: collectOpts) => collectObj;
export type sandbox = { create: createFn, Collect?: any }
