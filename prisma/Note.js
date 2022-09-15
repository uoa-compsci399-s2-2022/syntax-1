import prisma from "./prisma";

export const createNote = async (title, body, session) => {
  const newNote = await prisma.note.create({
    data: {
      title,
      body,
      user: { connect: { email: session?.user?.email } },
      group: {
        connectOrCreate: {
          where: {
            userId: session?.user?.id,
          },
          create: { userId: session?.user?.id, name: "Ungrouped" }
        }
      }
    }
  });
  const note = await getNoteByID(newNote.id);
  return note;
};

export const getNoteByID = async (id) => {
  const note = await prisma.note.findUnique({
    where: {
      id
    },
    include: {
      user: true,
      group: true
    }
  });

  return JSON.parse(JSON.stringify(note));
};

export const getAllNotes = async () => {
  const notes = await prisma.note.findMany({
    include: {
      user: true,
      group: true
    }
  });

  return notes;
};

export const getAllNotesByUserID = async (id) => {
  console.log("called");
  const notes = await prisma.note.findMany({
    where: {
      userId: id
    }
  });

  return JSON.parse(JSON.stringify(notes));
};

export const updateNote = async (id, updatedData, session) => {
  let userId = session?.user.id;
  const updatedNote = await prisma.note.update({
    where: {
      id_userId: {
        id,
        userId
      }
    },
    data: {
      ...updatedData
    }
  });
  const note = await getNoteByID(updatedNote.id);
  return note;
};

export const deleteNote = async (id, session) => {
  let userId = session?.user.id;
  const deletedNote = await prisma.note.delete({
    where: {
      id_userId: {
        id,
        userId
      }
    }
  });
  return deletedNote;
};

export const createGroup = async (name, color = "#ffffff", session) => {
  const newGroup = await prisma.group.create({
    data: {
      name,
      color,
      user: { connect: { email: session?.user?.email } }
    }
  });
  const group = await getGroupByID(newGroup.id);
  return group;
};

export const getGroupByID = async (id) => {
  const group = await prisma.group.findUnique({
    where: {
      id
    },
    include: {
      user: true
    }
  });

  return JSON.parse(JSON.stringify(group));
};
