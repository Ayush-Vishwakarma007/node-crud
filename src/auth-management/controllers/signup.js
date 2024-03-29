const { user } = require('pg/lib/defaults');
const User = require('../models/user');
const signupService = require('../services/signup');

async function signup (req, res) {
    try {
        const { name, email, password, role, skills, location, phone } = req.body;
        const createdUser = await signupService.createUser(name, email, password, role.toUpperCase(), skills, phone, location);
        console.log("Sign up service__: ", createdUser)
        res.send(createdUser, 200, "Sign up successfull", "Sucess")
    } catch (error) {
        console.error("Error creating user: ", error);
        res.send(null, 500, "something went wrong please try again later", "Error")
    }
};

async function getAllUsers(req, res) {
    try {
        const users = await signupService.getAllUser();
        res.send(users, 200, "All users fethed successfully", "Succss")
    } catch (error) {
        console.error("Error fetching users:", error);
        res.send(null, 500, "Something went wrong", "Error")
    }
}

async function getAllVolunteerUsers(req, res) {
    try {
        const volunteerUsers = await signupService.getAllVolunteerUsers(); 
        res.send(volunteerUsers, 200, "All Volunteers fetched successfully")
    } catch (error) {
        console.error("Error fetching volunteer users:", error);
        res.send(null, 500, "Something went wrong", "Error")
    }
}

async function updateUser(req, res) {
    try {
        const  eventId  = req.params;
        const  userId  = req.body;
        const updatedUser = await signupService.updateUserAppliedEvents(userId, eventId);
        res.send(updatedUser, 200, "User updated successfully", "Success");
    } catch (error) {
        console.error("Error updating user:", error);
        res.send(null, 500, "Something went wrong", "Error");
    }
}

async function getUserById(req, res) {
    const  userId  = req.params;
    try {
        const userData = await signupService.getUserById(userId.id);
        res.send(userData, 200, "User data fetched successfully", "Success")
        // res.status(200).json(userData);
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.send(null, 500, "Something went wrong. Please try again later.", "Error")
        // res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
}

async function updateUserAppointedBy(req, res) {
    const userId = req.params;
    const companyId = req.body;
    
    try {
      const updatedUser = await signupService.updateUserAppointedBy(userId.id,companyId.id);
      res.send(updatedUser, 200, "User appointed, Wait for his reply", "Success")
    } catch (error) {
        if(error.message === 'Volunteer already appointed'){
            res.send(null, 401, error.message, "Error")
        }
        res.send(null, 500, "Something went wrong please try again later", "Error")
    }
  }

  async function updateUserById(req, res) {
    try {
      const userId = req.params.id; 
      const userData = req.body;   
      const updatedUser = await signupService.updateUserById(userId, userData);
        
      res.send(updatedUser, 200, "Data fetched succesfully", "Error");
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong, please try again later', error: error.message });
    }
  }

  async function getAllVolunteerUsersByCompanyId(req, res, next) {
    const  companyId  = req.params;
    console.log("Company Id__", companyId.id)
    try {
        const volunteerUsers = await signupService.getAllVolunteerUsersByCompanyId(companyId.id);
        res.send(volunteerUsers, 200, "All users fetched successfully", "Success")
        // res.status(200).json(volunteerUsers);
    } catch (error) {
        res.send(null, 500, "Something went wrong", "Error")
        // res.status(500).json({ error: error.message });
    }
}  

async function getUserByIds(req, res) {
    const { ids } = req.body;
    try {
        const eventData = await signupService.getUserByIds(ids);
        res.send(eventData, 200, "All data fetched successfully", "success")
    } catch (error) {
        console.error("Error fetching events by IDs:", error);
        res.send(null, 500, "Something went wrong. Please try again later.", "Error")
    }
}

async function getChartData(req, res) {
    try {
      const chartData = await signupService.getChartData();
      res.send(chartData, 200, "Active users data fetched successfully", "Success");
    } catch (error) {
      console.error('Error fetching chart data:', error);
      res.send(null,500, "Something went wrong", "Error")
    //   res.status(500).json({ error: 'Internal server error' });
    }
  }

  async function getLineChartData(req, res){
    try {
        const lineChartData = await signupService.getLineChartData();
        res.send(lineChartData, 200, "Line chart data fetched successfully", "Success")
    } catch (error) {
       console.error(error) 
       res.send(null, 500, "Something went wrong", "Error")
    }
  }

  async function deleteUserById(req, res) {
    const userId = req.params.id; 
    try {
        const result = await signupService.deleteUserById(userId);
        res.send(result, 200, "User Deleted Successfully", "Error")
    } catch (error) {
        res.send(null, 500, "Something went wrong", "Error")
        // res.status(500).json({ error: error.message }); 
    }
}

module.exports = {
    signup,
    getAllUsers,
    getAllVolunteerUsers,
    updateUser,
    getUserById,
    updateUserAppointedBy,
    getAllVolunteerUsersByCompanyId,
    getUserByIds,
    getChartData,
    getLineChartData,
    updateUserById,
    deleteUserById
}
