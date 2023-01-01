import { collectObj, createFactory, iterFunction, reduceFunction, solverSpace } from "./types";
import { Stop } from "./Stop";

const iterate = (c: collectObj, iterFn: iterFunction) => {

  for (const [key, value] of c.iter) {
    const out = (() => {
      try {
        return iterFn(value, key, c);
      } catch (err) {
        return err;
      }
    })()
    if (out instanceof Stop || out?.$STOP) {
      break;
    }
  }
}
const mutate = (c: collectObj, iterFn: iterFunction) => {
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
    })()
    if (out instanceof Stop || out?.$STOP) {
      break;
    }
    if (out instanceof Error) {
      throw out;
    }
    c2.set(key, out);
    ++iterations
  } while (iterations <= size);
  return c2.value;
}
const select = (c: collectObj, reduceFn: reduceFunction, initial?: any) => {
  let memo =   initial;

  for (const [key,value] of c.iter) {
    try {
      memo = reduceFn(memo, value, key, c)
    } catch (err: any) {
      if (err.$STOP) {
        if ('value' in err) {
          memo = err.value;
        }
        break;
      }
    }
  }

  return memo;
}

const allItemKeys = (c: collectObj, item: any) => {
  const out = [];
  for (const [key, iItem] of c.iter) {
    if (iItem === item) {
      out.push(key)
    }
  }
  return out;
}
const testNumericKey = (key: any) => {
  if (typeof key !== 'number') {
    throw new Error(`non numeric key passed to get: ${key}`)
  }
  if (!Number.isFinite(key)) {
    throw new Error('infinite keys are not allowed');
  }
  if (key < 0 || !Number.isInteger(key)) {
    throw new Error(`key ${key} must be a whole number`);
  }
}

export const cf: createFactory = {
  create: (value: any) => {
    throw new Error('must be replaced with a real creator')
  }
}

