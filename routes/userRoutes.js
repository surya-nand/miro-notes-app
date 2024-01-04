const {registerUser,loginUser} = require('../controllers/userController')
const {verifyToken} = require('../middleware/authMiddleware')

const userRoutes = (app) => {
   /*POST request to create a new user{
     onSuccess - "Registration Successful. Please Login"
     onFailure - sends error message
   }*/
   app.route('/api/auth/signup').post(registerUser);

   /*POST request to create a new user{
     onSuccess - 'login successful',token,userDetails
     onFailure - sends error message
   }*/
   app.route('/api/auth/login').post(loginUser);
}

module.exports= {userRoutes}