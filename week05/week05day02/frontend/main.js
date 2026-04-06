import { io } from 'socket.io-client';

// ===========================
// CONFIG
// ===========================
const API_BASE = '/api';
const SOCKET_URL = window.location.origin;

// ===========================
// STATE
// ===========================
const state = {
  token: localStorage.getItem('pulse_token') || null,
  user: JSON.parse(localStorage.getItem('pulse_user') || 'null'),
  currentPost: 'general',
  currentView: 'auth',
  notifications: [],
  notifCount: 0,
  socket: null,
};

// ===========================
// DOM HELPERS
// ===========================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ===========================
// API UTILITY
// ===========================
async function api(endpoint, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (state.token) {
    headers['Authorization'] = `Bearer ${state.token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || `Request failed (${res.status})`);
  }
  return data;
}

// ===========================
// TOAST SYSTEM
// ===========================
function showToast(message, type = 'info') {
  const icons = {
    success: '✅',
    error: '❌',
    info: '💡',
    comment: '💬',
    like: '💖',
    reply: '↩️',
  };

  const container = $('#toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <div class="toast-icon ${type}">${icons[type] || icons.info}</div>
    <div class="toast-text">${message}</div>
  `;

  toast.addEventListener('click', () => removeToast(toast));
  container.appendChild(toast);

  setTimeout(() => removeToast(toast), 4000);
}

function removeToast(toast) {
  if (!toast.parentNode) return;
  toast.classList.add('removing');
  setTimeout(() => toast.remove(), 300);
}

// ===========================
// VIEW ROUTING
// ===========================
function showView(viewName, params = null) {
  // Hide all views
  $$('.view').forEach((v) => v.classList.add('hidden'));

  // Show target view
  const target = $(`#view-${viewName}`);
  if (target) target.classList.remove('hidden');

  // Update navbar
  $$('.nav-btn').forEach((b) => b.classList.remove('active'));
  const activeBtn = $(`.nav-btn[data-view="${viewName}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  // Show/hide navbar
  if (viewName === 'auth') {
    $('#navbar').classList.add('hidden');
  } else {
    $('#navbar').classList.remove('hidden');
  }

  state.currentView = viewName;

  // Load view data
  if (viewName === 'feed') {
    loadComments();
  } else if (viewName === 'profile') {
    loadProfile(params);
  }
}

// ===========================
// AUTH
// ===========================
function initAuth() {
  // Tab switching
  $('#tab-login').addEventListener('click', () => {
    $('#tab-login').classList.add('active');
    $('#tab-register').classList.remove('active');
    $('#tab-indicator').classList.remove('right');
    $('#login-form').classList.remove('hidden');
    $('#register-form').classList.add('hidden');
  });

  $('#tab-register').addEventListener('click', () => {
    $('#tab-register').classList.add('active');
    $('#tab-login').classList.remove('active');
    $('#tab-indicator').classList.add('right');
    $('#register-form').classList.remove('hidden');
    $('#login-form').classList.add('hidden');
  });

  // Login
  $('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = $('#btn-login');
    const loader = btn.querySelector('.btn-loader');
    const span = btn.querySelector('span');

    try {
      btn.disabled = true;
      loader.classList.remove('hidden');
      span.textContent = 'Signing in...';

      const data = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: $('#login-email').value.trim(),
          password: $('#login-password').value,
        }),
      });

      state.token = data.access_token;
      state.user = data.user;
      localStorage.setItem('pulse_token', state.token);
      localStorage.setItem('pulse_user', JSON.stringify(state.user));

      showToast(`Welcome back, <strong>${data.user.username}</strong>!`, 'success');
      initSocket();
      showView('feed');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      btn.disabled = false;
      loader.classList.add('hidden');
      span.textContent = 'Sign In';
    }
  });

  // Register
  $('#register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = $('#btn-register');
    const loader = btn.querySelector('.btn-loader');
    const span = btn.querySelector('span');

    try {
      btn.disabled = true;
      loader.classList.remove('hidden');
      span.textContent = 'Creating account...';

      await api('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          username: $('#reg-username').value.trim(),
          email: $('#reg-email').value.trim(),
          password: $('#reg-password').value,
          bio: $('#reg-bio').value.trim() || undefined,
        }),
      });

      showToast('Account created! Please sign in.', 'success');

      // Switch to login tab
      $('#tab-login').click();
      $('#login-email').value = $('#reg-email').value;
      $('#login-password').focus();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      btn.disabled = false;
      loader.classList.add('hidden');
      span.textContent = 'Create Account';
    }
  });

  // Logout
  $('#btn-logout').addEventListener('click', () => {
    state.token = null;
    state.user = null;
    localStorage.removeItem('pulse_token');
    localStorage.removeItem('pulse_user');
    if (state.socket) {
      state.socket.disconnect();
      state.socket = null;
    }
    showView('auth');
    showToast('Signed out successfully', 'info');
  });
}

// ===========================
// SOCKET.IO
// ===========================
function initSocket() {
  if (state.socket) {
    state.socket.disconnect();
  }

  state.socket = io(SOCKET_URL, {
    query: { userId: state.user?.id },
    transports: ['websocket', 'polling'],
  });

  state.socket.on('connect', () => {
    console.log('🔌 Connected to WebSocket');
  });

  // New comment broadcast
  state.socket.on('newComment', ({ postId, comment }) => {
    if (state.currentView === 'feed' && state.currentPost === postId) {
      // Only add if we didn't create it
      if (comment.author?._id !== state.user?.id) {
        prependComment(comment, true);
      }
    }

    // Show toast if relevant
    if (comment.author?._id !== state.user?.id) {
      const username = comment.author?.username || 'Someone';
      showToast(`<strong>${username}</strong> posted in #${postId}`, 'comment');
      addNotification('comment', `${username} posted in #${postId}`);
    }
  });

  // Edit comment broadcast
  state.socket.on('editComment', ({ postId, comment }) => {
    if (state.currentView === 'feed' && state.currentPost === postId) {
      const card = $(`.comment-card[data-id="${comment._id}"]`);
      if (card) {
        const contentEl = card.querySelector('.comment-content');
        if (contentEl) {
          contentEl.textContent = comment.content;
          card.classList.add('new-comment');
          setTimeout(() => card.classList.remove('new-comment'), 1500);
        }
      }
    }
  });

  // Delete comment broadcast
  state.socket.on('deleteComment', ({ postId, commentId }) => {
    if (state.currentView === 'feed' && state.currentPost === postId) {
      const card = $(`.comment-card[data-id="${commentId}"]`);
      if (card) {
        card.classList.add('removing');
        setTimeout(() => {
          card.remove();
          updateCommentCount();
        }, 300);
      }
    }
  });

  // Reply notification
  state.socket.on('newReply', ({ reply }) => {
    if (state.currentView === 'feed' && state.currentPost === reply.postId) {
      prependComment(reply, true);
    }
    const username = reply.author?.username || 'Someone';
    showToast(`<strong>${username}</strong> replied to your comment`, 'reply');
    addNotification('reply', `${username} replied to your comment`);
  });

  // Like notification
  state.socket.on('newLike', ({ likerId, commentId }) => {
    showToast('Someone liked your comment! 💖', 'like');
    addNotification('like', 'Someone liked your comment');
  });

  state.socket.on('disconnect', () => {
    console.log('🔌 Disconnected from WebSocket');
  });
}

