const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const path = require("path");
const { connectToMongoDB,Message } = require("./config/app");
const PORT = process.env.PORT || 8000;
const list_users = {};

app.use(express.json());
app.use(express.static(path.join(__dirname, "views")));

connectToMongoDB()

server.listen(PORT, () => {
  console.log(
    "-+-+-+-+- Servidor iniciado -+-+-+-+-+-\n" +
      " -+-+-+- http://127.0.0.1:" +
      PORT +
      " -+-+-+-"
  );
});

app.post('/messages', async (req, res) => {
  try {
    const { contenido } = req.body; // Obtener el contenido del mensaje del cuerpo de la solicitud
    console.log(contenido);

    // Validar que se haya proporcionado el contenido del mensaje
    if (!contenido) {
      return res.status(400).json({ error: 'El contenido del mensaje es obligatorio' });
    }

    // Crear un nuevo mensaje utilizando el modelo Message
    const newMessage = await Message.create({ contenido });

    // Devolver el mensaje creado en la respuesta
    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrió un error al crear el mensaje' });
  }
});


io.on("connection", (socket) => {
  socket.on("register", (nickname) => {
    if (list_users[nickname]) {
      socket.emit("userExists");
      return;
    } else {
      list_users[nickname] = socket.id;
      socket.nickname = nickname;
      socket.emit("login");
      io.emit("activeSessions", list_users);
    }
  });

  app.get('/getMessages', (req, res) => {
    // Obtener mensajes del historial de chat o de la base de datos
    // Enviar los mensajes al cliente
});

app.get('/waitForMessages', (req, res) => {
  // Espera nuevos mensajes disponibles  y Enviar los mensajes al cliente cuando estén disponibles
});


  socket.on("disconnect", () => {
    delete list_users[socket.nickname];
    io.emit("activeSessions", list_users);
  });

  socket.on("sendMessage", ({ message, image }) => {
    io.emit("sendMessage", { message, user: socket.nickname, image });
  });

  socket.on("sendMessagesPrivate", ({ message, image, selectUser }) => {
    if (list_users[selectUser]) {
      io.to(list_users[selectUser]).emit("sendMessage", {
        message,
        user: socket.nickname,
        image,
      });
      io.to(list_users[socket.nickname]).emit("sendMessage", {
        message,
        user: socket.nickname,
        image,
      });
    } else {
      alert("El usuario al que intentas enviar el mensaje no existe!");
    }
  });
});