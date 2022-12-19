export type collectOpts = {
  lockType?: boolean
}
export type collectObj = {
  value: any;
  type: string;
  form: string;
  keys: any[];
  size: number;
}
export type solverFn = (collect: collectObj, name?: string) => any;


export interface solverObj {
  keys(c: collectObj) : any[];
  size(c: collectObj): number;
}

export type solverSpace = {[key: string] : solverObj};
