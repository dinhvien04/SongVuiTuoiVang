import { useState, useRef, useEffect } from 'react';
import { megaLLM, ChatMessage } from '../services/megallm';

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Xin chào! Tôi là trợ lý AI của Sống Vui Khỏe. Tôi có thể giúp gì cho bạn hôm nay? 😊',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage.trim(),
    };

    // Add user message
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Call Backend API
      const response = await megaLLM.chat([...messages, userMessage]);
      
      if (response.success && response.data) {
        const aiMessage: ChatMessage = {
          role: 'assistant',
          content: response.data.message.content,
        };
        
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error(response.message || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback response
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau hoặc liên hệ hotline 1900123456 để được hỗ trợ trực tiếp.',
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    'Có những hoạt động gì cho người cao tuổi?',
    'Gói VIP khác gói Thường như thế nào?',
    'Làm sao để đăng ký tham gia?',
    'Yoga có giúp giảm đau lưng không?',
    'Thanh toán như thế nào?',
    'Có lớp học online không?',
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-4 md:bottom-24 md:right-6 z-50 group"
        aria-label="AI Chat Support"
      >
        <div className="relative">
          {/* Ripple effect */}
          {!isOpen && (
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
          )}

          {/* Main button */}
          <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full p-3 md:p-4 shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95">
            {isOpen ? (
              // Close icon
              <svg
                className="w-6 h-6 md:w-8 md:h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Chat support icon
              <svg
                className="w-6 h-6 md:w-8 md:h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            )}
          </div>

          {/* Badge */}
          {!isOpen && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
              AI
            </div>
          )}
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-36 right-4 md:bottom-40 md:right-6 w-[calc(100vw-2rem)] md:w-96 h-[32rem] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Trợ Lý AI</h3>
              {/* <p className="text-xs text-white/80">Powered by MegaLLM</p> */}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 shadow-md rounded-bl-none border border-gray-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-md border border-gray-100">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick questions (show only when chat is empty) */}
            {messages.length === 1 && !isLoading && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 text-center">Câu hỏi gợi ý:</p>
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInputMessage(question);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    className="w-full text-left text-sm bg-white hover:bg-blue-50 text-gray-700 px-3 py-2 rounded-lg border border-gray-200 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập câu hỏi của bạn..."
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-2 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

