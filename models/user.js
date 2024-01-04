const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    email:{type: String,required: true, unique: true},
    password:{type: String,required: true},
    notes: [{type: String}]
})

const notesUsers = mongoose.model('noteUser', userSchema)

module.exports = notesUsers;