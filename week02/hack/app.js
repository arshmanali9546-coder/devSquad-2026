// ============================
// QuizMaster — Single-Page Application
// ============================

// ---- State ----
let currentPage = "landing";
let currentUser = JSON.parse(localStorage.getItem("quizmaster_user")) || null;
let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let timerInterval = null;
let timerSeconds = 0;

// ---- Helpers ----
function $(sel) { return document.querySelector(sel); }
function getApp() { return $("#app"); }

function navigate(page, data) {
  clearInterval(timerInterval);
  currentPage = page;
  window.scrollTo(0, 0);
  renderPage(data);
}

function getQuizHistory() {
  return JSON.parse(localStorage.getItem("quizmaster_history_" + (currentUser?.email || "")) || "[]");
}

function saveQuizResult(quizTitle, score, total, incorrectQuestions) {
  const history = getQuizHistory();
  history.push({
    quizName: quizTitle,
    score: score,
    total: total,
    date: new Date().toISOString().split("T")[0],
    incorrect: incorrectQuestions
  });
  localStorage.setItem("quizmaster_history_" + currentUser.email, JSON.stringify(history));
}

// ---- Navbar ----
function renderNavbar(activePage) {
  const isLoggedIn = !!currentUser;
  const navLinks = isLoggedIn
    ? `<a href="#" data-nav="landing" class="${activePage === 'landing' ? 'text-black font-medium' : 'text-gray-500 hover:text-black'}">Home</a>
       <a href="#" data-nav="selectQuiz" class="${activePage === 'selectQuiz' ? 'text-black font-medium' : 'text-gray-500 hover:text-black'}">Quizzes</a>
       <a href="#" data-nav="profile" class="${activePage === 'profile' ? 'text-black font-medium' : 'text-gray-500 hover:text-black'}">Profile</a>`
    : `<a href="#" data-nav="landing" class="${activePage === 'landing' ? 'text-black font-medium' : 'text-gray-500 hover:text-black'}">Home</a>
       <a href="#" data-nav="signin" class="text-gray-500 hover:text-black">Sign In</a>`;

  return `
  <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div class="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
      <div class="flex items-center gap-2 cursor-pointer" data-nav="landing">
        <div class="w-4 h-4 bg-black rounded-sm"></div>
        <h1 class="text-lg font-bold tracking-tight">QuizMaster</h1>
      </div>
      <nav class="flex items-center gap-6 text-sm">
        ${navLinks}
        <div class="flex items-center gap-3">
          <button class="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </button>
          <div class="w-9 h-9 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center text-sm font-bold text-amber-800 cursor-pointer" ${isLoggedIn ? 'data-nav="profile"' : 'data-nav="signin"'}>
            ${isLoggedIn ? currentUser.name.charAt(0).toUpperCase() : '?'}
          </div>
        </div>
      </nav>
    </div>
  </header>`;
}

// ---- Page Router ----
function renderPage(data) {
  const app = getApp();
  switch (currentPage) {
    case "landing": app.innerHTML = renderNavbar("landing") + renderLandingPage(); break;
    case "signup": app.innerHTML = renderNavbar("signup") + renderSignUpPage(); break;
    case "signin": app.innerHTML = renderNavbar("signin") + renderSignInPage(); break;
    case "profile": app.innerHTML = renderNavbar("profile") + renderProfilePage(); break;
    case "selectQuiz": app.innerHTML = renderNavbar("selectQuiz") + renderSelectQuizPage(); break;
    case "quiz": app.innerHTML = renderNavbar("quiz") + renderQuizPage(); break;
    case "results": app.innerHTML = renderNavbar("results") + renderResultsPage(data); break;
    case "review": app.innerHTML = renderNavbar("review") + renderReviewPage(data); break;
  }
  attachNavListeners();
  attachPageListeners();
}

function attachNavListeners() {
  document.querySelectorAll("[data-nav]").forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      navigate(el.dataset.nav);
    });
  });
}

