import mongoose, { Schema, model } from 'mongoose';
import { handleSaveError, setUpdateSettings } from './hooks.js';

const shiftSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Groups',
    },
  },
  { versionKey: false, timestamps: true },
);

shiftSchema.post('save', handleSaveError);

shiftSchema.pre('findOneAndUpdate', setUpdateSettings);

shiftSchema.post('findOneAndUpdate', handleSaveError);

const ShiftsCollection = model('shift', shiftSchema);

export default ShiftsCollection;
