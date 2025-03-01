// import nodemailer from 'nodemailer';
// import 'dotenv/config';

// const { UKR_NET_EMAIL, UKR_NET_PASSWORD } = process.env;

// const nodemailerConfig = {
//   host: 'smtp.ukr.net',
//   port: 465, // 25, 465, 887, 2525
//   secure: true,
//   auth: {
//     user: UKR_NET_EMAIL,
//     pass: UKR_NET_PASSWORD,
//   },
// };

// const transport = nodemailer.createTransport(nodemailerConfig);

// export const sendEmail = (data) => {
//   const email = { ...data, from: UKR_NET_EMAIL };
//   return transport.sendMail(email);
// };

import nodemailer from 'nodemailer';

import { SMTP } from '../constants/index.js';
import { getEnvVar } from '../utils/getEnvVar.js';

const transporter = nodemailer.createTransport({
  host: getEnvVar(SMTP.SMTP_HOST),
  port: Number(getEnvVar(SMTP.SMTP_PORT)),
  auth: {
    user: getEnvVar(SMTP.SMTP_USER),
    pass: getEnvVar(SMTP.SMTP_PASSWORD),
  },
});

export const sendEmail = (options) => {
  return transporter.sendMail(options);
};
