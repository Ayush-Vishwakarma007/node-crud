const sequelize = require('../../../config/database');
const { Sequelize, Op } = require('sequelize');
const { user } = require('pg/lib/defaults');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const eventService = require('./event_post_service')


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

async function deleteUserById(userId) {
  try {
      const user = await User.findByPk(userId);
      if (!user) {
          throw new Error('User not found');
      }
      await user.destroy();
      return { message: 'User deleted successfully' };
  } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
  }
}

async function getAllUser() {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']]
        });
        const formattedUsers = users.map(user => user.toJSON());
        return formattedUsers;
    } catch (error) {
        throw error;
    }
}

async function updateUserById(userId, userData) {
  try {
    const user = await User.findByPk(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    if (userData.name) {
      user.name = userData.name;
    }
    if (userData.email) {
      user.email = userData.email;
    }
    if (userData.skills) {
      user.skills = userData.skills;
    }
    if (userData.phone) {
      user.phone = userData.phone;
    }
    if (userData.location) {
      user.location = userData.location;
    }
    if (userData.role) {
      user.role = userData.role;
    }

    await user.save();
    return user;
  } catch (error) {
    console.error(error);
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

// async function getChartData() {
//     try {
//       const activeUsers = await this.getAllUser();  
//       const users2024 = activeUsers.filter(user => {
//         const userYear = new Date(user.createdAt).getFullYear();
//         return userYear === 2023;
//       });
  
//       const groupedByMonth = {};
//       users2024.forEach(user => {
//         const userMonth = new Date(user.createdAt).getMonth() + 1; 
//         if (!groupedByMonth[userMonth]) {
//           groupedByMonth[userMonth] = {
//             activeCompany: 0,
//             activeVolunteer: 0
//           };
//         }
//         if (user.role === 'COMPANY') {
//           groupedByMonth[userMonth].activeCompany++;
//         } else if (user.role === 'VOLUNTEER') {
//           groupedByMonth[userMonth].activeVolunteer++;
//         }
//       });
  
//       const activeCompanyData = [];
//       const activeVolunteerData = [];
//       for (let month = 1; month <= 12; month++) {
//         const monthData = groupedByMonth[month] || { activeCompany: 0, activeVolunteer: 0 };
//         activeCompanyData.push(monthData.activeCompany);
//         activeVolunteerData.push(monthData.activeVolunteer);
//       }
  
//       const chartData = [
//         { name: 'Active Company', data: activeCompanyData },
//         { name: 'Active Volunteer', data: activeVolunteerData }
//       ];
  
//       return chartData;
//     } catch (error) {
//       console.error('Error fetching chart data:', error);
//       throw new Error('Error fetching chart data');
//     }
//   }

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
          activeCompany: { Active: 0, Inactive: 0 },
          activeVolunteer: { Active: 0, Inactive: 0 }
        };
      }
      if (user.role === 'COMPANY') {
        groupedByMonth[userMonth].activeCompany[user.status]++;
      } else if (user.role === 'VOLUNTEER') {
        groupedByMonth[userMonth].activeVolunteer[user.status]++;
      }
    });

    const activeCompanyData = [];
    const activeVolunteerData = [];
    const inactiveCompanyData = [];
    const inactiveVolunteerData = [];

    for (let month = 1; month <= 12; month++) {
      const monthData = groupedByMonth[month] || { activeCompany: { Active: 0, Inactive: 0 }, activeVolunteer: { Active: 0, Inactive: 0 } };
      
      activeCompanyData.push(monthData.activeCompany.Active);
      activeVolunteerData.push(monthData.activeVolunteer.Active);

      inactiveCompanyData.push(monthData.activeCompany.Inactive);
      inactiveVolunteerData.push(monthData.activeVolunteer.Inactive);
    }

    const chartData = [
      { name: 'Active Company', data: activeCompanyData },
      { name: 'Active Volunteer', data: activeVolunteerData },
      { name: 'Inactive Company', data: inactiveCompanyData },
      { name: 'Inactive Volunteer', data: inactiveVolunteerData }
    ];

    return chartData;
  } catch (error) {
    console.error('Error fetching chart data:', error);
    throw new Error('Error fetching chart data');
  }
}



  async function getLineChartData(){
    try {
        const activeUsers = await this.getAllUser(); 
        const allEvents = await eventService.getAllEvents();
  
        const users2024 = activeUsers.filter(user => {
          const userYear = new Date(user.createdAt).getFullYear();
          return userYear === 2023;
        });
  
        const groupedByMonth = {};
        const eventsByMonth = {};
  
        // Group users by month and count companies and volunteers
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
  
        // Group events by month
        allEvents.forEach(event => {
          const eventMonth = new Date(event.createdAt).getMonth() + 1;
          if (!eventsByMonth[eventMonth]) {
            eventsByMonth[eventMonth] = 0;
          }
          eventsByMonth[eventMonth]++;
        });
  
        const activeCompanyData = [];
        const activeVolunteerData = [];
        const registeredEvents = [];
  
        for (let month = 1; month <= 12; month++) {
          const monthCompanyData = groupedByMonth[month] || { activeCompany: 0, activeVolunteer: 0 };
          activeCompanyData.push(monthCompanyData.activeCompany);
          activeVolunteerData.push(monthCompanyData.activeVolunteer);
  
          const monthEventData = eventsByMonth[month] || 0;
          registeredEvents.push(monthEventData);
        }
  
        const chartData = [
          { name: 'Company', data: activeCompanyData },
          { name: 'Volunteer', data: activeVolunteerData },
          { name: 'Events', data: registeredEvents }
        ];
  
        return chartData;
      } catch (error) {
        console.error('Error fetching chart data:', error);
        throw new Error('Error fetching chart data');
      }
  }
  
  // Assuming eventService.getAllEvents() returns a Promise that resolves to an array of event objects
  


module.exports = {
    createUser,
    getAllUser,
    getAllVolunteerUsers,
    updateUserAppliedEvents,
    getUserById,
    updateUserAppointedBy,
    getAllVolunteerUsersByCompanyId,
    getUserByIds,
    getChartData,
    getLineChartData,
    updateUserById,
    deleteUserById
}
