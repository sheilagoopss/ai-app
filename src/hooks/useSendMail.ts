import { endpoints } from "@/constants/endpoints";
import HttpHelper from "@/helpers/HttpHelper";
import { useCallback, useState } from "react";

export interface IMail {
  to: string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: {
    content: string;
    filename: string;
    type: string;
  }[];
}

const useMailSender = () => {
  const [isSendingMail, setIsSendingMail] = useState(false);

  const sendMail = useCallback(async (mail: IMail) => {
    setIsSendingMail(true);
    try {
      const response = await HttpHelper.post(endpoints.mailSender.sendMail, {
        data: mail,
      });
      return response?.data;
    } catch (error) {
      console.error("Error sending mail:", error);
    } finally {
      setIsSendingMail(false);
    }
  }, []);

  return { sendMail, isSendingMail };
};

export default useMailSender; 