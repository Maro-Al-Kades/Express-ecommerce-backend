const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name required"],
      slug: {
        type: String,
        lowercase: true,
      },
    },

    email: {
      type: String,
      required: [true, "email required"],
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      unique: true,
    },

    profileImg: {
      type: String,
    },

    password: {
      type: String,
      required: [true, "password required"],
      minlength: [8, "password should be at least 8 characters long"],
      select: false,
    },

    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpiresAt: Date,
    passwordResetVerified: Boolean,

    role: {
      type: String,
      enum: ["user", "manager", "admin"],
      default: "user",
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // Hashing password
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
