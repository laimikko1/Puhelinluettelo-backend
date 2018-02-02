const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
var morgan = require('morgan')

app.use(bodyParser.json())
morgan.token('custom',
    function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :custom :status :res[content-length] - :response-time ms'))
app.use(cors())
app.use(express.static('build'))


let persons = [
    {
        name: "Arto Hellas",
        number: "040-124457",
        id: 1
    },

    {
        name: "Martti Tienari",
        number: "040-123456",
        id: 2
    },
    {
        name: "Arto Järvinen",
        number: "040-123456",
        id: 3
    },
    {
        name: "Lea Kutvonen",
        number: "040-123456",
        id: 4
    }
]

const generateID = () => {
    return Math.floor((Math.random() * 10000) + 100)
}

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/info', (req, res) => {
    const size = persons.length
    const time = Date()

    res.send(`<div> puhelinluettelossa: ${size} henkilön tiedot 
    <br> ${time} </div>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => {
        return p.id === id
    })

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body


    if (body.name.trim().length === 0) {
        return res.status(404).json({ error: "Name can't be empty!!" })
    }
    if (body.number.trim().length === 0) {
        return res.status(404).json({ error: "Number can't be empty!" })
    }

    if ((persons.filter(p => p.number === body.number)).length > 0) {
        return res.status(404).json(
            { error: "Name for the number is already defined!" })
    }


    const pers = {
        name: body.name,
        number: body.number,
        id: generateID()
    }
    persons = persons.concat(pers)
    res.json(pers)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})