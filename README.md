## 🚀 Deployed web service link

 **Paste this link on your browser**:  Wait for 10 secs, as free instances will spin down due to inactivity
 
    https://miro-app.onrender.com
## 🚀 Project Setup
To get started with locally running the app, follow these simple steps:

1. **Clone this repository**: Begin by cloning the Miro Notes App repository to your local machine using the following command:
    ```bash
    https://github.com/surya-nand/miro-notes-app.git
    ```
2. **Install the dependencies**: Navigate to the cloned repository and install the required dependencies by running the following command:
    ```bash
    npm install --force
    ```
3. **Create a `.env` file**: Create a `.env` file in the root directory of your project and add the following environment variables:
    ```env
    SECRET_KEY = <your_secret_key>
    PORT=5000
    MONGO_SERVER= mongodb+srv://18131a0176:mongo123@cluster0.4chdkwu.mongodb.net/
    ``` 
    > **Hosted on the internet**: `mongodb+srv://<username>:<password>@somecluster.some.mongodb.net/`
4. **To run this program locally**: Naviagate to server folder
    ```bash
    cd server
    Run nodemon index.js
    ```
5. **To run supertests**: Navigate to server folder
    ```bash
    cd server
    Run npm test authMiddleware.test.js
    Run npm test userController.test.js
    ```
## 🚀 Project Approach
I have used express(Node.js Framework) to build this server

1. **Defining routes**: Begin by 
    ```bash
   1. Creating two seperate files to handle user rotes and notes rotes
   2. User Routes to handle login and signup 
   3. Notes Routes to handle notes  
    ```
2. **Middleware**: Using JWT authentication 
    ```bash
    1. Creating protected routes by verifying token before accessing the controllers
    2. Express-rate-limitter to handle the traffic
    ```
3. **Controllers**: Created userContoller and notesController
    ```bash
    1. User controller - handles registerUser and loginUser
    2. Notes controller - handles CRUD operation performed on notes
    ``` 
    
4. **Model**: Created notes and user model
    ```bash
    1. user schema - Consists of email, password, array of note's id's  created by that user
    2. note schema - Consists of title, content, owner(userId of the note owner)
    ```
5. **MongoDB**: 
    ```bash
    1. used mongoose to connect with mongoDB database
    ```
6. **Testing**: 
    ```bash
    1. Manually tested each middleware,routes and controllers using postman
    2. Controllers tested again using superttest and jest (Replicate the same by running npm test command)
    ``` 
