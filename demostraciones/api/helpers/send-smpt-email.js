module.exports = {

  friendlyName: 'Send mails via SMTP',


  description: 'Send an email using nodemailer',


  inputs: {

    emailAddress: {
      type: 'string',
      required: true
    },

    subject: {
        type: 'string',
        required: true
    },

    message: {
        type: 'string',
        required: true
    }

  },


  fn: async function (inputs, exits) {
    
    "use strict";
    const nodemailer = require("nodemailer");

    // create reusable transporter object using the default SMTP transport
    var smtpTransport = nodemailer.createTransport({
      service: 'Gmail', // sets automatically host, port and connection security settings
      auth: {
          user: "ecoapps.tesla@gmail.com",
          pass: "wysiwyg25"
      }
    });

    // setup email data with unicode symbols
    var mailOptions = {
      from: '"Aplicativos Ecopetrol " <ecoapps.tesla@gmail.com>', // sender address
      to: inputs.emailAddress, // list of receivers
      subject: inputs.subject, // Subject line
      text: inputs.message, // plain text body
      html: "<p>"+ inputs.message +"</p>", // html body
    };

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log('Error while sending mail: ' + error);
      } else {
          console.log('Message sent: %s', info.messageId);
      }
      smtpTransport.close(); // shut down the connection pool, no more messages.
    });
    
    return exits.success( );
  

}

};