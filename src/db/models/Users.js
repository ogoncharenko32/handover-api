import mongoose, { Schema, model } from 'mongoose';
import { handleSaveError, setUpdateSettings } from './hooks.js';
import { emailRegexp } from '../../constants/index.js';

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: emailRegexp,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Groups',
    },
  },
  { versionKey: false, timestamps: true },
);

userSchema.post('save', handleSaveError);

userSchema.pre('findOneAndUpdate', setUpdateSettings);

userSchema.post('findOneAndUpdate', handleSaveError);

const UsersCollection = model('user', userSchema);

export default UsersCollection;