function attachPageListeners() {
  switch (currentPage) {
    case "landing": attachLandingListeners(); break;
    case "signup": attachSignUpListeners(); break;
    case "signin": attachSignInListeners(); break;
    case "selectQuiz": attachSelectQuizListeners(); break;
    case "quiz": attachQuizListeners(); break;
    case "results": attachResultsListeners(); break;
    case "review": attachReviewListeners(); break;
  }
}

// ============================
// 1. LANDING PAGE
// ============================
function renderLandingPage() {
  return `
  <main>
    <!-- Hero -->
    <section class="max-w-5xl mx-auto mt-10 px-6">
      <div class="relative rounded-2xl overflow-hidden h-[420px] flex items-center justify-center"
           style="background: url('images/5_files/hero-bg.png') no-repeat center center/cover;">
        <div class="absolute inset-0 bg-black/30"></div>
        <div class="relative z-10 text-center text-white px-6">
          <h2 class="text-4xl md:text-5xl font-bold mb-4">Welcome to QuizMaster</h2>
          <p class="text-base md:text-lg text-gray-200 max-w-xl mx-auto mb-8">
            Test your knowledge with our engaging quizzes. Compete with friends and climb the leaderboard. Start your quiz journey today!
          </p>
          <button id="getStartedBtn" class="bg-blue-500 hover:bg-blue-600 text-white px-7 py-3 rounded-lg font-medium transition shadow-lg hover:shadow-xl">
            Get Started
          </button>
        </div>
      </div>
    </section>

    <!-- Key Features -->
    <section class="max-w-5xl mx-auto mt-16 px-6 mb-20">
      <h3 class="text-2xl font-bold mb-2">Key Features</h3>
      <p class="text-gray-500 mb-8">Explore the exciting features that make QuizMaster the ultimate quiz app.</p>

      <div class="grid md:grid-cols-3 gap-6">
        <div class="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
          <div class="text-gray-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <h4 class="font-semibold mb-2">Timed Quizzes</h4>
          <p class="text-sm text-gray-500">Challenge yourself with timed quizzes to test your speed and accuracy.</p>
        </div>
        <div class="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
          <div class="text-gray-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 7 7 7 7"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 17 7 17 7"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
          </div>
          <h4 class="font-semibold mb-2">Leaderboard</h4>
          <p class="text-sm text-gray-500">Compete with friends and other users to see who can achieve the highest scores.</p>
        </div>
        <div class="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
          <div class="text-gray-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 12-4-4v3H3v2h15v3z"/></svg>
          </div>
          <h4 class="font-semibold mb-2">Progress Tracking</h4>
          <p class="text-sm text-gray-500">Track your progress and see how you improve over time with detailed performance reports.</p>
        </div>
      </div>
    </section>
  </main>`;
}

function attachLandingListeners() {
  const btn = $("#getStartedBtn");
  if (btn) {
    btn.addEventListener("click", () => {
      if (currentUser) navigate("selectQuiz");
      else navigate("signup");
    });
  }
}

// ============================
// 2. SIGN UP PAGE
// ============================
function renderSignUpPage() {
  return `
  <main class="max-w-lg mx-auto mt-16 px-6">
    <h2 class="text-2xl font-bold text-center mb-8">Create your account</h2>
    <form id="signupForm" class="space-y-5">
      <input id="signupName" type="text" placeholder="Full Name"
        class="w-full px-4 py-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 transition" />
      <input id="signupEmail" type="email" placeholder="Email"
        class="w-full px-4 py-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 transition" />
      <input id="signupPassword" type="password" placeholder="Password"
        class="w-full px-4 py-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 transition" />
      <input id="signupConfirm" type="password" placeholder="Confirm Password"
        class="w-full px-4 py-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 transition" />
      <p id="signupError" class="text-red-500 text-sm hidden"></p>
      <button type="submit" class="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium transition">
        Sign Up
      </button>
    </form>
    <p class="text-center text-sm text-gray-500 mt-4">
      Already have an account? <a href="#" id="goToSignIn" class="text-blue-500 hover:underline">Sign In</a>
    </p>
  </main>`;
}

