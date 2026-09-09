// Simple admin backend scaffold for development
// - Express REST API: /api/players
// - Socket.IO for real-time updates and private admin->player messages
// NOTE: This is an in-memory prototype. Replace with a real database for production.

const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(bodyParser.json());

// Serve static front-end files (admin UI and game pages)
const staticPath = path.resolve(__dirname, '..', 'src');
app.use(express.static(staticPath));

// In-memory players store (prototype)
// Each player: { id, name, location, progress, items: [], socketId, lastSeen }
const players = new Map();

// helper to seed one sample player
function seedSamplePlayers(){
  const now = Date.now();
  players.set('player1', {
    id: 'player1',
    name: '測試玩家1',
    location: { map: 'start_village', x: 10, y: 20 },
    progress: { level: 3, questsCompleted: ['q1'] },
    items: [{ id: 'potion', qty: 3 }],
    socketId: null,
    lastSeen: now
  });
  players.set('player2', {
    id: 'player2',
    name: '測試玩家2',
    location: { map: 'forest', x: 100, y: 44 },
    progress: { level: 1, questsCompleted: [] },
    items: [],
    socketId: null,
    lastSeen: now
  });
}
seedSamplePlayers();

// REST API
app.get('/api/players', (req, res) => {
  const list = Array.from(players.values());
  res.json(list);
});

app.get('/api/players/:id', (req, res) => {
  const p = players.get(req.params.id);
  if (!p) return res.status(404).json({ error: 'not found' });
  res.json(p);
});

// Update player fields (partial update)
app.post('/api/players/:id', (req, res) => {
  const id = req.params.id;
  const current = players.get(id);
  if (!current) return res.status(404).json({ error: 'not found' });
  const updates = req.body || {};
  const merged = { ...current, ...updates, lastSeen: Date.now() };
  // ensure nested merges for location/progress/items if provided
  if (updates.location) merged.location = { ...current.location, ...updates.location };
  if (updates.progress) merged.progress = { ...current.progress, ...updates.progress };
  if (updates.items) merged.items = updates.items;
  players.set(id, merged);

  // notify the player socket if connected
  if (merged.socketId) {
    io.to(merged.socketId).emit('player:update', merged);
  }

  res.json(merged);
});

// Simple endpoint to list sockets (for debugging)
app.get('/api/sockets', (req, res) => {
  const out = [];
  for (const p of players.values()) out.push({ id: p.id, socketId: p.socketId });
  res.json(out);
});

// Socket.IO events
io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  // Player or admin can register
  socket.on('register', (payload) => {
    // payload: { role: 'player'|'admin', id, name }
    if (!payload || !payload.role) return;
    socket.data.role = payload.role;
    socket.data.id = payload.id || null;
    socket.data.name = payload.name || null;

    if (payload.role === 'player'){
      // create or update player record
      const existing = players.get(payload.id) || {
        id: payload.id,
        name: payload.name || payload.id,
        location: { map: 'unknown', x: 0, y: 0 },
        progress: {},
        items: [],
        socketId: socket.id,
        lastSeen: Date.now()
      };
      existing.socketId = socket.id;
      existing.name = payload.name || existing.name;
      existing.lastSeen = Date.now();
      players.set(payload.id, existing);
      console.log('player registered', payload.id);

      // notify admins that a player connected
      io.emit('admin:playerConnected', existing);
    }

    if (payload.role === 'admin'){
      // nothing special for now
      console.log('admin connected', payload.name || socket.id);
    }
  });

  // Player sends periodic heartbeat/update
  socket.on('player:heartbeat', (payload) => {
    // payload: { id, location, progress, items }
    if (!payload || !payload.id) return;
    const p = players.get(payload.id) || { id: payload.id, name: payload.name || payload.id };
    p.location = payload.location || p.location;
    p.progress = payload.progress || p.progress;
    p.items = payload.items || p.items;
    p.socketId = socket.id;
    p.lastSeen = Date.now();
    players.set(payload.id, p);

    // broadcast to admins (or clients) that player updated
    io.emit('admin:playerUpdate', p);
  });

  // Admin sends a private message to a player
  socket.on('admin:message', (payload) => {
    // payload: { toPlayerId, text }
    if (!payload || !payload.toPlayerId) return;
    const p = players.get(payload.toPlayerId);
    if (p && p.socketId){
      io.to(p.socketId).emit('private:message', { from: 'admin', text: payload.text });
      socket.emit('admin:messageStatus', { ok: true });
    } else {
      socket.emit('admin:messageStatus', { ok: false, error: 'player offline' });
    }
  });

  socket.on('disconnect', () => {
    console.log('socket disconnect', socket.id);
    // clear socketId from players if matches
    for (const p of players.values()){
      if (p.socketId === socket.id){
        p.socketId = null;
        p.lastSeen = Date.now();
        players.set(p.id, p);
        io.emit('admin:playerDisconnected', p);
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Admin backend running at http://localhost:${PORT}  (serving ${staticPath})`);
});
