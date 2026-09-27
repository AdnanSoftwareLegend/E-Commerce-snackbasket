const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "seller", "admin"], default: "user" },
    phone: { type: String },
    address: { type: String },
    sellerRequest: {
      status: {
        type: String,
        enum: ["none", "pending", "approved", "rejected"],
        default: "none",
      },
      message: { type: String, default: "" },
      requestedAt: { type: Date },
      reviewedAt: { type: Date },
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
    },
  },
  { timestamps: true },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.statics.ensureDefaultAdmin = async function () {
  const email = process.env.ADMIN_EMAIL || "admin@snackbasket.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  const existingAdmin = await this.findOne({ email });
  if (existingAdmin) {
    return existingAdmin;
  }

  const adminUser = await this.create({
    name: "SnackBasket Admin",
    email,
    password,
    role: "admin",
    sellerRequest: {
      status: "none",
      message: "",
      requestedAt: null,
      reviewedAt: null,
      reviewedBy: null,
    },
  });

  return adminUser;
};

module.exports = mongoose.model("User", userSchema);
