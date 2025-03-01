import { FiPlusCircle, FiLogOut, FiTrash2 } from 'react-icons/fi';

const Sidebar = ({ 
  conversations, 
  onNewChat, 
  onSelectConversation, 
  onDeleteConversation,
  onLogout,
  currentConversationId
}) => {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <button 
          onClick={onNewChat}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center"
        >
          <FiPlusCircle className="mr-2" />
          New Chat
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-sm uppercase text-gray-400 mb-2">Conversations</h2>
        
        {conversations.length === 0 ? (
          <p className="text-gray-500 text-sm">No conversations yet</p>
        ) : (
          <ul>
            {conversations.map(conversation => (
              <li key={conversation._id} className="mb-1">
                <div className={`flex items-center justify-between p-2 rounded hover:bg-gray-700 cursor-pointer ${
                  currentConversationId === conversation._id ? 'bg-gray-700' : ''
                }`}>
                  <div 
                    className="flex-1 truncate mr-2"
                    onClick={() => onSelectConversation(conversation)}
                  >
                    {conversation.title}
                  </div>
                  <button 
                    onClick={() => onDeleteConversation(conversation._id)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="mt-auto pt-4 border-t border-gray-700">
        <button 
          onClick={onLogout}
          className="w-full text-gray-400 hover:text-white py-2 flex items-center"
        >
          <FiLogOut className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 