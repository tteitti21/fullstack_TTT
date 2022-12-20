const express = require('express')
const phonebookApp = express()

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
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

phonebookApp.get('/', (request, response) => {
    response.send('<h1>Main page</h1>')
})

phonebookApp.get('/info', (request, response) => {
    const infoPage = 
        `<div>Phonebook has info for ${persons.length} people.
        </div> <div>${new Date()}</div>`
    response.send(infoPage)
})

phonebookApp.get('/api/persons', (request, response) => {
    response.json(persons)
})

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

const PORT = 3001
phonebookApp.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})