// ===========================
// NOTIFICATIONS
// ===========================
function addNotification(type, text) {
  state.notifications.unshift({ type, text, time: new Date() });
  state.notifCount++;
  updateNotifBadge();
  renderNotifications();
}

function updateNotifBadge() {
  const badge = $('#notif-badge');
  if (state.notifCount > 0) {
    badge.textContent = state.notifCount > 9 ? '9+' : state.notifCount;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

function renderNotifications() {
  const list = $('#notif-list');
  if (state.notifications.length === 0) {
    list.innerHTML = '<p class="notif-empty">No notifications yet ✨</p>';
    return;
  }

  list.innerHTML = state.notifications
    .slice(0, 20)
    .map((n) => {
      const icons = { comment: '💬', reply: '↩️', like: '💖' };
      const timeAgo = getTimeAgo(n.time);
      return `
      <div class="notif-item">
        <div class="notif-icon ${n.type}">${icons[n.type] || '🔔'}</div>
        <div>
          <div class="notif-text">${n.text}</div>
          <div class="notif-time">${timeAgo}</div>
        </div>
      </div>
    `;
    })
    .join('');
}

function initNotifications() {
  const bell = $('#notification-bell');
  const dropdown = $('#notif-dropdown');

  bell.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('hidden');
    state.notifCount = 0;
    updateNotifBadge();
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && !bell.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });

  $('#clear-notifs').addEventListener('click', () => {
    state.notifications = [];
    state.notifCount = 0;
    updateNotifBadge();
    renderNotifications();
  });
}

