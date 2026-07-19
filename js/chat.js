/* ============================================================
   DUFL — Shared Chat Widget v2
   XSS-safe: Auth.sanitize for user input · No email exposure
   Auto-injects into any page
   ============================================================ */
(function(){
  'use strict';

  let chatOpen = false;

  // Wait for Auth to be ready
  function safeSanitize(msg){
    if (typeof Auth !== 'undefined' && Auth.sanitize) return Auth.sanitize(msg);
    // Fallback: basic HTML entity escaping
    return String(msg).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function init(){
    // Check if chat widget already exists
    if (document.getElementById('chatWidget')) return;

    const widget = document.createElement('div');
    widget.id = 'chatWidget';
    widget.style.cssText = 'position:fixed;bottom:calc(24px + env(safe-area-inset-bottom));right:24px;z-index:200';
    widget.innerHTML = `
      <button class="chat-toggle" id="chatToggle" style="width:52px;height:52px;border-radius:50%;background:var(--accent);color:#fff;font-size:22px;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 20px rgba(196,69,54,.35);border:none;transition:all .3s;position:relative">💬</button>
      <div class="chat-panel" id="chatPanel" style="position:absolute;bottom:64px;right:0;width:min(340px,calc(100vw - 32px));height:min(440px,60vh);background:var(--card);border-radius:16px;border:1px solid var(--border);box-shadow:0 12px 48px rgba(0,0,0,.15);display:flex;flex-direction:column;overflow:hidden;opacity:0;transform:translateY(16px) scale(.95);pointer-events:none;transition:all .3s">
        <div style="background:var(--accent);color:#fff;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;font:600 13px/1.2 var(--font-serif)"><span>💬 在线客服</span><button id="chatClose" style="width:24px;height:24px;border-radius:50%;background:rgba(255,255,255,.2);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:12px;border:none">✕</button></div>
        <div style="flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px" id="chatBody">
          <div style="text-align:center;font-size:10px;color:var(--text-3);padding:6px">方言电影研究 · 在线客服</div>
          <div style="max-width:85%;padding:10px 14px;border-radius:14px;font-size:12px;line-height:1.6;background:var(--bg-alt);color:var(--text);border-top-left-radius:4px;align-self:flex-start">您好！👋 如需帮助请留言，我们将尽快回复。</div>
        </div>
        <div style="display:flex;gap:6px;padding:10px 14px;border-top:1px solid var(--border)">
          <input type="text" id="chatInput" placeholder="输入消息……" style="flex:1;padding:8px 12px;border-radius:100px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:12px;outline:none">
          <button id="chatSend" style="width:30px;height:30px;border-radius:50%;background:var(--accent);color:#fff;font-size:13px;border:none;cursor:pointer;flex-shrink:0">➤</button>
        </div>
      </div>`;

    document.body.appendChild(widget);

    // Bind events
    const toggle = document.getElementById('chatToggle');
    const close = document.getElementById('chatClose');
    const panel = document.getElementById('chatPanel');
    const input = document.getElementById('chatInput');
    const send = document.getElementById('chatSend');
    const body = document.getElementById('chatBody');

    toggle.onclick = function(){ openPanel(); };
    close.onclick = function(){ closePanel(); };

    send.onclick = function(){ sendMsg(); };
    input.onkeydown = function(e){
      if (e.key === 'Enter'){ e.preventDefault(); sendMsg(); }
    };

    // Hover effects
    toggle.onmouseover = function(){ this.style.transform = 'scale(1.08)'; };
    toggle.onmouseout = function(){ this.style.transform = 'scale(1)'; };

    function openPanel(){
      chatOpen = true;
      panel.style.opacity = '1';
      panel.style.transform = 'translateY(0) scale(1)';
      panel.style.pointerEvents = 'auto';
      setTimeout(function(){ if (input) input.focus(); }, 300);
    }

    function closePanel(){
      chatOpen = false;
      panel.style.opacity = '0';
      panel.style.transform = 'translateY(16px) scale(.95)';
      panel.style.pointerEvents = 'none';
    }

    function sendMsg(){
      if (!input) return;
      const msg = input.value.trim();
      if (!msg) return;
      input.value = '';

      // XSS-safe: use textContent for user messages, innerHTML with sanitize
      const userDiv = document.createElement('div');
      userDiv.style.cssText = 'max-width:85%;padding:10px 14px;border-radius:14px;font-size:12px;line-height:1.6;background:var(--accent);color:#fff;border-top-right-radius:4px;align-self:flex-end';
      userDiv.textContent = msg;
      body.appendChild(userDiv);

      setTimeout(function(){
        const reply = document.createElement('div');
        reply.style.cssText = 'max-width:85%;padding:10px 14px;border-radius:14px;font-size:12px;line-height:1.6;background:var(--bg-alt);color:var(--text);border-top-left-radius:4px;align-self:flex-start';
        reply.textContent = '感谢留言！请通过研究机构邮箱联系我们，我们会尽快回复。';
        body.appendChild(reply);
        body.scrollTop = body.scrollHeight;
      }, 800);

      body.scrollTop = body.scrollHeight;
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