function attachSignUpListeners() {
  $("#signupForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#signupName").value.trim();
    const email = $("#signupEmail").value.trim();
    const password = $("#signupPassword").value;
    const confirm = $("#signupConfirm").value;
    const errEl = $("#signupError");

    if (!name || !email || !password || !confirm) {
      errEl.textContent = "All fields are required.";
      errEl.classList.remove("hidden");
      return;
    }
    if (password !== confirm) {
      errEl.textContent = "Passwords do not match.";
      errEl.classList.remove("hidden");
      return;
    }
    if (password.length < 6) {
      errEl.textContent = "Password must be at least 6 characters.";
      errEl.classList.remove("hidden");
      return;
    }

    // Check existing users
    const users = JSON.parse(localStorage.getItem("quizmaster_users") || "[]");
    if (users.find(u => u.email === email)) {
      errEl.textContent = "An account with this email already exists.";
      errEl.classList.remove("hidden");
      return;
    }

    // Register
    const user = { name, email, password, joinDate: new Date().toISOString().split("T")[0] };
    users.push(user);
    localStorage.setItem("quizmaster_users", JSON.stringify(users));

    // Auto-login
    currentUser = user;
    localStorage.setItem("quizmaster_user", JSON.stringify(user));
    navigate("selectQuiz");
  });

  $("#goToSignIn").addEventListener("click", (e) => {
    e.preventDefault();
    navigate("signin");
  });
}

// ============================
// 3. SIGN IN PAGE
// ============================
function renderSignInPage() {
  return `
  <main class="max-w-md mx-auto mt-16 px-6">
    <h2 class="text-2xl font-bold text-center mb-6">Welcome back</h2>
    <form id="signinForm" class="space-y-5">
      <input id="signinEmail" type="email" placeholder="Email"
        class="w-full px-4 py-4 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition" />
      <input id="signinPassword" type="password" placeholder="Password"
        class="w-full px-4 py-4 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition" />
      <p class="text-sm text-gray-500 cursor-pointer hover:text-gray-700">Forgot password?</p>
      <p id="signinError" class="text-red-500 text-sm hidden"></p>
      <button type="submit" class="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium transition">
        Log in
      </button>
    </form>
    <p class="text-center text-sm text-gray-500 mt-4">
      Don't have an account? <a href="#" id="goToSignUp" class="text-blue-500 hover:underline">Sign up</a>
    </p>
  </main>`;
}

function attachSignInListeners() {
  $("#signinForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("#signinEmail").value.trim();
    const password = $("#signinPassword").value;
    const errEl = $("#signinError");

    const users = JSON.parse(localStorage.getItem("quizmaster_users") || "[]");
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      errEl.textContent = "Invalid email or password.";
      errEl.classList.remove("hidden");
      return;
    }

    currentUser = user;
    localStorage.setItem("quizmaster_user", JSON.stringify(user));
    navigate("selectQuiz");
  });

  $("#goToSignUp").addEventListener("click", (e) => {
    e.preventDefault();
    navigate("signup");
  });
}

