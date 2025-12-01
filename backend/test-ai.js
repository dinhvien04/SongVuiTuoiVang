// Script test AI Chatbot API
const axios = require('axios');

const API_URL = 'http://localhost:5000/api/ai/chat';

// Test messages
const testMessages = [
    {
        messages: [
            { role: 'user', content: 'Xin chào!' }
        ]
    },
    {
        messages: [
            { role: 'user', content: 'Có những hoạt động gì cho người cao tuổi?' }
        ]
    },
    {
        messages: [
            { role: 'user', content: 'Gói VIP khác Standard như thế nào?' }
        ]
    }
];

async function testAIChat() {
    console.log('🧪 BẮT ĐẦU TEST AI CHATBOT API\n');
    console.log('━'.repeat(60));

    for (let i = 0; i < testMessages.length; i++) {
        const testCase = testMessages[i];
        console.log(`\n📝 TEST CASE ${i + 1}:`);
        console.log(`User: "${testCase.messages[0].content}"`);
        console.log('─'.repeat(60));

        try {
            const startTime = Date.now();

            const response = await axios.post(API_URL, testCase, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const endTime = Date.now();
            const duration = endTime - startTime;

            if (response.data.success) {
                console.log(`✅ SUCCESS (${duration}ms)`);
                console.log(`AI: "${response.data.data.message.content}"`);

                if (response.data.data.usage) {
                    console.log(`\n📊 Token Usage:`);
                    console.log(`   - Prompt tokens: ${response.data.data.usage.prompt_tokens}`);
                    console.log(`   - Completion tokens: ${response.data.data.usage.completion_tokens}`);
                    console.log(`   - Total tokens: ${response.data.data.usage.total_tokens}`);
                }
            } else {
                console.log('❌ FAILED');
                console.log(`Error: ${response.data.message}`);
            }
        } catch (error) {
            console.log('❌ ERROR');

            if (error.code === 'ECONNREFUSED') {
                console.log('⚠️  Backend không chạy! Hãy chạy: npm run dev');
            } else if (error.response) {
                console.log(`Status: ${error.response.status}`);
                console.log(`Message: ${error.response.data?.message || error.message}`);
                console.log(`Error: ${JSON.stringify(error.response.data, null, 2)}`);
            } else {
                console.log(`Error: ${error.message}`);
            }
        }

        console.log('─'.repeat(60));
    }

    console.log('\n━'.repeat(60));
    console.log('✨ TEST HOÀN THÀNH!\n');
}

// Kiểm tra backend health trước
async function checkBackend() {
    console.log('🔍 Kiểm tra backend...');

    try {
        const response = await axios.get('http://localhost:5000/api/health');
        console.log(`✅ Backend đang chạy: ${response.data.status}`);
        return true;
    } catch (error) {
        console.log('❌ Backend KHÔNG chạy!');
        console.log('⚠️  Vui lòng chạy: cd backend && npm run dev\n');
        return false;
    }
}

// Main
(async () => {
    const isBackendRunning = await checkBackend();

    if (isBackendRunning) {
        console.log('');
        await testAIChat();
    } else {
        process.exit(1);
    }
})();

