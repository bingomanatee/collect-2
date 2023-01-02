import { Collect, c } from '../index';

const caseInsensitiveComp = (a: any, b: any) => `${a}`.toLowerCase() === `${b}`.toLowerCase();

// @ts-ignore
const sortByValue = ([aKey, aValue], [bKey, bValue]) => {
  if (aValue > bValue) {
    return 1;
  }
  if (aValue < bValue) {
    return -1;
  }
  return 0;
};

const sortNumeric = (a: number, b: number) => (a - b);
const toInt = (n: any): any => {
  if (typeof n === 'string') {
    return toInt(Number.parseInt(n, 10));
  }
  if (typeof n === 'number') {
    return Math.floor(n);
  }
  return n;
}

describe('Collect', () => {
  describe('get', () => {

    describe('void', () => {
      it('should throw', () => {
        expect(() => c().get('x')).toThrow();
      })
    })
    describe('function', () => {
      it('should throw', () => {
        expect(() => c(() => {
        }).get('x')).toThrow();
      })
    })
    describe('scalar', () => {
      it('should throw', () => {
        expect(() => c(100).get('x')).toThrow();
      })
    })
    describe('array', () => {
      const value = [1, 2, 4, 8];
      it('should return item with proper key', () => {
        expect(c(value).get(2)).toEqual(4);
      });
      it('should return item with equivalent key given a keyComp function', () => {

        const keyComp = (a: any, b: any) => {
          if (a === b) {
            return true;
          }
          if (toInt(a) === toInt(b)) {
            return true;
          }
          return false;
        }

        expect(c([20, 40, 60, 80], { keyComp }).get('2.2')).toEqual(60);
      });
      it('should not return item with equivalent key given a keyComp function', () => {
        expect(() => c([20, 40, 60, 80]).get('2.2')).toThrow();
      });
      it('should return undefined with an out of range key', () => {
        expect(c(value).get(10)).toBeUndefined();
      });
      it('should return throw with an negative key', () => {
        expect(() => c(value).get(-10)).toThrow();
      });
      it('should return throw with a float key', () => {
        expect(() => c(value).get(2.2)).toThrow();
      });
      it('should return throw with a string key', () => {
        expect(() => c(value).get('doo')).toThrow();
      });
    })
    describe('map', () => {
      const value = new Map([['a', 1], ['b', 2], ['c', 3]])

      it('should return an item for a key', () => {
        expect(c(value).get('b')).toEqual(2);
      });

      it('should return undefined for a missing key', () => {
        expect(c(value).get('s')).toBeUndefined();
      });

      it('should fetch an equivalent key with a keyComp', () => {
        expect(c(value, { keyComp: caseInsensitiveComp }).get('B'))
          .toEqual(2);
      });
    });
    describe('set', () => {
      const value = new Set(['a', 'b', 'c']);

      it('should return item with proper key', () => {
        expect(c(value).get(2)).toEqual('c');
      });
      it('should return undefined with an out of range key', () => {
        expect(c(value).get(10)).toBeUndefined();
      });
      it('should return throw with an negative key', () => {
        expect(() => c(value).get(-10)).toThrow();
      });
      it('should return throw with a float key', () => {
        expect(() => c(value).get(2.2)).toThrow();
      });
      it('should return throw with a string key', () => {
        expect(() => c(value).get('doo')).toThrow();
      });
    });
    describe('object', () => {
      const value = { a: 1, '20': 2 }

      it('should return item with proper key', () => {
        expect(c(value).get('a')).toEqual(1);
        expect(c(value).get(20)).toEqual(2);
      });
      it('should return undefined with an unmapped key', () => {
        expect(c(value).get('b')).toBeUndefined();
      });
      it('should return an equivalent key with a keyComp function', () => {
        expect(c(value, { keyComp: caseInsensitiveComp }).get('A')).toEqual(1);
      });
    });
  });
  describe('set', () => {
    describe('void', () => {
      it('should throw', () => {
        expect(() => c().get('x')).toThrow();
      })
    })
    describe('function', () => {
      it('should throw', () => {
        expect(() => c(() => {
        }).get('x')).toThrow();
      })
    })
    describe('scalar', () => {
      it('should throw', () => {
        expect(() => c(100).get('x')).toThrow();
      })
    })
    describe('array', () => {
      const value = [1, 2, 4, 8];
      it('should update item with proper key', () => {
        expect(c([...value]).set(2, 50).value).toEqual([1, 2, 50, 8]);
      });
      it('should update item with an out of range key', () => {
        expect(c([...value]).set(6, 50).value).toEqual([1, 2, 4, 8, undefined, undefined, 50]);
      });
      it('should return throw with an negative key', () => {
        expect(() => c(value).set(-10, 50)).toThrow();
      });
      it('should return throw with a float key', () => {
        expect(() => c(value).set(2.2, 50)).toThrow();
      });
      it('should return throw with a string key', () => {
        expect(() => c(value).set('doo', 50)).toThrow();
      });
    })
    describe('map', () => {
      const value = new Map([['a', 1], ['b', 2], ['c', 3]]);

      it('should update an item with existing key', () => {
        expect(c(new Map(value)).set('b', 8).value).toEqual(new Map([['a', 1], ['b', 8], ['c', 3]]));
      });

      it('should update an item with equivalent key with keyComp', () => {
        expect(c(new Map(value), {
          keyComp: caseInsensitiveComp
        }).set('B', 8).value).toEqual(new Map([['a', 1], ['b', 8], ['c', 3]]));
      });

      it('should update an item with new key', () => {
        expect(c(new Map(value)).set('d', 8).value).toEqual(new Map([['a', 1], ['b', 2], ['c', 3], ['d', 8]]));
      });
    });

    describe('set', () => {
      const value = new Set(['a', 'b', 'c']);

      it('should return item with proper key', () => {
        expect(c(new Set(value)).set(2, 'd').value).toEqual(new Set(['a', 'b', 'd']));
      });
      it('should return item with an out of range key', () => {
        expect(c(new Set(value)).set(10, 'd').value).toEqual(new Set(['a', 'b', 'c', 'd']));
      });
      it('should return throw with an negative key', () => {
        expect(() => c(new Set(value)).set(-10, 'f')).toThrow();
      });
      it('should return throw with a float key', () => {
        expect(() => c(new Set(value)).set(2.2, 'f')).toThrow();
      });
      it('should return throw with a string key', () => {
        expect(() => c(new Set(value)).set('doo', 'f')).toThrow();
      });
    });

    describe('object', () => {
      const value = { a: 1, '20': 2 }

      it('should update item with equivalent key with keyComp', () => {
        expect(c({ ...value }, {
          keyComp: caseInsensitiveComp
        }).set('A', 30).value).toEqual({ a: 30, '20': 2 });
      });

      it('should update item with existing key', () => {
        expect(c({ ...value }).set('a', 30).value).toEqual({ a: 30, '20': 2 });
      });
      it('should update item with new key', () => {
        expect(c({ ...value }).set('b', 30).value).toEqual({ a: 1, b: 30, '20': 2 });
      });
    });
  });

  describe('addBefore', () => {
    describe('void', () => {
      it('should throw', () => {
        expect(() => c().addBefore(1)).toThrow();
        expect(() => c().addAfter(1)).toThrow();
      });
    });
    describe('function', () => {
      it('should throw', () => {
        expect(() => c(() => {
        }).addBefore(1)).toThrow();
        expect(() => c(() => {
        }).addAfter(1)).toThrow();
      });
    });
    describe('scalar', () => {
      it('should throw', () => {
        expect(() => c(1).addBefore(1)).toThrow();
        expect(() => c(1).addAfter(1)).toThrow();
      });
    });

    describe('array', () => {
      const values = [1, 2, 3];
      it('should add an item before the array', () => {
        expect(c(values).addBefore(4).value).toEqual([4, 1, 2, 3])
      })
      it('should add an item before the array at an index', () => {
        expect(c(values).addBefore(4, 2).value).toEqual([1, 2, 4, 3])
      })
      it('should add an item before the array at a larger index', () => {
        expect(c(values).addBefore(4, 20).value).toEqual([1, 2, 3, 4]);
      })
    })
    describe('map', () => {
      const values = new Map([['a', 100], ['b', 200], ['c', 50], ['d', 400]]);

      it('should throw without a key', () => {
        expect(() => c(values).addBefore(500)).toThrow();
      });
      it('should add a key before the other items in a map (no existing)', () => {
        expect(Array.from(c(values).addBefore(500, 'e').value.entries())).toEqual(
          [['e', 500], ['a', 100], ['b', 200], ['c', 50], ['d', 400]]
        )
      });
      it('should add a key onto an existing key', () => {
        expect(Array.from(c(values).addBefore(500, 'b').value.entries())).toEqual(
          [['a', 100], ['b', 500], ['c', 50], ['d', 400]]
        );
      });
    });

    describe('set', () => {
      const values = new Set([1, 2, 4, 8, 16]);

      it('should add an item before the array', () => {
        expect(Array.from(c(values).addBefore(4).values)).toEqual([4, 1, 2, 8, 16])
      })
      it('should add an item before the array at an index', () => {
        expect(Array.from(c(values).addBefore(7, 2).values)).toEqual([1, 2, 7, 4, 8, 16])
      })
      it('should add an item before the array at a larger index', () => {
        expect(Array.from(c(values).addBefore(4, 20).values)).toEqual([1, 2, 8, 16, 4]);
      })
    });

    describe('object', () => {
      it('should throw without a key', () => {
        expect(() => c({ a: 1, b: 2, c: 3, d: 4 }).addBefore(3)).toThrow();
      });
      it('should add a new key', () => {
        expect(c({ a: 1, b: 2, c: 3, d: 4 }).addBefore(10, 'z').value).toEqual(
          { z: 10, a: 1, b: 2, c: 3, d: 4 }
        );
      });
      it('should replace an existing key', () => {
        expect(c({ a: 1, b: 2, c: 3, d: 4 }).addBefore(10, 'c').value).toEqual(
          { c: 10, a: 1, b: 2, d: 4 }
        );
      });
    });
  });
  describe('addAfter', () => {
    describe('void', () => {
      it('should throw', () => {
        expect(() => c().addAfter(1)).toThrow();
        expect(() => c().addAfter(1)).toThrow();
      });
    });
    describe('function', () => {
      it('should throw', () => {
        expect(() => c(() => {
        }).addAfter(1)).toThrow();
        expect(() => c(() => {
        }).addAfter(1)).toThrow();
      });
    });
    describe('scalar', () => {
      it('should throw', () => {
        expect(() => c(1).addAfter(1)).toThrow();
        expect(() => c(1).addAfter(1)).toThrow();
      });
    });

    describe('array', () => {
      const values = [1, 2, 3];
      it('should add an item after the array', () => {
        expect(c(values).addAfter(4).value).toEqual([1, 2, 3, 4])
      })
      it('should add an item after the array at an index', () => {
        expect(c(values).addAfter(4, 1).value).toEqual([1, 2, 4, 3])
      })
      it('should add an item after the array at a larger index', () => {
        expect(c(values).addAfter(4, 20).value).toEqual([1, 2, 3, 4]);
      })
    })
    describe('map', () => {
      const values = new Map([['a', 100], ['b', 200], ['c', 50], ['d', 400]]);

      it('should throw without a key', () => {
        expect(() => c(new Map(values)).addAfter(500)).toThrow();
      });
      it('should add a key before the other items in a map (no existing)', () => {
        expect(Array.from(c(values).addAfter(500, 'e').value.entries())).toEqual(
          [['a', 100], ['b', 200], ['c', 50], ['d', 400], ['e', 500]]
        )
      });
      it('should add a key before the other items in a map (over existing)', () => {
        expect(Array.from(c(new Map(values)).addAfter(500, 'b').value.entries()))
          .toEqual(
            [['a', 100], ['b', 500], ['c', 50], ['d', 400]]
          );
      });
      it('should add a key before the other items in a map (over equivalent) with a keyComp', () => {
        expect(Array.from(c(new Map(values), { keyComp: caseInsensitiveComp }).addAfter(500, 'B')
          .value.entries()))
          .toEqual(
            [['a', 100], ['b', 500], ['c', 50], ['d', 400]]
          );
      });
    });

    describe('set', () => {
      const values = new Set([1, 2, 4, 8, 16]);

      it('should add an item after the array', () => {
        expect(Array.from(c(values).addAfter(4).value)).toEqual([1, 2, 8, 16, 4])
      })
      it('should add an item after the array at an index', () => {
        expect(Array.from(c(values).addAfter(7, 2).value)).toEqual([1, 2, 4, 7, 8, 16])
      })
      it('should add an item after the array at a larger index', () => {
        expect(Array.from(c(values).addAfter(4, 20).value)).toEqual([1, 2, 8, 16, 4]);
      })
    });

    describe('object', () => {
      const values = {
        a: 100,
        b: 200,
        c: 50,
        d: 400
      }

      it('should throw without a key', () => {
        expect(() => c({ ...values }).addAfter(500)).toThrow();
      });
      it('should add a key after the other items in a object (no existing)', () => {
        expect(c({ ...values }).addAfter(500, 'e').value).toEqual(
          { ...values, e: 500 }
        )
      });
      it('should add a key after the other items in a object (over existing)', () => {
        expect(c({ ...values }).addAfter(500, 'b').value).toEqual(
          {
            a: 100,
            c: 50,
            d: 400,
            b: 500
          }
        );
      });
      it('should add a key after the other items in a object (over equivalent) with a keyComp', () => {
        expect(c({ ...values }, { keyComp: caseInsensitiveComp }).addAfter(500, 'B').value)
          .toEqual(
            {
              a: 100,
              b: 500,
              c: 50,
              d: 400
            }
          );
      });
    });
  });

  describe('clear', () => {

    describe('void', () => {
      it('should set to undefined', () => {
        expect(c().clear().value).toBeUndefined();
      })
    })
    describe('function', () => {
      it('should throw', () => {
        expect(() => c(() => {
        }).clear()).toThrow();
      })
    })
    describe('scalar', () => {
      it('clears numbers to zero', () => {
        expect(c(100).clear().value).toEqual(0);
      })
      it('clears strings to empty string', () => {
        expect(c('').clear().value).toEqual('');
      })
      it('clears booleans to false', () => {
        expect(c(true).clear().value).toEqual(false);
      });
    });

    describe('array', () => {
      it('clears arrays to empty array', () => {
        expect(c([1, 2, 3]).clear().value).toEqual([]);
      });
    });
    describe('map', () => {
      it('clears arrays to empty map', () => {
        expect(c(new Map([['a', 1], ['b', 2]])).clear().value).toEqual(new Map());
      });
    });
    describe('set', () => {
      it('clears arrays to empty set', () => {
        expect(c(new Set([1, 2, 3])).clear().value).toEqual(new Set());
      });
    });
    describe('object', () => {
      it('clears arrays to empty set', () => {
        expect(c({ a: 10, b: 20 }).clear().value).toEqual({});
      });
    })


  });
  describe('clone', () => {

    describe('void', () => {
      it('should clone undefined to undefined', () => {
        expect(c().clone().value).toBeUndefined();
      })
      it('should clone null to null', () => {
        expect(c(null).clone().value).toBeNull();
      })
    })
    describe('function', () => {
      it('should clone a function to itself', () => {
        const f = (n: number) => 2 * n;
        const c1 = c(f);
        const c2 = c1.clone();
        expect(c1.value).toBe(c2.value);
      })
    })
    describe('scalar', () => {
      it('should clone a scalar to itself', () => {
        expect(c(100).clone().value).toBe(100);
      })
    });

    describe('array', () => {
      it('deep clones array and its contents', () => {
        const first = { a: 1, b: 2 };
        const second = ['a', 'b', 'c'];
        const value = [first, second];

        const base = c(value);
        const clone = base.clone(true);

        expect(base.value).toEqual(clone.value);
        expect(base.value[0] === clone.value[0]).toBeFalsy();
        expect(base.value[0] === clone.value[1]).toBeFalsy();
      })

      it('shallow clones array and its contents', () => {
        const first = { a: 1, b: 2 };
        const second = ['a', 'b', first];
        const value = [first, second];

        const base = c(value);
        const clone = base.clone();

        expect(base.value).toEqual(clone.value);
        expect(base.value[0] === clone.value[0]).toBeTruthy();
        expect(base.value[1] === clone.value[1]).toBeTruthy();
        expect(base.value[1][2] === clone.value[1][2]).toBeTruthy();
      })
    });
    describe('map', () => {

      it('deep clones map and its contents', () => {
        const first = { a: 1, b: 2 };
        const second = ['a', 'b', 'c'];
        const value = new Map<any, any>([
          ['first', first],
          ['second', second]
        ]);

        const base = c(value);
        const clone = base.clone(true);

        expect(base.value).toEqual(clone.value);
        expect(base.value.get('first') === clone.value.get('first')).toBeFalsy();
        expect(base.value.get('second') === clone.value.get('second')).toBeFalsy();
      })
      it('shallow clones map and its contents', () => {
        const first = { a: 1, b: 2 };
        const second = ['a', 'b', 'c'];
        const value = new Map<any, any>([
          ['first', first],
          ['second', second]
        ]);

        const base = c(value);
        const clone = base.clone();

        expect(base.value).toEqual(clone.value);
        expect(base.value.get('first') === clone.value.get('first')).toBeTruthy();
        expect(base.value.get('second') === clone.value.get('second')).toBeTruthy();
      })

    });
    describe('set', () => {
      it('deep clones set and its contents', () => {
        const first = { a: 1, b: 2 };
        const second = ['a', 'b', 'c'];
        const value = new Set([first, second]);

        const base = c(value);
        const clone = base.clone(true);

        expect(base.value).toEqual(clone.value);
        expect(base.values[0] === clone.values[0]).toBeFalsy();
        expect(base.values[1] === clone.values[1]).toBeFalsy();
      })
      it('shallow clones set and its contents', () => {
        const first = { a: 1, b: 2 };
        const second = ['a', 'b', 'c'];
        const value = new Set([first, second]);

        const base = c(value);
        const clone = base.clone();

        expect(base.value).toEqual(clone.value);
        expect(base.values[0] === clone.values[0]).toBeTruthy();
        expect(base.values[1] === clone.values[1]).toBeTruthy();
      })
    });
    describe('object', () => {
      it('deep clones object and its contents', () => {
        const first = { a: 1, b: 2 };
        const second = ['a', 'b', 'c'];
        const value = {
          first, second
        };

        const base = c(value);
        const clone = base.clone(true);

        expect(base.value).toEqual(clone.value);
        expect(base.value.first === clone.value.first).toBeFalsy();
        expect(base.value.second === clone.value.second).toBeFalsy();
      });

      it('shallow clones object and its contents', () => {
        const first = { a: 1, b: 2 };
        const second = ['a', 'b', 'c'];
        const value = {
          first, second
        };

        const base = c(value);
        const clone = base.clone();

        expect(base.value).toEqual(clone.value);
        expect(base.value.first === clone.value.first).toBeTruthy();
        expect(base.value.second === clone.value.second).toBeTruthy();
      });
    });
  });

  describe('sort', () => {
    describe('void', () => {
      it('should throw', () => {
        expect(() => c().sort()).toThrow();
      })
    })
    describe('function', () => {
      it('should throw', () => {
        expect(() => c(() => {
        }).sort()).toThrow();
      })
    })
    describe('scalar', () => {
      it('should throw', () => {
        expect(() => c(100).sort()).toThrow();
      })
    })

    describe('array', () => {
      it('should sort without sorterFn', () => {
        expect(c(['a', 'z', 'b', 'y', 'x', 'c']).sort().value)
          .toEqual(['a', 'b', 'c', 'x', 'y', 'z']);
      });
      it('should sort with sorterFn', () => {
        expect(c([300, 1, 100, 3, 2, 200, 4, 400]).sort((a, b) => (a - b)).value)
          .toEqual([1, 2, 3, 4, 100, 200, 300, 400]);
      })
    })
    describe('map', () => {
      const map = new Map([
        ['Bobby', 300], ['Marge', 1], ['Susan', 100], ['Robert', 3],
        ['Alan', 2], ['Frank', 200], ['Miller', 4], ['Batman', 400]
      ]);

      it('sort by keys without a function', () => {
        expect([...c(map).sort().value.entries()]).toEqual(
          [
            ['Alan', 2],
            ['Batman', 400],
            ['Bobby', 300],
            ['Frank', 200],
            ['Marge', 1],
            ['Miller', 4],
            ['Robert', 3],
            ['Susan', 100]
          ]
        );
      });

      it('should sort kv pairs by function', () => {
        const coll = c(map).sort(sortByValue)
        expect([...coll.value.entries()]).toEqual(
          [
            ['Marge', 1],
            ['Alan', 2],
            ['Robert', 3],
            ['Miller', 4],
            ['Susan', 100],
            ['Frank', 200],
            ['Bobby', 300],
            ['Batman', 400]
          ]
        )
      })

    })
    describe('set', () => {
      it('should sort without sorterFn', () => {
        expect(c(new Set(['a', 'z', 'b', 'y', 'x', 'c'])).sort().values)
          .toEqual(['a', 'b', 'c', 'x', 'y', 'z']);
      });
      it('should sort with sorterFn', () => {
        expect(c(new Set([300, 1, 100, 3, 2, 200, 4, 400])).sort(sortNumeric).values)
          .toEqual([1, 2, 3, 4, 100, 200, 300, 400]);
      })
    })
    describe('object', () => {
      const obj = { a: 100, b: 2, c: 300, d: 1, e: 200, f: 3 };

      it('should sort without sorterFn', () => {
        const sorted = c(obj).sort();
        expect(sorted.value).toEqual(obj);
        expect(sorted.keys).toEqual(['a', 'b', 'c', 'd', 'e', 'f'])
      });

      it('should sort with sorterFn', () => {
        const sorted = c(obj).sort(sortByValue);
        expect(sorted.value).toEqual(obj);
        expect(sorted.values).toEqual([1, 2, 3, 100, 200, 300]);
      });
    });
  });
});
