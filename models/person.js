const mongoose = require('mongoose')
const Schema = mongoose.Schema

const personSchema = new Schema({
    name: String,
    number: String

})

personSchema.statics.format = function (person) {
    return {
        name: person.name,
        number: person.number,
        id: person._id

    }
}

const Person = mongoose.model('Person', personSchema)



const url = 'mongodb://mikkol:salasana1@ds223578.mlab.com:23578/puhelinluettelo'


mongoose.connect(url)
mongoose.Promise = global.Promise

Person.format
module.exports = Person