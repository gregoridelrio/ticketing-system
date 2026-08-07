const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/users', authenticateToken, ticketController.getUsers);
router.get('/', authenticateToken, ticketController.getTickets);
router.get('/:id', authenticateToken, ticketController.getTicketById);
router.post('/', authenticateToken, ticketController.createTicket);
router.patch('/:id', authenticateToken, ticketController.updateTicket);
router.post('/:id/comments', authenticateToken, ticketController.addComment);

module.exports = router;