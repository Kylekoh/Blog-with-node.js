[![Build Status](https://travis-ci.org/bigeasy/adhere.svg?branch=master)](https://travis-ci.org/bigeasy/adhere) [![Coverage Status](https://coveralls.io/repos/bigeasy/adhere/badge.svg?branch=master&service=github)](https://coveralls.io/github/bigeasy/adhere?branch=master)

Wrap methods preserving arity.

## Synopsis

The `adhere` method allows you to define a function factory that wraps a user
function, but preserving the airty of the wrapped function.

```javascript
var switcharoo = function (method) {
    return adhere(method, function (object, vargs) {
        vargs.reverse()
        method.apply(object, vargs)
    })
}

var reversed = switcharoo(function (a, b) { return [ a, b ] })

assert.deepEqual(reversed(1, 2), [ 2, 1 ], 'reversed')
```

This airty preservation has been extracted from
[Cadence](https://github.com/bigeasy/cadence). This function builder is used to
preserve airty in [Pointcut](https://github.com/bigeasy/pointcut).
