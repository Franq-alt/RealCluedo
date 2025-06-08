import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { ChatMessage } from '../types/game';

interface ChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  currentPlayerId: string;
}

export const Chat: React.FC<ChatProps> = ({
  messages,
  onSendMessage,
  currentPlayerId
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-red-500/30 flex flex-col h-96">
      {/* Header */}
      <div className="p-4 border-b border-red-500/30">
        <h3 className="text-white font-medium">Game Chat</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${
              message.isSystemMessage
                ? 'text-center'
                : message.playerId === currentPlayerId
                ? 'text-right'
                : 'text-left'
            }`}
          >
            {message.isSystemMessage ? (
              <div className="text-yellow-300 text-sm italic">
                {message.message}
              </div>
            ) : (
              <div className={`inline-block max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                message.playerId === currentPlayerId
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700/50 text-white'
              }`}>
                <div className="font-medium text-sm mb-1">
                  {message.playerName}
                </div>
                <div className="text-sm">
                  {message.message}
                </div>
                <div className="text-xs opacity-70 mt-1">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-red-500/30">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-red-900/20 text-white placeholder-red-200/60 rounded-lg px-3 py-2 border border-red-400/30 focus:outline-none focus:border-yellow-400"
            maxLength={200}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white p-2 rounded-lg transition-colors border border-red-400/30"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};