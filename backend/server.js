const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');
const seedDatabase = require('./seeders/demoSeeder');

require('./models');

const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();

const allowedOrigins = [
  'https://ticketing-system-alpha-nine.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado por política de CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a MySQL establecida correctamente.');
    
    await sequelize.sync();
    await seedDatabase();
    
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
  }
}

startServer();