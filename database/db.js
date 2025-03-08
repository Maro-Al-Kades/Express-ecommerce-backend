const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log(`Database connected Successfully ✅`.blue.inverse);
  });
  // .catch((err) => {
  //   console.log(`Databse Error: ${err}`);
  //   process.exit(1);
  // });
};

module.exports = dbConnection;
