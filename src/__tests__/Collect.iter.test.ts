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
          expect(map).toEqual([2, 4, 8, 16]);
          expect(base.value).toEqual([1, 2, 4, 8]);
        });

        it('allow interruption', () => {
          const base = c([1, 2, 4, 8, 16, 32]);
          const map = base.map((n) => {
            if (n > 4) {
              throw { $STOP: true }
            }
            return 2 * n;
          });
          expect(map).toEqual([2, 4, 8]);
          expect(base.value).toEqual([1, 2, 4, 8, 16, 32]);
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
          expect(map).toEqual(output);
          expect(base.value).toEqual(input);
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
          expect(map).toEqual(output);
          expect(base.value).toEqual(input);
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
          expect(map).toEqual(new Set([2, 4, 8]));
          expect(base.value).toEqual(new Set([1, 2, 4, 8, 16, 32]));
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
          expect(map).toEqual(output);
          expect(base.value).toEqual(input);
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
          expect(map).toEqual(output);
          expect(base.value).toEqual(input);
        });
      });
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
