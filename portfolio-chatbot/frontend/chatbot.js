const CHATBOT_API_URL = "https://portfolio-chatbot-38ce.onrender.com/chat";

(function () {
  // ── Session Management ────────────────────────────────────
  const SESSION_KEY = "jchat_session_id";
  const HISTORY_KEY = "jchat_history";
  
  // Clear session on page load for fresh chat
  function clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(HISTORY_KEY);
  }
  
  // Clear on page load
  clearSession();
  
  function getSessionId() {
    let sessionId = sessionStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      sessionId = crypto.randomUUID?.() || Math.random().toString(36).substring(2) + Date.now().toString(36);
      sessionStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
  }

  function saveHistory(messages) {
    try {
      sessionStorage.setItem(HISTORY_KEY, JSON.stringify(messages.slice(-20)));
    } catch (e) {}
  }

  function loadHistory() {
    try {
      return JSON.parse(sessionStorage.getItem(HISTORY_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }
  
  function startNewChat() {
    clearSession();
    messageHistory = [];
    welcomeSent = false;
    messages.innerHTML = "";
    appendMessage(
      "bot",
      "Hey there! 👋 I'm Jyotirmoy's AI assistant. I know everything about his projects, skills, and background. Ask me anything!",
      formatTime(new Date()),
      false,
      false
    );
    welcomeSent = true;
    updateSuggestions(defaultSuggestions);
    input.focus();
  }

  // ── Markdown Parser (lightweight) ─────────────────────────
  function parseMarkdown(text) {
    if (!text) return "";
    
    // Escape HTML first
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    
    // Code blocks (```)
    html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre class="jchat-code-block"><code>$2</code></pre>');
    
    // Inline code (`)
    html = html.replace(/`([^`]+)`/g, '<code class="jchat-inline-code">$1</code>');
    
    // Links [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="jchat-link">$1</a>');
    
    // Auto-link URLs not already inside an anchor tag
    html = html.replace(/(https?:\/\/[^\s<"]+)(?![^<]*<\/a>)/g, (match) => {
      return `<a href="${match}" target="_blank" rel="noopener" class="jchat-link">${match}</a>`;
    });
    
    // Bullet lists
    html = html.replace(/^[\-\*]\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul class="jchat-list">$1</ul>');
    html = html.replace(/<\/ul>\s*<ul class="jchat-list">/g, '');
    
    // Line breaks
    html = html.replace(/\n/g, "<br>");
    
    return html;
  }

  // ── Time Formatting ───────────────────────────────────────
  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const html = `
    <div id="jchat-bubble" title="Ask about Jyotirmoy">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="8" width="18" height="10" rx="2" ry="2"/>
        <path d="M12 4v4"/>
        <path d="M8 13h.01"/>
        <path d="M16 13h.01"/>
        <path d="M9 17h6"/>
      </svg>
    </div>

    <div id="jchat-window">
      <div id="jchat-header">
        <div id="jchat-header-left">
          <div id="jchat-header-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="8" width="18" height="10" rx="2" ry="2"/>
              <path d="M12 4v4"/>
              <path d="M8 13h.01"/>
              <path d="M16 13h.01"/>
              <path d="M9 17h6"/>
            </svg>
          </div>
          <div id="jchat-header-text">
            <div id="jchat-header-title">⚡ Ask about Jyotirmoy</div>
            <div id="jchat-header-subtitle">Online now • AI-powered answers</div>
          </div>
        </div>
        <div id="jchat-header-actions">
          <button id="jchat-new" title="New Chat">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </button>
          <button id="jchat-close" title="Close (ESC)">✕</button>
        </div>
      </div>
      <div id="jchat-messages"></div>
      <div id="jchat-suggestions"></div>
      <div id="jchat-input-area">
        <input id="jchat-input" type="text" placeholder="Ask me anything... (Enter to send)" maxlength="500" autocomplete="off"/>
        <button id="jchat-send">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  `;

  const wrapper = document.createElement("div");
  wrapper.id = "jchat-wrapper";
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);

  const bubble   = document.getElementById("jchat-bubble");
  const window_  = document.getElementById("jchat-window");
  const closeBtn = document.getElementById("jchat-close");
  const newChatBtn = document.getElementById("jchat-new");
  const messages = document.getElementById("jchat-messages");
  const suggestionsContainer = document.getElementById("jchat-suggestions");
  const input    = document.getElementById("jchat-input");
  const sendBtn  = document.getElementById("jchat-send");

  let isOpen = false;
  let welcomeSent = false;
  let messageHistory = [];
  let currentSuggestions = [];

  // ── Initial Suggestions ───────────────────────────────────
  const defaultSuggestions = [
    "What projects has he built?",
    "What are his skills?",
    "How can I contact him?"
  ];

  // ── Hide bubble initially ─────────────────────────────────
  bubble.style.display = "none";
  window_.style.display = "none";

  // ── Wait for splash screen to finish ─────────────────────
  function showChatbotWhenReady() {
    const splash = document.getElementById("intro-splash");

    const revealChatbot = () => {
      bubble.style.display = "flex";
      window_.style.display = "flex";
    };

    const isSplashFullyGone = (splashEl) => {
      if (!splashEl) return true;
      return (
        splashEl.classList.contains("splash-gone") ||
        splashEl.style.display === "none" ||
        !document.body.contains(splashEl)
      );
    };

    if (!splash) {
      revealChatbot();
      return;
    }

    if (isSplashFullyGone(splash)) {
      revealChatbot();
      return;
    }

    const observer = new MutationObserver(() => {
      if (isSplashFullyGone(splash)) {
        revealChatbot();
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    setTimeout(() => {
      if (isSplashFullyGone(splash)) {
        revealChatbot();
      }
      observer.disconnect();
    }, 12000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", showChatbotWhenReady);
  } else {
    showChatbotWhenReady();
  }

  // ── Keyboard Shortcuts ────────────────────────────────────
  document.addEventListener("keydown", (e) => {
    // ESC to close chat
    if (e.key === "Escape" && isOpen) {
      closeChat();
    }
    // "/" to focus input when chat is open
    if (e.key === "/" && isOpen && document.activeElement !== input) {
      e.preventDefault();
      input.focus();
    }
  });

  // ── Toggle ────────────────────────────────────────────────
  function openChat() {
    isOpen = true;
    window_.classList.add("jchat-open");
    bubble.classList.add("jchat-hidden");
    input.focus();
    
    if (!welcomeSent) {
      appendMessage(
        "bot",
        "Hey there! 👋 I'm Jyotirmoy's AI assistant. I know everything about his projects, skills, and background. Ask me anything!",
        formatTime(new Date()),
        false,
        false
      );
      welcomeSent = true;
      updateSuggestions(defaultSuggestions);
    }
    scrollMessagesToBottom();
  }

  function closeChat() {
    isOpen = false;
    window_.classList.remove("jchat-open");
    bubble.classList.remove("jchat-hidden");
  }

  bubble.addEventListener("click", openChat);
  closeBtn.addEventListener("click", closeChat);
  newChatBtn.addEventListener("click", startNewChat);

  // ── Suggestions ───────────────────────────────────────────
  function updateSuggestions(suggestions) {
    currentSuggestions = suggestions || [];
    suggestionsContainer.innerHTML = "";
    
    if (!suggestions || suggestions.length === 0) {
      suggestionsContainer.style.display = "none";
      return;
    }
    
    suggestionsContainer.style.display = "flex";
    suggestions.forEach(text => {
      const chip = document.createElement("button");
      chip.className = "jchat-suggestion-chip";
      chip.textContent = text;
      chip.addEventListener("click", () => {
        input.value = text;
        sendMessage();
      });
      suggestionsContainer.appendChild(chip);
    });
  }

  // ── Messages ──────────────────────────────────────────────
  function scrollMessagesToBottom() {
    requestAnimationFrame(() => {
      messages.scrollTop = messages.scrollHeight;
    });
  }

  function appendMessage(role, text, time, withMarkdown = true, saveToHistory = true) {
    const msgWrapper = document.createElement("div");
    msgWrapper.classList.add("jchat-msg-wrapper", role === "user" ? "jchat-user-wrapper" : "jchat-bot-wrapper");
    
    const msg = document.createElement("div");
    msg.classList.add("jchat-msg", role === "user" ? "jchat-user" : "jchat-bot");
    
    if (role === "bot" && withMarkdown) {
      msg.innerHTML = parseMarkdown(text);
    } else {
      msg.textContent = text;
    }
    
    const meta = document.createElement("div");
    meta.classList.add("jchat-msg-meta");
    
    const timeSpan = document.createElement("span");
    timeSpan.classList.add("jchat-msg-time");
    timeSpan.textContent = time || formatTime(new Date());
    meta.appendChild(timeSpan);
    
    // Copy button for bot messages
    if (role === "bot") {
      const copyBtn = document.createElement("button");
      copyBtn.classList.add("jchat-copy-btn");
      copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
      copyBtn.title = "Copy message";
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(text).then(() => {
          copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
          copyBtn.classList.add("jchat-copied");
          setTimeout(() => {
            copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
            copyBtn.classList.remove("jchat-copied");
          }, 2000);
        }).catch(() => {
          copyBtn.title = "Copy failed";
          copyBtn.classList.add("jchat-copy-failed");
          setTimeout(() => copyBtn.classList.remove("jchat-copy-failed"), 2000);
        });
      });
      meta.appendChild(copyBtn);
    }
    
    msgWrapper.appendChild(msg);
    msgWrapper.appendChild(meta);
    messages.appendChild(msgWrapper);
    
    // Save to history
    if (saveToHistory) {
      messageHistory.push({ role, text, time: time || formatTime(new Date()) });
      saveHistory(messageHistory);
    }
    
    scrollMessagesToBottom();
    return msg;
  }

  function showTyping() {
    const wrapper = document.createElement("div");
    wrapper.classList.add("jchat-msg-wrapper", "jchat-bot-wrapper");
    wrapper.id = "jchat-typing-wrapper";
    
    const typing = document.createElement("div");
    typing.classList.add("jchat-msg", "jchat-bot", "jchat-typing");
    typing.id = "jchat-typing";
    typing.innerHTML = `<span></span><span></span><span></span>`;
    
    wrapper.appendChild(typing);
    messages.appendChild(wrapper);
    scrollMessagesToBottom();
  }

  function removeTyping() {
    const t = document.getElementById("jchat-typing-wrapper");
    if (t) t.remove();
  }

  function setLoading(state) {
    input.disabled = state;
    sendBtn.disabled = state;
  }

  // ── Typewriter Effect ─────────────────────────────────────
  function typewriterEffect(element, text, speed = 15) {
    return new Promise((resolve) => {
      const html = parseMarkdown(text);
      element.innerHTML = "";
      
      // For simple text, do character by character
      // For HTML, just fade in (safer)
      if (html.includes("<")) {
        element.style.opacity = "0";
        element.innerHTML = html;
        element.style.transition = "opacity 0.3s ease";
        requestAnimationFrame(() => {
          element.style.opacity = "1";
        });
        setTimeout(resolve, 300);
      } else {
        let i = 0;
        const timer = setInterval(() => {
          if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            scrollMessagesToBottom();
          } else {
            clearInterval(timer);
            resolve();
          }
        }, speed);
      }
    });
  }

  // ── Page Context (blog aware) ─────────────────────────────
  function getCurrentPageContext() {
    const hash = window.location.hash || "";
    const isBlogRoute = hash.startsWith("#blog/");

    if (!isBlogRoute) return "";

    const titleEl   = document.getElementById("detail-title");
    const dateEl    = document.getElementById("detail-date");
    const contentEl = document.getElementById("detail-content");

    const title      = (titleEl?.innerText || "").trim();
    const date       = (dateEl?.innerText || "").trim();
    const domContent = (contentEl?.innerText || "").trim();

    let fallbackContent = "";
    const idText = hash.replace("#blog/", "");
    const postId = Number.parseInt(idText, 10);

    if ((!domContent || domContent.length < 120) && Number.isInteger(postId)) {
      try {
        if (typeof blogPosts !== "undefined" && Array.isArray(blogPosts)) {
          const post = blogPosts.find((entry) => entry.id === postId);
          if (post && typeof post.content === "string") {
            fallbackContent = post.content;
          }
        }
      } catch (_) {
        fallbackContent = "";
      }
    }

    const content = domContent || fallbackContent;
    if (!content) return "";

    const cleaned = content.replace(/\s{3,}/g, " ").trim();
    const limited = cleaned.slice(0, 6000);

    return [
      `[CURRENT PAGE URL] ${window.location.href}`,
      title ? `[CURRENT BLOG TITLE] ${title}` : "",
      date  ? `[CURRENT BLOG DATE] ${date}`   : "",
      "[CURRENT BLOG CONTENT]",
      limited,
    ]
      .filter(Boolean)
      .join("\n");
  }

  // ── Scroll isolation ──────────────────────────────────────
  function setupChatScrollIsolation() {
    const stopBubble = (e) => e.stopPropagation();
    ["wheel", "touchmove", "DOMMouseScroll"].forEach((evt) => {
      window_.addEventListener(evt, stopBubble, { passive: true });
      messages.addEventListener(evt, stopBubble, { passive: true });
    });
  }

  setupChatScrollIsolation();

  // ── Send with Retry ───────────────────────────────────────
  async function fetchWithRetry(url, options, retries = 2, delay = 1000) {
    let lastResponse;
    for (let i = 0; i <= retries; i++) {
      try {
        const res = await fetch(url, options);
        if (res.ok || res.status < 500) return res;
        lastResponse = res;
        if (i < retries) await new Promise(r => setTimeout(r, delay * (i + 1)));
      } catch (err) {
        if (i === retries) throw err;
        await new Promise(r => setTimeout(r, delay * (i + 1)));
      }
    }
    // All retries exhausted with 5xx - return last response so caller can handle
    return lastResponse;
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    const time = formatTime(new Date());
    appendMessage("user", text, time);
    input.value = "";
    setLoading(true);
    showTyping();
    updateSuggestions([]); // Hide suggestions while loading

    try {
      const pageContext = getCurrentPageContext();
      const sessionId = getSessionId();
      
      const res = await fetchWithRetry(CHATBOT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: text, 
          page_context: pageContext,
          session_id: sessionId
        }),
      });

      const data = await res.json();
      removeTyping();

      if (data.reply) {
        const botTime = formatTime(new Date());
        const msgEl = appendMessage("bot", "", botTime, false, false);
        await typewriterEffect(msgEl, data.reply);
        // Save after typewriter completes
        messageHistory.push({ role: "bot", text: data.reply, time: botTime });
        saveHistory(messageHistory);
        
        // Update suggestions from API or use defaults
        if (data.suggestions && data.suggestions.length > 0) {
          updateSuggestions(data.suggestions);
        } else {
          updateSuggestions(defaultSuggestions);
        }
      } else if (data.error) {
        appendMessage("bot", `⚠️ ${data.error}`, formatTime(new Date()));
        updateSuggestions(defaultSuggestions);
      } else {
        appendMessage("bot", "Something went wrong. Try again.", formatTime(new Date()));
        updateSuggestions(defaultSuggestions);
      }
    } catch (err) {
      removeTyping();
      appendMessage("bot", "🔌 Connection issue. Please try again in a moment.", formatTime(new Date()));
      updateSuggestions(["Try again", "What are his skills?", "Contact info?"]);
    } finally {
      setLoading(false);
      input.focus();
    }
  }

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
})();