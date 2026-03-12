import { motion } from 'framer-motion';
import StaffChatbotWidget from '../../components/admin/StaffChatbotWidget';

const AiAssistant = () => {
  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      <div className="flex-1 flex flex-col min-h-0">
        <StaffChatbotWidget layout="hero" />
      </div>
    </div>
  );
};

export default AiAssistant;