// ============================
// 4. PROFILE PAGE
// ============================
function renderProfilePage() {
  if (!currentUser) { navigate("signin"); return ""; }

  const history = getQuizHistory();
  const totalAttempted = history.length;

  const historyRows = history.length > 0
    ? history.map(h => `
        <tr class="border-t border-gray-100">
          <td class="py-4 px-4 text-gray-700">${h.quizName}</td>
          <td class="py-4 px-4 text-blue-500">${h.score}/${h.total * 10}</td>
          <td class="py-4 px-4 text-blue-500">${h.date}</td>
        </tr>`).join("")
    : `<tr><td colspan="3" class="py-6 text-center text-gray-400">No quizzes taken yet.</td></tr>`;

  return `
  <main class="max-w-3xl mx-auto mt-10 px-6 pb-20">
    <!-- Avatar -->
    <div class="flex flex-col items-center mb-8">
      <div class="w-32 h-32 rounded-full bg-gradient-to-br from-amber-100 to-amber-300 flex items-center justify-center text-4xl font-bold text-amber-800 mb-4 ring-4 ring-amber-100">
        ${currentUser.name.charAt(0).toUpperCase()}
      </div>
      <h2 class="text-xl font-bold">${currentUser.name}</h2>
      <p class="text-blue-400 text-sm">Quiz Enthusiast</p>
      <p class="text-blue-400 text-sm">Joined ${currentUser.joinDate || '2024'}</p>
    </div>

    <!-- Tabs -->
    <div class="flex gap-6 border-b border-gray-200 mb-8">
      <button id="tabActivity" class="pb-2 text-sm text-blue-500 border-b-2 border-blue-500 font-medium">Activity</button>
      <button id="tabProfile" class="pb-2 text-sm text-gray-500 hover:text-black">Profile</button>
    </div>

    <!-- Tab Content -->
    <div id="profileTabContent">
      ${renderActivityTab(history)}
    </div>

    <!-- Logout -->
    <div class="mt-10 text-center">
      <button id="logoutBtn" class="text-red-500 hover:text-red-600 font-medium text-sm">Sign Out</button>
    </div>
  </main>`;
}

function renderActivityTab(history) {
  const historyRows = history.length > 0
    ? history.map(h => `
        <tr class="border-t border-gray-100">
          <td class="py-4 px-4 text-gray-700">${h.quizName}</td>
          <td class="py-4 px-4 text-blue-500">${h.score}/${h.total * 10}</td>
          <td class="py-4 px-4 text-blue-500">${h.date}</td>
        </tr>`).join("")
    : `<tr><td colspan="3" class="py-6 text-center text-gray-400">No quizzes taken yet.</td></tr>`;

  return `
    <div>
      <h3 class="text-xl font-bold mb-2">Personal Information</h3>
      <div class="border-t border-gray-200 pt-4 mb-6">
        <div class="grid grid-cols-2 gap-8">
          <div class="border-t-2 border-blue-400 pt-3">
            <p class="text-blue-400 text-sm mb-1">Name</p>
            <p class="text-gray-800">${currentUser.name}</p>
          </div>
          <div class="border-t-2 border-blue-400 pt-3">
            <p class="text-blue-400 text-sm mb-1">Email</p>
            <p class="text-gray-800">${currentUser.email}</p>
          </div>
        </div>
        <div class="mt-6 border-t-2 border-blue-400 pt-3 max-w-xs">
          <p class="text-blue-400 text-sm mb-1">Bio</p>
          <p class="text-gray-800">Avid quiz taker and trivia lover. Always up for a challenge!</p>
        </div>
      </div>

      <h3 class="text-xl font-bold mb-4">Quiz History</h3>
      <div class="border border-gray-200 rounded-xl overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50">
              <th class="text-left py-3 px-4 font-medium text-gray-600">Quiz Name</th>
              <th class="text-left py-3 px-4 font-medium text-gray-600">Score</th>
              <th class="text-left py-3 px-4 font-medium text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody>
            ${historyRows}
          </tbody>
        </table>
      </div>
    </div>`;
}

function attachProfileListeners() {
  const logoutBtn = $("#logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      currentUser = null;
      localStorage.removeItem("quizmaster_user");
      navigate("landing");
    });
  }

  const tabActivity = $("#tabActivity");
  const tabProfile = $("#tabProfile");
  if (tabActivity && tabProfile) {
    tabActivity.addEventListener("click", () => {
      tabActivity.classList.add("text-blue-500", "border-b-2", "border-blue-500", "font-medium");
      tabActivity.classList.remove("text-gray-500");
      tabProfile.classList.remove("text-blue-500", "border-b-2", "border-blue-500", "font-medium");
      tabProfile.classList.add("text-gray-500");
      $("#profileTabContent").innerHTML = renderActivityTab(getQuizHistory());
    });
    tabProfile.addEventListener("click", () => {
      tabProfile.classList.add("text-blue-500", "border-b-2", "border-blue-500", "font-medium");
      tabProfile.classList.remove("text-gray-500");
      tabActivity.classList.remove("text-blue-500", "border-b-2", "border-blue-500", "font-medium");
      tabActivity.classList.add("text-gray-500");
      $("#profileTabContent").innerHTML = `
        <div>
          <h3 class="text-xl font-bold mb-4">Profile Settings</h3>
          <p class="text-gray-500 text-sm">Total Quizzes Attempted: <span class="font-bold text-gray-800">${getQuizHistory().length}</span></p>
          <p class="text-gray-500 text-sm mt-2">Member since: <span class="font-bold text-gray-800">${currentUser.joinDate || '2024'}</span></p>
        </div>`;
    });
  }
}

