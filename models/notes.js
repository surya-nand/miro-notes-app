const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  owner : {type: String, required: true }
});
// Add text index on 'title' and 'content'
notesSchema.index({ title: "text", content: "text" });

const notes = mongoose.model("note", notesSchema);

module.exports = notes;
