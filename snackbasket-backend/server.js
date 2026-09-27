const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const app = require("./src/app");
const connectDB = require("./src/config/db");
const User = require("./src/models/User");

const bootstrap = async () => {
  await connectDB();
  await User.ensureDefaultAdmin();
};

bootstrap();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
  );
});