// Override the generic attachPageListeners for profile
const _origAttach = attachPageListeners;
// We handle profile separately in page listeners

// ============================
// 5. SELECT QUIZ PAGE
// ============================
function renderSelectQuizPage() {
  if (!currentUser) { navigate("signin"); return ""; }

  const featured = quizzes.filter(q => q.featured);

  const featuredCards = featured.map(q => `
    <div class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer quiz-card" data-quiz-id="${q.id}">
      <img src="${q.image}" class="h-36 w-full object-cover" alt="${q.featuredTitle}" />
      <div class="p-4">
        <h4 class="font-semibold text-sm">${q.featuredTitle}</h4>
        <p class="text-xs text-gray-500 mt-1">${q.featuredDesc}</p>
      </div>
    </div>`).join("");

  const allQuizRows = quizzes.map(q => `
    <div class="flex justify-between items-center py-4 cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition quiz-card" data-quiz-id="${q.id}">
      <div>
        <h4 class="font-semibold">${q.title}</h4>
        <p class="text-sm text-gray-500">${q.description}</p>
      </div>
      <img src="${q.image}" class="w-52 h-28 object-cover rounded-lg ml-6 flex-shrink-0" alt="${q.title}" />
    </div>`).join("");

  const categories = ["All", ...new Set(quizzes.map(q => q.category))];
  const filterBtns = categories.map(c => `
    <button class="filter-btn px-4 py-1.5 rounded-lg text-sm border border-gray-200 hover:bg-gray-100 transition ${c === 'All' ? 'bg-gray-900 text-white border-gray-900' : ''}" data-category="${c}">
      ${c}
    </button>`).join("");

  return `
  <main class="max-w-5xl mx-auto px-6 py-10 pb-20">
    <h2 class="text-3xl font-bold mb-6">Select a Quiz</h2>

    <div class="flex gap-3 mb-10 flex-wrap">${filterBtns}</div>

    <h3 class="text-lg font-semibold mb-4">Featured Quizzes</h3>
    <div class="grid md:grid-cols-3 gap-6 mb-12" id="featuredGrid">${featuredCards}</div>

    <h3 class="text-lg font-semibold mb-4">All Quizzes</h3>
    <div class="space-y-2" id="allQuizzesGrid">${allQuizRows}</div>
  </main>`;
}

