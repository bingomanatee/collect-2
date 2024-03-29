import { Collect, c } from '../index';

const toInt = (n: any): any => {
  if (typeof n === 'string') {
    const i = toInt(Number.parseInt(n, 10));
  //  console.log('converting ', n, 'to int', i);
    return i;
  }
  if (typeof n === 'number') {
    return Math.floor(n);
  }
  return n;
}
const intComp = (a: any, b: any) => {
 // console.log('intComp comparing ', a, 'and', b);
  return toInt(a) === toInt(b);
}
const caseInsensitiveComp = (a: any, b: any) => `${a}`.toLowerCase() === `${b}`.toLowerCase();

describe('Collect', () => {

  describe('constructor', () => {
    it('should accept a value', () => {
      const c = new Collect(100);
      expect(c.value).toEqual(100);
    });
  });

  describe('form', () => {
    describe('void', () => {
      it('should be void if no value argument', () => {
        expect(new Collect().form).toEqual('void');

      })
      it('should be void for null', () => {
        expect(new Collect(null).form).toEqual('void');
      });
    })
    describe('function', () => {
      it('should be function for lambdas and functions', () => {
        expect(new Collect(() => {
        }).form).toEqual('function');
        expect(new Collect(function () {
        }).form).toEqual('function');
      })
    })
    describe('scalar', () => {
      it('should be scalar for numbers and strings', () => {
        expect(new Collect(100).form).toEqual('scalar');
        expect(new Collect('abcd').form).toEqual('scalar');
      })
    })
    describe('array', () => {
      it('should be array', () => {
        expect(new Collect([]).form).toEqual('array');
        expect(new Collect([1, 10, 100]).form).toEqual('array');
      })
    })
    describe('map', () => {
      it('should be map', () => {
        expect(new Collect(new Map).form).toEqual('map');
        expect(new Collect(new Map([
          ['x', 1], ['y', -1]
        ])).form).toEqual('map');
      })
    })
    describe('set', () => {
      it('should be set', () => {
        expect(new Collect(new Set).form).toEqual('set');
        expect(new Collect(new Set(['x', 'y', 'z'])).form)
          .toEqual('set');
      })
    })
    describe('object', () => {

    })
  });

  describe('introspection', () => {
    describe('keys', () => {
      describe('void', () => {
        it('should always return []', () => {
          expect(new Collect().keys).toEqual([]);
        })
      })
      describe('function', () => {
        it('should always return []', () => {
          expect(new Collect().keys).toEqual([]);
        })
      })
      describe('scalar', () => {
        it('should always return []', () => {
          expect(new Collect('100').keys).toEqual([]);
        })
      })
      describe('array', () => {
        it('should  return [] for an empty array', () => {
          expect(new Collect([]).keys).toEqual([]);
        })
        it('should  return numbers for a array', () => {
          expect(new Collect([1, 10, 100]).keys).toEqual([0, 1, 2]);
        })
      })
      describe('map', () => {
        it('should return [] if empty', () => {
          expect(new Collect(new Map()).keys).toEqual([]);
        })
      })
      describe('set', () => {
        it('should return [] if empty', () => {
          expect(new Collect(new Set()).keys).toEqual([]);
        })
      })
      describe('object', () => {
        it('should return [] if empty', () => {
          expect(new Collect({}).keys).toEqual([]);
        })
      })
    });
    describe('size', () => {
      describe('void', () => {
        it('should always return 0', () => {
          expect(new Collect().size).toEqual(0);
        })
      })
      describe('function', () => {
        it('should always return 0', () => {
          expect(new Collect().size).toEqual(0);
        })
      })
      describe('scalar', () => {
        it('should always return 0', () => {
          expect(new Collect('100').size).toEqual(0);
        })
      })
      describe('array', () => {
        it('should  return 0 for an empty array', () => {
          expect(new Collect([]).size).toEqual(0);
        })
        it('should return 3 for a array', () => {
          expect(new Collect([1, 10, 100]).size).toEqual(3);
        })
      })
      describe('map', () => {
        it('should return 0 if empty', () => {
          expect(new Collect(new Map()).size).toEqual(0);
        })
        it('should return size', () => {
          expect(new Collect(new Map([
            ['x', 1], ['y', -1]
          ])).size).toEqual(2);
        })
      })
      describe('set', () => {
        it('should return 0 if empty', () => {
          expect(new Collect(new Set()).size).toEqual(0);
        })
        it('should return size', () => {
          expect(new Collect(new Set([1, 10, 100, 1000])).size)
            .toEqual(4);
        })
      })
      describe('object', () => {
        it('should return 0 if empty', () => {
          expect(new Collect({}).size).toEqual(0);
        })
        it('should return key count', () => {
          expect(new Collect({ x: 1, y: -1, z: 0 }).size).toEqual(3);
        })
      })
    });
    describe('hasKey', () => {
      describe('void', () => {
        it('should be false', () => {
          expect( c().hasKey(10)).toBeFalsy();
        })
      })
      describe('function', () => {
        it('should be false', () => {
          expect( c(() => {}).hasKey(10)).toBeFalsy();
        })
      })
      describe('scalar', () => {
        it('should be false', () => {
          expect( c(1000).hasKey(10)).toBeFalsy();
        })
      })
      describe('array', () => {
        const value = ['a', 'b', 'c'];

        it('should detect if key is in array', () => {
          expect(c(value).hasKey(1)).toBeTruthy();
          expect(c(value).hasKey(-1)).toBeFalsy();
          expect(c(value).hasKey(10)).toBeFalsy();
        });

        it('should return true if an equivalent key is in array', () => {
          const cl = c(value, {keyComp: intComp});
          expect(cl.hasKey('2.2')).toBeTruthy();
          expect(cl.hasKey('20.2')).toBeFalsy();
        });
      });
      describe('map', () => {
        const map = new Map([['a', 100], ['b', -100], ['c', 500]]);
        it('should detect if key is in map', () => {
          expect(c(map).hasKey('b')).toBeTruthy();
          expect(c(map).hasKey('d')).toBeFalsy();
        });
        it('should detect if equivalent key is in map with keyComp', () => {
          expect(c(map, {keyComp: caseInsensitiveComp}).hasKey('B')).toBeTruthy();
          expect(c(map, {keyComp: caseInsensitiveComp}).hasKey('d')).toBeFalsy();
        });
      });
      describe('set', () => {
        const value = ['a', 'b', 'c'];

        it('should detect if key is in array', () => {
          expect(c(new Set(value)).hasKey(1)).toBeTruthy();
          expect(c(new Set(value)).hasKey(-1)).toBeFalsy();
          expect(c(new Set(value)).hasKey(10)).toBeFalsy();
        });

        it('should return true if an equivalent key is in array', () => {
          expect(c(new Set(value), {keyComp: intComp}).hasKey('2.2')).toBeTruthy();
          expect(c(new Set(value), {keyComp: intComp}).hasKey('20.2')).toBeFalsy();
        });
      });
      describe('object', () => {
        it('should return 0 if empty', () => {
          expect(new Collect({}).size).toEqual(0);
        })
        it('should return key count', () => {
          expect(new Collect({ x: 1, y: -1, z: 0 }).size).toEqual(3);
        })
      })
    });
    describe('hasValue', () => {
      describe('void', () => {
        it('should return false', () => {
          expect(c().hasValue(100)).toBeFalsy();
        });
      });
      describe('function', () => {
        it('should always return false', () => {
          expect(c().hasValue(() => {})).toBeFalsy();
        })
      })
      describe('scalar', () => {
        it('should always be false', () => {
          expect(c(100).hasValue(100)).toBeFalsy();
        });
      });
      describe('array', () => {
        const value = ['a', 'b', 'c'];

        it('should detect if item is in array', () => {
          expect(c(value).hasValue('a')).toBeTruthy();
          expect(c(value).hasValue('d')).toBeFalsy();
        });

        it('should return true if an equivalent value is in array', () => {
          const cf = c(value, {valueComp: caseInsensitiveComp});
          expect(cf.hasValue('a')).toBeTruthy();
          expect(cf.hasValue('A')).toBeTruthy();
          expect(cf.hasValue('D')).toBeFalsy();
        });
      });
      describe('map', () => {
        const map = new Map([['a', 100], ['b', -100], ['c', 500]]);
        it('should detect if key is in map', () => {
          expect(c(map).hasValue(100)).toBeTruthy();
          expect(c(map).hasValue(1000)).toBeFalsy();
        });
        it('should detect if equivalent key is in map with keyComp', () => {
          const cf = c(map, {valueComp: intComp});
          expect(cf.hasValue(100.1)).toBeTruthy();
          expect(cf.hasValue('1000')).toBeFalsy();
        });
      });
      describe('set', () => {
        const value = ['a', 'b', 'c'];

        it('should detect if key is in set', () => {
          expect(c(new Set(value)).hasValue('a')).toBeTruthy();
          expect(c(new Set(value)).hasValue('d')).toBeFalsy();
        });

        it('should return true if an equivalent key is in set', () => {
          const cf = c(new Set(value), {valueComp: caseInsensitiveComp});
          expect(cf.hasValue('A')).toBeTruthy();
          expect(cf.hasValue('D')).toBeFalsy();
        });
      });
      describe('object', () => {
        const value = {a: 100, b: 200, c: 300};

        it('should detect if item is in object', () => {
          expect(c( value).hasValue(100)).toBeTruthy();
          expect(c(value).hasValue(500)).toBeFalsy();
        });

        it('should return true if an equivalent item is in object', () => {
          const cf = c((value), {valueComp: intComp});
          expect(cf.hasValue(100.1)).toBeTruthy();
          expect(cf.hasValue(301.2)).toBeFalsy();
        });
      });
    });
    describe('keyOf', () => {
      describe('void', () => {
        it('should throw', () => {
          expect(() => c().keyOf(100)).toThrow();
        })
      })
      describe('function', () => {
        it('should throw', () => {
          expect(() => c(() => {
          }).keyOf(100)).toThrow();
        })
      })
      describe('scalar', () => {
        it('should throw', () => {
          expect(() => c().keyOf(100)).toThrow();
        })
      })

      describe('array', () => {
        const values = [1, 2, 3, 5, 7, 9, 2, 4, 2]
        it('should return the key of a present item', () => {
          expect(c(values).keyOf(5)).toEqual(3);
        });
        it('should return undefined for absent item', () => {
          expect(c(values).keyOf(-5)).toBeUndefined();
        });
        it('should return all keys for multi-key search', () => {
          expect(c(values).keyOf(2, true)).toEqual([1, 6, 8]);
        })
      })
      describe('map', () => {
        const value = new Map([
          ['x', 1], ['y', -1], ['z', 4], ['a', 4], ['b', 3], ['c',4]
        ])
        it('should return key of present item', () => {
          expect(new Collect(value).keyOf(-1)).toEqual('y');
        })
        it('should return undefined for absent item', () => {
          expect(new Collect(value).keyOf(10)).toBeUndefined();
        })
        it('should return keys of a multi-key search', () => {
          expect(new Collect(value).keyOf(4, true)).toEqual(['z', 'a', 'c']);
        })
      })
      describe('set', () => {
        it('should return the key of a present item', () => {
          expect(c(new Set([1, 2, 3, 5, 7, 9])).keyOf(5)).toEqual(3);
        });
        it('should return undefined for absent item', () => {
          expect(c(new Set([1, 2, 3, 5, 7, 9])).keyOf(-5)).toBeUndefined();
        });
      })
      describe('object', () => {
        it('should return key of present item', () => {
          expect(new Collect({ x: 1, y: -1, z: 0 }).keyOf(-1)).toEqual('y');
        })
        it('should return undefined for absent item', () => {
          expect(new Collect({ x: 1, y: -1, z: 0 }).keyOf(10)).toBeUndefined();
        })
      })
    });
    describe('first, firstItem', () => {
      describe('void', () => {
        it('should throw', () => {
          expect(() => c().firstItem).toThrow();
          expect(() => c().first()).toThrow();
        })
      })
      describe('function', () => {
        it('should throw', () => {
          expect(() => c().firstItem).toThrow();
          expect(() => c().first()).toThrow();
        })
      })
      describe('scalar', () => {
        it('should throw', () => {
          expect(() => c().firstItem).toThrow();
          expect(() => c().first()).toThrow();
        })
      })

      describe('array', () => {
        const values = [1, 2, 3, 5, 7, 9, 2, 4, 2]
        it('should return firstItem', () => {
          expect(c(values).firstItem).toEqual(1);
        })
        it('should return the first item without a param', () => {
          expect(c(values).first()).toEqual([1])
        })
        it('should return the the given params', () => {
          expect(c(values).first(3)).toEqual([1, 2, 3])
        })
      })
      describe('map', () => {
        const values = new Map([
          ['x', 1], ['y', -1], ['z', 4], ['a', 4], ['b', 3], ['c',4]
        ])
        it('should return firstItem', () => {
          expect(c(values).firstItem).toEqual(1);
        })
        it('should return the first item without a param', () => {
          expect(c(values).first()).toEqual([1])
        })
        it('should return the the given params', () => {
          expect(c(values).first(3)).toEqual([1, -1, 4])
        })
      })
      describe('set', () => {
        const values = [1, 2, 3, 5, 7, 9];
        it('should return firstItem', () => {
          expect(c(new Set(values)).firstItem).toEqual(1);
        });
        it('should return the first item without a param', () => {
          expect(c(new Set(values)).first()).toEqual([1])
        });
        it('should return the the given params', () => {
          expect(c(new Set(values)).first(3)).toEqual([1, 2, 3])
        });
      })
      describe('object', () => {
        const value = {a: 1, b: 10, c: 20, d: 100}
        it('should return firstItem', () => {
          expect(c(value).firstItem).toEqual(1);
        });
        it('should return the first item without a param', () => {
          expect(c(value).first()).toEqual([1])
        });
        it('should return the the given params', () => {
          expect(c(value).first(3)).toEqual([1, 10, 20])
        });
      })
    });
    describe('last, lastItem', () => {
      describe('void', () => {
        it('should throw', () => {
          expect(() => c().keyOf(100)).toThrow();
        })
      })
      describe('function', () => {
        it('should throw', () => {
          expect(() => c(() => {
          }).keyOf(100)).toThrow();
        })
      })
      describe('scalar', () => {
        it('should throw', () => {
          expect(() => c().keyOf(100)).toThrow();
        })
      })

      describe('array', () => {
        const values = [1, 2, 3, 5, 7, 9, 2, 4, 2]
        it('should return lastItem', () => {
          expect(c(values).lastItem).toEqual(2);
        })
        it('should return the last item without a param', () => {
          expect(c(values).last()).toEqual([2])
        })
        it('should return the the given params', () => {
          expect(c(values).last(3)).toEqual([2, 4, 2])
        })
      })
      describe('map', () => {
        const values = new Map([
          ['x', 1], ['y', -1], ['z', 4], ['a', 4], ['b', 3], ['c',4]
        ])
        it('should return lastItem', () => {
          expect(c(values).lastItem).toEqual(4);
        })
        it('should return the last item without a param', () => {
          expect(c(values).last()).toEqual([4])
        })
        it('should return the the given params', () => {
          expect(c(values).last(3)).toEqual([4, 3, 4])
        })
      })
      describe('set', () => {
        const values = [1, 2, 3, 5, 7, 9];
        it('should return lastItem', () => {
          expect(c(new Set(values)).lastItem).toEqual(9);
        });
        it('should return the last item without a param', () => {
          expect(c(new Set(values)).last()).toEqual([9])
        });
        it('should return the the given params', () => {
          expect(c(new Set(values)).last(3)).toEqual([5, 7, 9])
        });
      })
      describe('object', () => {
        const value = {a: 1, b: 10, c: 20, d: 100}
        it('should return lastItem', () => {
          expect(c(value).lastItem).toEqual(100);
        });
        it('should return the last item without a param', () => {
          expect(c(value).last()).toEqual([100])
        });
        it('should return the the given params', () => {
          expect(c(value).last(3)).toEqual([10, 20, 100])
        });
      })
    });
  });
});
/*
    describe('void', () => {
      it('should throw', () => {
      })
    })
    describe('function', () => {
      it('should throw', () => {
      })
    })
    describe('scalar', () => {
      it('should throw', () => {
      })     })

 describe('array', () => {

    })
    describe('map', () => {

    })
    describe('set', () => {

    })
    describe('object', () => {

    })

 */
