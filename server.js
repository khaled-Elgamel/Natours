const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('uncaughtException ! SHUTTING DOWN ....');
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(db).then(() => console.log('DB connection successful'));

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`server is running on port ${port} ... `);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLER REJECTION ! SHUTTING DOWN ....');
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('uncaughtException ! SHUTTING DOWN ....');
  process.exit(1);
});
