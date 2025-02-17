import { Schema, model } from 'mongoose';
import { handleSaveError, setUpdateSettings } from './hooks';

const groupSchema = new Schema({
  groupName: {
    type: String,
    required: true,
    unique: true,
  },
});

groupSchema.post('save', handleSaveError);

groupSchema.pre('findOneAndUpdate', setUpdateSettings);

groupSchema.post('findOneAndUpdate', handleSaveError);

const GroupsCollection = model('group', groupSchema);

export default GroupsCollection;