export const makeSolvers = () => {

  const solvers: solverSpace = {};

  const scalarSolver = {
    keys() {
      return []
    },
    values() {
      return []
    },
    size() {
      return 0
    },
    get(c: collectObj, key: any) {
      throw new Error(`cannot get ${key} from form ${c.form}`);
    },
    set(c: collectObj, key: any, _value: any) {
      throw new Error(`cannot set ${key} to form ${c.form}`);
    },
    hasKey() {
      return false;
    },
    hasItem() {
      return false;
    },
    iter(c: collectObj): IterableIterator<[any, any]> {
      throw new Error(`cannot iterate on a ${c.form}`);
    },
    forEach(c: collectObj, iter: iterFunction) {
      throw new Error(`cannot iterate over ${c.form}`);
    },
    map(c: collectObj, iter: iterFunction) {
      throw new Error(`cannot iterate over ${c.form}`);
    },
    reduce(c: collectObj, iter: reduceFunction, initial?: any) {
      throw new Error(`cannot reduce ${c.form}`);
    },
    clone(c: collectObj) {
      return cf.create(c.value);
    },
    clear(c: collectObj) {
      c._$(undefined);
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
    }
  }

  // partial solvers

  const integerKeySolver = {
    ...scalarSolver,
    keys(c: collectObj) {
      const keys: number[] = [];
      const size: number = c.size;
      for (let key = 0; key < size; ++key) {
        keys.push(key)
      }
      return keys;
    },
    values() {
      throw new Error('values get be overridden over IntegerKeySolver')
    },
    size() {
      throw new Error('size must be overridden over IntegerKeySolver')
    },
    hasKey(c: collectObj, key: any) {
      testNumericKey(key);
      return key < c.size
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
    }
  }
  const loopingSolver = {
    map(c: collectObj, iterFn: iterFunction) {
      return mutate(c, iterFn);
    },
    reduce(c: collectObj, redFn: reduceFunction, memo: any) {
      return select(c, redFn, memo);
    },
    forEach(c: collectObj, iterFn: iterFunction) {
      iterate(c, iterFn);
    }
  }
  const sizeBasedSolver = {
    size(c: collectObj) {
      return c.value.size;
    },
    values(c: collectObj) {
      return Array.from(c.value.values());
    },
    iter(c: collectObj) {
      return c.value.entries();
    },
  }

  solvers.void = {
    ...scalarSolver
  }

  solvers.scalar = { ...scalarSolver };
  solvers.function = {
    ...scalarSolver,
    clear(c: collectObj) {
      c._$(() => {
      }); // noop
    }
  };

  solvers.array = {
    ...integerKeySolver,
    ...loopingSolver,
    size(c: collectObj) {
      return c.value.length;
    },
    get(c, key) {
      testNumericKey(key);
      return c.value[key];
    },
    values(c: collectObj) {
      return [...c.value];
    },
    iter(c: collectObj) {
      return c.value.entries();
    },
    clone(c: collectObj) {
      return cf.create([...c.value]);
    },
    clear(c: collectObj) {
      c._$([])
    },
    set(c: collectObj, key: any, value: any) {
      if (typeof key !== 'number') {
        throw new Error('can only set array values with numbers');
      }
      if (!Number.isInteger(key)) {
        throw new Error('arrays keys must be integers');
      }
      if (key < 0) {
        throw new Error('arrays keys must be whole numbers');
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
        c._$(c.map((value, key) => {
          if (Array.isArray(keyOrKeys)) {
            if (keyOrKeys.includes(key)) {
              return undefined;
            }
          } else if (keyOrKeys === key) {
            return undefined;
          }
          return value;
        }))
      }
      c._$((c.value as Array<any>).filter((value: any, key: number) => {
        if (Array.isArray(keyOrKeys)) {
          if (keyOrKeys.includes(key)) {
            return false;
          }
        } else if (keyOrKeys === key) {
          return false;
        }
        return true;
      }))
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
          })
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
          })
        } else {
          list = list.filter((lItem) => lItem !== itemOrItems);
        }
      }
      c._$(list)
    },
    hasItem(c: collectObj, item: any) {
      return (c.value as Array<any>).includes(item);
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
            out.push(...itemOrItems)
          } else {
            out.push(itemOrItems);
          }
          added = true;
        }
        out.push(iItem);
      });

      if (!added) {
        if (Array.isArray(itemOrItems)) {
          out.push(...itemOrItems)
        } else {
          out.push(itemOrItems);
        }
      }

      c._$(out);
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
            out.push(...itemOrItems)
          } else {
            out.push(itemOrItems);
          }
          added = true;
        }
      });

      if (!added) {
        if (Array.isArray(itemOrItems)) {
          out.push(...itemOrItems)
        } else {
          out.push(itemOrItems);
        }
      }

      c._$(out);
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
      c._$(new Set(values));
    },
    clone(c: collectObj) {
      return cf.create(new Set(c.value));
    },
    clear(c: collectObj) {
      c.value.clear();
    },
    iter(c: collectObj) {
      return (c.value as Set<any>).entries()
    },
    map(c: collectObj, iterFn: iterFunction) {
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
      return out;
    },
    keyOf(c: collectObj, item: any, allKeys?: boolean) {
      if (allKeys) {
        return allItemKeys(c, item);
      }
      return cf.create(c.values).keyOf(item);
    },
    deleteKey(c: collectObj, keyOrKeys: any) {
      const newSet = new Set(c.value);
      if (Array.isArray(keyOrKeys)) {
        keyOrKeys.forEach(((key) => {
          newSet.delete(c.get(key))
        }))
        c._$(newSet);
      } else if (keyOrKeys < c.size) {
        const item = c.get(keyOrKeys);
        (c.value as Set<any>).delete(item)
      }
    },
    deleteItem(c: collectObj, itemOrItems: any) {
      const list: Set<any> = new Set(c.value);

      if (Array.isArray(itemOrItems)) {
        itemOrItems.forEach((item) => {
          list.delete(item);
        })
      } else {
        list.delete(itemOrItems);
      }

      c._$(list)
    },
    hasItem(c: collectObj, item: any) {
      return (c.value as Set<any>).has(item);
    },
    addBefore(c: collectObj, itemOrItems: any, key?: number) {
      const standin = cf.create(c.values);
      standin.deleteItem(itemOrItems);

      standin.addBefore(itemOrItems, key);
      c._$(new Set(standin.values));
    },
    addAfter(c: collectObj, itemOrItems: any, key?: number) {
      const standin = cf.create(c.values);
      standin.deleteItem(itemOrItems);
      standin.addAfter(itemOrItems, key);
      c._$(new Set(standin.values));
    }
  }

  solvers.map = {
    ...sizeBasedSolver,
    ...loopingSolver,
    keys(c) {
      return Array.from(c.value.keys());
    },
    get(c, key) {
      return c.value.get(key);
    },
    hasKey(c, key) {
      return c.value.has(key);
    },
    set(c, key: any, value: any) {
      c.value.set(key, value);
    },
    clone(c: collectObj) {
      return cf.create(new Map(c.value));
    },
    clear(c: collectObj) {
      c.value.clear();
    },
    iter(c: collectObj) {
      return (c.value as Map<any, any>)[Symbol.iterator]()
    },
    keyOf(c: collectObj, item, allKeys?: boolean) {
      if (allKeys) {
        return allItemKeys(c, item);
      }
      for (const [key, value] of c.iter) {
        if (item === value) {
          return key;
        }
      }
      return undefined;
    },
    deleteKey(c: collectObj, keyOrKeys: any) {
      const newMap = new Map(c.value);
      if (Array.isArray(keyOrKeys)) {
        keyOrKeys.forEach(((key) => {
          newMap.delete(key)
        }))
        c._$(newMap);
      } else if (c.hasKey(keyOrKeys)) {
        (c.value as Map<any, any>).delete(keyOrKeys)
      }
    },
    deleteItem(c: collectObj, itemOrItems: any, once?: boolean) {
      const map: Map<any, any> = new Map(c.value);

      if (once) {
        if (Array.isArray(itemOrItems)) {
          itemOrItems.forEach((item) => {
            map.delete(c.keyOf(item));
          })
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
            if (itemOrItems === item) {
              map.delete(key);
            }
          }
        }
      }

      c._$(map);
    },
    hasItem(c: collectObj, item: any) {
      return (c.value as Map<any, any>).has(item);
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
        throw new Error('addBefore for maps requires key');
      }

      const map: Map<any, any> = new Map([[key, item]]);
      for (const [iKey, value] of c.iter) {
        if (key !== iKey) {
          map.set(iKey, value);
        }
      }
      c._$(map);
    },

    addAfter(c: collectObj, item: any, key?: number) {
      if (key === undefined) {
        throw new Error('addBefore for maps requires key');
      }

      const map: Map<any, any> = new Map([]);
      for (const [iKey, value] of c.iter) {
        if (key !== iKey) {
          map.set(iKey, value);
        }
      }
      map.set(key, item);
      c._$(map);
    }
  }

  solvers.object = {
    ...loopingSolver,
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
      return c.value[key];
    },
    hasKey(c: collectObj, key) {
      return key in c.value;
    },
    hasItem(c: collectObj, item: any) {
      for (const [key, kItem] of c.iter) {
        if (kItem === item) {
          return true;
        }
      }
      return false;
    },
    set(c: collectObj, key: any, value: any) {
      c._$({ ...c.value, [key]: value });
    },
    iter(c: collectObj): IterableIterator<[any, any]> {
      return Object.entries(c.value)[Symbol.iterator]();
    },
    clone(c: collectObj) {
      return cf.create({ ...c.value });
    },
    clear(c: collectObj) {
      c._$({})
    },
    keyOf(c: collectObj, item, allKeys?: boolean) {
      if (allKeys) {
        return allItemKeys(c, item);
      }
      for (const [key, value] of c.iter) {
        if (item === value) {
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
        c._$(obj);
      } else {
        if (keyOrKeys in obj) {
          delete obj[keyOrKeys];
          c._$(obj);
        }
      }
    },
    deleteItem(c: collectObj, itemOrItems: any, once?: boolean) {
      const value = { ...c.value };

      if (once) {
        if (Array.isArray(itemOrItems)) {
          itemOrItems.forEach((item) => {
            delete value[c.keyOf(item)];
          })
        } else {
          delete value[c.keyOf(itemOrItems)];
        }
      }

      c._$(value);
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
        throw new Error('addBefore for objects requires key');
      }

      const value = {...c.value};
      delete value[key];
      c._$({ [key]: item, ...value });
    },

    addAfter(c: collectObj, item: any, key?: number) {
      if (key === undefined) {
        throw new Error('addBefore for objects requires key');
      }

      const value = {...c.value};
      delete value[key];
      c._$({ ...value, [key]: item });
    }
  }

  return solvers;
}
