// services/eventService.js
const Event = require('../models/event');
const User = require('../models/user')

async function getAllEvents() {
    const allEvents = await Event.findAll(); 
    const allData = []
    allEvents.forEach(element => {
        allData.push(element['dataValues'])
    });
    return allData
}

async function createEvent(eventData) {
    try {
        const existingEvent = await Event.findOne({ where: { company_name: eventData.company_name } });
    if (existingEvent) {
        throw new Error('already exists');
    }
    const response = await Event.create(eventData);
    return response['dataValues'];       
    } catch (error) {
        throw error
    }
    
}


async function deleteEvent(id) {
    const event = await Event.findByPk(id);
    if (!event) throw new Error('Event not found');
    await event.destroy();
}

async function updateAppliedBy(eventId, userId) {
    try {
        let event = await Event.findByPk(eventId);

        if (!event) {
            throw new Error('Event not found');
        }

        let user = await User.findByPk(userId);

        if (!user) {
            throw new Error('User not found');
        }

        if (event.appliedBy && event.appliedBy.includes(user.name)) {
            throw new Error('You have already applied to this event');
        }

        if (event.appliedBy.length === 0) {
            event.appliedBy = [user.name];
        } else {
            event.appliedBy.push(user.name);
            event.changed('appliedBy', true);
        }

        await event.save();        
        return event;
    } catch (error) {
        console.error("Error saving event:", error);
        throw error;
    }
}

async function getEventsByIds(ids) {
    try {
        // Find events by multiple IDs
        const events = await Event.findAll({
            where: {
                id: ids
            }
        });

        // Map the events to extract their dataValues
        const eventData = events.map(event => event.toJSON());

        return eventData;
    } catch (error) {
        console.error("Error fetching events by IDs:", error);
        throw error;
    }
}

async function getEventsById(id) {
    try {
        const events = await Event.findAll({
            where: {
                company_id: id
            }
        });
        const eventData = events.map(event => event.toJSON());

        return eventData;
    } catch (error) {
        console.error("Error fetching events by IDs:", error);
        throw error;
    }
}


module.exports = {
    getAllEvents,
    createEvent,
    deleteEvent,
    updateAppliedBy,
    getEventsByIds,
    getEventsById
};
