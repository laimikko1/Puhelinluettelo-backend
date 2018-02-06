const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const url = process.env.MONGODB_URI


mongoose.connect(url)
mongoose.Promise = global.Promise

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

if (process.argv.length < 3) {
    Person
        .find({})
        .then(result => {
            console.log('puhelinluettelo:');
            result.forEach(r => {
                console.log(r['name'] + ': ' + r['number']);
            })
            mongoose.connection.close()
        })

} else {
    const name = process.argv[2]
    const number = process.argv[3]

    const newP = new Person({
        name: name,
        number: number
    })

    newP
        .save()
        .then(response => {
            console.log(`lisätään henkilö ${name} ${number} luetteloon`)
            mongoose.connection.close()
        })

 }