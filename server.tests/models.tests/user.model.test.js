/* eslint-env mocha */

var expect = require('chai').expect

var User = require('../../models/user').User

describe('user', () => {
    it('invalid if email field is not provided', (done) => {
        var user = new User();

        user.validate((err) => {
            expect(err.errors.email).to.exist
            done()
        })
    })
})

