const mongoose = require("mongoose");
const Message = require("./models/mensaje"); // Importar el modelo de mensaje

const connectToMongoDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/cris', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Base de datos online");
    
    // Comprobar si la colección de mensajes existe
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(collection => collection.name);

    // Si la colección de mensajes no existe, crear un mensaje de ejemplo para forzar la creación de la colección
    if (!collectionNames.includes('messages')) {
      await Message.create({
        contenido: 'Este es un mensaje de ejemplo'
      });
      console.log('Colección de mensajes creada correctamente');
    }
    
  } catch (error) {
    console.log(error);
    throw new Error("Error a la hora de iniciar la base de datos");
  }
};

module.exports = {
  connectToMongoDB,
  Message
};
