// src/models/user.model.js
const { Schema, model } = require('mongoose'); // ✅ solo esta línea de importación

const userSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: { type: String, required: true, select: false }
  },
  { timestamps: true }
);

module.exports = model('User', userSchema);