import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  sendMessage, 
  getConversations, 
  getConversation, 
  deleteConversation 
} from '../../services/api';
import Sidebar from './Sidebar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const Chat = () => {
  const { id } = useParams();
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Load conversations
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const res = await getConversations();
        setConversations(res.data.conversations);
      } catch (err) {
        setError('Failed to load conversations');
        console.error(err);
      }
    };
    
    loadConversations();
  }, []);

  // Load specific conversation if ID is provided
  useEffect(() => {
    const loadConversation = async () => {
      if (id) {
        setLoading(true);
        try {
          const res = await getConversation(id);
          setCurrentConversation(res.data.conversation);
          setMessages(res.data.conversation.messages);
        } catch (err) {
          setError('Failed to load conversation');
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        setCurrentConversation(null);
        setMessages([]);
      }
    };
    
    loadConversation();
  }, [id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (message) => {
    try {
        setLoading(true);
        setError('');
        
        // Add user message to UI immediately
        const newUserMessage = { role: 'user', content: message };
        setMessages(prev => [...prev, newUserMessage]);
        
        // Send to API
        const res = await sendMessage(message, currentConversation?._id);
        
        // Update with response and conversation data
        const { message: newAssistantMessage, conversation } = res.data;
        setMessages(prev => [...prev, newAssistantMessage]);
        
        // Update conversation data whether it's new or existing
        if (conversation) {
            const updatedConversation = {
                _id: conversation._id,
                title: conversation.title,
                messages: conversation.messages,
                updatedAt: conversation.updatedAt
            };
            
            setCurrentConversation(updatedConversation);
            
            // Update conversations list
            setConversations(prev => {
                const filtered = prev.filter(conv => conv._id !== conversation._id);
                return [updatedConversation, ...filtered];
            });
            
            // Navigate to the conversation if it's new
            if (!currentConversation) {
                navigate(`/chat/${conversation._id}`);
            }
        }
    } catch (err) {
        console.error('Error details:', err.response?.data || err); // More detailed error logging
        setError(err.response?.data?.message || 'Failed to send message');
        // Remove the user message if the API call failed
        setMessages(prev => prev.slice(0, -1));
    } finally {
        setLoading(false);
    }
  };

  const handleNewChat = () => {
    setCurrentConversation(null);
    setMessages([]);
    navigate('/chat');
    setSidebarOpen(false);
  };

  const handleSelectConversation = (conversation) => {
    navigate(`/chat/${conversation._id}`);
    setSidebarOpen(false);
  };

  const handleDeleteConversation = async (id) => {
    try {
      await deleteConversation(id);
      setConversations(prev => prev.filter(conv => conv._id !== id));
      
      if (currentConversation?._id === id) {
        setCurrentConversation(null);
        setMessages([]);
        navigate('/chat');
      }
    } catch (err) {
      setError('Failed to delete conversation');
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <button 
        className="md:hidden fixed top-4 left-4 z-20 bg-blue-500 text-white p-2 rounded-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? 'Close' : 'Menu'}
      </button>
      
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block md:w-64 bg-gray-800 text-white p-4 overflow-y-auto`}>
        <Sidebar 
          conversations={conversations}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={handleDeleteConversation}
          onLogout={handleLogout}
          currentConversationId={currentConversation?._id}
        />
      </div>
      
      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="bg-white shadow p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold truncate">
            {currentConversation ? currentConversation.title : 'New Chat'}
          </h2>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {messages.length > 0 ? (
            <MessageList messages={messages} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <h3 className="text-xl font-semibold mb-2">Welcome to AI Chat</h3>
                <p>Start a new conversation by typing a message below.</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Message input */}
        <div className="border-t p-4 bg-white">
          <MessageInput onSendMessage={handleSendMessage} disabled={loading} />
        </div>
      </div>
    </div>
  );
};

export default Chat; 