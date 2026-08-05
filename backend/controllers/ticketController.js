const { Ticket, User, Comment } = require('../models');

exports.createTicket = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    const newTicket = await Ticket.create({
      title,
      description,
      priority: priority || 'MEDIUM',
      createdBy: req.user.id
    });

    const fullTicket = await Ticket.findByPk(newTicket.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(201).json({
      message: 'Ticket creado exitosamente',
      ticket: fullTicket
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear el ticket',
      error: error.message
    });
  }
};

exports.getTickets = async (req, res) => {
  try {
    const whereClause = req.user.role === 'ADMIN' ? {} : { createdBy: req.user.id };

    const tickets = await Ticket.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tickets', error: error.message });
  }
};

exports.getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findByPk(id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        {
          model: Comment,
          as: 'comments',
          include: [{ model: User, as: 'author', attributes: ['id', 'name', 'email'] }]
        }
      ]
    });

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket no encontrado.' });
    }

    if (req.user.role !== 'ADMIN' && ticket.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para ver este ticket.' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el ticket', error: error.message });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, assignedTo } = req.body;

    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket no encontrado' });
    }

    if (status) ticket.status = status;
    if (priority) ticket.priority = priority;
    if (assignedTo) ticket.assignedTo = assignedTo;

    await ticket.save();

    const updatedTicket = await Ticket.findByPk(id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        { model: Comment, include: [{ model: User, as: 'author', attributes: ['id', 'name'] }] }
      ]
    });

    res.json({ message: 'Ticket actualizado correctamente', ticket: updatedTicket });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el ticket', error: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'El contenido del comentario es obligatorio.' });
    }

    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket no encontrado.' });
    }

    if (req.user.role !== 'ADMIN' && ticket.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para comentar en este ticket.' });
    }

    const comment = await Comment.create({
      content,
      ticketId: id,
      userId: req.user.id
    });

    const commentWithAuthor = await Comment.findByPk(comment.id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'name', 'email'] }]
    });

    res.status(201).json({ message: 'Comentario añadido', comment: commentWithAuthor });
  } catch (error) {
    res.status(500).json({ message: 'Error al añadir el comentario', error: error.message });
  }
};

module.exports = {
  getTickets: exports.getTickets || getTickets,
  getTicketById: exports.getTicketById || getTicketById,
  createTicket: exports.createTicket || createTicket,
  updateTicket: exports.updateTicket || updateTicket,
  addComment: exports.addComment || addComment
};