// ===========================
// COMMENTS
// ===========================
async function loadComments() {
  const list = $('#comments-list');
  list.innerHTML = `
    <div class="comments-loading">
      <div class="spinner"></div>
      <p>Loading comments...</p>
    </div>
  `;

  try {
    const comments = await api(`/comments/post/${state.currentPost}`);
    renderComments(comments);
  } catch (err) {
    list.innerHTML = `<div class="comments-empty">
      <div class="empty-icon">😔</div>
      <p>Failed to load comments</p>
    </div>`;
    showToast(err.message, 'error');
  }
}

function renderComments(comments) {
  const list = $('#comments-list');

  if (!comments || comments.length === 0) {
    list.innerHTML = `
      <div class="comments-empty">
        <div class="empty-icon">💭</div>
        <p>No comments yet. Be the first to share!</p>
      </div>
    `;
    return;
  }

  // Separate root comments and replies
  const rootComments = comments.filter((c) => !c.parentCommentId);
  const replies = comments.filter((c) => c.parentCommentId);

  // Build a map of replies by parent
  const replyMap = {};
  replies.forEach((r) => {
    const parentId = r.parentCommentId;
    if (!replyMap[parentId]) replyMap[parentId] = [];
    replyMap[parentId].push(r);
  });

  let html = '';
  rootComments.forEach((c) => {
    html += buildCommentHTML(c);
    if (replyMap[c._id]) {
      replyMap[c._id].forEach((r) => {
        html += buildCommentHTML(r, true);
      });
    }
  });

  list.innerHTML = html;
  attachCommentListeners();

  // Update title
  updateCommentCount();
}

function updateCommentCount() {
  const count = $$('.comment-card').length;
  $('#comments-title').textContent = `Comments (${count})`;
}

function buildCommentHTML(comment, isReply = false) {
  const author = comment.author || {};
  const authorId = author._id || author.id;
  const initial = (author.username || '?')[0].toUpperCase();
  const timeAgo = getTimeAgo(new Date(comment.createdAt));
  const replyClass = isReply ? 'is-reply' : '';
  const isAuthor = state.user && authorId === state.user.id;

  const avatarContent = author.profilePicture 
    ? `<img src="${author.profilePicture}" alt="${author.username}" />`
    : initial;

  return `
    <div class="comment-card ${replyClass}" data-id="${comment._id}">
      <div class="comment-top">
        <div class="comment-avatar">${avatarContent}</div>
        <div class="comment-meta">
          <div class="comment-author" data-user-id="${authorId}">${author.username || 'Anonymous'}</div>
          <div class="comment-time">${timeAgo}</div>
        </div>
        ${
          isAuthor
            ? `<div class="comment-options">
          <button class="option-btn edit-btn" data-id="${comment._id}" data-content="${escapeAttr(
                comment.content
              )}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="option-btn delete-btn" data-id="${comment._id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
          </button>
        </div>`
            : ''
        }
      </div>
      <div class="comment-content">${escapeHTML(comment.content)}</div>
      <div class="comment-actions">
        <button class="action-btn like-btn" data-comment-id="${comment._id}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <span>${comment.likesCount || 0}</span>
        </button>
        ${
          !isReply
            ? `<button class="action-btn reply-btn" data-comment-id="${comment._id}" data-content="${escapeAttr(
                comment.content
              )}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 10 20 15 15 20"/><path d="M4 4v7a4 4 0 0 0 4 4h12"/></svg>
          <span>Reply</span>
        </button>`
            : ''
        }
      </div>
    </div>
  `;
}

