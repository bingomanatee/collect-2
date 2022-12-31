import { Collect, c } from '../index';


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
      it('should return undefined with an out of range key', () => {
        expect(c(value).get('b')).toBeUndefined();
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
        expect(c([...value]).set(6, 50).value).toEqual([1, 2, 4, 8, , , 50]);
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
      const value = new Map([['a', 1], ['b', 2], ['c', 3]])

      it('should update an item with existing key', () => {
        expect(c(new Map(value)).set('b', 8).value).toEqual(new Map([['a', 1], ['b', 8], ['c', 3]]));
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
      it('should add a key before the other items in a map (over existing)', () => {
        expect(Array.from(c(values).addBefore(500, 'b').value.entries())).toEqual(
          [['b', 500], ['a', 100], ['c', 50], ['d', 400]]
        );
      });
    });

    describe.skip('set', () => {

    });

    describe.skip('object', () => {

    })
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
        expect(() => c(values).addAfter(500)).toThrow();
      });
      it('should add a key before the other items in a map (no existing)', () => {
        expect(Array.from(c(values).addAfter(500, 'e').value.entries())).toEqual(
          [ ['a', 100], ['b', 200], ['c', 50], ['d', 400], ['e', 500]]
        )
      });
      it('should add a key before the other items in a map (over existing)', () => {
        expect(Array.from(c(values).addAfter(500, 'b').value.entries())).toEqual(
          [['a', 100], ['c', 50], ['d', 400], ['b', 500]]
        );
      });
    });

    describe.skip('set', () => {

    });

    describe.skip('object', () => {

    })
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
