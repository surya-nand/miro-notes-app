const mongoose = require("mongoose")

const notesUsers = mongoose.model('notesUser',{
    email:{type: String,required: true, unique: true},
    password:{type: String,required: true},
    notes: [{type: Schema.Types.ObjectId, ref:'note'}]
});

module.exports = notesUsers;