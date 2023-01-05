import { Collect, c } from "../index";

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
  if (typeof n === "string") {
    return toInt(Number.parseInt(n, 10));
  }
  if (typeof n === "number") {
    return Math.floor(n);
  }
  return n;
};

describe("Collect", () => {
  describe("get", () => {

    describe("void", () => {
      it("should throw", () => {
        expect(() => c().get("x")).toThrow();
      });
    });
    describe("function", () => {
      it("should throw", () => {
        expect(() => c(() => {
        }).get("x")).toThrow();
      });
    });
    describe("scalar", () => {
      it("should throw", () => {
        expect(() => c(100).get("x")).toThrow();
      });
    });
    describe("array", () => {
      const value = [1, 2, 4, 8];
      it("should return item with proper key", () => {
        expect(c(value).get(2)).toEqual(4);
      });
      it("should return item with equivalent key given a keyComp function", () => {

        const keyComp = (a: any, b: any) => {
          if (a === b) {
            return true;
          }
          if (toInt(a) === toInt(b)) {
            return true;
          }
          return false;
        };

        expect(c([20, 40, 60, 80], { keyComp }).get("2.2")).toEqual(60);
      });
      it("should not return item with equivalent key given a keyComp function", () => {
        expect(() => c([20, 40, 60, 80]).get("2.2")).toThrow();
      });
      it("should return undefined with an out of range key", () => {
        expect(c(value).get(10)).toBeUndefined();
      });
      it("should return throw with an negative key", () => {
        expect(() => c(value).get(-10)).toThrow();
      });
      it("should return throw with a float key", () => {
        expect(() => c(value).get(2.2)).toThrow();
      });
      it("should return throw with a string key", () => {
        expect(() => c(value).get("doo")).toThrow();
      });
    });
    describe("map", () => {
      const value = new Map([["a", 1], ["b", 2], ["c", 3]]);

      it("should return an item for a key", () => {
        expect(c(value).get("b")).toEqual(2);
      });

      it("should return undefined for a missing key", () => {
        expect(c(value).get("s")).toBeUndefined();
      });

      it("should fetch an equivalent key with a keyComp", () => {
        expect(c(value, { keyComp: caseInsensitiveComp }).get("B"))
          .toEqual(2);
      });
    });
    describe("set", () => {
      const value = new Set(["a", "b", "c"]);

      it("should return item with proper key", () => {
        expect(c(value).get(2)).toEqual("c");
      });
      it("should return undefined with an out of range key", () => {
        expect(c(value).get(10)).toBeUndefined();
      });
      it("should return throw with an negative key", () => {
        expect(() => c(value).get(-10)).toThrow();
      });
      it("should return throw with a float key", () => {
        expect(() => c(value).get(2.2)).toThrow();
      });
      it("should return throw with a string key", () => {
        expect(() => c(value).get("doo")).toThrow();
      });
    });
    describe("object", () => {
      const value = { a: 1, "20": 2 };

      it("should return item with proper key", () => {
        expect(c(value).get("a")).toEqual(1);
        expect(c(value).get(20)).toEqual(2);
      });
      it("should return undefined with an unmapped key", () => {
        expect(c(value).get("b")).toBeUndefined();
      });
      it("should return an equivalent key with a keyComp function", () => {
        expect(c(value, { keyComp: caseInsensitiveComp }).get("A")).toEqual(1);
      });
    });
  });
  describe("set", () => {
    describe("void", () => {
      it("should throw", () => {
        expect(() => c().get("x")).toThrow();
      });
    });
    describe("function", () => {
      it("should throw", () => {
        expect(() => c(() => {
        }).get("x")).toThrow();
      });
    });
    describe("scalar", () => {
      it("should throw", () => {
        expect(() => c(100).get("x")).toThrow();
      });
    });
    describe("array", () => {
      const value = [1, 2, 4, 8];
      it("should update item with proper key", () => {
        expect(c([...value]).set(2, 50).value).toEqual([1, 2, 50, 8]);
      });
      it("should update item with an out of range key", () => {
        expect(c([...value]).set(6, 50).value).toEqual([1, 2, 4, 8, undefined, undefined, 50]);
      });
      it("should return throw with an negative key", () => {
        expect(() => c(value).set(-10, 50)).toThrow();
      });
      it("should return throw with a float key", () => {
        expect(() => c(value).set(2.2, 50)).toThrow();
      });
      it("should return throw with a string key", () => {
        expect(() => c(value).set("doo", 50)).toThrow();
      });
    });
    describe("map", () => {
      const value = new Map([["a", 1], ["b", 2], ["c", 3]]);

      it("should update an item with existing key", () => {
        expect(c(new Map(value)).set("b", 8).value).toEqual(new Map([["a", 1], ["b", 8], ["c", 3]]));
      });

      it("should update an item with equivalent key with keyComp", () => {
        expect(c(new Map(value), {
          keyComp: caseInsensitiveComp
        }).set("B", 8).value).toEqual(new Map([["a", 1], ["b", 8], ["c", 3]]));
      });

      it("should update an item with new key", () => {
        expect(c(new Map(value)).set("d", 8).value).toEqual(new Map([["a", 1], ["b", 2], ["c", 3], ["d", 8]]));
      });
    });

    describe("set", () => {
      const value = new Set(["a", "b", "c"]);

      it("should return item with proper key", () => {
        expect(c(new Set(value)).set(2, "d").value).toEqual(new Set(["a", "b", "d"]));
      });
      it("should return item with an out of range key", () => {
        expect(c(new Set(value)).set(10, "d").value).toEqual(new Set(["a", "b", "c", "d"]));
      });
      it("should return throw with an negative key", () => {
        expect(() => c(new Set(value)).set(-10, "f")).toThrow();
      });
      it("should return throw with a float key", () => {
        expect(() => c(new Set(value)).set(2.2, "f")).toThrow();
      });
      it("should return throw with a string key", () => {
        expect(() => c(new Set(value)).set("doo", "f")).toThrow();
      });
    });

    describe("object", () => {
      const value = { a: 1, "20": 2 };

      it("should update item with equivalent key with keyComp", () => {
        expect(c({ ...value }, {
          keyComp: caseInsensitiveComp
        }).set("A", 30).value).toEqual({ a: 30, "20": 2 });
      });

      it("should update item with existing key", () => {
        expect(c({ ...value }).set("a", 30).value).toEqual({ a: 30, "20": 2 });
      });
      it("should update item with new key", () => {
        expect(c({ ...value }).set("b", 30).value).toEqual({ a: 1, b: 30, "20": 2 });
      });
    });
  });

  describe("addBefore", () => {
    describe("void", () => {
      it("should throw", () => {
        expect(() => c().addBefore(1)).toThrow();
        expect(() => c().addAfter(1)).toThrow();
      });
    });
    describe("function", () => {
      it("should throw", () => {
        expect(() => c(() => {
        }).addBefore(1)).toThrow();
        expect(() => c(() => {
        }).addAfter(1)).toThrow();
      });
    });
    describe("scalar", () => {
      it("should throw", () => {
        expect(() => c(1).addBefore(1)).toThrow();
        expect(() => c(1).addAfter(1)).toThrow();
      });
    });

    describe("array", () => {
      const values = [1, 2, 3];
      it("should add an item before the array", () => {
        expect(c(values).addBefore(4).value).toEqual([4, 1, 2, 3]);
      });
      it("should add an item before the array at an index", () => {
        expect(c(values).addBefore(4, 2).value).toEqual([1, 2, 4, 3]);
      });
      it("should add an item before the array at a larger index", () => {
        expect(c(values).addBefore(4, 20).value).toEqual([1, 2, 3, 4]);
      });
    });
    describe("map", () => {
      const values = new Map([["a", 100], ["b", 200], ["c", 50], ["d", 400]]);

      it("should throw without a key", () => {
        expect(() => c(values).addBefore(500)).toThrow();
      });
      it("should add a key before the other items in a map (no existing)", () => {
        expect(Array.from(c(values).addBefore(500, "e").value.entries())).toEqual(
          [["e", 500], ["a", 100], ["b", 200], ["c", 50], ["d", 400]]
        );
      });
      it("should add a key onto an existing key", () => {
        expect(Array.from(c(values).addBefore(500, "b").value.entries())).toEqual(
          [["a", 100], ["b", 500], ["c", 50], ["d", 400]]
        );
      });
    });

    describe("set", () => {
      const values = new Set([1, 2, 4, 8, 16]);

      it("should add an item before the array", () => {
        expect(Array.from(c(values).addBefore(4).values)).toEqual([4, 1, 2, 8, 16]);
      });
      it("should add an item before the array at an index", () => {
        expect(Array.from(c(values).addBefore(7, 2).values)).toEqual([1, 2, 7, 4, 8, 16]);
      });
      it("should add an item before the array at a larger index", () => {
        expect(Array.from(c(values).addBefore(4, 20).values)).toEqual([1, 2, 8, 16, 4]);
      });
    });

    describe("object", () => {
      it("should throw without a key", () => {
        expect(() => c({ a: 1, b: 2, c: 3, d: 4 }).addBefore(3)).toThrow();
      });
      it("should add a new key", () => {
        expect(c({ a: 1, b: 2, c: 3, d: 4 }).addBefore(10, "z").value).toEqual(
          { z: 10, a: 1, b: 2, c: 3, d: 4 }
        );
      });
      it("should replace an existing key", () => {
        expect(c({ a: 1, b: 2, c: 3, d: 4 }).addBefore(10, "c").value).toEqual(
          { c: 10, a: 1, b: 2, d: 4 }
        );
      });
    });
  });
  describe("addAfter", () => {
    describe("void", () => {
      it("should throw", () => {
        expect(() => c().addAfter(1)).toThrow();
        expect(() => c().addAfter(1)).toThrow();
      });
    });
    describe("function", () => {
      it("should throw", () => {
        expect(() => c(() => {
        }).addAfter(1)).toThrow();
        expect(() => c(() => {
        }).addAfter(1)).toThrow();
      });
    });
    describe("scalar", () => {
      it("should throw", () => {
        expect(() => c(1).addAfter(1)).toThrow();
        expect(() => c(1).addAfter(1)).toThrow();
      });
    });

    describe("array", () => {
      const values = [1, 2, 3];
      it("should add an item after the array", () => {
        expect(c(values).addAfter(4).value).toEqual([1, 2, 3, 4]);
      });
      it("should add an item after the array at an index", () => {
        expect(c(values).addAfter(4, 1).value).toEqual([1, 2, 4, 3]);
      });
      it("should add an item after the array at a larger index", () => {
        expect(c(values).addAfter(4, 20).value).toEqual([1, 2, 3, 4]);
      });
    });
    describe("map", () => {
      const values = new Map([["a", 100], ["b", 200], ["c", 50], ["d", 400]]);

      it("should throw without a key", () => {
        expect(() => c(new Map(values)).addAfter(500)).toThrow();
      });
      it("should add a key before the other items in a map (no existing)", () => {
        expect(Array.from(c(values).addAfter(500, "e").value.entries())).toEqual(
          [["a", 100], ["b", 200], ["c", 50], ["d", 400], ["e", 500]]
        );
      });
      it("should add a key before the other items in a map (over existing)", () => {
        expect(Array.from(c(new Map(values)).addAfter(500, "b").value.entries()))
          .toEqual(
            [["a", 100], ["b", 500], ["c", 50], ["d", 400]]
          );
      });
      it("should add a key before the other items in a map (over equivalent) with a keyComp", () => {
        expect(Array.from(c(new Map(values), { keyComp: caseInsensitiveComp }).addAfter(500, "B")
          .value.entries()))
          .toEqual(
            [["a", 100], ["b", 500], ["c", 50], ["d", 400]]
          );
      });
    });

    describe("set", () => {
      const values = new Set([1, 2, 4, 8, 16]);

      it("should add an item after the array", () => {
        expect(Array.from(c(values).addAfter(4).value)).toEqual([1, 2, 8, 16, 4]);
      });
      it("should add an item after the array at an index", () => {
        expect(Array.from(c(values).addAfter(7, 2).value)).toEqual([1, 2, 4, 7, 8, 16]);
      });
      it("should add an item after the array at a larger index", () => {
        expect(Array.from(c(values).addAfter(4, 20).value)).toEqual([1, 2, 8, 16, 4]);
      });
    });

    describe("object", () => {
      const values = {
        a: 100,
        b: 200,
        c: 50,
        d: 400
      };

      it("should throw without a key", () => {
        expect(() => c({ ...values }).addAfter(500)).toThrow();
      });
      it("should add a key after the other items in a object (no existing)", () => {
        expect(c({ ...values }).addAfter(500, "e").value).toEqual(
          { ...values, e: 500 }
        );
      });
      it("should add a key after the other items in a object (over existing)", () => {
        expect(c({ ...values }).addAfter(500, "b").value).toEqual(
          {
            a: 100,
            c: 50,
            d: 400,
            b: 500
          }
        );
      });
      it("should add a key after the other items in a object (over equivalent) with a keyComp", () => {
        expect(c({ ...values }, { keyComp: caseInsensitiveComp }).addAfter(500, "B").value)
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

  describe("clear", () => {

    describe("void", () => {
      it("should set to undefined", () => {
        expect(c().clear().value).toBeUndefined();
      });
    });
    describe("function", () => {
      it("should throw", () => {
        expect(() => c(() => {
        }).clear()).toThrow();
      });
    });
    describe("scalar", () => {
      it("clears numbers to zero", () => {
        expect(c(100).clear().value).toEqual(0);
      });
      it("clears strings to empty string", () => {
        expect(c("").clear().value).toEqual("");
      });
      it("clears booleans to false", () => {
        expect(c(true).clear().value).toEqual(false);
      });
    });

    describe("array", () => {
      it("clears arrays to empty array", () => {
        expect(c([1, 2, 3]).clear().value).toEqual([]);
      });
    });
    describe("map", () => {
      it("clears arrays to empty map", () => {
        expect(c(new Map([["a", 1], ["b", 2]])).clear().value).toEqual(new Map());
      });
    });
    describe("set", () => {
      it("clears arrays to empty set", () => {
        expect(c(new Set([1, 2, 3])).clear().value).toEqual(new Set());
      });
    });
    describe("object", () => {
      it("clears arrays to empty set", () => {
        expect(c({ a: 10, b: 20 }).clear().value).toEqual({});
      });
    });


  });
  describe("clone", () => {

    describe("void", () => {
      it("should clone undefined to undefined", () => {
        expect(c().clone().value).toBeUndefined();
      });
      it("should clone null to null", () => {
        expect(c(null).clone().value).toBeNull();
      });
    });
    describe("function", () => {
      it("should clone a function to itself", () => {
        const f = (n: number) => 2 * n;
        const c1 = c(f);
        const c2 = c1.clone();
        expect(c1.value).toBe(c2.value);
      });
    });
    describe("scalar", () => {
      it("should clone a scalar to itself", () => {
        expect(c(100).clone().value).toBe(100);
      });
    });

    describe("array", () => {
      it("deep clones array and its contents", () => {
        const first = { a: 1, b: 2 };
        const second = ["a", "b", "c"];
        const value = [first, second];

        const base = c(value);
        const clone = base.clone(true);

        expect(base.value).toEqual(clone.value);
        expect(base.value[0] === clone.value[0]).toBeFalsy();
        expect(base.value[0] === clone.value[1]).toBeFalsy();
      });

      it("shallow clones array and its contents", () => {
        const first = { a: 1, b: 2 };
        const second = ["a", "b", first];
        const value = [first, second];

        const base = c(value);
        const clone = base.clone();

        expect(base.value).toEqual(clone.value);
        expect(base.value[0] === clone.value[0]).toBeTruthy();
        expect(base.value[1] === clone.value[1]).toBeTruthy();
        expect(base.value[1][2] === clone.value[1][2]).toBeTruthy();
      });
    });
    describe("map", () => {

      it("deep clones map and its contents", () => {
        const first = { a: 1, b: 2 };
        const second = ["a", "b", "c"];
        const value = new Map<any, any>([
          ["first", first],
          ["second", second]
        ]);

        const base = c(value);
        const clone = base.clone(true);

        expect(base.value).toEqual(clone.value);
        expect(base.value.get("first") === clone.value.get("first")).toBeFalsy();
        expect(base.value.get("second") === clone.value.get("second")).toBeFalsy();
      });
      it("shallow clones map and its contents", () => {
        const first = { a: 1, b: 2 };
        const second = ["a", "b", "c"];
        const value = new Map<any, any>([
          ["first", first],
          ["second", second]
        ]);

        const base = c(value);
        const clone = base.clone();

        expect(base.value).toEqual(clone.value);
        expect(base.value.get("first") === clone.value.get("first")).toBeTruthy();
        expect(base.value.get("second") === clone.value.get("second")).toBeTruthy();
      });

    });
    describe("set", () => {
      it("deep clones set and its contents", () => {
        const first = { a: 1, b: 2 };
        const second = ["a", "b", "c"];
        const value = new Set([first, second]);

        const base = c(value);
        const clone = base.clone(true);

        expect(base.value).toEqual(clone.value);
        expect(base.values[0] === clone.values[0]).toBeFalsy();
        expect(base.values[1] === clone.values[1]).toBeFalsy();
      });
      it("shallow clones set and its contents", () => {
        const first = { a: 1, b: 2 };
        const second = ["a", "b", "c"];
        const value = new Set([first, second]);

        const base = c(value);
        const clone = base.clone();

        expect(base.value).toEqual(clone.value);
        expect(base.values[0] === clone.values[0]).toBeTruthy();
        expect(base.values[1] === clone.values[1]).toBeTruthy();
      });
    });
    describe("object", () => {
      it("deep clones object and its contents", () => {
        const first = { a: 1, b: 2 };
        const second = ["a", "b", "c"];
        const value = {
          first, second
        };

        const base = c(value);
        const clone = base.clone(true);

        expect(base.value).toEqual(clone.value);
        expect(base.value.first === clone.value.first).toBeFalsy();
        expect(base.value.second === clone.value.second).toBeFalsy();
      });

      it("shallow clones object and its contents", () => {
        const first = { a: 1, b: 2 };
        const second = ["a", "b", "c"];
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

  describe("sort", () => {
    describe("void", () => {
      it("should throw", () => {
        expect(() => c().sort()).toThrow();
      });
    });
    describe("function", () => {
      it("should throw", () => {
        expect(() => c(() => {
        }).sort()).toThrow();
      });
    });
    describe("scalar", () => {
      it("should throw", () => {
        expect(() => c(100).sort()).toThrow();
      });
    });

    describe("array", () => {
      it("should sort without sorterFn", () => {
        expect(c(["a", "z", "b", "y", "x", "c"]).sort().value)
          .toEqual(["a", "b", "c", "x", "y", "z"]);
      });
      it("should sort with sorterFn", () => {
        expect(c([300, 1, 100, 3, 2, 200, 4, 400]).sort((a, b) => (a - b)).value)
          .toEqual([1, 2, 3, 4, 100, 200, 300, 400]);
      });
    });
    describe("map", () => {
      const map = new Map([
        ["Bobby", 300], ["Marge", 1], ["Susan", 100], ["Robert", 3],
        ["Alan", 2], ["Frank", 200], ["Miller", 4], ["Batman", 400]
      ]);

      it("sort by keys without a function", () => {
        expect([...c(map).sort().value.entries()]).toEqual(
          [
            ["Alan", 2],
            ["Batman", 400],
            ["Bobby", 300],
            ["Frank", 200],
            ["Marge", 1],
            ["Miller", 4],
            ["Robert", 3],
            ["Susan", 100]
          ]
        );
      });

      it("should sort kv pairs by function", () => {
        const coll = c(map).sort(sortByValue);
        expect([...coll.value.entries()]).toEqual(
          [
            ["Marge", 1],
            ["Alan", 2],
            ["Robert", 3],
            ["Miller", 4],
            ["Susan", 100],
            ["Frank", 200],
            ["Bobby", 300],
            ["Batman", 400]
          ]
        );
      });

    });
    describe("set", () => {
      it("should sort without sorterFn", () => {
        expect(c(new Set(["a", "z", "b", "y", "x", "c"])).sort().values)
          .toEqual(["a", "b", "c", "x", "y", "z"]);
      });
      it("should sort with sorterFn", () => {
        expect(c(new Set([300, 1, 100, 3, 2, 200, 4, 400])).sort(sortNumeric).values)
          .toEqual([1, 2, 3, 4, 100, 200, 300, 400]);
      });
    });
    describe("object", () => {
      const obj = { a: 100, b: 2, c: 300, d: 1, e: 200, f: 3 };

      it("should sort without sorterFn", () => {
        const sorted = c(obj).sort();
        expect(sorted.value).toEqual(obj);
        expect(sorted.keys).toEqual(["a", "b", "c", "d", "e", "f"]);
      });

      it("should sort with sorterFn", () => {
        const sorted = c(obj).sort(sortByValue);
        expect(sorted.value).toEqual(obj);
        expect(sorted.values).toEqual([1, 2, 3, 100, 200, 300]);
      });
    });
  });
  describe("append", () => {
    describe("void", () => {
      it("should throw", () => {
        expect(() => c().append([1, 2, 3])).toThrow();
      });
    });
    describe("function", () => {
      it("should throw", () => {
        expect(() => c(() => {
        }).append([1, 2, 3])).toThrow();
      });
    });
    describe("scalar", () => {
      it("should throw", () => {
        expect(() => c(100).append([1, 2, 3])).toThrow();
      });
    });

    describe("array", () => {
      it("should add values", () => {
        expect(c([1, 2, 3]).append([4, 5, 6]).value)
          .toEqual([1, 2, 3, 4, 5, 6]);
      });
      it("should add values at index", () => {
        // console.log('append at 1', c([1, 2, 3]).append([4, 5, 6], 0).value)
        expect(c([1, 2, 3]).append([4, 5, 6], 0).value)
          .toEqual([4, 5, 6, 1, 2, 3]);
        expect(c([1, 2, 3]).append([4, 5, 6], 1).value)
          .toEqual([1, 4, 5, 6, 2, 3]);
      });
    });
    describe("map", () => {
      const map = new Map([
        ["Bobby", 300], ["Marge", 1], ["Susan", 100], ["Robert", 3],
        ["Alan", 2], ["Frank", 200], ["Miller", 4], ["Batman", 400]
      ]);
      const newValues = { a: 5, "Bobby": 3000, c: 7 };

      it("should add vales", () => {
        expect(c(new Map(map)).append(newValues).value).toEqual(new Map([
          ["Marge", 1], ["Susan", 100], ["Robert", 3],
          ["Alan", 2], ["Frank", 200], ["Miller", 4], ["Batman", 400],
          ["a", 5], ["Bobby", 3000], ["c", 7]
        ]));
      });
      it("should add vales at existing index", () => {
        expect(Array.from(c(new Map(map)).append(newValues, "Susan").value.entries()))
          .toEqual([
              ["Marge", 1],
              ["Susan", 100],
              ["a", 5],
              ["Bobby", 3000],
              ["c", 7],
              ["Robert", 3],
              ["Alan", 2],
              ["Frank", 200],
              ["Miller", 4],
              ["Batman", 400]
            ]
          );
      });

      it("should add vales at end if a non-present key is asked for", () => {
        expect(Array.from(c(new Map(map)).append(newValues, "q").value.entries()))
          .toEqual([
            ["Marge", 1], ["Susan", 100], ["Robert", 3],
            ["Alan", 2], ["Frank", 200], ["Miller", 4], ["Batman", 400],
            ["a", 5], ["Bobby", 3000], ["c", 7]
          ]);
      });
      it("should add vales at existing index with replacement key", () => {
        expect(c(new Map(map)).append({ Susan: 90, ...newValues }, "Susan").value)
          .toEqual(new Map([
            ["Marge", 1], ["Susan", 90], ["a", 5], ["Bobby", 3000], ["c", 7],
            ["Robert", 3],
            ["Alan", 2], ["Frank", 200], ["Miller", 4], ["Batman", 400]
          ]));
      });
    });
    describe("set", () => {
      it("should add values", () => {
        expect(c(new Set([1, 2, 3])).append([4, 5, 6]).value)
          .toEqual(new Set([1, 2, 3, 4, 5, 6]));
      });
      it("should add values at index", () => {
        // console.log('append at 1', c([1, 2, 3]).append([4, 5, 6], 0).value)
        expect(c(new Set([1, 2, 3])).append([4, 5, 6], 0).value)
          .toEqual(new Set([4, 5, 6, 1, 2, 3]));
        expect(c(new Set([1, 2, 3])).append([4, 5, 6], 1).value)
          .toEqual(new Set([1, 4, 5, 6, 2, 3]));
      });
    });
    describe("object", () => {
      const obj = { a: 100, b: 2, c: 300, d: 1, e: 200, f: 3 };
      const newValues = { a: 5, b: 6, z: 7 };

      it("should add vales", () => {
        const cf = c({ ...obj }).append(newValues);
        expect(cf.value).toEqual({
          ...obj, ...newValues
        });
        expect(cf.keys).toEqual(["c", "d", "e", "f", "a", "b", "z"]);
      });
      it("should add vales at existing index", () => {
        const cf = c({ ...obj }).append(newValues, "e");
        expect(cf.value).toEqual({
          ...obj, ...newValues
        });
        expect(cf.keys).toEqual(["c", "d", "e", "a", "b", "z", "f"]);
      });
      it("should add vales at existing index with replacement key", () => {
        const cf = c({ ...obj }).append(newValues, "b");
        expect(cf.value).toEqual({ ...obj, ...newValues });
        expect(cf.keys).toEqual(["a", "b", "z", "c", "d", "e", "f"]);
      });
    });
  });

  describe("selectKeys", () => {
    describe("void", () => {
      it("should throw", () => {
        expect(() => c().sort()).toThrow();
      });
    });
    describe("function", () => {
      it("should throw", () => {
        expect(() => c(() => {
        }).sort()).toThrow();
      });
    });
    describe("scalar", () => {
      it("should throw", () => {
        expect(() => c(100).sort()).toThrow();
      });
    });

    describe("array", () => {
      const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
      it("should select items with the given keys", () => {
        expect(c([...numbers]).selectKeys([1, 4]).value).toEqual([
          2, 5
        ]);
      });
      it("should select items with the given keys with preservation", () => {
        expect(c([...numbers]).selectKeys([1, 4], true)
          .value).toEqual([
          undefined, 2, undefined, undefined, 5, undefined,
        ]);
      });

      it("should select keys by filter", () => {
        expect(c([...numbers]).selectKeys((k: number) => k >= 3 && k < 6).value)
          .toEqual([3, 4, 5]);
      });

      it("should select keys by filter with key preservation", () => {
        expect(c([...numbers])
          .selectKeys((k: number) => k >= 3 && k < 6, true).value)
          .toEqual([undefined, undefined, 3, 4, 5, undefined, undefined, ]);
      });
    });
    describe("map", () => {
      const map = new Map([
        ["Bobby", 300], ["Marge", 1], ["Susan", 100], ["Robert", 3],
        ["Alan", 2], ["Frank", 200], ["Miller", 4], ["Batman", 400]
      ]);

      it("should select keys passed in", () => {
        expect(Array.from(c(new Map(map))
          .selectKeys(["Marge", "Robert"])
          .value.entries()
        )).toEqual([
          ["Marge", 1], ["Robert", 3]
        ]);
      });

      it.skip("should filter with stopper", () => {
        expect(Array.from(c(map).filter((v, i) => {
            if (i === "Miller") {
              throw { $STOP: true };
            }
            return (i === "Marge") || v > 50;
          }).value.entries()
        )).toEqual([
          ["Bobby", 300], ["Marge", 1], ["Susan", 100], ["Frank", 200]
        ]);
      });
    });
    describe("set", () => {
      const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      it("should selectKeys", () => {
        expect(c(new Set(values)).selectKeys([2, 5]).value)
          .toEqual(new Set([3, 6]));
      });
      it.skip("should filter with stopper", () => {
        expect(c(new Set(values)).filter((v) => {
          if (v > 7) {
            throw { $STOP: true };
          }
          return !(v % 3);
        }).value)
          .toEqual(new Set([3, 6]));
      });
    });
    describe("object", () => {
      const obj = { a: 100, b: 2, c: 300, d: 1, e: 200, f: 3 };

      it("should select keys of objects", () => {
        expect(c(obj).selectKeys(["b", "d"]).value).toEqual({ b: 2, d: 1 });
      });
      it.skip("should select keys of objects with stopper", () => {
        expect(c(obj).filter((v, k) => {
          if (k === "d") {
            throw { $STOP: true };
          }
          return v > 50;
        }).value).toEqual({ a: 100, c: 300 });
      });
    });
  });

  describe("selectValues", () => {
    describe("void", () => {
      it("should throw", () => {
        expect(() => c().sort()).toThrow();
      });
    });
    describe("function", () => {
      it("should throw", () => {
        expect(() => c(() => {
        }).sort()).toThrow();
      });
    });
    describe("scalar", () => {
      it("should throw", () => {
        expect(() => c(100).sort()).toThrow();
      });
    });

    describe("array", () => {
      const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
      it("should select items with the given values", () => {
        expect(c(numbers).selectValues([2, 1, 4]).value).toEqual([
          1, 2, 4
        ]);
      });
    });

    describe("map", () => {
      const map = new Map([
        ["Bobby", 300], ["Marge", 1], ["Susan", 100], ["Robert", 3],
        ["Alan", 2], ["Frank", 200], ["Miller", 4], ["Batman", 400]
      ]);

      it("should select values passed in", () => {
        expect(Array.from(c(new Map(map))
          .selectValues([1, 3, 2, 4])
          .value.entries()
        )).toEqual([
          ["Marge", 1], ["Robert", 3],
          ["Alan", 2], ["Miller", 4]
        ]);
      });

      it.skip("should filter with stopper", () => {
        expect(Array.from(c(map).filter((v, i) => {
            if (i === "Miller") {
              throw { $STOP: true };
            }
            return (i === "Marge") || v > 50;
          }).value.entries()
        )).toEqual([
          ["Bobby", 300], ["Marge", 1], ["Susan", 100], ["Frank", 200]
        ]);
      });
    });
    describe("set", () => {
      const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      it("should select objects", () => {
        const cf = c(new Set(values)).selectValues([6, 4, 2]);
        expect(cf.type).toBe("set");
        expect(cf.values)
          .toEqual([2, 4, 6]);
      });
      it.skip("should filter with stopper", () => {
        expect(c(new Set(values)).filter((v) => {
          if (v > 7) {
            throw { $STOP: true };
          }
          return !(v % 3);
        }).value)
          .toEqual(new Set([3, 6]));
      });
    });
    describe.skip("object", () => {
      const obj = { a: 100, b: 2, c: 300, d: 1, e: 200, f: 3 };

      it("should select items of objects", () => {
        const cf = c(obj).selectValues([200, 100]);
        expect(cf.value).toEqual({ a: 100, e: 200 });
        expect(cf.values).toEqual([100, 200]);
      });

      it.skip("should select items of objects with stopper", () => {
        expect(c(obj).filter((v, k) => {
          if (k === "d") {
            throw { $STOP: true };
          }
          return v > 50;
        }).value).toEqual({ a: 100, c: 300 });
      });
    });
  });

  describe("removeFirst/Last", () => {

    describe("void", () => {
      it("should throw", () => {
        expect(() => c().removeFirst()).toThrow();
        expect(() => c().removeLast()).toThrow();
      });
    });
    describe("function", () => {
      it("should throw", () => {
        expect(() => c(() => {
        }).removeFirst()).toThrow();
        expect(() => c(() => {
        }).removeLast()).toThrow();
      });
    });
    describe("scalar", () => {
      it("should throw", () => {
        expect(() => c(100).removeFirst()).toThrow();
        expect(() => c(100).removeLast()).toThrow();
      });
    });

    describe("array", () => {
      const list = [1, 2, 4, 8, 6, 32];
      it("should remove the first item (no arg)", () => {
        const cf = c([...list]);

        const returned = cf.removeFirst();
        expect(returned).toEqual([1]);
        expect(cf.value).toEqual([2, 4, 8, 6, 32]);
      });
      it("should remove the first n items", () => {
        const cf = c([...list]);

        const returned = cf.removeFirst(3);
        expect(returned).toEqual([1, 2, 4]);
        expect(cf.value).toEqual([8, 6, 32]);
      });
      it("should remove the first n items as entries", () => {
        const cf = c([...list]);

        const returned = cf.removeFirst(3, true);
        expect(returned).toEqual([[0, 1], [1, 2], [2, 4]]);
        expect(cf.value).toEqual([8, 6, 32]);
      });

      it("should remove the last item (no arg)", () => {
        const cf = c([...list]);

        const returned = cf.removeLast();
        expect(returned).toEqual([32]);
        expect(cf.value).toEqual([1, 2, 4, 8, 6]);
      });
      it("should remove the last n items", () => {
        const cf = c([...list]);

        const returned = cf.removeLast(3);
        expect(cf.value)
          .toEqual([1, 2, 4]);
        expect(returned)
          .toEqual([8, 6, 32]);
      });
      it("should remove the last n items as entries", () => {
        const cf = c([...list]);

        const returned = cf.removeLast(3, true);
        expect(returned).toEqual([[3, 8], [4, 6], [5, 32]]);
        expect(cf.value).toEqual([1, 2, 4]);
      });
    });
    describe("map", () => {
      const map = new Map([
        ["a", 100], ["b", 200], ["c", 300], ["d", 400], ["e", 500], ["f", 600]
      ]);
      it("should remove first item", () => {
        const cf = c(new Map(map));
        const result = cf.removeFirst();
        expect(result).toEqual([100]);
        expect(cf.value).toEqual(
          new Map([
            ["b", 200], ["c", 300], ["d", 400], ["e", 500], ["f", 600]
          ])
        );
      });

      it("should remove first n items", () => {
        const cf = c(new Map(map));
        const result = cf.removeFirst(3);
        expect(result).toEqual([100, 200, 300]);
        expect(cf.value).toEqual(
          new Map([
            ["d", 400], ["e", 500], ["f", 600]
          ])
        );
      });

      it("should remove first n items with entries", () => {
        const cf = c(new Map(map));
        const result = cf.removeFirst(3, true);
        expect(result).toEqual([["a", 100], ["b", 200], ["c", 300]]);
        expect(cf.value).toEqual(
          new Map([
            ["d", 400], ["e", 500], ["f", 600]
          ])
        );
      });
      it("should remove last item", () => {
        const cf = c(new Map(map));
        const result = cf.removeLast();
        expect(result).toEqual([600]);
        expect(cf.value).toEqual(
          new Map([
            ["a", 100], ["b", 200], ["c", 300], ["d", 400], ["e", 500]
          ])
        );
      });

      it("should remove last n items", () => {
        const cf = c(new Map(map));
        const result = cf.removeLast(3);
        expect(result).toEqual([400, 500, 600]);
        expect(cf.value).toEqual(
          new Map([
            ["a", 100], ["b", 200], ["c", 300]
          ])
        );
      });

      it("should remove last n items with entries", () => {
        const cf = c(new Map(map));
        const result = cf.removeLast(3, true);
        expect(result).toEqual([
          ["d", 400], ["e", 500], ["f", 600]
        ]);
        expect(cf.value).toEqual(
          new Map([
            ["a", 100], ["b", 200], ["c", 300]
          ])
        );
      });
    });
    describe("set", () => {
      const list = [1, 2, 4, 8, 6, 32];
      it("should remove the first item (no arg)", () => {
        const cf = c(new Set(list));

        const returned = cf.removeFirst();
        expect(returned).toEqual([1]);
        expect(cf.value).toEqual(new Set([2, 4, 8, 6, 32]));
      });
      it("should remove the first n items", () => {
        const cf = c(new Set(list));

        const returned = cf.removeFirst(3);
        expect(returned).toEqual([1, 2, 4]);
        expect(cf.value).toEqual(new Set([8, 6, 32]));
      });
      it("should remove the first n items as entries", () => {
        const cf = c(new Set(list));

        const returned = cf.removeFirst(3, true);
        expect(returned).toEqual([[0, 1], [1, 2], [2, 4]]);
        expect(cf.value).toEqual(new Set([8, 6, 32]));
      });

      it("should remove the last item (no arg)", () => {
        const cf = c(new Set(list));

        const returned = cf.removeLast();
        expect(returned).toEqual([32]);
        expect(cf.value).toEqual(new Set([1, 2, 4, 8, 6]));
      });
      it("should remove the last n items", () => {
        const cf = c(new Set(list));

        const returned = cf.removeLast(3);
        expect(cf.value)
          .toEqual(new Set([1, 2, 4]));
        expect(returned)
          .toEqual([8, 6, 32]);
      });
      it("should remove the last n items as entries", () => {
        const cf = c(new Set(list));

        const returned = cf.removeLast(3, true);
        expect(returned).toEqual([[3, 8], [4, 6], [5, 32]]);
        expect(cf.value).toEqual(new Set([1, 2, 4]));
      });
    });
    describe("object", () => {

    });
  });
});
