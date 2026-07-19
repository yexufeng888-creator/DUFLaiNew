/* ============================================================
   DUFL — Auth Module v2
   Security-hardened: PBKDF2 + random per-user salt
   Input sanitization · XSS prevention · Secure sessions
   ============================================================ */
const Auth = (function(){
  'use strict';

  const USERS_KEY = 'dufl_users_v2';
  const SESSION_KEY = 'dufl_session_v2';
  const SALT_KEY_PREFIX = 'dufl_salt_';
  const PBKDF2_ITERATIONS = 310000; // OWASP 2026 recommendation

  /* ---- HTML Sanitizer (XSS prevention) ---- */
  function sanitize(str){
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeHTML(str){
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;');
  }

  /* ---- Crypto: PBKDF2 with random per-user salt ---- */
  function generateSalt(){
    const arr = new Uint8Array(32);
    crypto.getRandomValues(arr);
    return Array.from(arr).map(b => b.toString(16).padStart(2,'0')).join('');
  }

  async function hashPassword(password, salt){
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw', encoder.encode(password),
      { name: 'PBKDF2' }, false, ['deriveBits']
    );
    const bits = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt: encoder.encode(salt), iterations: PBKDF2_ITERATIONS, hash: 'SHA-512' },
      key, 512
    );
    return Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2,'0')).join('');
  }

  /* ---- User Store ---- */
  function getUsers(){
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
    catch(e){ return []; }
  }
  function saveUsers(users){
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  /* ---- Session ---- */
  function getSession(){
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
    catch(e){ return null; }
  }
  function saveSession(session){
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
  function clearSession(){
    localStorage.removeItem(SESSION_KEY);
  }

  /* ---- Validate inputs ---- */
  function validateName(name){
    if (!name || !name.trim()) return '请输入姓名';
    if (name.length > 50) return '姓名不能超过50个字符';
    if (/[<>"'&]/.test(name)) return '姓名包含非法字符';
    return null;
  }

  function validateEmail(email){
    if (!email || !email.trim()) return '请输入邮箱';
    if (email.length > 254) return '邮箱格式不正确';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return '邮箱格式不正确';
    return null;
  }

  function validatePassword(password){
    if (!password) return '请输入密码';
    if (password.length < 8) return '密码至少8位';
    if (password.length > 128) return '密码不能超过128位';
    return null;
  }

  /* ---- Register ---- */
  async function register(name, email, password){
    const nameErr = validateName(name);
    if (nameErr) return { ok: false, error: nameErr };

    const emailErr = validateEmail(email);
    if (emailErr) return { ok: false, error: emailErr };

    const passErr = validatePassword(password);
    if (passErr) return { ok: false, error: passErr };

    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase().trim())){
      return { ok: false, error: '该邮箱已注册' };
    }

    const salt = generateSalt();
    const hashed = await hashPassword(password, salt);

    const user = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
      salt: salt,
      createdAt: new Date().toISOString()
    };
    users.push(user);
    saveUsers(users);

    // Auto-login
    const session = {
      name: sanitize(name.trim()),
      email: email.toLowerCase().trim(),
      loginTime: new Date().toISOString()
    };
    saveSession(session);
    return { ok: true, user: session };
  }

  /* ---- Login ---- */
  async function login(email, password){
    if (!email || !password) return { ok: false, error: '请输入邮箱和密码' };

    const users = getUsers();
    const user = users.find(u => u.email === email.toLowerCase().trim());
    if (!user) return { ok: false, error: '账号不存在' };

    // Handle legacy SHA-256 hashes (migration)
    let hashed;
    if (user.salt){
      hashed = await hashPassword(password, user.salt);
    } else {
      // Legacy fallback: migrate old accounts
      const encoder = new TextEncoder();
      const data = encoder.encode(password + 'dufl_salt_2026');
      const hash = await crypto.subtle.digest('SHA-256', data);
      const legacyHash = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,'0')).join('');
      if (user.password === legacyHash){
        // Migrate to PBKDF2
        const newSalt = generateSalt();
        const newHash = await hashPassword(password, newSalt);
        user.salt = newSalt;
        user.password = newHash;
        saveUsers(users);
        hashed = newHash;
      } else {
        hashed = null;
      }
    }

    if (user.password !== hashed) return { ok: false, error: '密码错误' };

    const session = {
      name: sanitize(user.name),
      email: user.email,
      loginTime: new Date().toISOString()
    };
    saveSession(session);
    return { ok: true, user: session };
  }

  /* ---- Logout ---- */
  function logout(){
    clearSession();
    window.location.href = 'index.html';
  }

  /* ---- Check ---- */
  function isLoggedIn(){
    const s = getSession();
    if (!s) return false;
    // Session expires after 30 days
    const loginTime = new Date(s.loginTime);
    const now = new Date();
    const daysDiff = (now - loginTime) / (1000 * 60 * 60 * 24);
    if (daysDiff > 30){
      clearSession();
      return false;
    }
    return true;
  }

  function currentUser(){
    return getSession();
  }

  /* ---- Update Nav UI (XSS-safe) ---- */
  function updateNavUI(){
    const session = getSession();
    const navActions = document.querySelector('#nav .nav-actions');
    if (!navActions) return;

    // Remove existing auth elements
    const existing = navActions.querySelector('.auth-area');
    if (existing) existing.remove();

    const area = document.createElement('span');
    area.className = 'auth-area';
    area.style.cssText = 'display:flex;align-items:center;gap:6px;margin-right:4px';

    if (session){
      const safeName = sanitize(session.name);
      const initialEl = document.createElement('span');
      initialEl.style.cssText = 'width:26px;height:26px;border-radius:50%;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600';
      initialEl.textContent = safeName.charAt(0).toUpperCase();

      const nameEl = document.createElement('span');
      nameEl.style.cssText = 'max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;color:var(--text-2)';
      nameEl.textContent = safeName;

      const logoutBtn = document.createElement('button');
      logoutBtn.textContent = '退出';
      logoutBtn.onclick = function(){ Auth.logout(); };
      logoutBtn.style.cssText = 'font-size:10px;color:var(--text-3);padding:3px 8px;border-radius:4px;cursor:pointer;transition:all .2s';
      logoutBtn.onmouseover = function(){ this.style.background='var(--border-soft)'; this.style.color='var(--accent)'; };
      logoutBtn.onmouseout = function(){ this.style.background='none'; this.style.color='var(--text-3)'; };

      const wrapper = document.createElement('span');
      wrapper.style.cssText = 'display:flex;align-items:center;gap:6px';
      wrapper.appendChild(initialEl);
      wrapper.appendChild(nameEl);
      wrapper.appendChild(logoutBtn);
      area.appendChild(wrapper);
    } else {
      const loginLink = document.createElement('a');
      loginLink.href = 'login.html';
      loginLink.textContent = '登录';
      loginLink.style.cssText = 'font-size:12px;font-weight:500;color:var(--accent);padding:5px 12px;border-radius:100px;border:1px solid var(--accent);transition:all .2s;white-space:nowrap';
      loginLink.onmouseover = function(){ this.style.background='var(--accent)'; this.style.color='#fff'; };
      loginLink.onmouseout = function(){ this.style.background='none'; this.style.color='var(--accent)'; };
      area.appendChild(loginLink);
    }

    // Insert before menu button or append
    const menuBtn = navActions.querySelector('.menu-btn');
    if (menuBtn) navActions.insertBefore(area, menuBtn);
    else navActions.appendChild(area);
  }

  /* ---- Require Auth (for protected pages) ---- */
  function requireAuth(){
    if (!isLoggedIn()){
      sessionStorage.setItem('redirect_after_login', window.location.href);
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }

  /* ---- Init ---- */
  function init(){
    updateNavUI();
    // Listen for storage changes (other tabs)
    window.addEventListener('storage', function(e){
      if (e.key === SESSION_KEY || e.key === USERS_KEY) updateNavUI();
    });
  }

  document.addEventListener('DOMContentLoaded', init);

  return { register, login, logout, isLoggedIn, currentUser, requireAuth, updateNavUI, init, sanitize, escapeHTML };
})();