function prependComment(comment, highlight = false) {
  const list = $('#comments-list');
  // Remove empty state if present
  const emptyEl = list.querySelector('.comments-empty');
  if (emptyEl) emptyEl.remove();

  const isReply = !!comment.parentCommentId;
  const html = buildCommentHTML(comment, isReply);

  if (isReply) {
    // Insert after the parent comment
    const parentCard = list.querySelector(`[data-id="${comment.parentCommentId}"]`);
    if (parentCard) {
      parentCard.insertAdjacentHTML('afterend', html);
    } else {
      list.insertAdjacentHTML('afterbegin', html);
    }
  } else {
    // Prepend at top
    list.insertAdjacentHTML('afterbegin', html);
  }

  if (highlight) {
    const newCard = list.querySelector(`[data-id="${comment._id}"]`);
    if (newCard) {
      newCard.classList.add('new-comment');
      setTimeout(() => newCard.classList.remove('new-comment'), 1500);
    }
  }

  attachCommentListeners();
  updateCommentCount();
}

function attachCommentListeners() {
  // Like buttons
  $$('.like-btn').forEach((btn) => {
    btn.replaceWith(btn.cloneNode(true));
  });
  $$('.like-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const commentId = btn.dataset.commentId;
      try {
        const result = await api(`/likes/${commentId}/toggle`, { method: 'POST' });
        const countSpan = btn.querySelector('span');
        let count = parseInt(countSpan.textContent) || 0;

        if (result.message === 'Comment liked') {
          btn.classList.add('liked');
          countSpan.textContent = count + 1;
        } else {
          btn.classList.remove('liked');
          countSpan.textContent = Math.max(0, count - 1);
        }
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  });

  // Reply buttons
  $$('.reply-btn').forEach((btn) => {
    btn.replaceWith(btn.cloneNode(true));
  });
  $$('.reply-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      openReplyModal(btn.dataset.commentId, btn.dataset.content);
    });
  });

  // Edit buttons
  $$('.edit-btn').forEach((btn) => {
    btn.replaceWith(btn.cloneNode(true));
  });
  $$('.edit-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      openEditModal(btn.dataset.id, btn.dataset.content);
    });
  });

  // Delete buttons
  $$('.delete-btn').forEach((btn) => {
    btn.replaceWith(btn.cloneNode(true));
  });
  $$('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (confirm('Are you sure you want to delete this comment?')) {
        const id = btn.dataset.id;
        try {
          await api(`/comments/${id}`, { method: 'DELETE' });
          const card = $(`.comment-card[data-id="${id}"]`);
          if (card) {
            card.classList.add('removing');
            setTimeout(() => {
              card.remove();
              updateCommentCount();
            }, 300);
          }
          showToast('Comment deleted', 'success');
        } catch (err) {
          showToast(err.message, 'error');
        }
      }
    });
  });

  // Author profile clicks
  $$('.comment-author').forEach((el) => {
    el.addEventListener('click', () => {
      const userId = el.dataset.userId;
      if (userId) showView('profile', userId);
    });
  });
}

// ===========================
// COMPOSER
// ===========================
function initComposer() {
  const input = $('#comment-input');
  const sendBtn = $('#btn-send');
  const charCount = $('#char-count');

  input.addEventListener('input', () => {
    const len = input.value.length;
    charCount.textContent = `${len} / 500`;
    sendBtn.disabled = len === 0 || len > 500;

    if (len > 450) {
      charCount.style.color = 'var(--accent-orange)';
    } else if (len > 500) {
      charCount.style.color = 'var(--accent-red)';
    } else {
      charCount.style.color = '';
    }
  });

  sendBtn.addEventListener('click', async () => {
    const content = input.value.trim();
    if (!content) return;

    try {
      sendBtn.disabled = true;
      const comment = await api('/comments', {
        method: 'POST',
        body: JSON.stringify({
          postId: state.currentPost,
          content,
        }),
      });

      prependComment(comment, true);
      input.value = '';
      charCount.textContent = '0 / 500';
      sendBtn.disabled = true;
      showToast('Comment posted!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
      sendBtn.disabled = false;
    }
  });

  // Enter to send (Ctrl/Cmd + Enter)
  input.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      sendBtn.click();
    }
  });
}

