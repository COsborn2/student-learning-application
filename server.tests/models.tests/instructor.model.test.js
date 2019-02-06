/* eslint-env mocha */

const expect = require('chai').expect

const Instructor = require('../../models/instructor').Instructor

describe('instructor model tests', () => {
    it('valid if all properties exist', (done) => {
        let instructor = new Instructor({
            email: 'test-email@gmail.com',
            hashedPassword: 'password!',
            salt: 'exampleofasalt'
        })

        instructor.validate((err) => {
            expect(err).does.not.exist // no errors in validation
            done()
        })
    })

    it('invalid if email does not exist', (done) => {
        let instructor = new Instructor({
            hashedPassword: 'small',
            salt: 'exampleofasalt'
        })

        instructor.validate((err) => {
            expect(err.errors.email).to.exist
            done()
        })
    })

    it('invalid if hashedPassword does not exist', (done) => {
        let instructor = new Instructor({
            email: 'test-email@gmail.com',
            salt: 'exampleofasalt'
        })

        instructor.validate((err) => {
            expect(err.errors.hashedPassword).to.exist
            done()
        })
    })

    it('invalid if password is not of valid length', (done) => {
        let instructor = new Instructor({
            email: 'test-email@gmail.com',
            hashedPassword: 'small',
            salt: 'exampleofasalt'
        })

        instructor.validate((err) => {
            expect(err.errors.hashedPassword).to.exist
            done()
        })
    })

    it('invalid if email is of improper format (handled by validator package)', (done) => {
        let instructor = new Instructor({
            email: 'test-emailgmail.com',
            hashedPassword: 'smallpassword',
            salt: 'exampleofasalt'
        })

        instructor.validate((err) => {
            expect(err.errors.email).to.exist
            done()
        })
    })
})
