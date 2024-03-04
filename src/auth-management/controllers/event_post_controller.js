// controllers/eventController.js
const eventService = require('../services/event_post_service');
const jwt = require('jsonwebtoken');

async function getAllEvents(req, res) {
    try {
        const events = await eventService.getAllEvents();
        res.send(events,200, 'All events fetched succussfully','Success')
    } catch (err) {
        console.error(err);
        res.send(null,500, 'Something went wrong','Error')
    }
}

async function createEvent(req, res) {
    try {
        const company_id = parseInt(req.params.id); 
        const eventData = { ...req.body, company_id }; 
        const event = await eventService.createEvent(eventData);
        res.send(event, 200, "Event Posted Successfully", "Success")
    } catch (error) {
        if (error.message === 'already exists') {
            res.send(null, 401, 'Event already exists', 'BAD_RQUEST');
        } else {
            res.send(null, 500, 'Something went wrong', 'Error');
        }
    }
}

async function deleteEvent(req, res) {
    try {
        await eventService.deleteEvent(req.params.id);
        res.status(204).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

async function updateAppliedBy(req, res) {
    try {
        const eventId = req.params.id;
        const userId = req.body.userId;
        const updatedData = await eventService.updateAppliedBy(eventId, userId);
        res.send(updatedData, 200, 'Application Successfull', 'Success')
    } catch (error) {
        if (error.message === 'Event not found' || error.message === 'You have already applied to this event') {
            res.send(null, 402, error.message, 'Error')
        } else {
            console.error(error);
            res.send(null, 500, "Something went wrong", "Error")
        }
    }
}

async function getEventsByIds(req, res) {
    const { ids } = req.body;
    try {
        const eventData = await eventService.getEventsByIds(ids);
        res.send(eventData, 200, "All data fetched successfully", "success")
    } catch (error) {
        console.error("Error fetching events by IDs:", error);
        res.send(null, 500, "Something went wrong. Please try again later.", "Error")
    }
}

async function fetchEventsById(req, res, next) {
    try {
        const id = req.params.id;
        const events = await eventService.getEventsById(id);
        // res.json(events);
        res.send(events, 200, "All events fetched successfully", "Success")
    } catch (error) {
        // res.status(500).json({ message: 'Failed to fetch events by ID', error: error.message });
        res.send(null, 500, "something went wrong", "Error")
    }
}

module.exports = {
    getAllEvents,
    createEvent,
    deleteEvent,
    updateAppliedBy,
    getEventsByIds,
    fetchEventsById
};
