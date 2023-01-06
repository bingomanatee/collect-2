
# @wonderlandlabs/collect
## The Great Equalizer
<br />


[@wonderlandlabs/collect]([https://www.npmjs.com/package/@wonderlandlabs/collect)
is a unified interface into all of JavaScripts' base compound classes: Sets, Maps,
Objects, Arrays and even Strings.

It allows you full interfaces into collections, their keys, and their items, as well
as modification methods formerly exclusive to Arrays.

When a method doesn't have an explicit return value (eg `get(key)`, `first()`), it
returns the collection itself, for currying.

See ["Getting Started"](https://collect-docs.vercel.app/get-started) for examples of creation/usage of collections

See ["Why Collect Exists"](https://collect-docs.vercel.app/why) for a longer explanation of the purpose and impetus of Collect.

## Reflection
* [`form`](https://collect-docs.vercel.app/reflection/type) string
* [`type`](https://collect-docs.vercel.app/reflection/type) string
* [`size`](https://collect-docs.vercel.app/reflection/reflection#size-whole-number-read-only) int
* [`value`](https://collect-docs.vercel.app/reflection/reflection#store-any-read-only) raw
* [`hasKey(key)`](https://collect-docs.vercel.app/reflection/introspection#haskeykey-boolean)
* [`hasItem(item)`](https://collect-docs.vercel.app/reflection/introspection#hasitemitem-boolean) bool
* [`first(count?)`](https://collect-docs.vercel.app/reflection/reflection#firstcount-number--items): item[]
* [`last(count?)`](https://collect-docs.vercel.app/reflection/reflection#lastcount-number--items) item[]
* [`firstItem`](https://collect-docs.vercel.app/reflection/reflection#firstitem) item?
* [`lastItem`](https://collect-docs.vercel.app/reflection/reflection#lastitem) item?

### Access
* [`get(key`)](https://collect-docs.vercel.app/reflection/introspection#getkey-any): item
* [`set(key, value)`](https://collect-docs.vercel.app/reflection/introspection#setkey-item--self)
* [`deleteKey(key or keys)`](https://collect-docs.vercel.app/changes#deletekeykey--key--self)
* [`deleteItem(item or items)`](https://collect-docs.vercel.app/changes#deleteitemitem--items--self)
* [`keyOf(item)`](https://collect-docs.vercel.app/reflection/introspection#keyofitem-key--undefined): key?
* [`keys`](https://collect-docs.vercel.app/reflection/reflection#keys-any): keys[]
* [`values`](https://collect-docs.vercel.app/reflection/reflection#items-any): items[]

### Loopers
* [`forEach(action)`](https://collect-docs.vercel.app/looping#foreachlooper-self)
* [`reduce(action)`](https://collect-docs.vercel.app/looping#reducelooper-initial-any) any
* [`map(action)`](https://collect-docs.vercel.app/looping#maplooper-self)

### Iterators
* [`storeIter`](https://collect-docs.vercel.app/iterators#storeiter-iterator) iterator
* [`itemIter`](https://collect-docs.vercel.app/iterators#itemiter-iterator) iterator
* [`keyIter`](https://collect-docs.vercel.app/iterators#keyiter--iterator) iterator

### Append
* [`addBefore(item, key?)`](https://collect-docs.vercel.app/append#addbeforeitem-key-self)
* [`addAfter(item, key?)`](https://collect-docs.vercel.app/append#addafteritem-key-self)
* [`removeFirst(count?)`](https://collect-docs.vercel.app/append#removefirstcount-item)
* [`removeLast(count?)`](https://collect-docs.vercel.app/append#removelastcount-item)

### Utility
* [`clone(deep?)`](https://collect-docs.vercel.app/changes#cloneoptions-quiet-boolean-compkeys-compitems-collection)
* [`cloneEmpty()`](https://collect-docs.vercel.app/changes#cloneemptyoptions-quiet-boolean-compkeys-compitems-collection)
* [`cloneShallow()`](https://collect-docs.vercel.app/changes#cloneshallowoptions-collection)
* [`clear()`](https://collect-docs.vercel.app/changes#clear--self)
* [`sort(ordFn)`](https://collect-docs.vercel.app/changes#sortsortfn-comparatorfn-self)
* [`change(newStore)`](https://collect-docs.vercel.app/changes#changereplacer--store--storetype--void-collection-self)

## Highlights

* **custom comparators**: store and look up keys with matching functions you can inject yourself
* **set operations**: merge in contents of any collections into the store type of your choice, or pick values based on value or key set.
* **Robust**: no caching -- only a single value is stored in each wrapper
* **Broad**: allows consistent access for Arrays, Maps, Objects, strings and Sets
* **Very little external dependency**: `lodash.cloneDeep` and `lodash.toString` are used; otherwise, this library uses 100% pure Javascript
* **Cross-target appends**: Adds push/pop/shift/unshift analogs (Appenders) to all classes

Most fundamentally: Collect is **CONSISTENT**. Every version has complete iterators, you can search by key AND by item,
and full loopers for every type of content. As Javascript evolves, minor features just don't seem to get applied across all
compound types

## 1.0 release

The 1.0 release is a _complete rebuild_ of collect. the interface is meant to be almost completely identical
to the pre-1.0 release. here are a few notable changes:

1. **the core value is stored in the `.value` property instead of in store**. 
2. **the value formerly called `items` is now referred to as `values`.
3. **the technique to stop iterator functions(`reduce`, `map`, `forEach`) is different. (TLDR: throw `{$STOP: true}`)
4. **`cloneShallow()` has been replaced with `.clone(true)`.** 

### Under the hood

Previously, multiple classes were created for each possible type of inner value. This precludes changing
the type of value stored (via change) from, say, an array to a Set. It also vastly complicated the TypeScript.

Instead, in 1.0, we dynamically choose a handler based on the form of the content on the fly. 

Also, the type detection system has been moved to @wonderlandlabs/walrus, an independent module. 