// ===========================
// CHANNELS
// ===========================
function initChannels() {
  $$('.channel-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('.channel-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentPost = btn.dataset.post;
      loadComments();
    });
  });
}

// ===========================
// REPLY MODAL
// ===========================
let replyTargetId = null;

function openReplyModal(commentId, parentContent) {
  replyTargetId = commentId;
  $('#modal-parent-comment').textContent = parentContent || '...';
  $('#reply-input').value = '';
  $('#reply-modal').classList.remove('hidden');
  setTimeout(() => $('#reply-input').focus(), 100);
}

function closeReplyModal() {
  $('#reply-modal').classList.add('hidden');
  replyTargetId = null;
}

function initReplyModal() {
  $('#modal-close').addEventListener('click', closeReplyModal);
  $('#modal-cancel').addEventListener('click', closeReplyModal);

  $('#reply-modal').addEventListener('click', (e) => {
    if (e.target === $('#reply-modal')) closeReplyModal();
  });

  $('#btn-reply-submit').addEventListener('click', async () => {
    const content = $('#reply-input').value.trim();
    if (!content || !replyTargetId) return;

    const btn = $('#btn-reply-submit');
    const loader = btn.querySelector('.btn-loader');
    const span = btn.querySelector('span');

    try {
      btn.disabled = true;
      loader.classList.remove('hidden');
      span.textContent = 'Sending...';

      const reply = await api(`/comments/${replyTargetId}/reply`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      });

      prependComment(reply, true);
      closeReplyModal();
      showToast('Reply posted!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      btn.disabled = false;
      loader.classList.add('hidden');
      span.textContent = 'Reply';
    }
  });
}

// ===========================
// EDIT MODAL
// ===========================
let editTargetId = null;

function openEditModal(commentId, content) {
  editTargetId = commentId;
  $('#edit-input').value = content || '';
  $('#edit-modal').classList.remove('hidden');
  setTimeout(() => $('#edit-input').focus(), 100);
}

function closeEditModal() {
  $('#edit-modal').classList.add('hidden');
  editTargetId = null;
}

