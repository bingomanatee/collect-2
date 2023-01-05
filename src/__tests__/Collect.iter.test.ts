import { Collect, c } from '../index';


describe('Collect', () => {

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
          const values = ['a', 'b', 'c']
          for (const entry of new Collect(new Set(values)).iter) {
            out.push(entry);
          }

          expect(out).toEqual([
            [0, 'a'],
            [1, 'b'],
            [2, 'c']
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
          c(setObj).forEach((v) => {
            sum += v;
          });
          expect(sum).toEqual((10 + 20 + 30 + 40 + 50 + 60));
        });

        it('can be interrupted with $STOP', () => {
          let sum = 0;
          c(setObj).forEach((v) => {
            sum += v;
            if (v > 30) {
              return { $STOP: true };
            }
          });
          expect(sum).toEqual((10 + 20 + 30 + 40));
        });

        it('can be interrupted with thrown $STOP', () => {
          let sum = 0;
          c(setObj).forEach((v) => {
            sum += v;
            if (v > 30) {
              throw { $STOP: true };
            }
          });
          expect(sum).toEqual((10 + 20 + 30 + 40));
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

    describe('map(method)', () => {

      describe('void', () => {
        it('should throw', () => {
          expect(() => c().map(() => {
          })).toThrow();
        })
      })
      describe('function', () => {
        it('should throw', () => {
          expect(() => c(() => {
          }).map(() => {
          })).toThrow();
        })
      })
      describe('scalar', () => {
        it('should throw', () => {
          expect(() => c(100).map(() => {
          })).toThrow();
        })
      })

      describe('array', () => {
        it('should return modified array - and not modify source', () => {
          const base = c([1, 2, 4, 8]);
          const map = base.map((n) => 2 * n);
          expect(map.value).toEqual([2, 4, 8, 16]);
         // expect(base.value).toEqual([1, 2, 4, 8]);
        });

        it('allow interruption', () => {
          const base = c([1, 2, 4, 8, 16, 32]);
          const map = base.map((n) => {
            if (n > 4) {
              throw { $STOP: true }
            }
            return 2 * n;
          });
          expect(map.value).toEqual([2, 4, 8]);
         // expect(base.value).toEqual([1, 2, 4, 8, 16, 32]);
        });
      })
      describe('map', () => {
        it('should return modified array - and not modify source', () => {
          const input = new Map([
            ['a', 1],
            ['b', 2],
            ['c', 3],
            ['d', 4],
            ['e', 5],
          ]);
          const output = new Map([
            ['a', 2],
            ['b', 4],
            ['c', 6],
            ['d', 8],
            ['e', 10],
          ])
          const base = c(input);
          const map = base.map((n) => 2 * n);
          expect(map.value).toEqual(output);
         // expect(base.value).toEqual(input);
        });

        it('allow interruption', () => {
          const input = new Map([
            ['a', 1],
            ['b', 2],
            ['c', 3],
            ['d', 4],
            ['e', 5],
          ]);
          const output = new Map([
            ['a', 2],
            ['b', 4],
            ['c', 6],
          ])
          const base = c(input);
          const map = base.map((n) => {
            if (n >= 4) {
              throw { $STOP: true }
            }
            return 2 * n;
          });
          expect(map.value).toEqual(output);
        //  expect(base.value).toEqual(input);
        });
      })
      describe('set', () => {
        it('should produce modified set', () => {
          const base = c(new Set([1, 2, 4, 8, 16, 32]));
          const map = base.map((n) => {
            if (n > 4) {
              throw { $STOP: true }
            }
            return 2 * n;
          });
          expect(map.value).toEqual(new Set([2, 4, 8]));
         // expect(base.value).toEqual(new Set([1, 2, 4, 8, 16, 32]));
        });
      })
      describe('object', () => {
        it('modifies result, but not base', () => {
          const input = {
            a: 1,
            b: 2,
            c: 3,
            d: 4,
            e: 5
          }
          const output = {
            a: 2,
            b: 4,
            c: 6,
            d: 8,
            e: 10
          }
          const base = c(input);
          const map = base.map((n) => {
            return 2 * n;
          });
          expect(map.value).toEqual(output);
         // expect(base.value).toEqual(input);
        });
        it('allows interruption', () => {
          const input = {
            a: 1,
            b: 2,
            c: 3,
            d: 4,
            e: 5
          }
          const output = {
            a: 2,
            b: 4,
            c: 6
          }
          const base = c(input);
          const map = base.map((n) => {
            if (n >= 4) {
              throw { $STOP: true }
            }
            return 2 * n;
          });
          expect(map.value).toEqual(output);
         // expect(base.value).toEqual(input);
        });
      });
    })

    describe('reduce', () => {

      const sumReducer = (memo: number | undefined, value: number) => ((memo || 0) + value);

      describe('void', () => {
        it('should throw', () => {
          expect(() => c().reduce(() => {
          })).toThrow();
        })
      })
      describe('function', () => {
        it('should throw', () => {
          expect(() => c(() => {
          }).reduce(() => {
          })).toThrow();
        })
      })
      describe('scalar', () => {
        it('should throw', () => {
          expect(() => c(100).reduce(() => {
          })).toThrow();
        })
      })

      describe('array', () => {
        it('should return a summary', () => {
          const base = c([1, 2, 4, 8]);
          const sum = base.reduce(sumReducer);
          expect(sum.value).toEqual(15);
          //expect(base.value).toEqual([1, 2, 4, 8]);
        });

        it('should return a summary -- with an initializer', () => {
          const base = c([1, 2, 4, 8]);
          const sum = base.reduce(sumReducer, 5);
          expect(sum.value).toEqual(20);
         // expect(base.value).toEqual([1, 2, 4, 8]);
        });

        it('allow interruption', () => {
          const base = c([1, 2, 4, 8, 16, 32]);
          const map = base.reduce((memo, n) => {
            if (n > 4) {
              throw { $STOP: true }
            }
            return (memo || 0) + n;
          });
          expect(map.value).toEqual(7);
         // expect(base.value).toEqual([1, 2, 4, 8, 16, 32]);
        });

        it('allow interruption - with a value', () => {
          const base = c([1, 2, 4, 8, 16, 32]);
          const map = base.reduce((memo, n) => {
            if (n > 4) {
              throw { $STOP: true, value: 100 + memo }
            }
            return (memo || 0) + n;
          });
          expect(map.value).toEqual(107);
         // expect(base.value).toEqual([1, 2, 4, 8, 16, 32]);
        });
      })
      describe('map', () => {

        const initial = new Map([
          ['a', 2],
          ['b', 4],
          ['c', 6],
          ['d', 8],
          ['e', 10],
        ])

        const source = new Map(initial);

        it('should return a summary', () => {
          const base = c(source);
          const sum = base.reduce(sumReducer);
          expect(sum.value).toEqual(30);
       //   expect(base.value).toEqual(initial);
        });

        it('should return a summary -- with an initializer', () => {
          const base = c(source);
          const sum = base.reduce(sumReducer, 5);
          expect(sum.value).toEqual(35);
        //  expect(base.value).toEqual(initial);
        });

        it('allow interruption', () => {
          const base = c(source);
          const map = base.reduce((memo, n) => {
            if (n > 4) {
              throw { $STOP: true }
            }
            return (memo || 0) + n;
          });
          expect(map.value).toEqual(6);
        //  expect(base.value).toEqual(initial);
        });

        it('allow interruption - with a value', () => {
          const base = c(source);
          const map = base.reduce((memo, n) => {
            if (n > 4) {
              throw { $STOP: true, value: 100 + memo }
            }
            return (memo || 0) + n;
          });
          expect(map.value ).toEqual(106);
         //expect(base.value).toEqual(initial);
        });
      })
      describe('set', () => {
        const initial = new Set([2, 4, 6, 8, 10]);
        const source = new Set(initial);
        it('should return a summary', () => {
          const base = c(source);
          const sum = base.reduce(sumReducer);
          expect(sum.value).toEqual(30);
        //  expect(base.value).toEqual(initial);
        });

        it('should return a summary -- with an initializer', () => {
          const base = c(source);
          const sum = base.reduce(sumReducer, 5);
          expect(sum.value).toEqual(35);
        //  expect(base.value).toEqual(initial);
        });

        it('allow interruption', () => {
          const base = c(source);
          const map = base.reduce((memo, n) => {
            if (n > 4) {
              throw { $STOP: true }
            }
            return (memo || 0) + n;
          });
          expect(map.value).toEqual(6);
         // expect(base.value).toEqual(initial);
        });

        it('allow interruption - with a value', () => {
          const base = c(source);
          const map = base.reduce((memo, n) => {
            if (n > 4) {
              throw { $STOP: true, value: 100 + memo }
            }
            return (memo || 0) + n;
          });
          expect(map.value).toEqual(106);
        //  expect(base.value).toEqual(initial);
        });
      });
      describe('object', () => {
        const initial = {
          a: 2,
          b: 4,
          c: 6,
          d: 8,
          e: 10
        }
        const source = {...initial};

        it('should return a summary', () => {
          const base = c(source);
          const sum = base.reduce(sumReducer);
          expect(sum.value).toEqual(30);
          //expect(base.value).toEqual(initial);
        });

        it('should return a summary -- with an initializer', () => {
          const base = c(source);
          const sum = base.reduce(sumReducer, 5);
          expect(sum.value).toEqual(35);
        //  expect(base.value).toEqual(initial);
        });

        it('allow interruption', () => {
          const base = c(source);
          const map = base.reduce((memo, n) => {
            if (n > 4) {
              throw { $STOP: true }
            }
            return (memo || 0) + n;
          });
          expect(map.value).toEqual(6);
         // expect(base.value).toEqual(initial);
        });

        it('allow interruption - with a value', () => {
          const base = c(source);
          const map = base.reduce((memo, n) => {
            if (n > 4) {
              throw { $STOP: true, value: 100 + memo }
            }
            return (memo || 0) + n;
          });
          expect(map.value).toEqual(106);
          //expect(base.value).toEqual(initial);
        });
      });
    });

    describe('filter', () => {
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
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
        it('should filter', () => {
          expect(c(numbers).filter((n) => !!(n % 2)).value).toEqual([
            1, 3, 5, 7
          ]);
        });

        it('should filter with stopper', () => {
          expect(c(numbers).filter((n, i) => {
            if (i > 2) {
              return { $STOP: true };
            }
            return !!(n % 2);
          }).value).toEqual([
            1, 3
          ]);
        });

        it('should filter with stopper and value', () => {
          expect(c(numbers).filter((n, i) => {
            if (i > 2) {
              return { $STOP: true, value: true };
            }
            return !!(n % 2);
          }).value).toEqual([
            1, 3, 4
          ]);
        });
      });
      describe('map', () => {
        const map = new Map([
          ['Bobby', 300], ['Marge', 1], ['Susan', 100], ['Robert', 3],
          ['Alan', 2], ['Frank', 200], ['Miller', 4], ['Batman', 400]
        ]);

        it('should filter', () => {
          expect(Array.from(c(map).filter((v, i) => {
              return (i === 'Miller') || v > 50;
            }).value.entries()
          )).toEqual([
            ['Bobby', 300], ['Susan', 100], ['Frank', 200],
            ['Miller', 4], ['Batman', 400]
          ])
        });

        it('should filter with stopper', () => {
          expect(Array.from(c(map).filter((v, i) => {
              if (i === 'Miller') {
                throw { $STOP: true };
              }
              return (i === 'Marge') || v > 50;
            }).value.entries()
          )).toEqual([
            ['Bobby', 300], ['Marge', 1], ['Susan', 100], ['Frank', 200],
          ])
        });
      });
      describe('set', () => {
        const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        it('should filter', () => {
          expect(c(new Set(values)).filter((v) => !(v % 3)).value)
            .toEqual(new Set([3, 6, 9]));
        });
        it('should filter with stopper', () => {
          expect(c(new Set(values)).filter((v) => {
            if (v > 7) {
              throw { $STOP: true };
            }
            return !(v % 3);
          }).value)
            .toEqual(new Set([3, 6]));
        });
      })
      describe('object', () => {
        const obj = { a: 100, b: 2, c: 300, d: 1, e: 200, f: 3 };

        it('should filter objects', () => {
          expect(c(obj).filter((v, k) => {
            return v > 50;
          }).value).toEqual({ a: 100, c: 300, e: 200 })
        })
        it('should filter objects with stopper', () => {
          expect(c(obj).filter((v, k) => {
            if (k === 'd') {
              throw { $STOP: true };
            }
            return v > 50;
          }).value).toEqual({ a: 100, c: 300 });
        })
      });
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
