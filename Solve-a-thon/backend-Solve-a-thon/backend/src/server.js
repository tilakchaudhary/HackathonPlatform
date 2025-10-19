require('dotenv').config();
const http = require('http');
const app = require('./app');
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const adminRoutes = require('./routes/admin');

const organizerRoutes = require("./routes/organizer");

app.use("/api/organizer", organizerRoutes);


app.use('/api/admin', adminRoutes);

// Attach Socket.io
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || '*', methods: ['GET','POST'] }
});
app.set('io', io);

io.on('connection', socket => {
  console.log('Socket connected', socket.id);
  socket.on('joinHackathon', room => {
    socket.join(room);
  });
  socket.on('disconnect', () => console.log('Socket disconnected', socket.id));
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

console.log('Admin routes mounted at /api/admin');
