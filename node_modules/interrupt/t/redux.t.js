require('proof')(7, prove)

function prove (assert) {
    var interrupt = require('../redux').createInterrupter('bigeasy.example')
    try {
        try {
            throw new Error('foo')
        } catch (e) {
            throw interrupt('bar', {
                url: 'http://127.0.0.1:8080/foo',
                statusCode: 404,
                headers: {
                    sent: {
                        'content-type': 'text/plain',
                        'content-length': '10'
                    },
                    received: {
                        'content-type': 'text/plain',
                        'content-length': '10'
                    }
                },
                cause: e
            }, {
                value: 1
            })
        }
    } catch (e) {
        assert(/^bigeasy.example:bar$/m.test(e.message), 'message')
        assert(e.value, 1, 'properties set')
        assert(e.statusCode, 404, 'context set')
    }
    try {
        try {
            throw new Error('foo')
        } catch (e) {
            throw interrupt('bar', { cause: e })
        }
    } catch (e) {
        console.log(e.stack)
        assert(/^bigeasy.example:bar$/m.test(e.message), 'no context')
    }
    try {
        throw interrupt('bar', 2, { key: 'value' })
    } catch (e) {
        console.log(e.stack)
        assert(/^bigeasy.example:bar$/m.test(e.message), 'no cause')
    }
    try {
        throw interrupt('bar')
    } catch (e) {
        console.log(e.stack)
        assert(/^bigeasy.example:bar$/m.test(e.message), 'nothing but message')
    }

    interrupt = require('../bootstrap').createInterrupterCreator({})('bigeasy.example')

    try {
        throw interrupt('bar')
    } catch (e) {
        console.log(e.stack)
        assert(/^bigeasy.example:bar$/m.test(e.message), 'no captureStackTrace')
    }
}
