export type collectOpts = {
  lockType?: boolean
}
export type collectObj = {
  value: any;
  type: string;
  form: string;
  keys: any[];
  values: any[];
  size: number;
  _$(v: any): void; // an internal method to update the value - not for general use.
  iter: IterableIterator<[any, any]>;
  forEach: (iterFn: iterFunction) => void;
  map: (iterFn: iterFunction) => any;
  clone: () => collectObj;
  get: (key: any) => any;
  set: (key: any, value: any) => void;
  clear(): void;
  keyOf: (key: any) => any
}

export type solverFn = (collect: collectObj, name?: string) => any;

export type iterFunction = (value: any, key: any, collect: collectObj) => any;

export interface solverObj {
  // introspection
  keys(c: collectObj): any[];
  values(c: collectObj): any[];
  size(c: collectObj): number;

  set(c: collectObj, key: any, value: any): void;
  get(c: collectObj, key: any): any;
  has(c: collectObj, key: any): boolean;

  // iteration
  iter(c: collectObj) : IterableIterator<[any, any]>;
  forEach(c: collectObj, iter: iterFunction) : void;
  map (c: collectObj, iterFn: iterFunction) : any;
  clone(c: collectObj) : collectObj;
  clear(c: collectObj) : void;
  keyOf(c: collectObj, key: any): any;
}

export type solverSpace = { [key: string]: solverObj };

export type createFn = (value: any) => collectObj;
export type createFactory = { create: createFn }
