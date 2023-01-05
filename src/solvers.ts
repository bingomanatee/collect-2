import { collectObj, filterFn, generalObj, iterFn, objIter, reduceFn, solverSpace, sortFn } from "./types";
import clone from "lodash.clonedeep";
import { Stop } from "./Stop";
import { sandboxObj } from "./sandboxObj";

const iterate = (c: collectObj, iterFn: iterFn) => {

  for (const [key, value] of c.iter) {
    const out = (() => {
      try {
        return iterFn(value, key, c);
      } catch (err) {
        return err;
      }
    })();
    if (out instanceof Stop || out?.$STOP) {
      break;
    }
  }
};
const mutate = (c: collectObj, iterFn: iterFn) => {
  const { size, iter } = c;
  const c2 = c.clone();
  c2.clear();

  let iterations = 0;
  do {
    const n = iter.next();

    if (!n || n.done) {
      break;
    }
    const { value: [key, value] } = n;
    const out = (() => {
      try {
        return iterFn(value, key, c);
      } catch (err) {
        return err;
      }
    })();
    if (out instanceof Stop || out?.$STOP) {
      break;
    }
    if (out instanceof Error) {
      throw out;
    }
    c2.set(key, out);
    ++iterations;
  } while (iterations <= size);
  return c2.value;
};
const reduce = (c: collectObj, reduceFn: reduceFn, initial?: any) => {
  let memo = initial;

  for (const [key, value] of c.iter) {
    try {
      memo = reduceFn(memo, value, key, c);
    } catch (err: any) {
      if (err.$STOP) {
        if ("value" in err) {
          return err.value;
        }
        return memo;
        break;
      }
    }
  }

  return memo;
};

const allItemKeys = (c: collectObj, item: any) => {
  const out = [];
  for (const [key, iItem] of c.iter) {
    if (c.sameKeys(item, iItem)) {
      out.push(key);
    }
  }
  return out;
};
const testNumericKey = (key: any, returnBool?: boolean): boolean => {
  if (typeof key !== "number") {
    if (returnBool) {
      return false;
    }
    throw new Error(`non numeric key passed to get: ${key}`);
  }
  if (!Number.isFinite(key)) {
    if (returnBool) {
      return false;
    }
    throw new Error("infinite keys are not allowed");
  }
  if (key < 0 || !Number.isInteger(key)) {
    if (returnBool) {
      return false;
    }
    throw new Error(`key ${key} must be a whole number`);
  }
  return true;
};

export const key4key = (c: collectObj, key: any, debug?: boolean) => {
  if (c.opts.keyComp) {
    for (const [iKey] of c.iter) {
      if (debug) {
        console.log("---- key4key: comparing ", iKey, "to", key);
      }
      if (c.sameKeys(key, iKey)) {
        if (debug) {
          console.log("--- key4key comparator:", c.opts.keyComp?.toString());
          console.log("---- key4key: found", iKey, " to match ", key);
        }
        return iKey;
      }
    }
  }
  if (debug) {
    console.log("---- key4key - no match for", key);
  }
  return key;
};

function* appendGenerator(source: collectObj, input: collectObj, atKey?: any) {
  let added = false;
  for (const [key, value] of source.iter) {
    if (!input.hasKey(key)) {
      yield [key, value];
    }
    if (source.sameKeys(key, atKey)) {
      for (const [inputKey, inputItem] of input.iter) {
        yield [inputKey, inputItem];
      }
      added = true;
    }
  }
  if (!added) {
    for (const [inputKey, inputItem] of input.iter) {
      yield [inputKey, inputItem];
    }
  }
}

