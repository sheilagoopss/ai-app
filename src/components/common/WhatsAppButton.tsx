import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/972509669655"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-[#25D366] text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-[#128C7E] transition-colors duration-200 z-50"
    >
      <FaWhatsapp className="w-8 h-8" />
      <span className="font-medium text-lg">צור קשר</span>
    </a>
  );
} 