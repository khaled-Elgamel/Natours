const nodemailer = require('nodemailer');
const pug = require('pug');
const { convert } = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.url = url;
    this.firstName = user.name.split(' ')[0];
    this.from = `Khaled Mohamed<${process.env.EMAIL_FROM}>`;
  }

  newTransporter() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendinBlue',

        auth: {
          user: process.env.SENDINBLUE_USERNAME,
          pass: process.env.SENDINBLUE_PASSWORD
        }
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async send(templete, subject) {
    // 1 render html based on a pug templete
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${templete}.pug`,
      {
        url: this.url,
        firstName: this.firstName,
        subject
      }
    );

    // 2 define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html)
    };

    //3 create transporter
    await this.newTransporter().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family ! ');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token only valid for 10 minutes '
    );
  }
};
