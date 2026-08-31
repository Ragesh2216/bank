// --- Authentication & Session Management ---

document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  
  // Page routing logic check (runs on load)
  if (currentPath.includes('admin-dashboard.html')) {
    checkAuth('admin');
  } else if (currentPath.includes('client-dashboard.html')) {
    checkAuth('client');
  }

  // --- SIGNUP PROCESS ---
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('signup-name').value.trim();
      const company = document.getElementById('signup-company').value.trim();
      const email = document.getElementById('signup-email').value.trim().toLowerCase();
      const password = document.getElementById('signup-password').value;
      const confirmPassword = document.getElementById('signup-confirm').value;

      // Validation
      if (!name || !company || !email || !password || !confirmPassword) {
        showError('Please fill out all fields.');
        return;
      }

      if (password !== confirmPassword) {
        showError('Passwords do not match.');
        return;
      }

      if (password.length < 6) {
        showError('Password must be at least 6 characters long.');
        return;
      }

      // Check if email already registered
      let users = JSON.parse(localStorage.getItem('corp_bank_users')) || [];
      if (users.some(user => user.email === email)) {
        showError('Email is already registered.');
        return;
      }

      // Save user
      users.push({ name, company, email, password });
      localStorage.setItem('corp_bank_users', JSON.stringify(users));

      // Show success and redirect
      showSuccess('Registration successful! Redirecting to login page...');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
    });
  }

  // --- LOGIN PROCESS ---
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const roleElement = document.querySelector('input[name="role"]:checked');
      if (!roleElement) {
        showError('Please select your portal access role (Admin or Client).');
        return;
      }
      
      const role = roleElement.value;
      const email = document.getElementById('login-email').value.trim().toLowerCase();
      const password = document.getElementById('login-password').value;

      if (!email || !password) {
        showError('Please enter your email and password.');
        return;
      }

      // Default Admin and Client fallback details for easy testing without signup
      let users = JSON.parse(localStorage.getItem('corp_bank_users')) || [];
      
      // Seed default accounts if empty
      if (users.length === 0) {
        users = [
          { email: 'admin@apex.com', password: 'adminpassword', name: 'Admin User', company: 'Apex Admin Group' },
          { email: 'client@company.com', password: 'clientpassword', name: 'Corporate CFO', company: 'Nexus Holdings' }
        ];
        localStorage.setItem('corp_bank_users', JSON.stringify(users));
      }

      // Authenticate
      let matchedUser = users.find(user => user.email === email && user.password === password);
      
      if (!matchedUser) {
        // Create user on the fly
        const prefix = email.split('@')[0];
        const nameParts = prefix.split(/[._-]/).map(part => part.charAt(0).toUpperCase() + part.slice(1));
        const name = nameParts.join(' ') || "Corporate User";
        const domain = email.split('@')[1] ? email.split('@')[1].split('.')[0] : "company";
        const company = domain.charAt(0).toUpperCase() + domain.slice(1) + " Holdings";
        matchedUser = { email, password, name, company };
        
        // Add to local storage users directory
        users.push(matchedUser);
        localStorage.setItem('corp_bank_users', JSON.stringify(users));
      }

      // Store session details
      const sessionUser = {
        email: matchedUser.email,
        name: matchedUser.name,
        company: matchedUser.company,
        role: role
      };
      
      localStorage.setItem('corp_bank_current_user', JSON.stringify(sessionUser));

      showSuccess('Login successful! Welcome to the portal.');
      
      setTimeout(() => {
        if (role === 'admin') {
          window.location.href = 'admin-dashboard.html';
        } else {
          window.location.href = 'client-dashboard.html';
        }
      }, 1500);
    });
  }

  // --- LOGOUT PROCESS ---
  const logoutBtns = document.querySelectorAll('.logout-trigger');
  if (logoutBtns) {
    logoutBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('corp_bank_current_user');
        window.location.href = 'login.html';
      });
    });
  }
});

// --- HELPER FUNCTIONS ---

function checkAuth(requiredRole) {
  const session = JSON.parse(localStorage.getItem('corp_bank_current_user'));
  
  if (!session) {
    window.location.href = '404.html';
    return;
  }
  
  if (session.role !== requiredRole) {
    window.location.href = '404.html';
    return;
  }

  // Output email dynamically to designated elements
  const emailPlaceholders = document.querySelectorAll('.user-email');
  if (emailPlaceholders) {
    emailPlaceholders.forEach(el => {
      el.textContent = session.email;
    });
  }

  const namePlaceholders = document.querySelectorAll('.user-name-display');
  if (namePlaceholders) {
    namePlaceholders.forEach(el => {
      el.textContent = session.name;
    });
  }

  const companyPlaceholders = document.querySelectorAll('.user-company-display');
  if (companyPlaceholders) {
    companyPlaceholders.forEach(el => {
      el.textContent = session.company;
    });
  }
}

function showError(msg) {
  const container = document.getElementById('alert-container');
  if (!container) {
    alert(msg);
    return;
  }
  container.className = 'alert-box alert-error';
  container.textContent = msg;
  container.style.display = 'block';
  
  setTimeout(() => {
    container.style.display = 'none';
  }, 5000);
}

function showSuccess(msg) {
  const container = document.getElementById('alert-container');
  if (!container) {
    console.log(msg);
    return;
  }
  container.className = 'alert-box alert-success';
  container.textContent = msg;
  container.style.display = 'block';
  
  setTimeout(() => {
    container.style.display = 'none';
  }, 5000);
}
