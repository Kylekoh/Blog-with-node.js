require('proof')(19, prove)

function prove (assert) {
    var adhere = require('../..')
    var slice = [].slice

    var encase = function (method) {
        return adhere(method, function (object, vargs) {
            method.apply(object, vargs)
        })
    }

    var string = encase(function () { return 1 })
    assert(string.toString(), 'function () { return 1 }', 'to string')

    var object = {}
    object.zero = encase(function () {
        assert(this === object, 'zero this')
        assert(slice.call(arguments), [ 1, 2, 3 ], 'zero arguments')
    })
    assert(object.zero.length, 0, 'zero length')
    object.zero(1, 2, 3)
    object.one = encase(function (one) {
        assert(this === object, 'zero this')
        assert(slice.call(arguments), [ 1, 2, 3 ], 'zero arguments')
    })
    assert(object.one.length, 1, 'one length')
    object.one(1, 2, 3)
    object.two = encase(function (one, two) {
        assert(this === object, 'zero this')
        assert(slice.call(arguments), [ 1, 2, 3 ], 'zero arguments')
    })
    assert(object.two.length, 2, 'two length')
    object.two(1, 2, 3)
    object.three = encase(function (one, two, three) {
        assert(this === object, 'three this')
        assert(slice.call(arguments), [ 1, 2, 3 ], 'three arguments')
    })
    assert(object.three.length, 3, 'three length')
    object.three(1, 2, 3)
    object.four = encase(function (one, two, three, four) {
        assert(this === object, 'zero this')
        assert(slice.call(arguments), [ 1, 2, 3 ], 'zero arguments')
    })
    assert(object.four.length, 4, 'four length')
    object.four(1, 2, 3)
    object.many = encase(function (one, two, three, four, five) {
        assert(this === object, 'zero this')
        assert(slice.call(arguments), [ 1, 2, 3 ], 'zero arguments')
    })
    assert(object.many.length, 5, 'many length')
    object.many(1, 2, 3)
}
