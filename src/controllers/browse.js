import * as browseServices from '../services/browse.js';

export const getTicketsController = async (req, res) => {
  const data = await browseServices.getTickets(req.user);

  res.status(200).json({
    status: 200,
    message: 'Successfully found tickets',
    data,
  });
};

export const addTicketController = async (req, res) => {
  const { _id, groupId } = req.user;
  console.log(req.user);
  const data = await browseServices.addTicket({ userId: _id, groupId, ...req.body });

  res.status(200).json({
    status: 200,
    message: 'Successfully added ticket',
    data,
  });
};
