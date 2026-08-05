const User = require('./User');
const Ticket = require('./Ticket');
const Comment = require('./Comment');

User.hasMany(Ticket, { foreignKey: 'createdBy', as: 'createdTickets' });
Ticket.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

User.hasMany(Ticket, { foreignKey: 'assignedTo', as: 'assignedTickets' });
Ticket.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignee' });

Ticket.hasMany(Comment, { foreignKey: 'ticketId', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(Ticket, { foreignKey: 'ticketId' });

User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' });

module.exports = {
  User,
  Ticket,
  Comment
};