function attachSelectQuizListeners() {
  // Quiz card clicks
  document.querySelectorAll(".quiz-card").forEach(card => {
    card.addEventListener("click", () => {
      const quizId = parseInt(card.dataset.quizId);
      currentQuiz = quizzes.find(q => q.id === quizId);
      currentQuestionIndex = 0;
      userAnswers = new Array(currentQuiz.questions.length).fill(-1);
      timerSeconds = 30 * 60; // 30 minutes
      navigate("quiz");
    });
  });

  // Filter buttons
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.category;

      // Update active style
      document.querySelectorAll(".filter-btn").forEach(b => {
        b.classList.remove("bg-gray-900", "text-white", "border-gray-900");
      });
      btn.classList.add("bg-gray-900", "text-white", "border-gray-900");

      // Filter quizzes
      const filtered = cat === "All" ? quizzes : quizzes.filter(q => q.category === cat);

      // Update featured
      const featuredFiltered = filtered.filter(q => q.featured);
      const featuredGrid = $("#featuredGrid");
      if (featuredGrid) {
        featuredGrid.innerHTML = featuredFiltered.map(q => `
          <div class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer quiz-card" data-quiz-id="${q.id}">
            <img src="${q.image}" class="h-36 w-full object-cover" alt="${q.featuredTitle}" />
            <div class="p-4">
              <h4 class="font-semibold text-sm">${q.featuredTitle}</h4>
              <p class="text-xs text-gray-500 mt-1">${q.featuredDesc}</p>
            </div>
          </div>`).join("") || '<p class="text-gray-400 text-sm">No featured quizzes in this category.</p>';
      }

      // Update all quizzes
      const allGrid = $("#allQuizzesGrid");
      if (allGrid) {
        allGrid.innerHTML = filtered.map(q => `
          <div class="flex justify-between items-center py-4 cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition quiz-card" data-quiz-id="${q.id}">
            <div>
              <h4 class="font-semibold">${q.title}</h4>
              <p class="text-sm text-gray-500">${q.description}</p>
            </div>
            <img src="${q.image}" class="w-52 h-28 object-cover rounded-lg ml-6 flex-shrink-0" alt="${q.title}" />
          </div>`).join("") || '<p class="text-gray-400 text-sm">No quizzes in this category.</p>';
      }

      // Re-attach quiz card listeners
      document.querySelectorAll(".quiz-card").forEach(card => {
        card.addEventListener("click", () => {
          const quizId = parseInt(card.dataset.quizId);
          currentQuiz = quizzes.find(q => q.id === quizId);
          currentQuestionIndex = 0;
          userAnswers = new Array(currentQuiz.questions.length).fill(-1);
          timerSeconds = 30 * 60;
          navigate("quiz");
        });
      });
    });
  });
}

// ============================
// 6. MCQ QUIZ PAGE
// ============================
function renderQuizPage() {
  if (!currentQuiz) { navigate("selectQuiz"); return ""; }

  const q = currentQuiz.questions[currentQuestionIndex];
  const total = currentQuiz.questions.length;
  const progress = ((currentQuestionIndex + 1) / total) * 100;

  const hours = Math.floor(timerSeconds / 3600);
  const minutes = Math.floor((timerSeconds % 3600) / 60);
  const seconds = timerSeconds % 60;

  const optionsHtml = q.options.map((opt, i) => `
    <label class="flex items-center gap-3 border border-gray-200 p-4 rounded-xl cursor-pointer hover:bg-gray-50 transition ${userAnswers[currentQuestionIndex] === i ? 'bg-gray-100 border-gray-400' : ''}">
      <input type="radio" name="quizOption" value="${i}" class="w-5 h-5 accent-gray-900" ${userAnswers[currentQuestionIndex] === i ? 'checked' : ''} />
      <span>${opt}</span>
    </label>`).join("");

  return `
  <main class="max-w-4xl mx-auto mt-8 px-6 pb-20">
    <!-- Progress -->
    <div class="mb-6">
      <p class="text-gray-700 mb-2 font-medium">Progress</p>
      <div class="w-full bg-gray-200 rounded-full h-2.5">
        <div class="bg-gray-900 h-2.5 rounded-full transition-all duration-500" style="width: ${progress}%"></div>
      </div>
      <p class="text-sm text-gray-500 mt-2">Question ${currentQuestionIndex + 1} of ${total}</p>
    </div>

    <!-- Timer -->
    <div class="grid grid-cols-3 gap-6 text-center mb-10">
      <div class="bg-gray-100 p-5 rounded-xl">
        <p id="timerHours" class="text-2xl font-bold">${String(hours).padStart(2, '0')}</p>
        <p class="text-sm text-gray-500 mt-1">Hours</p>
      </div>
      <div class="bg-gray-100 p-5 rounded-xl">
        <p id="timerMinutes" class="text-2xl font-bold">${String(minutes).padStart(2, '0')}</p>
        <p class="text-sm text-gray-500 mt-1">Minutes</p>
      </div>
      <div class="bg-gray-100 p-5 rounded-xl">
        <p id="timerSeconds" class="text-2xl font-bold">${String(seconds).padStart(2, '0')}</p>
        <p class="text-sm text-gray-500 mt-1">Seconds</p>
      </div>
    </div>

    <!-- Question -->
    <h2 class="text-2xl font-semibold mb-6">${q.q}</h2>

    <!-- Options -->
    <div class="space-y-4" id="optionsContainer">
      ${optionsHtml}
    </div>

    <!-- Nav Buttons -->
    <div class="flex justify-between mt-10">
      <button id="prevBtn" class="bg-gray-200 hover:bg-gray-300 px-6 py-2.5 rounded-lg font-medium transition ${currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}">
        Previous
      </button>
      <button id="nextBtn" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium transition">
        ${currentQuestionIndex === total - 1 ? 'Finish' : 'Next'}
      </button>
    </div>
  </main>`;
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timerSeconds--;
    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      finishQuiz();
      return;
    }
    const h = Math.floor(timerSeconds / 3600);
    const m = Math.floor((timerSeconds % 3600) / 60);
    const s = timerSeconds % 60;
    const hEl = $("#timerHours");
    const mEl = $("#timerMinutes");
    const sEl = $("#timerSeconds");
    if (hEl) hEl.textContent = String(h).padStart(2, '0');
    if (mEl) mEl.textContent = String(m).padStart(2, '0');
    if (sEl) sEl.textContent = String(s).padStart(2, '0');
  }, 1000);
}

