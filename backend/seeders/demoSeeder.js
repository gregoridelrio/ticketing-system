const bcrypt = require('bcryptjs');
const { User, Ticket, Comment } = require('../models');

const seedDatabase = async () => {
  try {
    console.log('Iniciando Seeding...');

    const adminPassword = await bcrypt.hash('Admin123!', 10);
    const userPassword = await bcrypt.hash('User123!', 10);

    const admin = await User.create({
      name: 'Admin Demo',
      email: 'admin@demo.com',
      password: adminPassword,
      role: 'ADMIN'
    });

    const user = await User.create({
      name: 'User Demo',
      email: 'user@demo.com',
      password: userPassword,
      role: 'USER'
    });

    const ticket1 = await Ticket.create({
      title: 'Error 500 al procesar pago con tarjeta Visa',
      description: 'Los clientes reportan fallos en la pasarela de pago Stripe durante el checkout.',
      status: 'OPEN',
      priority: 'HIGH',
      createdBy: user.id,
      assignedTo: null
    });

    const ticket2 = await Ticket.create({
      title: 'Actualizar imágenes de la Landing Page',
      description: 'Reemplazar los banners antiguos con la nueva línea gráfica de la empresa.',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      createdBy: user.id,
      assignedTo: admin.id
    });

    const ticket3 = await Ticket.create({
      title: 'Optimización de consultas SQL en el Reporte Mensual',
      description: 'El reporte de facturación tarda más de 12 segundos en generarse.',
      status: 'RESOLVED',
      priority: 'LOW',
      createdBy: user.id,
      assignedTo: admin.id
    });

    await Comment.create({
      text: 'Adjunto captura de pantalla con los logs del servidor.',
      ticketId: ticket1.id,
      userId: user.id
    });

    await Comment.create({
      text: 'Revisando los webhooks de Stripe. Parece un problema de timeout.',
      ticketId: ticket2.id,
      userId: admin.id
    });

    await Comment.create({
      text: 'Se agregaron índices en la base de datos y el reporte ahora carga en 200ms.',
      ticketId: ticket3.id,
      userId: admin.id
    });

    console.log('✅ Base de datos poblada exitosamente.');
  } catch (error) {
    console.error('❌ Error al ejecutar el seeder:', error);
  }
};

module.exports = seedDatabase;