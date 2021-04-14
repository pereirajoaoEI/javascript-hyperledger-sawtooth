var chai = require('chai')
chai.should();
chai.use(require('chai-as-promised'))

describe('prometido', function () {
	var prometido = require('../index')
	var assert = require('assert');
	var when = require('when');

	describe('Deferred', function () {

		it('supports the typical Deferred api', function () {
			var x = new prometido.Deferred();

			x.should.have.property('reject')
			x.reject.should.be.a('function')

			x.should.have.property('resolve')
			x.resolve.should.be.a('function')

			x.should.have.property('promise')
			x.promise.should.be.a('function')

		})
	})

	describe('when', function () {
		it('returns a promise', function () {
			var p = prometido.when();
			p.should.be.an('object')
		})

		it('takes an array of promises and is fulfilled when each of those promises is fulfilled', function (done) {
			var a = prometido.asPromise('a');
			var b = prometido.asPromise('b');

			var p = prometido.when([a, b]);
			p.then(function (x) {
				x.should.deep.equal(['a','b']);
				done();
			})
		})

		it('rejects its promise as soon as any of its component promises is rejected', function(done) {
			var a = new prometido.Deferred();
			var b = new prometido.Deferred();
			var c = new prometido.Deferred();
			var p = prometido.when([a.promise(), b.promise(), c.promise()]);
			p.then(function () {
				assert.fail('fulfilled handler should not be called');
			}, function (err) {
				(err instanceof Error).should.equal(true);
				err.message.should.equal('err');
				done();
			});

			a.resolve(true) // a is resolved, b and c still pending
			b.reject(new Error('err'));
		})

	})

	describe('asPromise', function () {
		it('returns a resolved promise', function (done) {

			prometido.asPromise('34234').then(function (x) {
				x.should.equal('34234');
				done();
			});
		})

		it('should pass its argument through if already as promise', function () {
			var promise = when.resolve();
			prometido.asPromise(promise).should.equal(promise);
		})
	})

	describe('asRejectedPromise', function () {
		it('returns a rejected promise', function (done) {
			prometido.asRejectedPromise(new Error('xcvxcv')).should.be.rejected.notify(done);
		})
		it('rejects with error without args', function (done) {
			prometido.asRejectedPromise().then(null, function (e) { e.should.be.instanceof(Error); done()});
		})
		it('rejects with error with string as arg', function (done) {
			prometido.asRejectedPromise('blah').then(null, function (e) { e.should.be.instanceof(Error); done()});
		})
	})

	describe('reduceRight', function () {
		it('returns the seed value if the array is null or empty', function (done) {
			prometido.reduceRight(null, function () {}, 0).should.eventually.equal(0).notify(done);
		})
		it('is non-destructive to the original array', function (done) {
			var arr = [1,2,3];
			prometido.reduceRight(arr, function () {}).then(function () {
				arr.should.deep.equal([1,2,3])
			}).then(done, done)
		})
		it('iterates in serial right-to-left over an array with a promise-returning reducer', function (done) {

			var arr = [1,2,3]
			var calls = [];
			prometido.reduceRight(arr, function (sum, step) {
				calls.push({sum: sum, step: step});
				return prometido.asPromise(sum + step);
			}, 0)
			.then(function (val) {
				val.should.equal(6);
				calls.length.should.equal(3);
				calls[0].sum.should.equal(0)
				calls[0].step.should.equal(3)
				calls[1].sum.should.equal(3)
				calls[1].step.should.equal(2)
				calls[2].sum.should.equal(5)
				calls[2].step.should.equal(1)
			}).then(done, done);

		})
	})


	describe('reduce', function () {
		it('returns the seed value if the array is null or empty', function (done) {
			prometido.reduce(null, function () {}, 0).should.eventually.equal(0).notify(done);
		})

		it('is non-destructive to the original array', function (done) {
			var arr = [1,2,3];
			prometido.reduce(arr, function () { return true; }).then(function () {
				arr.should.deep.equal([1,2,3])
			}).then(done, done)
		})

		it('iterates in serial left-to-right over an array with a promise-returning reducer', function (done) {

			var arr = [1,2,3]
			var calls = [];
			prometido.reduce(arr, function (sum, step) {
				calls.push({sum: sum, step: step});
				return prometido.asPromise(sum + step);
			}, 0)
			.then(function (val) {
				val.should.equal(6);
				calls.length.should.equal(3);
				calls[0].sum.should.equal(0)
				calls[0].step.should.equal(1)
				calls[1].sum.should.equal(1)
				calls[1].step.should.equal(2)
				calls[2].sum.should.equal(3)
				calls[2].step.should.equal(3)
			}).then(done, done);
		})

		it('can continue by resolving a promise', function (done) {
			prometido.reduce([1,2], function (sum, step, promise) {
				promise.resolve(sum + step);
			}, 0).then(function (val) {
				val.should.equal(3)
			}).then(done, done);
		})
	})

	describe('pCall', function () {
		it('calls a function and returns it as a promise', function (done) {
			var fn = function (a, b) {
				return a + b;
			}
			prometido.pCall(fn, 2, 3).then(function(val) {
				val.should.equal(5)
			}).then(done, done);
		})
	})

})
