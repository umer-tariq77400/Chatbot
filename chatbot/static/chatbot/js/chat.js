document.addEventListener('DOMContentLoaded', () => {
    const chatWidget = document.getElementById('chat-widget');
    const chatWindow = document.getElementById('chat-window');
    const toggleChatBtn = document.getElementById('toggle-chat');
    const closeChatBtn = document.getElementById('close-chat');
    const toggleIconOpen = document.getElementById('toggle-icon-open');
    const toggleIconClose = document.getElementById('toggle-icon-close');
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');

    let isOpen = false;
    let isLoading = false;

    // Initialize Lucide icons for dynamically added content
    const refreshIcons = () => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    };

    const scrollToBottom = () => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const toggleChat = () => {
        isOpen = !isOpen;
        if (isOpen) {
            chatWindow.classList.remove('hidden');
            chatWindow.classList.add('animate-in', 'slide-in-from-bottom-10', 'fade-in');
            toggleChatBtn.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
            toggleChatBtn.classList.add('bg-slate-800', 'rotate-90');
            toggleIconOpen.classList.add('hidden');
            toggleIconClose.classList.remove('hidden');
            setTimeout(() => chatInput.focus(), 100);
        } else {
            chatWindow.classList.add('hidden');
            chatWindow.classList.remove('animate-in', 'slide-in-from-bottom-10', 'fade-in');
            toggleChatBtn.classList.remove('bg-slate-800', 'rotate-90');
            toggleChatBtn.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
            toggleIconOpen.classList.remove('hidden');
            toggleIconClose.classList.add('hidden');
        }
    };

    toggleChatBtn.addEventListener('click', toggleChat);
    closeChatBtn.addEventListener('click', () => {
        if (isOpen) toggleChat();
    });

    chatInput.addEventListener('input', () => {
        sendBtn.disabled = !chatInput.value.trim() || isLoading;
    });

    const appendMessage = (role, text, id = null) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `flex gap-3 ${role === 'user' ? 'justify-end' : 'justify-start'}`;
        if (id) msgDiv.id = id;

        let avatarHtml = '';
        if (role === 'model') {
            avatarHtml = `
                <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600 border border-indigo-200">
                    <i data-lucide="bot" width="16" height="16"></i>
                </div>
            `;
        }

        let userAvatarHtml = '';
        if (role === 'user') {
            userAvatarHtml = `
                <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-slate-600">
                    <i data-lucide="user" width="16" height="16"></i>
                </div>
            `;
        }

        const contentClass = role === 'user'
            ? 'bg-indigo-600 text-white rounded-tr-none'
            : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none';

        msgDiv.innerHTML = `
            ${role === 'model' ? avatarHtml : ''}
            <div class="max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${contentClass}">
                ${role === 'model' ? `<div class="prose prose-sm max-w-none prose-p:leading-normal prose-a:text-indigo-600 markdown-content">${marked.parse(text)}</div>` : text}
            </div>
            ${role === 'user' ? userAvatarHtml : ''}
        `;

        chatMessages.appendChild(msgDiv);
        refreshIcons();
        scrollToBottom();
        return msgDiv;
    };

    const showLoading = () => {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading-indicator';
        loadingDiv.className = 'flex gap-3 justify-start';
        loadingDiv.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600 border border-indigo-200">
                <i data-lucide="bot" width="16" height="16"></i>
            </div>
            <div class="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm">
                <div class="flex space-x-1 h-5 items-center">
                    <div class="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div class="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div class="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                </div>
            </div>
        `;
        chatMessages.appendChild(loadingDiv);
        refreshIcons();
        scrollToBottom();
    };

    const removeLoading = () => {
        const loadingDiv = document.getElementById('loading-indicator');
        if (loadingDiv) loadingDiv.remove();
    };

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text || isLoading) return;

        // User Message
        appendMessage('user', text);
        chatInput.value = '';
        sendBtn.disabled = true;
        isLoading = true;
        showLoading();

        try {
            const response = await fetch('/api/chat/message/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: text })
            });

            removeLoading();

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Create a placeholder for the model response
            const msgId = 'msg-' + Date.now();
            const modelMsgDiv = appendMessage('model', '', msgId);
            const contentDiv = modelMsgDiv.querySelector('.markdown-content');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedText = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.substring(6);
                        if (dataStr === '[DONE]') continue;

                        try {
                            const data = JSON.parse(dataStr);
                            if (data.text) {
                                accumulatedText += data.text;
                                contentDiv.innerHTML = marked.parse(accumulatedText);
                                scrollToBottom();
                            }
                        } catch (e) {
                            console.error('Error parsing SSE data', e);
                        }
                    }
                }
            }

        } catch (error) {
            removeLoading();
            appendMessage('model', "I'm having trouble connecting right now. Please try again later.");
            console.error('Error:', error);
        } finally {
            isLoading = false;
            if (chatInput.value.trim()) sendBtn.disabled = false;
        }
    });
});
