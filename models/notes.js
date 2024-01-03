const mongoose = require("mongoose")

const notes = mongoose.model('note',{
    title:{type: String,required: true},
    content:{type: String,required: true},
    owner: {type: Schema.Types.ObjectId, ref:'notesUser', required: true}
});

module.exports = notes;