  
var mongoose = require("mongoose");

// Savesto the Schema constructor
var Schema = mongoose.Schema;

// Create a new NoteSchema object

var NoteSchema = new Schema({
  // 
  title: String,

  body: String
});

// Creates our model from the above schema
var Note = mongoose.model("Note", NoteSchema);


// Exports the Note model
module.exports = Note;