function finishQuiz() {
  clearInterval(timerInterval);

  let score = 0;
  const incorrect = [];
  currentQuiz.questions.forEach((q, i) => {
    if (userAnswers[i] === q.answer) {
      score++;
    } else {
      incorrect.push({
        index: i,
        question: q.q,
        yourAnswer: userAnswers[i] >= 0 ? q.options[userAnswers[i]] : "Not answered",
        correctAnswer: q.options[q.answer]
      });
    }
  });

  const total = currentQuiz.questions.length;
  saveQuizResult(currentQuiz.title, score * 10, total, incorrect);

  navigate("results", { score, total, incorrect, quizTitle: currentQuiz.title });
}

function attachQuizListeners() {
  // Start timer
  startTimer();

  // Option selection
  document.querySelectorAll('input[name="quizOption"]').forEach(input => {
    input.addEventListener("change", () => {
      userAnswers[currentQuestionIndex] = parseInt(input.value);
      // Update UI
      document.querySelectorAll('#optionsContainer label').forEach((label, idx) => {
        if (idx === userAnswers[currentQuestionIndex]) {
          label.classList.add('bg-gray-100', 'border-gray-400');
        } else {
          label.classList.remove('bg-gray-100', 'border-gray-400');
        }
      });
    });
  });

  // Previous
  const prevBtn = $("#prevBtn");
  if (prevBtn && currentQuestionIndex > 0) {
    prevBtn.addEventListener("click", () => {
      currentQuestionIndex--;
      renderPage();
    });
  }

  // Next / Finish
  const nextBtn = $("#nextBtn");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        currentQuestionIndex++;
        // Re-render quiz page but keep timer going
        const app = getApp();
        app.innerHTML = renderNavbar("quiz") + renderQuizPage();
        attachNavListeners();
        attachQuizListeners();
      } else {
        finishQuiz();
      }
    });
  }
}

// ============================
// 7. RESULTS PAGE
// ============================
let lastResultData = null;

