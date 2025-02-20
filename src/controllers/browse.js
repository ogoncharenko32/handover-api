import * as browseServices from '../services/browse.js';

export const getTicketsController = async (req, res) => {
  const { shiftId } = req.query;

  const data = await browseServices.getTickets(shiftId);

  res.status(200).json({
    status: 200,
    message: 'Successfully found tickets',
    data,
  });
};

export const createShiftController = async (req, res) => {
  const data = await browseServices.createShift(req.body);

  res.status(200).json({
    status: 200,
    message: 'Successfully created new shift',
    data,
  });
};

export const getShiftsController = async (req, res) => {
  const { groupId } = req.user;

  const data = await browseServices.getShifts(groupId);

  res.status(200).json({
    status: 200,
    message: 'Successfully found shifts',
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
