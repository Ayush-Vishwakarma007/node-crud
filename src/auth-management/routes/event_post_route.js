// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event_post_controller');

router.get('/getAll', eventController.getAllEvents);
router.post('/event_post/:id', eventController.createEvent);
router.delete('/:id', eventController.deleteEvent);
router.get('/:id', eventController.fetchEventsById);
router.put('/:id/appliedBy', eventController.updateAppliedBy);
router.post('/getByIds', eventController.getEventsByIds);



module.exports = router;
