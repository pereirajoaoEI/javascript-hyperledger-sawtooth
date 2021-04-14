# prometido
promise helpers (wip)

## installation

    $ npm install

## api

`prometido.when`

    function (Promise[]) => Promise
or
    function (Promise) => Promise

Aggregates an array of promises into one promise which is resolved
when every constituent promise is resolved or rejected when some
constituent promise is rejected

`prometido.reduce`
----
    function (arr, reducerFn, seedValue) => Promise

where the `reducerFn` has the interface

    function (accumulatedValue, currentValue, deferred)

`reducerFn` can either return a sync value or resolve/reject the deferred argument


`prometido.reduceRight`
----
like `prometido.reduce`, but with the `reducerFn` applied in right-to-left order over the values `arr`.

`prometido.pCall`
----
    function (fn, arg1 ... argN) => Promise

call a function (without `this` context), ensuring that return value is a Promise and trapping thrown exceptions as a rejected Promise

`prometido.asPromise`
----
    function (val) => Promise

uses heuristics to ensure that val is a promise. If val is already a promise, it is passed through, otherwise val is returned as a new resolved Promise.

`prometido.asRejectedPromise`
----
    function (err) => Promise

ensures that `err` is an Error and returns it as a rejected Promise.

## running the tests

    $ npm test

## contributors

jden <jason@denizac.org>

## license
MIT (c) 2013 Agile Diagnosis, Inc. See LICENSE.md