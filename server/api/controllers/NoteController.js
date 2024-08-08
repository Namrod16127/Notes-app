import { PrismaClient }  from '@prisma/client';

const prisma = new PrismaClient();

export const createNote = async(req, res) => {
  const { title, content, tags } = req.body;

  const note = await prisma.note.create({
    include:{
      user: true
    },
    data: {
      title: title,
      content: content,
      tags: tags,
      userId: req.userId,
    },
  });

  if (!title) {
    return res.status(400).json({ error: true, message:"Title is required" })
  }
  if (!content) {
    return res.status(400).json({ error: true, message:"Enter your content" })
  }
 
  res.status(201).json({ note });
};

export const getNote = async(req, res) => {
  
  const note_id = req.params.id;

  const note = await prisma.note.findUnique({
    where: {
      id: note_id,
    },
    include: {
      user: true,
    },
  });

  if (!note) {
    return res.status(404).json({
      error: "Note not found",
    });
  }
  return res.json({ note });
}

export const searchNote = async(req, res) => {
  const { query }= req.query;

  const or = query 
  ? {
    OR: [
      {title: {
        contains: query
      }},
      {content: {
        contains: query
      }},
    ]
  }
  : {}

  if (!query) {
    return res.status(400).json({
      error: true,
      message: "Search query required",
    })
  }
  
  try {
    const notes = await prisma.note.findMany({
      where: {
       ...or,
      },
    });

    res.json({
      error: false,
      notes,
      message: "Notes matching the search query found",
    });

  } catch (error){
    console.log(error);
    res.status(500).json({
      error: true,
      message: "No search results found"
    });
  }
}

export const deleteNote = async(req, res) => {
  const note_id = req.params.id;

  const note = await prisma.note.findUnique({
    where: {
      id: note_id,
    },
    include: {
      user: true,
    }
  });

  if (!note) {
    res.status(404).json({
      error: "Note not found",
    });
  }
  
  // check that the authenticated is user is the user who created the note

  if (note.userId !== req.userId) {
    return res.status(403).json({
      error:'You do not have permission to delete this article'
    })
  }
  await prisma.note.delete({
    where: { id: note_id },
  });

  return res.json("Note deleted successfully");

}

export const updateNote = async(req, res) => {
  const note_id = req.params.id;

  const note = await prisma.note.findUnique({
    where: { id: note_id, },
    include: {
      user: true,
    },
  });

  if (!note) {
    return res.status(404).json({
      error: "Note not found",
    });
  }

  // check that the authenticated is user is the user who created the note

  if (note.userId !== req.userId) {
    return res.status(403).json({
      error:'You do not have permission to delete this article'
    })
  }
  const updatedNote = await prisma.note.update({
    where: { id: note_id },
    data: {
      title: req.body.title,
      content: req.body.content,
      tags: req.body.tags,
      
    },
    include: {
      user: true,
    }
  });

  return res.json({
    note: updatedNote,
  });
}

export const updateIsPinned = async(req, res) => {
  const note_id = req.params.id;

  const note = await prisma.note.findUnique({
    where: { id: note_id },
    include: {
      user: true,
    },
  });

  if (!note) {
    return res.status(404).json({
      error: "Note not found",
    });
  }

  // check that the authenticated is user is the user who created the note

  if (note.userId !== req.userId) {
    return res.status(403).json({
      error:'You do not have permission to delete this article'
    })
  }
  const updatedIsPinned = await prisma.note.update({
    where: { id: note_id },
    data: {
      isPinned: req.body.isPinned,
    },
    include: {
      user: true,
    }
  });

  return res.json({
    note: updatedIsPinned,
  });
}

export const getAllNotes = async(req, res) => {
  
  try {
    const notes = await prisma.note.findMany({

      include: {
        user: true,
      },
    });
  
    return res.json({ 
      notes 
    });

  } catch (e) {
    console.log(e);
  }
  
}