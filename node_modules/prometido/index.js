/*global define: false */
/* uses ES5 Array fns */
var whenjs = require('when');

function arrayify(thing) {
	return Array.isArray(thing) ? thing : [thing];
}

function any(arr) {
	return arr && arr.length > 0;
}

/**
 * Aggregates an array of promises into one promise which is resolved
 * when every constituent promise is resolved or rejected when some
 * constituent promise is rejected
 * @param  {Promise|Array.<Promise>} promises
 * @return {Promise}
 */
function when(promises) {
	promises = arrayify(promises);
	var whenPromise = new PromiseFactory();

	var pending = promises.length;
	var results = [];

	var resolve = function (i) {
		return function (val) {
			results[i] = val;
			pending--;

			if (pending === 0) {
				whenPromise.resolve(results);
			}
		};
	};

	promises.forEach(function (p, i) {
		if (!p || !p.then) return;

		p.then(resolve(i), whenPromise.reject);
	});

	return whenPromise.promise();
}

function reduceRight(orig, reducer, seedValue) {
	if (!any(orig)) {
		return asPromise(seedValue);
	}
	var arr = Array.prototype.slice.call(orig);
	var deferred = new PromiseFactory();

	var step = arr.pop();
	return asPromise(reducer(seedValue, step))
									.then(function(val) {
										return reduceRight(arr, reducer, val)
									})
}

function reduce(orig, reducer, seedValue) {
	if (!any(orig)) {
		return asPromise(seedValue);
	}
	var arr = Array.prototype.slice.call(orig);
	var deferred = new PromiseFactory();

	var step = arr.shift();
	var next = whenjs.defer();
	var ret = reducer(seedValue, step, next);

	var promise = ret === undefined ? next.promise : asPromise(ret);
	return promise.then(function(val) {
					return reduce(arr, reducer, val)
				})
}

/* call as promise */
function pCall(fn) {
	try {
		var args = Array.prototype.slice.call(arguments, 1)
		var val = fn.apply(null, args);
		return asPromise(val);
	} catch (e) {
		return asRejectedPromise(e);
	}
}

/**
 * Make an object with properly-bound `resolve` and `reject`
 */
function PromiseFactory() {
	var deferred = whenjs.defer();
	//var timeout = setTimeout(function () { console.log(t, 'Promise timed out')}, 3000);

	this.reject = function (err) {
		deferred.reject(err);
	};
	this.resolve = function (val) {
	//	clearTimeout(timeout);
		deferred.resolve(val);
	};
	this.promise = function () {
		return deferred.promise;
	};
}

/**
 * Helper function to return a resolved promise with a given value
 */
function asPromise (val) {
	if (val && typeof val.then === 'function') {
		return val;
	}
	var deferred = new PromiseFactory();
	deferred.resolve(val);
	return deferred.promise();
}

function asRejectedPromise(err) {
	var deferred = new PromiseFactory();
	if (!(err instanceof Error)) {
		err = new Error(err);
	}
	deferred.reject(err);
	return deferred.promise();
}

module.exports = {
	Deferred: PromiseFactory,
	when: when,
	asPromise: asPromise,
	asRejectedPromise: asRejectedPromise,
	reduceRight: reduceRight,
	reduce: reduce,
	pCall: pCall
};