const { default: mongoose } = require("mongoose");

async function connect() {
  await mongoose.connect(process.env.ATLAS_URL);
  console.log("database connected");
}

module.exports = connect;
