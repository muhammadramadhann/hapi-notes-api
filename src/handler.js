const { nanoid } = require('nanoid');
const notes = require('./notes');

/* --- method untuk menambah catatan baru --- */
const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;
  
  /* properti id unik dari modul nanoid */
  const id = nanoid(16);

  /* properti created at dan updated at sebagai waktu catatan baru ditambahkan */
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    title, tags, body, id, createdAt, updatedAt,
  };

  notes.push(newNote);

  /* validasi apakah newNote sudah masuk ke dalam array notes berdasarkan id catatan */
  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  /* menentukan response dari server berdasarkan hasil isSuccess */
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;
};

/* --- method untuk menampilkan catatan --- */
const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

/* --- method untuk menampilkan detail catatan --- */
const getNoteByIdHandler = (request, h) => {
  /* mendapatkan nilai id catatan dengan request.params */
  const { id } = request.params;

  /* mendapatkan objek note dengan id yang ditangkap sebelumnya dari objek array notes */
  const note = notes.filter((n) => n.id === id)[0];

  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

/* --- method untuk mengedit detail catatan --- */
const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  
  /* panggil data notes terbaru menggunakan request.payload */
  const { title, tags, body } = request.payload;

  /* update properti updateAt */
  const updatedAt = new Date().toISOString();

  /* mengubah catatan lama dengan catatan baru memanfaatkan indexing array */
  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id tidak ditemukan!',
  });
  response.code(404);
  return response;
};

/* --- method untuk menghapus catatan --- */
const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  /* mengubah catatan lama dengan catatan baru memanfaatkan indexing array */
  const index = notes.findIndex((note) => note.id === id);

  /* mengecek index nilainya tidak -1 dan hapus data pada array notes dengan method splice() */
  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id tidak ditemukan!',
  });
  response.code(404);
  return response;
};

module.exports = { 
  addNoteHandler, 
  getAllNotesHandler, 
  getNoteByIdHandler, 
  editNoteByIdHandler,
  deleteNoteByIdHandler, 
};
