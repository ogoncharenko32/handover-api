import ShiftsCollection from '../db/models/Shifts.js';
import TicketsCollection from '../db/models/Tickets.js';

export const getTickets = async (shiftId) => {
  const dataQuery = TicketsCollection.find;

  const data = await TicketsCollection.find({
    $or: [
      //   { userId },
      //   { groupId },
      { shiftId },
    ],
  });

  return data;
};

export const createShift = async (payload) => {
  const data = await ShiftsCollection.create(payload);
  return data;
};

export const getShifts = async (groupId) => {
  const data = await ShiftsCollection.find({ groupId });
  return data;
};

export const addTicket = async (payload) => {
  const data = await TicketsCollection.create(payload);

  return data;
};
