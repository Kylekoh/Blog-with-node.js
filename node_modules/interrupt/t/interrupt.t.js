require('proof')(5, prove)

/*
    ___ strings: en_US ___

        convert : value, outcome ~ You failed to convert %s to %d.
        outcome : count, count ~ You have %d %{cat/cats}.

    ___ en_US ___
 */

function prove (assert) {
    var interrupt = require('..').createInterrupter('bigeasy.interrupt')
    try {
        throw interrupt(new Error('convert'), { value: 1 })
    } catch (error) {
        interrupt.rescue('bigeasy.interrupt', /convert/, function (error) {
            console.log(error.stack)
            assert(error.value, 1, 'rescue')
        })(error)
    }

    try {
        try {
            var error = new Error('missed')
            error.typeIdentifier = {}
            error.path = '.'
            throw error
        } catch (error) {
            interrupt.rescue()(error)
        }
    } catch (error) {
        assert(error.message, 'missed', 'missed not an interrupt')
    }

    try {
        try {
            throw interrupt(new Error('convert'), { value: 1 })
        } catch (error) {
            interrupt.rescue('bigeasy.missed', function (error) {
            })(error)
        }
    } catch (error) {
        assert(error.message, 'bigeasy.interrupt:convert', 'missed not of type')
    }

    try {
        try {
            throw interrupt(new Error('format'), { value: 1 })
        } catch (error) {
            interrupt.rescue('bigeasy.missed', /parse/, function (error) {
            })(error)
        }
    } catch (error) {
        assert(error.message, 'bigeasy.interrupt:format', 'missed regex')
    }

    try {
        throw interrupt(new Error('format'), { value: 1 })
    } catch (error) {
        interrupt.rescue([
            'bigeasy.interrupt', function (error) {
                throw new Error('specific failed')
            },
            'bigeasy.interrupt', 'missed', function (error) {
                throw new Error('specific failed')
            },
            'bigeasy.interrupt', 'format', function (error) {
                assert(error.message, 'bigeasy.interrupt:format', 'specific')
            }
        ])(error)
    }
}
