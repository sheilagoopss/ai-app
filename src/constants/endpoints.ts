const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const endpoints = {
  mailSender: {
    sendMail: `${API_URL}/api/v1/mail/send-email`,
  },
}; 