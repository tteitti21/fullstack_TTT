require('dotenv').config()
const express = require('express')
const phonebookApp = express()
const cors = require('cors')
const Person = require('./models/person')

phonebookApp.use(cors())
phonebookApp.use(express.json())
phonebookApp.use(express.urlencoded({ extended: true }))

// GET all
phonebookApp.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

// GET by ID
phonebookApp.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

/** creates a phonebook entry that is created during POST request */
const createPerson = (body) => {
    const person = new Person({
        "name": body.name,
        "number": body.number,
    })
    person.save().then(savedPerson => {
        return savedPerson
    })   
}

// POST
phonebookApp.post('/api/persons', (request, response) => {
    const body = request.body

        return body.name === undefined ? response.status(418).json({
                    error: 'Name is not defined'
                })
        : body.number === undefined ? response.status(406).json({
                    error: 'Number is not defined'
                })
        : persons.find(p => p.name === body.name) !== undefined ?
                    response.status(406).json({
                        error: 'Name already exists'
                    })
        : response.json(createPerson(body))
})

// DELETE
/*phonebookApp.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end() 
})*/

const PORT = process.env.PORT
phonebookApp.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})