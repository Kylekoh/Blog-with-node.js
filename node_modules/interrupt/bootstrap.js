var slice = [].slice
var util = require('util')

exports.createInterrupterCreator = function (_Error) {
    return function (path) {
        var ejector = function (name, depth, context, properties) {
            var vargs = slice.call(arguments)
            name = vargs.shift()
            typeof vargs[0] == 'number' ? depth = vargs.shift() : 4
            context = vargs.shift() || {}
            properties = vargs.shift() || {}
            var keys = Object.keys(context).length
            var body = ''
            var dump = ''
            var stack = ''
            if (keys != 0) {
                var cause = null
                body = '\n'
                if (context.cause) {
                    cause = properties.cause = context.cause
                    delete context.cause
                    keys--
                }
                if (keys != 0) {
                    dump = '\n' + util.inspect(context, { depth: depth }) + '\n'
                }
                if (cause != null) {
                    dump += '\ncause: ' + cause.stack + '\n\nstack:'
                }
            }
            var message = path + ':' + name + body + dump
            var error = new Error(message)
            for (var key in context) {
                error[key] = context[key]
            }
            for (var key in properties) {
                error[key] = properties[key]
            }
            if (_Error.captureStackTrace) {
                _Error.captureStackTrace(error, ejector)
            }
            return error
        }
        return ejector
    }
}
