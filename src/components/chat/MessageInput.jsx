import { useState } from 'react';
import { FiSend } from 'react-icons/fi';

const MessageInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <textarea
        className="flex-1 border rounded-l-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
        rows={1}
        disabled={disabled}
      />
      <button
        type="submit"
        className={`bg-blue-500 hover:bg-blue-600 text-white rounded-r-lg px-4 py-2 ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={disabled || !message.trim()}
      >
        <FiSend />
      </button>
    </form>
  );
};

export default MessageInput; 