/* eslint-env mocha */

var sinon = require('sinon')

var userRoute = require('../../routes/usersRoute')
var { User } = require('./../../models/user')

describe('test /users/ get all users', () => {
    beforeEach(() => {
        sinon.stub(User, 'find')
    })

    afterEach(() => {
        User.find.restore()
    })

    it('should send all users', () => {
        var user1 = { email: 'testemail@place.com' }
        var user2 = { email: 'someuser@place.com' }
        var user3 = { email: 'first-last@service.com' }
        
        var users = [user1, user2, user3]

        var expectedModels = users

        User.find.yields(null, users)

        var req = {}
        var res = {
            send: sinon.stub()
        }

        userRoute.allUsers(req, res)

        expectedModels = { users }

        sinon.assert.calledWith(res.send, expectedModels)
    })
})