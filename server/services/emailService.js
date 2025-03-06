const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendStatusChangeNotification = async ({ to, garageName, spaceNumber, currentStatus, newStatus, effectiveDate, requestedBy }) => {
  const formattedDate = new Date(effectiveDate).toLocaleDateString('de-AT');
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: `Status Change Request: ${garageName} - Space P-${spaceNumber}`,
    html: `
      <h2>Parking Space Status Change Request</h2>
      <p>A status change has been requested for the following parking space:</p>
      <ul>
        <li><strong>Garage:</strong> ${garageName}</li>
        <li><strong>Space Number:</strong> P-${spaceNumber}</li>
        <li><strong>Current Status:</strong> ${currentStatus}</li>
        <li><strong>New Status:</strong> ${newStatus}</li>
        <li><strong>Effective Date:</strong> ${formattedDate}</li>
        <li><strong>Requested By:</strong> ${requestedBy}</li>
      </ul>
      <p>Please log in to the Garage Management System to review this request.</p>
    `,
  };
  return transporter.sendMail(mailOptions);
};

exports.sendChangeApprovalNotification = async ({ to, garageName, spaceNumber, currentStatus, newStatus, effectiveDate, approvedBy }) => {
  const formattedDate = new Date(effectiveDate).toLocaleDateString('de-AT');
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: `Status Change Approved: ${garageName} - Space P-${spaceNumber}`,
    html: `
      <h2>Parking Space Status Change Approved</h2>
      <p>A status change has been approved for the following parking space:</p>
      <ul>
        <li><strong>Garage:</strong> ${garageName}</li>
        <li><strong>Space Number:</strong> P-${spaceNumber}</li>
        <li><strong>Current Status:</strong> ${currentStatus}</li>
        <li><strong>New Status:</strong> ${newStatus}</li>
        <li><strong>Effective Date:</strong> ${formattedDate}</li>
        <li><strong>Approved By:</strong> ${approvedBy}</li>
      </ul>
      <p>The status will be changed automatically on the effective date.</p>
    `,
  };
  return transporter.sendMail(mailOptions);
};

exports.sendChangeRejectionNotification = async ({ to, garageName, spaceNumber, currentStatus, newStatus, rejectedBy }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: `Status Change Rejected: ${garageName} - Space P-${spaceNumber}`,
    html: `
      <h2>Parking Space Status Change Rejected</h2>
      <p>A status change has been rejected for the following parking space:</p>
      <ul>
        <li><strong>Garage:</strong> ${garageName}</li>
        <li><strong>Space Number:</strong> P-${spaceNumber}</li>
        <li><strong>Current Status:</strong> ${currentStatus}</li>
        <li><strong>Requested New Status:</strong> ${newStatus}</li>
        <li><strong>Rejected By:</strong> ${rejectedBy}</li>
      </ul>
      <p>Please log in to the Garage Management System for more information or to submit a new request.</p>
    `,
  };
  return transporter.sendMail(mailOptions);
};