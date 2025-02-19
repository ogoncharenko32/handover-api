import mongoose, { Schema, model } from 'mongoose';
import { handleSaveError, setUpdateSettings } from './hooks.js';

const ticketSchema = new Schema(
  {
    status: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    isImportant: {
      type: Boolean,
      default: false,
      required: true,
    },
    comment: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Groups',
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

ticketSchema.post('save', handleSaveError);

ticketSchema.pre('findOneAndUpdate', setUpdateSettings);

ticketSchema.post('findOneAndUpdate', handleSaveError);

const TicketsCollection = model('tickets', ticketSchema);

export default TicketsCollection;
