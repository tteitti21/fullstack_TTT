const express = require('express')
//const morgan = require('morgan')
const phonebookApp = express()
const cors = require('cors')

phonebookApp.use(cors())
phonebookApp.use(express.json())
phonebookApp.use(express.urlencoded({ extended: true }))
//phonebookApp.use(morgan('tiny'))

// If method is POST, logs the send data of the person
/** 
morgan.token('send-data', function(req, res) {
    return req.method === 'POST' ? JSON.stringify(req.body)
    : undefined
})

phonebookApp.use(morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens['send-data'](req, res)
    ].join(' ')
}))  */

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Eva Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// GET mainpage
phonebookApp.get('/', (request, response) => {
    response.send('<h1>Main page</h1>')
})

// GET info
phonebookApp.get('/info', (request, response) => {
    const infoPage = 
        `<div>Phonebook has info for ${persons.length} people.
        </div> <div>${new Date()}</div>`
    response.send(infoPage)
})

// GET all
phonebookApp.get('/api/persons', (request, response) => {
    response.json(persons)
})

// GET by ID
phonebookApp.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (!person) {
        return response.status(400).json({
            error: 'Content not found'
        })
    }
    response.json(person)
})

/** Creates random ID for person that cannot match with any existing
 * id, otherwise it recalls itself until unique one is found.
 */
const IdGenerator = () => {
    let id = Math.floor(Math.random() * 1000)
    if (persons.find(person => person.id === id) === undefined) {
        return (id)
    } else {
        return IdGenerator()
    }}

/** creates a phonebook entry that is created during POST request */
const createPerson = (body) => {
    const person = {
        "name": body.name,
        "number": body.number,
        "id": IdGenerator()
    }
    persons = persons.concat(person)
    return ( person )
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
phonebookApp.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = process.env.PORT || 3001
phonebookApp.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})