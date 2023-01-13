const nodemailer = require('nodemailer');
const InvariantException = require('../../exceptions/InvariantException');

class MailerService {

    constructor() {
        const {
            MAIL_HOST,
            MAIL_PORT,
            MAIL_USERNAME,
            MAIL_PASSWORD,
            MAIL_FROM_ADDRESS,
        } = process.env;

        this._mailFrom = MAIL_FROM_ADDRESS;
        this._transporter = nodemailer.createTransport({
            host: MAIL_HOST,
            port: MAIL_PORT,
            // secure: true,
            auth: {
                user: MAIL_USERNAME,
                pass: MAIL_PASSWORD,
            },
        });
    }

    /**
     * Sending email using nodemailer provider
     * 
     * @param {*} opts 
     * @param {array} attachments 
     * @returns {Promise}
     */
    async sendEmail(params = {}, attachments = []) {
        const { to = null, subject = 'no-reply', html = '<h1>No Content</h1>' } = params;
        if (!to) {
            throw new InvariantException({ message: 'Target email must not be empty.', tags: ['MailerService', '@sendEmail'] });
        }

        const messages = {
            from: this._mailFrom,
            to,
            subject,
            html,
            attachments,
        };

        return this._transporter.sendMail(messages);
    }

}

module.exports = MailerService;