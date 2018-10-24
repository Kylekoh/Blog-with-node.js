require('proof')(5, prove)

function prove (assert) {
    var ejectable = require('..')

    var f = ejectable(function (async, value) {
        assert(value, 1, 'parameters')
        async([function () {
            async.eject()
            async()(null, 1)
        }, function (error) {
            assert(error.message, 'ejected', 'eject')
        }], function () {
            async()(null, 1)
        }, [function (value) {
            assert(value, 1, 'continuing')
            var wait = async()
            async.eject()
            wait()
        }, function (error) {
            assert(error.message, 'ejected', 'eject outstanding')
        }])
    })

    assert(f.length, 2, 'arity')

    f(1, function (error) {
        if (error) throw error
    })
}
