"use client";

import useMailSender from "../hooks/useSendMail";
import { Open_Sans } from "next/font/google";
import { FormEvent, useState } from "react";

const openSansHebrew = Open_Sans({
  subsets: ["hebrew"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-open-sans-hebrew",
});

export default function ContactForm() {
  const { sendMail, isSendingMail } = useMailSender();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = Object.fromEntries(
      new FormData(e.target as HTMLFormElement),
    );
    const response = await sendMail({
      to: [process.env.NEXT_PUBLIC_CONTACT_EMAIL || ""],
      subject: "Betzefer Contact Form Submission",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
          <h2 style="color: #333; text-align: center; border-bottom: 2px solid #B5BDFF; padding-bottom: 10px;">New Contact Form Submission</h2>
          <p style="color: #666;">Hello,</p>
          <p style="color: #666;">You have received a new contact form submission from goopss.com. Here are the details:</p>
          <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #B5BDFF;">
            <p style="margin: 8px 0;"><strong>Name:</strong> ${values.name}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${values.email}</p>
            <p style="margin: 8px 0;"><strong>Phone:</strong> ${values.phone}</p>
            <p style="margin: 8px 0;"><strong>Message:</strong></p>
            <p style="background-color: #f0f0f0; padding: 10px; border-radius: 4px;">${values.message}</p>
          </div>
          <p style="color: #666;">Please respond to this inquiry at your earliest convenience.</p>
          <p style="color: #666;">Best regards,<br>Goopss Notification System</p>
          <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #999; border-top: 1px solid #e0e0e0; padding-top: 10px;">
            This is an automated email. Please do not reply directly to this message.
          </div>
        </div>
      `,
    });
    if (response?.data) {
      (e.target as HTMLFormElement).reset();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000); // Hide after 5 seconds
    }
  };

  return (
    <section
      className={`w-full py-16 md:py-24 ${openSansHebrew.variable} font-sans bg-[#FFA87F]`}
      dir="rtl"
    >
      <div className="container mx-auto px-4 md:px-0">
        <div className="w-full max-w-[1000px] mx-auto">
          <div className="relative rounded-2xl p-8 md:p-12 bg-white">
            <div className="flex flex-col items-center text-center mb-12">
              <h2 className="text-5xl font-bold tracking-tight mb-2">
                צור קשר
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {showSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <strong className="font-bold">תודה, פרטיך התקבלו בהצלחה</strong>
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-lg font-medium">
                    שם מלא <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-200 text-right"
                    placeholder="הכנס את שמך המלא"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-lg font-medium">
                    אימייל <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-200 text-right"
                    placeholder="הכנס את כתובת המייל שלך"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-lg font-medium">
                    טלפון <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-200 text-right"
                    placeholder="הכנס את מספר הטלפון שלך"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-lg font-medium">
                  הודעה <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-200 text-right"
                  placeholder="כתוב את הודעתך כאן..."
                />
              </div>
              <button
                type="submit"
                className="bg-[#FFA87F] text-white rounded-lg py-3 px-6 text-lg font-medium hover:bg-[#FF9B6A] transition-colors"
                disabled={isSendingMail}
              >
                {isSendingMail ? "שומר..." : "שלח הודעה"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
} 