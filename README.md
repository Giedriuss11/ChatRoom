Getting Started with Create React App
This project was bootstrapped with Create React App.

Available Scripts
In the project directory, you can run:

You need to direct to folder:

To have a fully functional project at first you need to direct it to the folder(there are two types of folders)(first is called front and second - back)

To start "front folder" you need to direct it with cd front:

To get started with the Create React App project, follow these steps:

Open your command line interface and navigate to the project directory.

Install the required node packages for the front-end by running the following command:

cd front
npm install
This will download all the necessary dependencies.

Start the front-end development server by running:

npm start
This command will run the app in development mode and open it in your browser at http://localhost:3000.

In another command line interface window, navigate to the project directory and switch to the back-end folder:

cd back
Install the required node packages for the back-end by running:

npm install
This will download all the necessary dependencies for the back-end.

Start the back-end server by running:

nodemon app
This command will run the back-end server.

Additionally, in the back folder, create a file named .env. Inside this file, add the following lines:

ACCESS_SECRET=ajksdfiuashdfi134857
MONGO_KEY=mongodb://username:password@localhost:27017/mydatabase
Replace username and password with your MongoDB credentials or use your database portal.

With these instructions, both the front-end and back-end of the application should be up and running. The front-end will be accessible at http://localhost:3000, and the back-end will be running on the specified server.

You can refer to the Create React App documentation and React documentation to learn more about React and the features provided by Create React App.
The page will reload when you make changes.
You may also see any lint errors in the console.

npm test
Launches the test runner in the interactive watch mode.
See the section about running tests for more information.

npm run build
Builds the app for production to the build folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

See the section about deployment for more information.

npm run eject
Note: this is a one-way operation. Once you eject, you can't go back!

If you aren't satisfied with the build tool and configuration choices, you can eject at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except eject will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use eject. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

Learn More
You can learn more in the Create React App documentation.

To learn React, check out the React documentation.

Code Splitting
This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

Analyzing the Bundle Size
This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

Making a Progressive Web App
This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

Advanced Configuration
This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

Deployment
This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

npm run build fails to minify
This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
