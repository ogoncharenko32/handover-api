import createHttpError from 'http-errors';
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
  console.log(req.body);
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
  console.log(req.body);
  const data = await browseServices.addTicket({ userId: _id, groupId, ...req.body });

  res.status(200).json({
    status: 200,
    message: 'Successfully added ticket',
    data,
  });
};

export const deleteTicketController = async (req, res, next) => {
  const { _id: userId } = req.user;
  const { ticketId } = req.params;
  const data = await browseServices.deleteTicket({ _id: ticketId, userId });
  if (!data) {
    next(createHttpError(404, 'Ticket not found'));
    return;
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully deleted ticket',
    ticketId,
  });
};

export const updateTicketController = async (req, res) => {
  console.log(req.user);
  const { _id: userId } = req.user;
  console.log('🚀 ~ updateTicketController ~ userId:', userId);
  const { ticketId } = req.params;
  const data = await browseServices.updateTicket({ _id: ticketId, userId }, { ...req.body });
  console.log('🚀 ~ updateTicketController ~ ticketId:', ticketId);

  res.status(200).json({
    status: 200,
    message: 'Successfully updated ticket',
    data,
  });
};
