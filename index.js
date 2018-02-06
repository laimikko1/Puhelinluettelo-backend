const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
var morgan = require('morgan')
const Person = require('./models/person')

app.use(bodyParser.json())
morgan.token('custom',
    function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :custom :status :res[content-length] - :response-time ms'))
app.use(cors())
app.use(express.static('build'))

app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(persons => {
            res.json(persons.map(Person.format))
        })
})

app.get('/api/info', (req, res) => {
    const time = Date()

    Person
        .find({})
        .then(response => {
            res.send(`<div> puhelinluettelossa: ${response.length} henkilön tiedot 
            <br> ${time} </div>`)
        })
        .catch(error => {
            console.log(error);

        })

})

app.get('/api/persons/:id', (req, res) => {

    Person
        .findById(req.params.id)
        .then(pe => {
            res.json(Person.format(pe))
        })
        .catch(error => {
            console.log(error);
            res.status(404).send({ error: 'no ei löyry' })
        })
})

app.delete('/api/persons/:id', (req, res) => {
    Person
        .findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => {
            res.status(404).send({ error: 'malformatted id' })
        })

})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (body.name.trim().length === 0) {
        return res.status(404).json({ error: "Name can't be empty!!" })
    }
    if (body.number.trim().length === 0) {
        return res.status(404).json({ error: "Number can't be empty!" })
    }

    const pers = new Person({
        name: body.name,
        number: body.number
    })

    Person
        .find({ name: body.name })
        .then(findp => {
            if (findp.length > 0) {
                return res.status(400).send({ error: 'Already in the phoneBOOK' })
            }
            pers
                .save()
                .then(savedAndFormatted => {
                    res.json(Person.format(savedAndFormatted))
                })
                .catch(error => {
                    console.log(error);
                })
        })
})


app.put('/api/persons/:id', (req, res) => {
    const body = req.body

    const p = {
        name: body.name,
        number: body.number
    }

    Person
        .findByIdAndUpdate(req.params.id, p, { new: true })
        .then(updatedP => {
            res.json(Person.format(updatedP))
        })
        .catch(error => {
            console.log(error)
            res.status(404).send({ error: 'örörr' })
        })
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})