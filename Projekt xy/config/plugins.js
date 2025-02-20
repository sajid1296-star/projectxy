module.exports = {
  'users-permissions': {
    config: {
      jwt: {
        expiresIn: '7d',
      },
      register: {
        allowedFields: ['username', 'email', 'password', 'name', 'address'],
      },
    },
  },
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      settings: {
        defaultFrom: 'noreply@example.com',
        defaultReplyTo: 'noreply@example.com',
      },
    },
  },
}; 