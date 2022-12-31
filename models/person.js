const mongoose = require('mongoose')

const url = process.env.URL
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('failed to connect', error.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

personSchema.set('toJSON', {
    transform: (document, returnedPerson) => {
        returnedPerson.id = returnedPerson._id.toString()
        delete returnedPerson._id
        delete returnedPerson.__v
    }
})

module.exports = mongoose.model('Person', personSchema)