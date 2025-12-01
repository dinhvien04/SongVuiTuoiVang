// Backend API Service (gọi backend thay vì gọi trực tiếp MegaLLM)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface ChatCompletionResponse {
    success: boolean;
    data?: {
        message: ChatMessage;
        usage?: {
            prompt_tokens: number;
            completion_tokens: number;
            total_tokens: number;
        };
    };
    message?: string;
}

export const megaLLM = {
    /**
     * Gửi chat message tới Backend API
     */
    chat: async (
        messages: ChatMessage[]
    ): Promise<ChatCompletionResponse> => {
        try {
            const response = await fetch(`${API_URL}/ai/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages,
                }),
            });

            if (!response.ok) {
                throw new Error(`Backend API error: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error('Error calling Backend API:', error);
            throw error;
        }
    },

    /**
     * Streaming chat (nếu cần real-time response)
     */
    chatStream: async (
        messages: ChatMessage[],
        onChunk: (chunk: string) => void
    ): Promise<void> => {
        try {
            const response = await fetch(`${API_URL}/ai/chat/stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages,
                }),
            });

            if (!response.ok) {
                throw new Error(`Backend API error: ${response.statusText}`);
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error('No response body');
            }

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n').filter(line => line.trim() !== '');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') continue;

                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed.choices[0]?.delta?.content;
                            if (content) {
                                onChunk(content);
                            }
                        } catch (e) {
                            // Ignore parsing errors
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error in streaming chat:', error);
            throw error;
        }
    },
};

