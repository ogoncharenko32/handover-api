import TicketsCollection from '../db/models/Tickets.js';

export const getTickets = async ({ userId, groupId }) => {
  const dataQuery = TicketsCollection.find;

  const data = await TicketsCollection.find({
    $or: [{ userId }, { groupId }],
  });

  return data;
};

export const addTicket = async (payload) => {
  const data = await TicketsCollection.create(payload);

  return data;
};
