import { collectObj, createFactory, iterFunction, solverSpace } from "./types";
import { Stop } from "./Stop";


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
    has() {
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
    clone(c: collectObj) {
      return cf.create(c.value);
    },
    clear(c: collectObj) {
      c._$(undefined);
    }
  }
  const iterate = (c: collectObj, iterFn: iterFunction) => {
    const { size, iter } = c;

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
      ++iterations
    } while (iterations <= size);
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
    get() {
      throw new Error('get be overridden over IntegerKeySolver')
    },
    set() {
      throw new Error('set be overridden over IntegerKeySolver')
    },
    has(c: collectObj, key: any) {
      if (typeof key !== 'number') {
        console.warn('has passed non-numeric key');
        return false;
      }
      if (key < 0 || key >= c.size || key !== Math.floor(key)) {
        return false;
      }
      return true;
    },
  }
  const loopingSolver = {
    map(c: collectObj, iterFn: iterFunction) {
      return mutate(c, iterFn);
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
      if (typeof key !== 'number') {
        throw new Error(`non numeric key passed to get: ${key}`)
      }
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
    }
  };

  solvers.set = {
    ...integerKeySolver,
    ...sizeBasedSolver,
    ...loopingSolver,
    get(c: collectObj, key: number) {
      return Array.from(c.value.values())[key];
    },
    set(c: collectObj, key: number, value: any) {
      const values = Array.from(c.value.values()).map((v, i) => {
        if (i === key) {
          return value;
        }
        return v;
      });
      c._$(new Set(values));
    },
    clone(c: collectObj) {
      return cf.create(new Set(c.value));
    },
    clear(c: collectObj) {
      c.value.clear();
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
    has(c, key) {
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
    has(c: collectObj, key) {
      return key in c.value;
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
    }
  }

  return solvers;
}
