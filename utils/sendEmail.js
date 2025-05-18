const sgMail = require('@sendgrid/mail');

const sendEmail = async ({name, email, html, message}) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: email, // Change to your recipient
    from: 'taskplanner2025@gmail.com', // Change to your verified sender
    subject: `Task Planner of ${name}`,
    text: 'Please find the task planner',
    html : `<h4> Hello, ${name}</h4>
    ${message}
    `
  };
  const info = await sgMail.send(msg);
  console.log(info);
 
};

module.exports = sendEmail;