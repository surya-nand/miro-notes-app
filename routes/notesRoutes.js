const {
  createNote,
  getNotesOfLoggedInUser,
  getNote,
  updateNote,
  deleteNote,
  shareNote,
  searchNotes,
} = require("../controllers/notesController");
const { verifyToken } = require("../middleware/authMiddleware");
const {limiter} = require('../middleware/rateLimitMiddleware')

const notesRoutes = (app) => {
  /*GET request to retrieve all notes of a loggedInUser{
     onSuccess - "Successfully retrieved notes", userNotes
     onFailure - Send corresponding error message
   }*/
  app.route("/api/notes").get(verifyToken,limiter,getNotesOfLoggedInUser);
  /*GET request to retrieve a particular notes of a loggedInUser{
     onSuccess - "Note found", noteData
     onFailure - Send corresponding error message
   }*/
  app.route("/api/notes/:id").get(verifyToken,limiter,getNote);
  /*POST request to create a new note{
     onSuccess - "Note created successfully", newNote
     onFailure - Send corresponding error message
   }*/
  app.route("/api/notes").post(verifyToken,limiter,createNote);
  /*PUT request to update an existing note{
     onSuccess - "Note updated successfully", updatedNote
     onFailure - Send corresponding error message
   }*/
  app.route("/api/notes/:id").put(verifyToken,limiter, updateNote);
  /*DELETE request to remove an existing note{
     onSuccess - "Note deleted successfully"
     onFailure - Send corresponding error message
   }*/
  app.route("/api/notes/:id").delete(verifyToken,limiter, deleteNote);
  /*POST request to update an existing note{
     onSuccess - "Note is already shared with this user"
     onFailure - Send corresponding error message
   }*/
  app.route("/api/notes/:id/share").post(verifyToken,limiter, shareNote);
  /*GET request to retrieve notes based on keywords{
     onSuccess - "Search successful", userNotes
     onFailure - Send corresponding error message
   }*/
  app.route("/api/search").get(verifyToken,limiter, searchNotes);
};

module.exports = { notesRoutes };
