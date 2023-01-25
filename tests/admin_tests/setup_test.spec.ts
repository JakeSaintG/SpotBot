import { testFn } from '../../src/admin/commands'
import { assert } from 'chai'

//Temporary; For set up of Mocha/Chai
describe('testFn', function () {
    it('should return message received affirmation', function () {
        assert.strictEqual(testFn('message'), 'message was received')
    })
})
