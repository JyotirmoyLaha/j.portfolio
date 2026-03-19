const CHATBOT_API_URL = "https://portfolio-chatbot-38ce.onrender.com/chat";

(function () {
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
        <div id="jchat-header-text">
          <span id="jchat-header-title">⚡ Ask about Jyotirmoy</span>
          <span id="jchat-header-subtitle">Online now • Real-time portfolio answers</span>
        </div>
        <button id="jchat-close">✕</button>
      </div>
      <div id="jchat-messages"></div>
      <div id="jchat-input-area">
        <input id="jchat-input" type="text" placeholder="Ask me anything..." maxlength="500" autocomplete="off"/>
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
  const messages = document.getElementById("jchat-messages");
  const input    = document.getElementById("jchat-input");
  const sendBtn  = document.getElementById("jchat-send");

  let isOpen = false;
  let welcomeSent = false;

  // ── Hide bubble initially ─────────────────────────────────
  bubble.style.display = "none";
  window_.style.display = "none";

  // ── Wait for splash screen to finish ─────────────────────
  function showChatbotWhenReady() {
    const splash = document.getElementById("intro-splash");

    if (!splash) {
      // No splash screen found — show immediately
      bubble.style.display = "flex";
      window_.style.display = "flex";
      return;
    }

    // Watch for splash to be hidden/removed
    const observer = new MutationObserver(() => {
      const isHidden =
        splash.style.display === "none" ||
        splash.style.opacity === "0" ||
        splash.style.visibility === "hidden" ||
        splash.classList.contains("hidden") ||
        !document.body.contains(splash);

      if (isHidden) {
        bubble.style.display = "flex";
        window_.style.display = "flex";
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    // Fallback — show after 5 seconds no matter what
    setTimeout(() => {
      bubble.style.display = "flex";
      window_.style.display = "flex";
      observer.disconnect();
    }, 5000);
  }

  // Run after DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", showChatbotWhenReady);
  } else {
    showChatbotWhenReady();
  }

  // ── Toggle ────────────────────────────────────────────────
  function openChat() {
    isOpen = true;
    window_.classList.add("jchat-open");
    bubble.classList.add("jchat-hidden");
    input.focus();
    if (!welcomeSent) {
      appendMessage(
        "bot",
        "Hey! I'm Jyotirmoy's portfolio assistant. I fetch his latest info in real-time. Ask me anything about his skills, projects, blogs, or background. 🚀"
      );
      welcomeSent = true;
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

  // ── Messages ──────────────────────────────────────────────
  function scrollMessagesToBottom() {
    requestAnimationFrame(() => {
      messages.scrollTop = messages.scrollHeight;
    });
  }

  function appendMessage(role, text) {
    const msg = document.createElement("div");
    msg.classList.add("jchat-msg", role === "user" ? "jchat-user" : "jchat-bot");
    msg.textContent = text;
    messages.appendChild(msg);
    scrollMessagesToBottom();
    return msg;
  }

  function showTyping() {
    const typing = document.createElement("div");
    typing.classList.add("jchat-msg", "jchat-bot", "jchat-typing");
    typing.id = "jchat-typing";
    typing.innerHTML = `<span></span><span></span><span></span>`;
    messages.appendChild(typing);
    scrollMessagesToBottom();
  }

  function removeTyping() {
    const t = document.getElementById("jchat-typing");
    if (t) t.remove();
  }

  function setLoading(state) {
    input.disabled = state;
    sendBtn.disabled = state;
  }

  function getCurrentPageContext() {
    const hash = window.location.hash || "";
    const isBlogRoute = hash.startsWith("#blog/");

    if (!isBlogRoute) return "";

    const titleEl = document.getElementById("detail-title");
    const dateEl = document.getElementById("detail-date");
    const contentEl = document.getElementById("detail-content");

    const title = (titleEl?.innerText || "").trim();
    const date = (dateEl?.innerText || "").trim();
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
      date ? `[CURRENT BLOG DATE] ${date}` : "",
      "[CURRENT BLOG CONTENT]",
      limited,
    ]
      .filter(Boolean)
      .join("\n");
  }

  function setupChatScrollIsolation() {
    const stopBubble = (e) => {
      e.stopPropagation();
    };

    ["wheel", "touchmove", "DOMMouseScroll"].forEach((evt) => {
      window_.addEventListener(evt, stopBubble, { passive: true });
      messages.addEventListener(evt, stopBubble, { passive: true });
    });
  }

  setupChatScrollIsolation();

  // ── Send ──────────────────────────────────────────────────
  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    appendMessage("user", text);
    input.value = "";
    setLoading(true);
    showTyping();

    try {
      const pageContext = getCurrentPageContext();
      const res = await fetch(CHATBOT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, page_context: pageContext }),
      });

      const data = await res.json();
      removeTyping();

      if (data.reply) {
        appendMessage("bot", data.reply);
      } else if (data.error) {
        appendMessage("bot", data.error);
      } else {
        appendMessage("bot", "Something went wrong. Try again.");
      }
    } catch (err) {
      removeTyping();
      appendMessage("bot", "Something went wrong. Try again.");
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