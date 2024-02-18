const mongoose = require('mongoose');

// Definir el esquema del mensaje
const messageSchema = new mongoose.Schema({

  contenido: {
    type: String,
  },

});

// Crear el modelo de Mensaje
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
