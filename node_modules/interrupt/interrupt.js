var Supersede = require('supersede')
var assert = require('assert')
var slice = [].slice
var typeIdentifiers = {}
var MISSING = { specified: [], otherwise: function (error) { throw error } }

function rescue (error) {
    var vargs = slice.call(arguments)
    return function (error) {
        if (!(error.path && error.typeIdentifier && typeIdentifiers[error.path] == error.typeIdentifier)) {
            throw error
        }
        var cases = {}, test, when, arg
        var map = new Supersede, state = 'begin'
        while (arg = vargs.shift()) {
            if (Array.isArray(arg)) {
                vargs.unshift.apply(vargs, arg)
            } else {
                switch (state) {
                case 'begin':
                    assert.ok(typeof arg == 'string')
                    when = cases[arg]
                    if (when == null) {
                        when = cases[arg] = {
                            specified: [],
                            otherwise: MISSING.otherwise
                        }
                    }
                    state = 'when'
                    break
                case 'when':
                    if (arg instanceof RegExp) {
                        test = {
                            regex: arg,
                            test: function (property) {
                                return this.regex.test(property)
                            },
                            f: null
                        }
                        state = 'regex'
                    } else if (typeof arg == 'string') {
                        test = {
                            value: arg,
                            test: function (property) {
                                return this.value == property
                            },
                            f: null
                        }
                        state = 'regex'
                    } else {
                        when.otherwise = arg
                        state = 'begin'
                    }
                    break
                case 'regex':
                    assert.ok(typeof arg == 'function')
                    test.f = arg
                    when.specified.push(test)
                    state = 'begin'
                    break
                }
            }
        }
        for (var path in cases) {
            map.set(('.' + path).split('.'), cases[path])
        }
        var path = ('.' + error.path).split('.')
        var when = map.get(path) || MISSING
        for (var i = 0, I = when.specified.length; i < I; i++) {
            var specific = when.specified[i]
            if (specific.test(error.errno || error.name)) {
                return specific.f(error)
            }
        }
        return when.otherwise(error)
    }
}

exports.rescue = rescue
exports.createInterrupter = function (path) {
    var typeIdentifier = typeIdentifiers[path] = {}
    function interrupt (error) {
        // see: http://stackoverflow.com/questions/1382107/whats-a-good-way-to-extend-error-in-javascript
        var vargs = slice.call(arguments, 1)
        error.path = path
        error.name = error.message
        error.stack = error.stack.replace(error.message, path + ':' + error.message)
        error.message = path + ':' + error.message
        error.typeIdentifier = typeIdentifier
        vargs.forEach(function (values) {
            for (var key in values) {
                error[key] = values[key]
            }
        })
        return error
    }
    interrupt.rescue = rescue
    return interrupt
}