function renderResultsPage(data) {
  if (data) lastResultData = data;
  data = lastResultData;
  if (!data) { navigate("selectQuiz"); return ""; }

  const { score, total, incorrect, quizTitle } = data;
  const percentage = Math.round((score / total) * 100);

  let message = "";
  if (percentage >= 80) message = `Congratulations, ${currentUser.name}! You've completed the quiz with a score of ${score} out of ${total}. Your performance indicates a strong understanding of the subject matter. Keep up the excellent work!`;
  else if (percentage >= 50) message = `Good job, ${currentUser.name}! You scored ${score} out of ${total}. There's room for improvement, but you're on the right track!`;
  else message = `${currentUser.name}, you scored ${score} out of ${total}. Keep practicing and you'll improve. Review the incorrect answers to learn more!`;

  return `
  <main class="max-w-3xl mx-auto mt-16 px-6 text-center pb-20">
    <h2 class="text-3xl font-bold mb-10">Quiz Results</h2>

    <div class="mb-8">
      <div class="flex justify-between text-sm text-gray-600 mb-2">
        <span>Quiz Completed</span>
        <span>100%</span>
      </div>
      <div class="w-full bg-gray-200 h-2.5 rounded-full">
        <div class="bg-gray-900 h-2.5 rounded-full w-full"></div>
      </div>
    </div>

    <div class="bg-gray-100 rounded-xl p-6 text-left mb-8">
      <p class="text-gray-500 text-sm">Score</p>
      <h3 class="text-3xl font-bold mt-1">${score}/${total}</h3>
    </div>

    <p class="text-gray-600 max-w-2xl mx-auto mb-10">${message}</p>

    <div class="flex flex-col items-center gap-4">
      <button id="reviewAnswersBtn" class="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition">
        Review Answers
      </button>
      <button id="takeAnotherBtn" class="bg-gray-200 hover:bg-gray-300 px-8 py-3 rounded-lg font-medium transition">
        Take Another Quiz
      </button>
    </div>
  </main>`;
}

function attachResultsListeners() {
  const reviewBtn = $("#reviewAnswersBtn");
  if (reviewBtn) {
    reviewBtn.addEventListener("click", () => {
      navigate("review", lastResultData);
    });
  }

  const anotherBtn = $("#takeAnotherBtn");
  if (anotherBtn) {
    anotherBtn.addEventListener("click", () => {
      currentQuiz = null;
      navigate("selectQuiz");
    });
  }
}

// ============================
// 8. REVIEW INCORRECT ANSWERS PAGE
// ============================
let lastReviewData = null;

function renderReviewPage(data) {
  if (data) lastReviewData = data;
  data = lastReviewData;
  if (!data) { navigate("selectQuiz"); return ""; }

  const { incorrect } = data;

  const questionsHtml = incorrect.length > 0
    ? incorrect.map((item, i) => `
        <div class="mb-8">
          <h3 class="font-semibold text-lg mb-2">Question ${i + 1}</h3>
          <p class="text-gray-700 mb-2">${item.question}</p>
          <p class="text-gray-500 mb-1">Your answer: <span class="font-medium text-gray-800">${item.yourAnswer}</span></p>
          <p class="text-gray-500">Correct answer: <span class="font-medium text-gray-800">${item.correctAnswer}</span></p>
        </div>`).join("")
    : `<p class="text-gray-500 text-center py-8">🎉 You got all answers correct! No incorrect answers to review.</p>`;

  return `
  <main class="max-w-3xl mx-auto py-16 px-6 pb-20">
    <h2 class="text-3xl font-bold mb-10">Review Incorrect Answers</h2>
    ${questionsHtml}
    <div class="flex justify-end mt-8">
      <button id="backToQuizzesBtn" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium transition">
        Back to Quizzes
      </button>
    </div>
  </main>`;
}

function attachReviewListeners() {
  const btn = $("#backToQuizzesBtn");
  if (btn) {
    btn.addEventListener("click", () => {
      currentQuiz = null;
      navigate("selectQuiz");
    });
  }
}

// ---- Fix attachPageListeners to include profile ----
function attachPageListeners() {
  switch (currentPage) {
    case "landing": attachLandingListeners(); break;
    case "signup": attachSignUpListeners(); break;
    case "signin": attachSignInListeners(); break;
    case "profile": attachProfileListeners(); break;
    case "selectQuiz": attachSelectQuizListeners(); break;
    case "quiz": attachQuizListeners(); break;
    case "results": attachResultsListeners(); break;
    case "review": attachReviewListeners(); break;
  }
}

// ---- Init ----
document.addEventListener("DOMContentLoaded", () => {
  // If user is logged in, show landing; else landing
  navigate("landing");
});
