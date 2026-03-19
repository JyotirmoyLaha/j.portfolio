// ── Change this after deploying backend on Render ──
const CHATBOT_API_URL = "http://127.0.0.1:8000/chat";

(function () {
  // ── Inject HTML ──────────────────────────────────────────
  const html = `
    <div id="jchat-bubble" title="Ask about Jyotirmoy">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    </div>

    <div id="jchat-window">
      <div id="jchat-header">
        <span>⚡ Ask about Jyotirmoy</span>
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

  // ── Elements ─────────────────────────────────────────────
  const bubble   = document.getElementById("jchat-bubble");
  const window_  = document.getElementById("jchat-window");
  const closeBtn = document.getElementById("jchat-close");
  const messages = document.getElementById("jchat-messages");
  const input    = document.getElementById("jchat-input");
  const sendBtn  = document.getElementById("jchat-send");

  let isOpen = false;
  let welcomeSent = false;

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
  }

  function closeChat() {
    isOpen = false;
    window_.classList.remove("jchat-open");
    bubble.classList.remove("jchat-hidden");
  }

  bubble.addEventListener("click", openChat);
  closeBtn.addEventListener("click", closeChat);

  // ── Messages ──────────────────────────────────────────────
  function appendMessage(role, text) {
    const msg = document.createElement("div");
    msg.classList.add("jchat-msg", role === "user" ? "jchat-user" : "jchat-bot");
    msg.textContent = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
    return msg;
  }

  function showTyping() {
    const typing = document.createElement("div");
    typing.classList.add("jchat-msg", "jchat-bot", "jchat-typing");
    typing.id = "jchat-typing";
    typing.innerHTML = `<span></span><span></span><span></span>`;
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;
  }

  function removeTyping() {
    const t = document.getElementById("jchat-typing");
    if (t) t.remove();
  }

  function setLoading(state) {
    input.disabled = state;
    sendBtn.disabled = state;
  }

  // ── Send ──────────────────────────────────────────────────
  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    appendMessage("user", text);
    input.value = "";
    setLoading(true);
    showTyping();

    try {
      const res = await fetch(CHATBOT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
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