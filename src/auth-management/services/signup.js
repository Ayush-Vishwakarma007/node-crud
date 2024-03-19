const sequelize = require('../../../config/database');
const { Sequelize, Op } = require('sequelize');
const { user } = require('pg/lib/defaults');
const User = require('../models/user');
const bcrypt = require('bcryptjs');


async function createUser(name, email, password, role, skills, phone, location) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let user;
    if (role === 'COMPANY') {
        user = await User.create({ name, email, password: hashedPassword, role, phone, location });
    } else {
        user = await User.create({ name, email, password: hashedPassword, role, skills, phone, location });
    }
    if (user['dataValues']['role'] === 'COMPANY') {
        delete user['dataValues']['skills']
        delete user['dataValues']['phone']
        delete user['dataValues']['location']
    }
    delete user['dataValues']['password']
    return user['dataValues']
};

async function getAllUser() {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });

        const formattedUsers = users.map(user => user.toJSON());
        return formattedUsers;
    } catch (error) {
        throw error;
    }
}

async function getAllVolunteerUsers() {
    try {
        const volunteerUsers = await User.findAll({
            where: { role: 'VOLUNTEER' },
            attributes: { exclude: ['password'] }
        });

        const formattedVolunteerUsers = volunteerUsers.map(user => user.toJSON());
        return formattedVolunteerUsers;
    } catch (error) {
        throw error;
    }
}

async function updateUserAppliedEvents(userId, eventId) {
    try {
        const user = await User.findByPk(userId.id);
        if (!user) {
            throw new Error("User not found");
        }

        if (user.applied_event && user.applied_event.includes(eventId.id)) {
            throw new Error("Event already applied");
        }

        if (!user.applied_event) {
            user.applied_event = [eventId.id];
        } else {
            user.applied_event.push(eventId.id);
            user.changed('applied_event', true);
        }

        await user.save();
        return user.toJSON();
    } catch (error) {
        throw error;
    }
}

async function getUserById(userId) {
    try {
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            throw new Error("User not found");
        }

        return user.toJSON();
    } catch (error) {
        throw error;
    }
}

async function updateUserAppointedBy(userId, companyId) {
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error("User not found");
        }
        console.log("User__: ", companyId)
        if (user.appointedBy && user.appointedBy.includes(companyId)) {
            throw new Error("Volunteer already appointed");
        }

        if (!user.appointedBy) {
            user.appointedBy = [companyId];
        } else {
            user.appointedBy.push(companyId);
            user.changed('appointedBy', true);
        }

        await user.save();
        return user.toJSON();
    } catch (error) {
        throw error;
    }
}


  async function getAllVolunteerUsersByCompanyId(companyId) {
    try {
        const volunteerUsers = await User.findAll({
            where: { 
                role: 'VOLUNTEER',
                appointedBy: { [Sequelize.Op.contains]: [companyId] }
            },
            attributes: { exclude: ['password'] }   
        });

        const formattedVolunteerUsers = volunteerUsers.map(user => user.toJSON());
        return formattedVolunteerUsers;
    } catch (error) {
        console.log("Error while data fetching__: ", error)
        throw error;
    }
}


async function getUserByIds(ids) {
    try {
        const users = await User.findAll({
            where: {
                id: ids
            },
            attributes: { exclude: ['password'] } 
        });
        const userData = users.map(user => user.toJSON());
        return userData;
    } catch (error) {
        console.error("Error fetching user by IDs:", error);
        throw error;
    }
}

async function getChartData() {
    try {
      const activeUsers = await this.getAllUser();  
      const users2024 = activeUsers.filter(user => {
        const userYear = new Date(user.createdAt).getFullYear();
        return userYear === 2023;
      });
  
      const groupedByMonth = {};
      users2024.forEach(user => {
        const userMonth = new Date(user.createdAt).getMonth() + 1; 
        if (!groupedByMonth[userMonth]) {
          groupedByMonth[userMonth] = {
            activeCompany: 0,
            activeVolunteer: 0
          };
        }
        if (user.role === 'COMPANY') {
          groupedByMonth[userMonth].activeCompany++;
        } else if (user.role === 'VOLUNTEER') {
          groupedByMonth[userMonth].activeVolunteer++;
        }
      });
  
      const activeCompanyData = [];
      const activeVolunteerData = [];
      for (let month = 1; month <= 12; month++) {
        const monthData = groupedByMonth[month] || { activeCompany: 0, activeVolunteer: 0 };
        activeCompanyData.push(monthData.activeCompany);
        activeVolunteerData.push(monthData.activeVolunteer);
      }
  
      const chartData = [
        { name: 'Active Company', data: activeCompanyData },
        { name: 'Active Volunteer', data: activeVolunteerData }
      ];
  
      return chartData;
    } catch (error) {
      console.error('Error fetching chart data:', error);
      throw new Error('Error fetching chart data');
    }
  }


module.exports = {
    createUser,
    getAllUser,
    getAllVolunteerUsers,
    updateUserAppliedEvents,
    getUserById,
    updateUserAppointedBy,
    getAllVolunteerUsersByCompanyId,
    getUserByIds,
    getChartData
}
