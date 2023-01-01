export type collectOpts = {
  lockType?: boolean;
  debug?: boolean
}
export type collectObj = {
  opts?: {[key: string] : any};
  value: any;
  store: any;
  type: string;
  form: string;
  keys: any[];
  values: any[];
  items: any[];
  size: number;
  hasKey: (key: any) => boolean;
  hasItem: (item: any) => boolean;
  _$(v: any): void; // an internal method to update the value - not for general use.
  iter: IterableIterator<[any, any]>;
  forEach: (iterFn: iterFunction) => collectObj;
  map: (iterFn: iterFunction) => any;
  reduce: (iterFn: reduceFunction, initial?: any) => any;
  clone: () => collectObj;
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
  addBefore(item: any, key?: any) : collectObj;
  addAfter(item: any, key?: any) : collectObj;
}

export type solverFn = (collect: collectObj, name?: string) => any;

export type reduceFunction = (memo: any, value: any, key: any, collect: collectObj) => any;
export type iterFunction = (value: any, key: any, collect: collectObj) => any;

export interface solverObj {
  // introspection
  keys(c: collectObj): any[];
  values(c: collectObj): any[];
  size(c: collectObj): number;

  set(c: collectObj, key: any, value: any): void;
  get(c: collectObj, key: any): any;
  hasKey(c: collectObj, key: any): boolean;
  hasItem(c: collectObj, item: any): boolean;

  // iteration
  iter(c: collectObj) : IterableIterator<[any, any]>;
  forEach(c: collectObj, iter: iterFunction) : void;
  reduce(c: collectObj, iter: reduceFunction, initial?: any): any;
  map (c: collectObj, iterFn: iterFunction) : any;
  clone(c: collectObj) : collectObj;
  clear(c: collectObj) : void;
  keyOf(c: collectObj, key: any, allKeys?: boolean): any;
  deleteKey: (c: collectObj, key: any, preserveKeys?: boolean) => void;
  deleteItem: (c: collectObj, item: any, once?: boolean, preserveKeys?: boolean) => void;

  first: (c: collectObj, count?: number) => any[];
  last: (c: collectObj, count?: number) => any[];
  addBefore: (c: collectObj, item: any, key?: any) => void;
  addAfter: (c: collectObj, item: any, key?: any) => void;
}

export type solverSpace = { [key: string]: solverObj };

export type createFn = (value: any) => collectObj;
export type createFactory = { create: createFn }
