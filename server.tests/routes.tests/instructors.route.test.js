/* eslint-env mocha */

// const sinon = require('sinon')

// var instructorRoute = require('../../routes/instructorsRoute')
// const { Instructor } = require('../../models/instructor')

// describe('test /instructors/ get all instructors', () => {
//     var stubbedModel

//     beforeEach(() => {
//         stubbedModel = sinon.stub(Instructor, 'find')
//     })

//     afterEach(() => {
//         Instructor.find.restore()
//     })

//     it('should send all instructors', async () => {
//         let instructor1 = new Instructor({
//             email: 'test-email1@gmail.com',
//             hashedPassword: 'password1!',
//             salt: 'exampleofasalt1'
//         })
//         let instructor2 = new Instructor({
//             email: 'test-email2@gmail.com',
//             hashedPassword: 'password!2',
//             salt: 'exampleofasalt2'
//         })
//         let instructor3 = new Instructor({
//             email: 'test-email3@gmail.com',
//             hashedPassword: 'password!3',
//             salt: 'exampleofasalt3'
//         })
        
//         let instructors = [instructor1, instructor2, instructor3]

//         let expectedModels = { instructors }

//         let req = {}
//         let res = {
//             send: sinon.stub()
//         }

//         stubbedModel.resolves(instructors)

//         await instructorRoute.allInstructors(req, res)

//         sinon.assert.calledWith(res.send, expectedModels)
//     })
// })