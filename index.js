require('dotenv').config()
const express = require('express')
const phonebookApp = express()
const cors = require('cors')
const Person = require('./models/person')

phonebookApp.use(cors())
phonebookApp.use(express.json())
phonebookApp.use(express.urlencoded({ extended: true }))

// GET info page
phonebookApp.get('/info', async function(request, response) {
    const persons = await Person.find().exec()
    const infoPage = 
        `<div>Phonebook has info for ${persons.length} people.
        </div> <div>${new Date()}</div>`
    response.send(infoPage)
})

// GET all
phonebookApp.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

// GET by ID
phonebookApp.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
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
        : response.json(createPerson(body))
})

// DELETE
phonebookApp.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

phonebookApp.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new:true})
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const unknownURL = (request, response) => {
    console.log('Path did not match any specified middleware')
    response.status(404).send({ error: 'unknown URL' })
}
  
phonebookApp.use(unknownURL)

/** 4 parameters makes it error handler, next() in other calls will jump straight to here */
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
    next(error)
}
  
phonebookApp.use(errorHandler)

const PORT = process.env.PORT
phonebookApp.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})