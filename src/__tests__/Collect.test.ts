import { Collect, c } from '../index';


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
    })
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
    })
  });

  describe('iteration', () => {
    describe('iter', () => {
      describe('void', () => {
        it('throws', () => {
          expect(() => new Collect().iter).toThrow();
        })
      })
      describe('function', () => {
        it('throws', () => {
          expect(() => new Collect().iter).toThrow();
        })
      })
      describe('scalar', () => {
        it('throws', () => {
          expect(() => new Collect().iter).toThrow();
        })
      })
      describe('array', () => {
        it('iterates over entries', () => {
          const out = [];
          for (const entry of new Collect(['a', 'b', 'c']).iter) {
            out.push(entry);
          }
          expect(out).toEqual([
            [0, 'a'],
            [1, 'b'],
            [2, 'c']
          ]);
        })
      })
      describe('map', () => {
        it('iterates over entries', () => {
          const out = [];
          const map = new Map([
            ['a', 100],
            ['b', 200],
            ['c', 300]
          ]);
          for (const entry of new Collect(map).iter) {
            out.push(entry);
          }
          expect(out).toEqual([
            ['a', 100],
            ['b', 200],
            ['c', 300]
          ]);
        })
      })
      describe('set', () => {
        it('iterates over entries', () => {
          const out = [];
          for (const entry of new Collect(new Set(['a', 'b', 'c'])).iter) {
            out.push(entry);
          }

          expect(out).toEqual([
            ['a', 'a'],
            ['b', 'b'],
            ['c', 'c']
          ]);
        })
      })
      describe('object', () => {
        it('iterates', () => {
          const out = [];
          const obj = {
            a: 100,
            b: 200,
            c: 300
          }
          for (const entry of new Collect(obj).iter) {
            out.push(entry);
          }
          expect(out).toEqual([
            ['a', 100],
            ['b', 200],
            ['c', 300]
          ]);
        })
      })
    })
    describe('forEach', () => {
      describe('void', () => {
        it('should throw', () => {
          expect(() => new Collect().forEach(() => {
          })).toThrow();
        })
      })
      describe('function', () => {
        it('should throw', () => {
          expect(() => new Collect(() => {
          }).forEach(() => {
          })).toThrow();
        })
      })
      describe('scalar', () => {
        it('should throw', () => {
          expect(() => new Collect(100).forEach(() => {
          })).toThrow();
        })
      })

      describe('array', () => {
        const list = [10, 20, 30, 40, 50, 60];
        it('should iterate through values', () => {
          let sum = 0;
          c(list).forEach((v, i) => sum += v + i);
          expect(sum).toEqual(10 + 20 + 30 + 40 + 50 + 60 + 1 + 2 + 3 + 4 + 5);
        });

        it('can be interrupted with $STOP', () => {
          let sum = 0;
          c(list).forEach((v, i) => {
            sum += v + i;
            if (i > 2) {
              return { $STOP: true };
            }
          });
          expect(sum).toEqual(10 + 20 + 30 + 40 + 1 + 2 + 3);
        });

        it('can be interrupted with thrown $STOP', () => {
          let sum = 0;
          c(list).forEach((v, i) => {
            sum += v + i;
            if (i > 2) {
              throw { $STOP: true };
            }
          });
          expect(sum).toEqual(10 + 20 + 30 + 40 + 1 + 2 + 3);
        });
      })
      describe('map', () => {
        const map = new Map([['a', 10], ['b', 20], ['c', 30], ['d', 40], ['e', 50], ['f', 60]])
        it('should iterate through values', () => {
          let phrase = ''
          c(map).forEach((v, i) => phrase = `${phrase}-${i}-${v}`);

          expect(phrase).toEqual('-a-10-b-20-c-30-d-40-e-50-f-60');
        });

        it('can be interrupted with $STOP', () => {
          let phrase = ''
          c(map).forEach((v, i) => {
            phrase = `${phrase}-${i}-${v}`;
            if (i === 'c') {
              return { $STOP: true }
            }
          });

          expect(phrase).toEqual('-a-10-b-20-c-30');
        });

        it('can be interrupted with thrown $STOP', () => {
          let phrase = ''
          c(map).forEach((v, i) => {
            phrase = `${phrase}-${i}-${v}`;
            if (i === 'c') {
              throw { $STOP: true }
            }
          });

          expect(phrase).toEqual('-a-10-b-20-c-30');
        });
      })
      describe('set', () => {
        const setObj = new Set([10, 20, 30, 40, 50, 60]);
        it('should iterate through values', () => {
          let sum = 0;
          c(setObj).forEach((v, i) => {
            console.log('--- set iteration', v, i);
            sum += v + i
          });
          expect(sum).toEqual((10 + 20 + 30 + 40 + 50 + 60) * 2);
        });

        it('can be interrupted with $STOP', () => {
          let sum = 0;
          c(setObj).forEach((v, i) => {
            sum += v + i;
            if (i > 30) {
              return { $STOP: true };
            }
          });
          expect(sum).toEqual((10 + 20 + 30 + 40) * 2);
        });

        it('can be interrupted with thrown $STOP', () => {
          let sum = 0;
          c(setObj).forEach((v, i) => {
            sum += v + i;
            if (i > 30) {
              throw { $STOP: true };
            }
          });
          expect(sum).toEqual((10 + 20 + 30 + 40) * 2);
        });
      })

      describe('object', () => {
        const map = {
          a: 10,
          b: 20,
          c: 30,
          d: 40,
          e: 50,
          f: 60
        }
        it('should iterate through values', () => {
          let phrase = ''
          c(map).forEach((v, i) => phrase = `${phrase}-${i}-${v}`);

          expect(phrase).toEqual('-a-10-b-20-c-30-d-40-e-50-f-60');
        });

        it('can be interrupted with $STOP', () => {
          let phrase = ''
          c(map).forEach((v, i) => {
            phrase = `${phrase}-${i}-${v}`;
            if (i === 'c') {
              return { $STOP: true }
            }
          });

          expect(phrase).toEqual('-a-10-b-20-c-30');
        });

        it('can be interrupted with thrown $STOP', () => {
          let phrase = ''
          c(map).forEach((v, i) => {
            phrase = `${phrase}-${i}-${v}`;
            if (i === 'c') {
              throw { $STOP: true }
            }
          });

          expect(phrase).toEqual('-a-10-b-20-c-30');
        });
      })

    })
  })
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
