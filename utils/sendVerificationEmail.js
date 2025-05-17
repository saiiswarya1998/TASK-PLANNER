const sendEmail = require('./sendEmail');

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const verifyEmail = `${origin}/verificationPage.html?verificationToken=${verificationToken}&email=${email}`;

  const message = `<p>Please confirm your email by clicking on the following link : 
  <a href="${verifyEmail}">Verify Email</a> </p>`;

  const html = `<h4> Hello, ${name}</h4>
    ${message}
    `;

  const mail = {};
  
  
  return sendEmail({
  name, email, html, message
    
  });
};

module.exports = sendVerificationEmail;