function initEditModal() {
  $('#modal-edit-close').addEventListener('click', closeEditModal);
  $('#modal-edit-cancel').addEventListener('click', closeEditModal);

  $('#edit-modal').addEventListener('click', (e) => {
    if (e.target === $('#edit-modal')) closeEditModal();
  });

  $('#btn-edit-submit').addEventListener('click', async () => {
    const content = $('#edit-input').value.trim();
    if (!content || !editTargetId) return;

    const btn = $('#btn-edit-submit');
    const loader = btn.querySelector('.btn-loader');
    const span = btn.querySelector('span');

    try {
      btn.disabled = true;
      loader.classList.remove('hidden');
      span.textContent = 'Saving...';

      const comment = await api(`/comments/${editTargetId}`, {
        method: 'PATCH',
        body: JSON.stringify({ content }),
      });

      // Update UI locally
      const card = $(`.comment-card[data-id="${editTargetId}"]`);
      if (card) {
        const contentEl = card.querySelector('.comment-content');
        if (contentEl) {
          contentEl.textContent = comment.content;
          // Update data-content for future edits
          const editBtn = card.querySelector('.edit-btn');
          if (editBtn) editBtn.dataset.content = escapeAttr(comment.content);
        }
        card.classList.add('new-comment');
        setTimeout(() => card.classList.remove('new-comment'), 1500);
      }

      closeEditModal();
      showToast('Comment updated!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      btn.disabled = false;
      loader.classList.add('hidden');
      span.textContent = 'Save Changes';
    }
  });
}

// ===========================
// PROFILE
// ===========================
async function loadProfile(targetId = null) {
  const isOwnProfile = !targetId || targetId === state.user.id;
  const uid = targetId || state.user.id;

  try {
    const profile = await api(`/users/${uid}`);

    // Update Header
    $('#profile-username').textContent = profile.username || 'Unknown';
    $('#profile-email').textContent = profile.email || '';
    $('#profile-bio').textContent = profile.bio || 'No bio yet';
    
    // Avatar
    const avatarEl = $('#profile-avatar');
    if (profile.profilePicture) {
      avatarEl.innerHTML = `<img src="${profile.profilePicture}" alt="${profile.username}" />`;
    } else {
      avatarEl.textContent = (profile.username || '?')[0].toUpperCase();
    }

    // Follow/Photo buttons
    const photoBtn = $('#btn-edit-photo');
    const actionsArea = $('#profile-actions');

    if (isOwnProfile) {
      photoBtn.classList.remove('hidden');
      actionsArea.innerHTML = '';
    } else {
      photoBtn.classList.add('hidden');
      const isFollowing = profile.followers?.includes(state.user.id);
      actionsArea.innerHTML = `
        <button class="btn-follow ${isFollowing ? 'following' : ''}" id="btn-follow-toggle">
          ${isFollowing ? 'Unfollow' : 'Follow User'}
        </button>
      `;
      
      $('#btn-follow-toggle').addEventListener('click', () => toggleFollow(uid));
    }

    // Stats
    $('#stat-followers').textContent = profile.followers?.length || 0;
    $('#stat-following').textContent = profile.following?.length || 0;
  } catch (err) {
    showToast('Failed to load profile', 'error');
  }
}

async function toggleFollow(targetId) {
  const btn = $('#btn-follow-toggle');
  const isFollowing = btn.classList.contains('following');
  const endpoint = isFollowing ? `/users/${targetId}/unfollow` : `/users/${targetId}/follow`;

  try {
    btn.disabled = true;
    await api(endpoint, { method: 'POST' });
    
    // Quick UI flip
    if (isFollowing) {
      btn.classList.remove('following');
      btn.textContent = 'Follow User';
      $('#stat-followers').textContent = Math.max(0, parseInt($('#stat-followers').textContent) - 1);
    } else {
      btn.classList.add('following');
      btn.textContent = 'Unfollow';
      $('#stat-followers').textContent = parseInt($('#stat-followers').textContent) + 1;
    }
    showToast(isFollowing ? 'Unfollowed user' : 'User followed!', 'info');
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    btn.disabled = false;
  }
}

function initProfileActions() {
  $('#btn-edit-photo').addEventListener('click', async () => {
    const url = prompt('Enter your profile picture URL:', state.user.profilePicture || '');
    if (url === null) return;

    try {
      const updatedUser = await api('/users/profile', {
        method: 'PATCH',
        body: JSON.stringify({ profilePicture: url }),
      });
      
      state.user = updatedUser;
      localStorage.setItem('pulse_user', JSON.stringify(state.user));
      loadProfile(); // Refresh
      showToast('Profile photo updated!', 'success');
      
      // Update composer too
      if ($('#composer-avatar')) {
        $('#composer-avatar').innerHTML = url 
          ? `<img src="${url}" style="width:100%;height:100%;border-radius:50%;object-fit:cover" />` 
          : updatedUser.username[0].toUpperCase();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}

// ===========================
// NAV
// ===========================
function initNav() {
  $$('.nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      showView(btn.dataset.view);
    });
  });
}

// ===========================
// HELPERS
// ===========================
function getTimeAgo(date) {
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((now - d) / 1000);

  if (diff < 10) return 'just now';
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ===========================
// INIT
// ===========================
function init() {
  initAuth();
  initNav();
  initComposer();
  initChannels();
  initReplyModal();
  initEditModal();
  initProfileActions();
  initNotifications();

  // Update composer avatar
  if (state.user) {
    const initial = (state.user.username || '?')[0].toUpperCase();
    if (state.user.profilePicture) {
      $('#composer-avatar').innerHTML = `<img src="${state.user.profilePicture}" style="width:100%;height:100%;border-radius:50%;object-fit:cover" />`;
    } else {
      $('#composer-avatar').textContent = initial;
    }
  }

  // Check if already logged in
  if (state.token && state.user) {
    initSocket();
    showView('feed');
  } else {
    showView('auth');
  }
}

document.addEventListener('DOMContentLoaded', init);