export const makeSolvers = () => {

  const solvers: solverSpace = {};

  const scalarSolver = {
    keys() {
      return [];
    },
    values() {
      return [];
    },
    size() {
      return 0;
    },
    get(c: collectObj, key: any) {
      throw new Error(`cannot get ${key} from form ${c.form}`);
    },
    set(c: collectObj, key: any, _value: any) {
      throw new Error(`cannot set ${key} to form ${c.form}`);
    },
    sort(c: collectObj) {
      throw new Error(`cannot sort form ${c.form}`);
    },
    hasKey() {
      return false;
    },
    hasValue() {
      return false;
    },
    iter(c: collectObj): IterableIterator<[any, any]> {
      throw new Error(`cannot iterate on a ${c.form}`);
    },
    forEach(c: collectObj, iter: iterFn) {
      throw new Error(`cannot iterate over ${c.form}`);
    },
    map(c: collectObj, iter: iterFn) {
      throw new Error(`cannot iterate over ${c.form}`);
    },
    reduce(c: collectObj, iter: reduceFn) {
      throw new Error(`cannot reduce ${c.form}`);
    },
    filter(c: collectObj, filter: filterFn) {
      throw new Error(`cannot filter ${c.form}`);
    },
    getMap(c: collectObj, iter: iterFn) {
      throw new Error(`cannot iterate over ${c.form}`);
    },
    getReduce(c: collectObj, iter: reduceFn) {
      throw new Error(`cannot reduce ${c.form}`);
    },
    getFilter(c: collectObj, filter: filterFn) {
      throw new Error(`cannot filter ${c.form}`);
    },
    clone(c: collectObj) {
      return sandboxObj.create(c.value, c.opts);
    },
    clear(c: collectObj) {
      c.change(undefined);
    },
    keyOf(c: collectObj, item: any, allKeys?: boolean) {
      throw new Error(`cannot get keyOf ${c.form}`);
    },
    deleteKey(c: collectObj, keyOrKeys: any, preserveKeys?: boolean) {
      throw new Error(`cannot delete keys of ${c.form}`);
    },
    deleteItem(c: collectObj, item: any, once?: boolean) {
      throw new Error(`cannot delete items of ${c.form}`);
    },
    first(c: collectObj) {
      throw new Error(`cannot get first from ${c.form}`);
    },
    last(c: collectObj) {
      throw new Error(`cannot get first from ${c.form}`);
    },
    addBefore(c: collectObj) {
      throw new Error(`cannot add before a ${c.form}`);
    },
    addAfter(c: collectObj) {
      throw new Error(`cannot add after a ${c.form}`);
    },
    removeFirst(c: collectObj) {
      throw new Error(`cannot removeFirst of ${c.form}`);
    },
    removeLast(c: collectObj) {
      throw new Error(`cannot removeLast of ${c.form}`);
    },
    append(c: collectObj, item: any, atKey?: any) {
      throw new Error(`cannot append to ${c.form}`);
    },
    selectValues(c: collectObj) {
      throw new Error(`cannot selectValues to ${c.form}`);
    },
    selectKeys(c: collectObj) {
      throw new Error(`selecctKeys selectItems to ${c.form}`);
    }
  };

  // partial solvers

  const integerKeySolver = {
    ...scalarSolver,
    keys(c: collectObj) {
      const keys: number[] = [];
      const size: number = c.size;
      for (let key = 0; key < size; ++key) {
        keys.push(key);
      }
      return keys;
    },
    values() {
      throw new Error("values get be overridden over IntegerKeySolver");
    },
    size() {
      throw new Error("size must be overridden over IntegerKeySolver");
    },
    hasKey(c: collectObj, key: any) {
      if (c.opts.keyComp) {
        key = key4key(c, key);
      }

      if (!testNumericKey(key, true)) {
        return false;
      }
      return key < c.size;
    },
    first(c: collectObj, count?: number) {
      if (count === undefined || count < 1) {
        return c.values.slice(0, 1);
      }
      return c.values.slice(0, count);
    },
    last(c: collectObj, count?: number) {
      if (count === undefined || count < 1) {
        return c.values.slice(-1);
      }
      return c.values.slice(-count);
    },
    selectKeys(c: collectObj, keys: any, preserveKeys?: boolean) {
      if (typeof keys === "function") {
        if (preserveKeys) {
          c.map((item, key) => {
            if (keys(item, key, c)) {
              return item;
            }
            return undefined;
          });
        } else {
          c.filter(keys);
        }
      } else if (preserveKeys) {
        const keyItems = sandboxObj.create(keys,
          c.opts.keyComp ? undefined : { valueComp: c.opts.keyComp }
        );
        c.map((item, key) => {
          if (keyItems.hasValue(key)) {
            return item;
          }
          return undefined;
        });
      } else {
        const keyItems = sandboxObj.create(keys,
          c.opts.keyComp ? undefined : { valueComp: c.opts.keyComp }
        );
        c.filter((item, key) => keyItems.hasValue(key));
      }
    },
    selectValues(c: collectObj, values: any, preserveKeys?: boolean) {
      if (typeof values === "function") {
        if (preserveKeys) {
          c.map((item, key) => {
            if (values(key, { item, key }, c)) {
              return item;
            }
            return undefined;
          });
        } else {
          c.filter(values);
        }
      } else {
        const valueSet = sandboxObj.create(values,
          c.opts.valueComp ? c.opts : undefined
        );
        if (preserveKeys) {
          c.map((item) => {
            if (valueSet.hasValue(item)) {
              return item;
            }
            return undefined;
          });
        } else {
          c.filter((item) => valueSet.hasValue(item));
        }
      }
    }
  };
  const loopingSolver = {
    map(c: collectObj, iterFn: iterFn) {
      c.change(mutate(c, iterFn));
    },
    reduce(c: collectObj, redFn: reduceFn, memo: any) {
      c.change(reduce(c, redFn, memo));
    },
    getMap(c: collectObj, iterFn: iterFn) {
      return mutate(c.clone(), iterFn);
    },
    getReduce(c: collectObj, redFn: reduceFn, memo: any) {
      return reduce(c.clone(), redFn, memo);
    },
    forEach(c: collectObj, iterFn: iterFn) {
      iterate(c, iterFn);
    },
    append(c: collectObj, items: any, atKey?: any) {
      const toAdd = sandboxObj.create(items);
      if (!(toAdd.family === "container")) {
        throw new Error(`cannot append from ${toAdd.form}`);
      }

      const c2 = c.cloneEmpty();
      for (const [key, item] of appendGenerator(c, toAdd, atKey)) {
        c2.set(key, item);
      }

      c.change(c2.value);
    }
  };

  const loopingSelectSolver = {
    selectKeys(c: collectObj, keys: any) {
      if (typeof keys === "function") {
        return c.filter((item, key) => keys(key, { item, key }, c));
      }
      const keySet = sandboxObj.create(keys, c.opts.keyComp ? { valueComp: c.opts.valueComp } : undefined);
      if (keySet.family !== "container") {
        throw (`cannot select keys using key form ${keySet.form}`);
      }
      c.filter((item, key) => keySet.hasValue(key));
    },
    selectValues(c: collectObj, values: any) {
      if (typeof values === "function") {
        return c.filter(values);
      }
      const valueSet = sandboxObj.create(values, c.opts.valueComp ? c.opts : undefined);
      if (valueSet.family !== "container") {
        throw (`cannot select keys using key form ${valueSet.form}`);
      }
      c.filter((item) => valueSet.hasValue(item));
    }
  };
  const sizeBasedSolver = {
    size(c: collectObj) {
      return c.value.size;
    },
    values(c: collectObj) {
      return Array.from(c.value.values());
    },
    iter(c: collectObj) {
      return c.value.entries();
    }
  };

  solvers.void = {
    ...scalarSolver
  };

  solvers.scalar = {
    ...scalarSolver,
    clear(c: collectObj) {
      switch (c.type) {
        case "bigint":
          c.change(0);
          break;
        case "number":
          c.change(0);
          break;
        case "string":
          c.change("");
          break;
        case "symbol":
          c.change(Symbol(""));
          break;
        case "boolean":
          c.change(false);
          break;
        default:
          console.warn("cannot clear type ", c.type);
          break;
      }
    }
  };
  solvers.function = {
    ...scalarSolver,
    clear(c: collectObj) {
      throw new Error("cannot clear a function");
    }
  };

  solvers.array = {
    ...integerKeySolver,
    ...loopingSolver,
    size(c: collectObj) {
      return c.value.length;
    },
    get(c, key) {
      try {
        testNumericKey(key);
        return c.value[key];
      } catch (err) {
        if (c.opts.keyComp) {
          for (const [iKey, value] of c.iter) {
            if (c.sameKeys(iKey, key)) {
              return value;
            }
          }
        }
        throw err;
      }
    },
    values(c: collectObj) {
      return [...c.value];
    },
    iter(c: collectObj) {
      return c.value.entries();
    },
    clone(c: collectObj, deep) {
      if (!deep) {
        return sandboxObj.create([...c.value], c.opts);
      }
      return sandboxObj.create(clone(c.value), c.opts);
    },
    clear(c: collectObj) {
      c.change([]);
    },
    set(c: collectObj, key: any, value: any) {
      if (typeof key !== "number") {
        throw new Error("can only set array values with numbers");
      }
      if (!Number.isInteger(key)) {
        throw new Error("arrays keys must be integers");
      }
      if (key < 0) {
        throw new Error("arrays keys must be whole numbers");
      }
      c.value[key] = value;
    },
    keyOf(c: collectObj, item: any, allKeys?: boolean) {
      if (allKeys) {
        return allItemKeys(c, item);
      }
      const num = (c.value as any[]).indexOf(item);
      if (num < 0) {
        return undefined;
      }
      return num;
    },
    deleteKey(c: collectObj, keyOrKeys: any, preserveKeys?: boolean) {
      if (preserveKeys) {
        c.change(c.map((value, key) => {
          if (Array.isArray(keyOrKeys)) {
            if (keyOrKeys.includes(key)) {
              return undefined;
            }
          } else if (keyOrKeys === key) {
            return undefined;
          }
          return value;
        }));
      }
      c.change((c.value as Array<any>).filter((value: any, key: number) => {
        if (Array.isArray(keyOrKeys)) {
          if (keyOrKeys.includes(key)) {
            return false;
          }
        } else if (keyOrKeys === key) {
          return false;
        }
        return true;
      }));
    },
    deleteItem(c: collectObj, itemOrItems: any, once?: boolean, preserveKeys?: boolean) {
      let list: any[] = c.value;
      if (once) {
        if (Array.isArray(itemOrItems)) {
          itemOrItems.forEach((item) => {
            const i = list.indexOf(item);
            if (i >= 0) {
              if (preserveKeys) {
                list[i] = undefined;
              } else {
                delete list[i];
              }
            }
          });
        } else {
          const i = list.indexOf(itemOrItems);
          if (i >= 0) {
            if (preserveKeys) {
              list[i] = undefined;
            } else {
              delete list[i];
            }
          }
        }
      } else {
        if (Array.isArray(itemOrItems)) {
          itemOrItems.forEach((item) => {
            list = list.filter((lItem) => lItem !== item);
          });
        } else {
          list = list.filter((lItem) => lItem !== itemOrItems);
        }
      }
      c.change(list);
    },
    hasValue(c: collectObj, item: any) {
      if ((c.value as Array<any>).includes(item)) {
        return true;
      }
      if (c.opts.valueComp) {
        return (c.value as Array<any>).some((iItem) => c.sameValues(iItem, item));
      }
      return false;
    },
    addBefore(c: collectObj, itemOrItems: any, key?: any) {
      const out: any[] = [];
      let added = false;
      if (key === undefined) {
        key = 0;
      }

      testNumericKey(key);
      c.forEach((iItem, iKey) => {
        if (iKey === key) {
          if (Array.isArray(itemOrItems)) {
            out.push(...itemOrItems);
          } else {
            out.push(itemOrItems);
          }
          added = true;
        }
        out.push(iItem);
      });

      if (!added) {
        if (Array.isArray(itemOrItems)) {
          out.push(...itemOrItems);
        } else {
          out.push(itemOrItems);
        }
      }

      c.change(out);
    },
    addAfter(c: collectObj, itemOrItems: any, key?: any) {
      const out: any[] = [];
      let added = false;
      if (key === undefined) {
        key = c.size;
      }

      testNumericKey(key);
      c.forEach((iItem, iKey) => {
        out.push(iItem);
        if (iKey === key) {
          if (Array.isArray(itemOrItems)) {
            out.push(...itemOrItems);
          } else {
            out.push(itemOrItems);
          }
          added = true;
        }
      });

      if (!added) {
        if (Array.isArray(itemOrItems)) {
          out.push(...itemOrItems);
        } else {
          out.push(itemOrItems);
        }
      }

      c.change(out);
    },
    sort(c: collectObj, sorter?: sortFn) {
      const sorted = (c.value as Array<any>).sort(sorter);
      c.change(sorted);
    },
    filter(c: collectObj, filter: filterFn, preserveKeys?: boolean) {
      if (preserveKeys) {
        c.reduce((memo, item, key) => {
          const out = filter(item, key, c);
          if (out && typeof out === "object" && out.$STOP) {
            if (out.value) {
              memo[key] = item;
              throw { $STOP: true, value: memo };
            }
            throw out;
          }
          memo[key] = out ? item : undefined;
          return memo;
        });
      } else {
        c.reduce((memo, item, key) => {
          const out = filter(item, key, c);
          if (out && typeof out === "object" && out.$STOP) {
            if (out.value) {
              memo.push(item);
              throw { $STOP: true, value: memo };
            }
            throw out;
          }
          if (out) {
            memo.push(item);
          }
          return memo;
        }, []);
      }
    },
    getFilter(c: collectObj, filter: filterFn, preserveKeys?: boolean) {
      if (preserveKeys) {
        return c.clone().reduce((memo, item, key) => {
          const out = filter(item, key, c);
          if (out && typeof out === "object" && out.$STOP) {
            if (out.value) {
              memo[key] = item;
              throw { $STOP: true, value: memo };
            }
            throw out;
          }
          memo[key] = out ? item : undefined;
          return memo;
        }).value;
      } else {
        return c.clone().reduce((memo, item, key) => {
          const out = filter(item, key, c);
          if (out && typeof out === "object" && out.$STOP) {
            if (out.value) {
              memo.push(item);
              throw { $STOP: true, value: memo };
            }
            throw out;
          }
          if (out) {
            memo.push(item);
          }
          return memo;
        }, []).value;
      }
    },
    append(c: collectObj, item: any, atKey?: any) {
      const c2: collectObj = (item instanceof sandboxObj.Collect) ? item : sandboxObj.create(item);
      if (c2.family !== "container") {

        throw new Error(`cannot merge from ${c2.family}`);
      }
      if (typeof atKey === "undefined") {
        c.change([...c.value, ...c2.values]);
        return;
      }
      const newValues = [...c.value];
      newValues.splice(atKey, 0, ...c2.values);
      c.change(newValues);
    },
    removeFirst(c: collectObj, count = 1, entries = false) {
      if (count < 1) {
        return [];
      }
      const removed = (c.value as Array<any>).splice(0, count);
      if (entries) {
        return removed.map((v: any, k: number) => [k, v]);
      }
      return removed;
    },
    removeLast(c: collectObj, count = 1, entries = false) {
      if (count < 1) {
        return [];
      }
      const removed = (c.value as Array<any>).splice(-count);
      if (entries) {
        return removed.map((v: any, k: number) => [k + c.value.length, v]);
      }
      return removed;
    }
  };

  solvers.set = {
    ...integerKeySolver,
    ...sizeBasedSolver,
    ...loopingSolver,
    get(c: collectObj, key: number) {
      testNumericKey(key);
      return Array.from(c.values)[key];
    },
    set(c: collectObj, key: number, value: any) {
      testNumericKey(key);
      const values = Array.from(c.value.values());
      if (values.length > key) {
        values[key] = value;
      } else {
        values.push(value);
      }
      c.change(new Set(values));
    },
    hasKey(c: collectObj, key) {
      const c2 = c.clone();
      c2.change(c.values);
      return c2.hasKey(key);
    },
    clone(c: collectObj, deep) {
      if (!deep) {
        return sandboxObj.create(new Set(c.value), c.opts);
      }
      return sandboxObj.create(clone(c.value), c.opts);
    },
    clear(c: collectObj) {
      c.value.clear();
    },
    sort(c: collectObj, sorter?: sortFn) {
      const sorted = (c.values).sort(sorter);
      c.change(new Set(sorted));
    },
    iter(c: collectObj) {
      return c.values.entries();
    },
    values(c) {
      return [...c.value.values()];
    },
    map(c: collectObj, iterFn: iterFn) {
      const out = new Set();

      for (const [key, value] of c.iter) {
        try {
          const v2 = iterFn(value, key, c);
          out.add(v2);
        } catch (err) {
          // @ts-ignore
          if (err?.$STOP) {
            break;
          }
          throw err;
        }
      }
      c.change(out);
    },
    keyOf(c: collectObj, item: any, allKeys?: boolean) {
      if (allKeys) {
        return allItemKeys(c, item);
      }
      return sandboxObj.create(c.values, c.opts).keyOf(item);
    },
    deleteKey(c: collectObj, keyOrKeys: any) {
      const newSet = new Set(c.value);
      if (Array.isArray(keyOrKeys)) {
        keyOrKeys.forEach(((key) => {
          newSet.delete(c.get(key));
        }));
        c.change(newSet);
      } else if (keyOrKeys < c.size) {
        const item = c.get(keyOrKeys);
        (c.value as Set<any>).delete(item);
      }
    },
    deleteItem(c: collectObj, itemOrItems: any) {
      const list: Set<any> = new Set(c.value);

      if (Array.isArray(itemOrItems)) {
        itemOrItems.forEach((item) => {
          list.delete(item);
        });
      } else {
        list.delete(itemOrItems);
      }

      c.change(list);
    },
    hasValue(c: collectObj, item: any) {
      if ((c.value as Set<any>).has(item)) {
        return true;
      }
      if (c.opts.valueComp) {
        for (const iItem of c.value.values()) {
          if (c.sameValues(iItem, item)) {
            return true;
          }
        }
      }
      return false;
    },
    filter(c: collectObj, filter: filterFn) {
      const cf = sandboxObj.create(c.values).filter(filter);
      c.change(new Set(cf.value));
    },
    getFilter(c: collectObj, filter: filterFn) {
      const cf = sandboxObj.create(c.values).filter(filter);
      return new Set(cf.value);
    },
    addBefore(c: collectObj, itemOrItems: any, key?: number) {
      const standin = sandboxObj.create(c.values);
      standin.deleteItem(itemOrItems);

      standin.addBefore(itemOrItems, key);
      c.change(new Set(standin.values));
    },
    addAfter(c: collectObj, itemOrItems: any, key?: number) {
      const standin = sandboxObj.create(c.values, c.opts);
      standin.deleteItem(itemOrItems);
      standin.addAfter(itemOrItems, key);
      c.change(new Set(standin.values));
    },
    removeFirst(c: collectObj, count = 1, entries?: boolean) {
      const values = c.values;
      const cf = c.clone().change(values);
      const returned = cf.removeFirst(count, entries);
      c.change(new Set(cf.value));
      return returned;
    },
    removeLast(c: collectObj, count = 1, entries?: boolean) {
      const values = c.values;
      const cf = c.clone().change(values);
      const returned = cf.removeLast(count, entries);
      c.change(new Set(cf.value));
      return returned;
    },
    append(c: collectObj, items: any, atKey?: any) {
      const vals = sandboxObj.create(c.values);
      vals.append(items, atKey);
      c.change(new Set(vals.values));
    }
  };

  solvers.map = {
    ...sizeBasedSolver,
    ...loopingSolver,
    ...loopingSelectSolver,
    keys(c) {
      return Array.from(c.value.keys());
    },
    get(c, key) {
      if (c.opts.keyComp) {
        return c.value.get(key4key(c, key));
      } else {
        return c.value.get(key);
      }
    },
    hasKey(c, key) {
      if (c.value.has(key)) {
        return true;
      }
      if (c.opts.keyComp) {
        for (const [iKey] of c.iter) {
          if (c.sameKeys(key, iKey)) {
            return true;
          }
        }
      }
      return false;
    },
    set(c, key: any, value: any) {
      if (c.opts.keyComp) {
        c.value.set(key4key(c, key), value);
      } else {
        c.value.set(key, value);
      }
    },
    clone(c: collectObj, deep) {
      if (!deep) {
        return sandboxObj.create(new Map(c.value));
      }
      return sandboxObj.create(clone(c.value));
    },
    clear(c: collectObj) {
      c.value.clear();
    },
    sort(c: collectObj, sorter?: sortFn) {
      const entries = [...(c.value as Map<any, any>).entries()];
      const map = new Map(entries.sort(sorter));
      c.change(map);
    },
    iter(c: collectObj) {
      return (c.value as Map<any, any>)[Symbol.iterator]();
    },
    keyOf(c: collectObj, item, allKeys?: boolean) {
      if (allKeys) {
        return allItemKeys(c, item);
      }
      for (const [key, value] of c.iter) {
        if (c.sameValues(item, value)) {
          return key;
        }
      }
      return undefined;
    },
    deleteKey(c: collectObj, keyOrKeys: any) {
      const newMap = new Map(c.value);
      if (Array.isArray(keyOrKeys)) {
        if (c.opts.keyComp) {
          keyOrKeys = keyOrKeys.map((key) => key4key(c, key));
        }
        keyOrKeys.forEach(((key: any) => {
          newMap.delete(key);
        }));
        c.change(newMap);
      } else if (c.hasKey(keyOrKeys)) {
        (c.value as Map<any, any>).delete(key4key(c, keyOrKeys));
      }
    },
    deleteItem(c: collectObj, itemOrItems: any, once?: boolean) {
      const map: Map<any, any> = new Map(c.value);

      if (once) {
        if (Array.isArray(itemOrItems)) {
          itemOrItems.forEach((item) => {
            map.delete(c.keyOf(item));
          });
        } else {
          map.delete(c.keyOf(itemOrItems));
        }
      } else {
        if (Array.isArray(itemOrItems)) {
          for (const [key, item] of c.iter) {
            if (itemOrItems.includes(item)) {
              map.delete(key);
            }
          }
        } else {
          for (const [key, item] of c.iter) {
            if (c.sameValues(itemOrItems, item)) {
              map.delete(key);
            }
          }
        }
      }

      c.change(map);
    },
    hasValue(c: collectObj, item: any) {
      for (const [_key, value] of c.iter) {
        if (c.sameValues(value, item)) {
          return true;
        }
      }
      return false;
    },
    first(c: collectObj, count?: number) {
      if (count === undefined || count < 1) {
        return c.values.slice(0, 1);
      }
      return c.values.slice(0, count);
    },
    last(c: collectObj, count?: number) {
      if (count === undefined || count < 1) {
        return c.values.slice(-1);
      }
      return c.values.slice(-count);
    },
    addBefore(c: collectObj, item: any, key?: number) {
      if (key === undefined) {
        throw new Error("addBefore for maps requires key");
      }
      if (c.hasKey(key)) {
        return c.set(key4key(c, key), item);
      }
      const map = new Map(
        [[key, item], ...c.value.entries()]
      );
      c.change(map);
    },
    addAfter(c: collectObj, item: any, key?: number) {
      if (key === undefined) {
        throw new Error("addBefore for maps requires key");
      }
      if (c.hasKey(key)) {
        return c.set(key4key(c, key), item);
      }
      const map = new Map(
        [...c.value.entries(), [key, item]]
      );
      c.change(map);
    },
    filter(c: collectObj, filter: filterFn) {
      const value = new Map();

      for (const [key, item] of c.iter) {
        try {
          const result = filter(item, key, c);
          if ((typeof result !== "boolean") && result.$STOP) {
            if ("value" in result && Array.isArray(result.value)) {
              const [k, v] = result.value;
              value.set(k, v);
            }
            break;
          }
          if (result) {
            value.set(key, item);
          }
        } catch (err: any) {
          if (err.$STOP) {
            if ("value" in err && Array.isArray(err.value)) {
              const [k, v] = err.value;
              value.set(k, v);
            }
            break;
          }
          throw err;
        }
      }

      c.change(value);
    },
    getFilter(c: collectObj, filter: filterFn) {
      return c.clone().filter(filter).value;
    },
    removeFirst(c: collectObj, count = 1, entries = false) {
      const returned: any[] = [];
      const changed = new Map();
      let index = 0;
      c.forEach((value, key) => {
        if (index >= count) {
          changed.set(key, value);
        } else if (entries) {
          returned.push([key, value]);
        } else {
          returned.push(value);
        }
        c.change(changed);
        index += 1;
      });
      return returned;
    },
    removeLast(c: collectObj, count = 1, entries = false) {
      const returned: any[] = [];
      const changed = new Map();
      let index = 0;
      const removeFrom = c.size - count - 1;

      c.forEach((value, key) => {
        if (index <= removeFrom) {
          changed.set(key, value);
        } else if (entries) {
          returned.push([key, value]);
        } else {
          returned.push(value);
        }
        c.change(changed);
        index += 1;
      });
      return returned;
    }
  };

  solvers.object = {
    ...loopingSolver,
    ...loopingSelectSolver,
    keys(c: collectObj) {
      return Array.from(Object.keys(c.value));
    },
    values(c: collectObj) {
      return Array.from(Object.values(c.value));
    },
    size(c: collectObj) {
      return c.keys.length;
    },
    get(c: collectObj, key) {
      if (key in c.value) {
        return c.value[key];
      } else if (c.opts.keyComp) {
        for (const [iKey, value] of c.iter) {
          if (c.sameKeys(key, iKey)) {
            return value;
          }
        }
        return undefined;
      }
    },
    hasKey(c: collectObj, key) {
      if (c.opts.keyComp) {
        for (const [iKey] of c.iter) {
          if (c.sameKeys(iKey, key)) {
            return true;
          }
        }
        return false;
      }
      return key in c.value;
    },
    hasValue(c: collectObj, item: any) {
      for (const [_key, kItem] of c.iter) {
        if (c.sameValues(kItem, item)) {
          return true;
        }
      }
      return false;
    },
    set(c: collectObj, key: any, value: any) {
      const newObj = { ...c.value };
      if (key in c.value) {
        c.value[key] = value;
      } else if (c.opts.keyComp) {
        for (const [iKey] of c.iter) {
          if (c.sameKeys(iKey, key)) {
            newObj[iKey] = value;
            c.change(newObj);
            return;
          }
        }
      }

      newObj[key] = value;
      c.change(newObj);
    },
    iter(c: collectObj): IterableIterator<[any, any]> {
      return Object.entries(c.value)[Symbol.iterator]();
    },
    clone(c: collectObj, deep) {
      if (!deep) {
        return sandboxObj.create({ ...c.value }, c.opts);
      }
      return sandboxObj.create(clone(c.value));
    },
    clear(c: collectObj) {
      c.change({});
    },
    sort(c: collectObj, sorter?: sortFn) {
      const entries: [key: string, value: any][] = [...Object.entries(c.value)].sort(sorter);
      const obj: { [key: string]: any } = {};
      entries.forEach(([key, value]) => obj[key] = value);
      c.change(obj);
    },
    keyOf(c: collectObj, item, allKeys?: boolean) {
      if (allKeys) {
        return allItemKeys(c, item);
      }
      for (const [key, value] of c.iter) {
        if (c.sameValues(item, value)) {
          return key;
        }
      }
      return undefined;
    },
    deleteKey(c: collectObj, keyOrKeys: any, _preserveKeys?: boolean) {
      const obj = { ...c.value };
      if (Array.isArray(keyOrKeys)) {
        keyOrKeys.forEach((key) => {
          if (key in obj) {
            delete obj[key];
          }
        });
        c.change(obj);
      } else {
        if (keyOrKeys in obj) {
          delete obj[keyOrKeys];
          c.change(obj);
        }
      }
    },
    deleteItem(c: collectObj, itemOrItems: any, once?: boolean) {
      const value = { ...c.value };

      if (once) {
        if (Array.isArray(itemOrItems)) {
          itemOrItems.forEach((item) => {
            delete value[c.keyOf(item)];
          });
        } else {
          delete value[c.keyOf(itemOrItems)];
        }
      }

      c.change(value);
    },
    first(c: collectObj, count?: number) {
      if (count === undefined || count < 1) {
        return c.values.slice(0, 1);
      }
      return c.values.slice(0, count);
    },
    last(c: collectObj, count?: number) {
      if (count === undefined || count < 1) {
        return c.values.slice(-1);
      }
      return c.values.slice(-count);
    },
    addBefore(c: collectObj, item: any, key?: number) {
      if (key === undefined) {
        throw new Error("addBefore for objects requires key");
      }
      if (c.hasKey(key)) {
        return c.set(key, item);
      }
      const value = { ...c.value };
      delete value[key];
      c.change({ [key]: item, ...value });
    },
    addAfter(c: collectObj, item: any, key?: number) {
      if (key === undefined) {
        throw new Error("addBefore for objects requires key");
      }

      if (c.hasKey(key)) {
        return c.set(key, item);
      }

      const value = { ...c.value };
      delete value[key];
      c.change({ ...value, [key]: item });
    },
    filter(c: collectObj, filter: filterFn) {
      const value: generalObj = {};

      for (const [key, item] of c.iter) {
        try {
          const result = filter(item, key, c);
          if ((typeof result !== "boolean") && result.$STOP) {
            if ("value" in result && Array.isArray(result.value)) {
              const [k, v]: objIter = result.value as objIter;
              value[k] = v;
            }
            break;
          }
          if (result) {
            value[key] = item;
          }
        } catch (err: any) {
          if (err.$STOP) {
            if ("value" in err && Array.isArray(err.value)) {
              const [k, v]: objIter = err.value;
              value[k] = v;
            }
            break;
          }
          throw err;
        }
      }

      c.change(value);
    },
    getFilter(c:collectObj, filter: filterFn) {
      return c.clone().filter(filter).value;
    },
    removeFirst(c: collectObj, count = 1, entries = false) {
      const returned: any[] = [];
      const changed: generalObj = {};
      let index = 0;
      c.forEach((value, key) => {
        if (index >= count) {
          changed[key] = value;
        } else if (entries) {
          returned.push([key, value]);
        } else {
          returned.push(value);
        }
        c.change(changed);
        index += 1;
      });
      return returned;
    },
    removeLast(c: collectObj, count = 1, entries = false) {
      const returned: any[] = [];
      const changed: generalObj = {};
      let index = 0;
      const removeFrom = c.size - count - 1;

      c.forEach((value, key: string) => {
        if (index <= removeFrom) {
          changed[key] = value;
        } else if (entries) {
          returned.push([key, value]);
        } else {
          returned.push(value);
        }
        c.change(changed);
        index += 1;
      });
      return returned;
    }
  };

  return solvers;
};
