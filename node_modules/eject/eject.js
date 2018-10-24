var slice = [].slice
var adhere = require('adhere')
var cadence = require('cadence')
var interrupt = require('interrupt').createInterrupter('bigeasy.eject')

function ejectable (body) {
    var outstanding = [], ejecting = [ false ]
    function eject () {
        ejecting[ejecting.length - 1] = true
        if (outstanding.length) {
            ejecting.push(false)
            outstanding.forEach(function (callback) {
                callback(interrupt(new Error('ejected')))
            })
        }
    }
    var f = cadence(function (async) {
        function _async () {
            if (ejecting[ejecting.length - 1]) {
                ejecting.push(false)
                throw interrupt(new Error('ejected'))
            }
            var vargs = slice.call(arguments), index = ejecting.length - 1
            if (vargs.length == 0) {
                var callback = async()
                outstanding.push(callback)
                return function () {
                    if (!ejecting[index]) {
                        outstanding = outstanding.filter(function (oustanding) {
                            return callback !== outstanding
                        })
                        callback.apply(null, slice.call(arguments))
                    }
                }
            }
            return async.apply(null, vargs)
        }
        for (var key in async) {
            _async[key] = async[key]
        }
        _async.eject = eject
        _async.async = async
        body.apply(this, [ _async ].concat(slice.call(arguments, 1)))
    })
    return adhere(body, function (object, vargs) {
        f.apply(object, vargs)
    })
}

module.exports = ejectable
