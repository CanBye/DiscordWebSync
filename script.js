document.addEventListener('DOMContentLoaded', function() {
    const channelSelect = document.getElementById('channelSelect');
    const refreshBtn = document.getElementById('refreshBtn');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const clearBtn = document.getElementById('clearBtn');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const errorMessage = document.getElementById('errorMessage');
    const messagesContainer = document.getElementById('messages');
    const langTR = document.getElementById('langTR');
    const langEN = document.getElementById('langEN');
    
    let allMessages = [];
    let filteredMessages = [];
    let currentLanguage = localStorage.getItem('language') || 'tr';
    
    function switchLanguage(lang) {
        currentLanguage = lang;
        localStorage.setItem('language', lang);
        
        langTR.classList.toggle('active', lang === 'tr');
        langEN.classList.toggle('active', lang === 'en');
        
        document.querySelectorAll('[data-tr]').forEach(element => {
            const text = element.getAttribute('data-' + lang);
            if (text) {
                element.textContent = text;
            }
        });
        
        document.querySelectorAll('[data-tr-placeholder]').forEach(element => {
            const placeholder = element.getAttribute('data-' + lang + '-placeholder');
            if (placeholder) {
                element.placeholder = placeholder;
            }
        });
        
        if (filteredMessages.length > 0) {
            renderMessages(filteredMessages);
        }
    }
    
    function showLoading() {
        loading.style.display = 'flex';
        error.style.display = 'none';
        messagesContainer.innerHTML = '';
    }
    
    function hideLoading() {
        loading.style.display = 'none';
    }
    
    function showError(message) {
        hideLoading();
        error.style.display = 'block';
        errorMessage.textContent = message;
    }
    
    function hideError() {
        error.style.display = 'none';
    }
    
    function formatDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        const locale = currentLanguage === 'tr' ? 'tr-TR' : 'en-US';
        const timeStr = date.toLocaleTimeString(locale, {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        if (diffDays === 0) {
            return (currentLanguage === 'tr' ? 'Bugün ' : 'Today ') + timeStr;
        } else if (diffDays === 1) {
            return (currentLanguage === 'tr' ? 'Dün ' : 'Yesterday ') + timeStr;
        } else if (diffDays < 7) {
            return diffDays + (currentLanguage === 'tr' ? ' gün önce' : ' days ago');
        } else {
            return date.toLocaleDateString(locale) + ' ' + timeStr;
        }
    }
    
    function isImageFile(url, contentType) {
        if (contentType && contentType.startsWith('image/')) return true;
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        return imageExtensions.some(ext => url.toLowerCase().includes(ext));
    }
    
    function isVideoFile(url, contentType) {
        if (contentType && contentType.startsWith('video/')) return true;
        const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
        return videoExtensions.some(ext => url.toLowerCase().includes(ext));
    }
    
    function formatAttachments(attachments) {
        if (!attachments || attachments.length === 0) return '';
        
        let html = '<div class="attachments">';
        
        attachments.forEach(attachment => {
            if (isImageFile(attachment.url, attachment.content_type)) {
                html += `
                    <div class="attachment">
                        <img src="${attachment.url}" alt="${attachment.filename}" loading="lazy">
                    </div>
                `;
            } else if (isVideoFile(attachment.url, attachment.content_type)) {
                html += `
                    <div class="attachment">
                        <video controls preload="metadata">
                            <source src="${attachment.url}" type="${attachment.content_type || 'video/mp4'}">
                            Tarayıcınız video oynatmayı desteklemiyor.
                        </video>
                    </div>
                `;
            } else {
                html += `
                    <div class="attachment attachment-file">
                        <a href="${attachment.url}" target="_blank" rel="noopener noreferrer">
                            📎 ${attachment.filename}
                        </a>
                    </div>
                `;
            }
        });
        
        html += '</div>';
        return html;
    }
    
    function formatMessage(message) {
        const formattedDate = formatDate(message.timestamp);
        const attachmentsHtml = formatAttachments(message.attachments);
        
        return `
            <div class="message" data-message-id="${message.id}">
                <div class="message-header">
                    <img src="${message.author.avatar}" alt="${message.author.username}" class="avatar">
                    <div class="user-info">
                        <div class="username">${message.author.username}</div>
                        <div class="timestamp">${formattedDate}</div>
                    </div>
                </div>
                <div class="message-content">${message.content || '<i>Bu mesaj içerik içermiyor</i>'}</div>
                ${attachmentsHtml}
            </div>
        `;
    }
    
    function renderMessages(messages) {
        messagesContainer.innerHTML = '';
        
        if (messages.length === 0) {
            const noMessageText = currentLanguage === 'tr' ? 'Mesaj bulunamadı.' : 'No messages found.';
            messagesContainer.innerHTML = `<div class="message"><div class="message-content">${noMessageText}</div></div>`;
            return;
        }
        
        messages.forEach(message => {
            messagesContainer.innerHTML += formatMessage(message);
        });
    }
    
    function filterMessages(searchTerm) {
        if (!searchTerm.trim()) {
            filteredMessages = [...allMessages];
        } else {
            const term = searchTerm.toLowerCase();
            filteredMessages = allMessages.filter(message => 
                message.content.toLowerCase().includes(term) ||
                message.author.username.toLowerCase().includes(term)
            );
        }
        renderMessages(filteredMessages);
    }
    
    async function loadMessages(channel) {
        showLoading();
        hideError();
        
        try {
            const response = await fetch(`api/messages.php?channel=${encodeURIComponent(channel)}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            allMessages = data.reverse();
            filteredMessages = [...allMessages];
            
            hideLoading();
            renderMessages(filteredMessages);
            
        } catch (err) {
            console.error('Mesaj yükleme hatası:', err);
            showError(`Mesajlar yüklenirken hata oluştu: ${err.message}`);
        }
    }
    
    channelSelect.addEventListener('change', function() {
        const selectedChannel = this.value;
        loadMessages(selectedChannel);
        searchInput.value = '';
    });
    
    refreshBtn.addEventListener('click', function() {
        const selectedChannel = channelSelect.value;
        loadMessages(selectedChannel);
        searchInput.value = '';
    });
    
    searchBtn.addEventListener('click', function() {
        const searchTerm = searchInput.value;
        filterMessages(searchTerm);
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = this.value;
            filterMessages(searchTerm);
        }
    });
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value;
        filterMessages(searchTerm);
    });
    
    clearBtn.addEventListener('click', function() {
        searchInput.value = '';
        filterMessages('');
    });
    
    langTR.addEventListener('click', function() {
        switchLanguage('tr');
    });
    
    langEN.addEventListener('click', function() {
        switchLanguage('en');
    });
    
    switchLanguage(currentLanguage);
    loadMessages('general');
});
