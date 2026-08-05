const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');

require('./models');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/', (req, res) => {
  res.json({ status: 'OK', message: 'API funcionando correctamente' });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a MySQL establecida correctamente.');
    
    await sequelize.sync({ alter: true });
    console.log('Modelos y tablas sincronizados correctamente.');

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
  }
}

startServer();