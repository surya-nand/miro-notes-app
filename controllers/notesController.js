const notes = require("../models/notes");
const notesUsers = require("../models/user");

const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    //Accessing user id send from verify token middleware
    const loggedInUserId = req.user._id;

    const newNote = new notes({
      title,
      content,
      owner: loggedInUserId,
    });

    //creating a new note
    await newNote
      .save()
      .then((newNote) => {
        res.status(201).send({
          message: "Note created successfully",
          note: newNote,
        });
      })
      .catch((error) => {
        res.status(400).send({
          message: "Failed creating notes",
        });
      });

    // Inserting newly created notes id into user.notes array
    await notesUsers.findByIdAndUpdate(loggedInUserId, {
      $push: { notes: newNote._id },
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

const getNotesOfLoggedInUser = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // fetching all the notes created by loggedInUser
    const userNotes = await notes.find({ owner: loggedInUserId });
    res.status(200).send({
      message: "successfully retrieved notes",
      notes: userNotes,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

const getNote = async (req, res) => {
  try {
    const  noteId  = req.params.id;
    const loggedInUserId = req.user._id;

    //fetching a particular note data from id sent as a parameter
    const noteData = await notes.findById(noteId);
    if (!noteData) {
      return res.status(404).send({
        message: "Note not found",
      });
    }
    //Check if the notes owner is loggedIn User or not
    if (noteData.owner != loggedInUserId) {
      return res.status(400).send({
        message: "You are not the author of this note",
      });
    }
    //send noteData as a response
    if (noteData) {
      res.status(200).send({
        message: "note found",
        note: noteData,
      });
    } else {
      res.status(404).send({
        message: "note not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateNote = async (req, res) => {
  try {
    const  noteId  = req.params.id;
    const { title, content } = req.body;
    const loggedInUserId = req.user._id;
    const noteData = await notes.findById(noteId);
    //Check if the notes owner is loggedIn User or not
    if (noteData.owner != loggedInUserId) {
      return res.status(400).send({
        message: "You are not the author of this note",
      });
    }
    const updatedNote = await notes.findByIdAndUpdate(
      noteId,
      { title, content },
      { new: true }
    );
    if (updatedNote) {
      res.status(200).send({
        message: "Note updated successfully",
        note: updatedNote,
      });
    } else {
      res.status(404).send({
        message: "Note not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    const  noteId  = req.params.id;
    const loggedInUserId = req.user._id;
    const noteData = await notes.findById(noteId);

    //check if note exists
    if (!noteData) {
      return res.status(404).send({
        message: "Note not found",
      });
    }
    //check the owner of the notes
    if (noteData.owner != loggedInUserId) {
      return res.status(400).send({
        message: "You are not the author of this note",
      });
    }

    await notes.findByIdAndDelete(noteId);
    res.status(200).send({
      message: "Note deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      message: "Error deleting note",
      error: error.message,
    });
  }
};

const shareNote = async (req, res) => {
  try {
    const  noteId  = req.params.id;
    const { sharedWithEmail } = req.body;
    const loggedInUserId = req.user._id;

    // Check if the note exists
    const noteData = await notes.findById(noteId);
    if (!noteData) {
      return res.status(404).send({
        message: "Note not found",
      });
    }

    // Check if the logged-in user is the owner of the note
    if (noteData.owner != loggedInUserId) {
      return res.status(400).send({
        message: "You are not the owner of this note",
      });
    }
    const userToShareWith = await notesUsers.findOne({
      email: sharedWithEmail,
    });
    if (!userToShareWith) {
      return res.status(404).send({
        message: "User to share with not found",
      });
    }
    if (userToShareWith.notes.includes(noteId)) {
      return res.status(400).send({
        message: "Note is already shared with this user",
      });
    }
    await notesUsers.findByIdAndUpdate(userToShareWith._id, {
      $push: { notes: noteId },
    });
    res.status(200).send({
      message: "Note shared successfully",
    });
  } catch (error) {
    res.status(500).send({
      message: "Error sharing note",
      error: error.message,
    });
  }
};

const searchNotes = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const  q  = req.query.q;
    console.log(req.query.q)

    // Use MongoDB's text search to find notes with the keyword
    const userNotes = await notes.find({
      owner: loggedInUserId,
      content: { $regex: new RegExp(q, 'i') }, // 'i' for case-insensitive
    });

    res.status(200).send({
      message: "Search successful",
      notes: userNotes,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  createNote,
  getNotesOfLoggedInUser,
  getNote,
  updateNote,
  deleteNote,
  shareNote,
  searchNotes,
};
