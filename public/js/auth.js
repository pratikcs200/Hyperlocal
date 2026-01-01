// Authentication utilities
class Auth {
  static getToken() {
    return localStorage.getItem('token');
  }

  static setToken(token) {
    localStorage.setItem('token', token);
  }

  static removeToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  static getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  static setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  static isAuthenticated() {
    return !!this.getToken();
  }

  static isAdmin() {
    const user = this.getUser();
    return user && user.role === 'admin';
  }

  static logout() {
    this.removeToken();
    document.body.classList.remove('authenticated');
    window.location.href = '/login.html';
  }

  // Make authenticated API requests
  static async apiRequest(url, options = {}) {
    const token = this.getToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (response.status === 401) {
        this.logout();
        return;
      }

      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
}

// Highlight current page in navigation
function highlightCurrentPage() {
  const currentPage = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname;
  const publicPages = ['/login.html', '/register.html', '/'];
  
  // Add authenticated class to body if user is logged in
  if (Auth.isAuthenticated()) {
    document.body.classList.add('authenticated');
  }
  
  // Redirect to login if not authenticated and not on public page
  if (!Auth.isAuthenticated() && !publicPages.includes(currentPage)) {
    window.location.href = '/login.html';
    return;
  }

  // Redirect to home if authenticated and on login/register page
  if (Auth.isAuthenticated() && (currentPage === '/login.html' || currentPage === '/register.html')) {
    window.location.href = '/';
    return;
  }

  // Update navigation based on auth status
  updateNavigation();
  
  // Highlight current page
  highlightCurrentPage();
});

function updateNavigation() {
  const userInfo = document.querySelector('.user-info');
  const navLinks = document.querySelector('.nav-links');
  
  if (!userInfo || !navLinks) return;

  if (Auth.isAuthenticated()) {
    const user = Auth.getUser();
    userInfo.innerHTML = `
      <span>Welcome, ${user.name}</span>
      <button class="btn-logout" onclick="Auth.logout()">Logout</button>
    `;
    
    // Show authenticated user links
    const authLinks = navLinks.querySelectorAll('li a[href="/cart.html"], li a[href="/orders.html"], li a[href="/chat.html"]');
    authLinks.forEach(link => {
      link.parentElement.style.display = 'block';
    });
    
    // Add admin link if user is admin
    if (Auth.isAdmin()) {
      const existingAdminLink = navLinks.querySelector('a[href="/admin.html"]');
      if (!existingAdminLink) {
        const adminLink = document.createElement('li');
        adminLink.innerHTML = '<a href="/admin.html">Admin</a>';
        navLinks.appendChild(adminLink);
      }
    }
  } else {
    userInfo.innerHTML = `
      <a href="/login.html" class="btn btn-primary">Login</a>
      <a href="/register.html" class="btn btn-secondary">Register</a>
    `;
    
    // Hide authenticated user links
    const authLinks = navLinks.querySelectorAll('li a[href="/cart.html"], li a[href="/orders.html"], li a[href="/chat.html"]');
    authLinks.forEach(link => {
      link.parentElement.style.display = 'none';
    });
  }
}

// Utility functions for UI
function showAlert(message, type = 'info') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  
  const container = document.querySelector('.container');
  if (container) {
    container.insertBefore(alertDiv, container.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      alertDiv.remove();
    }, 5000);
  }
}

// Show update notification
function showUpdateNotification(message, count = 1) {
  // Remove existing notification if any
  const existingNotification = document.querySelector('.update-notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  const notification = document.createElement('div');
  notification.className = 'update-notification show';
  notification.innerHTML = `
    <span>📢</span>
    <span>${message} ${count > 1 ? `(${count} new)` : ''}</span>
    <button class="close-btn" onclick="hideUpdateNotification()" aria-label="Close notification">&times;</button>
  `;
  
  // Add click handler to scroll to top and hide notification
  notification.addEventListener('click', (e) => {
    if (!e.target.classList.contains('close-btn')) {
      scrollToTopAndHighlight();
      hideUpdateNotification();
    }
  });
  
  document.body.appendChild(notification);
  
  // Auto hide after 10 seconds
  setTimeout(() => {
    hideUpdateNotification();
  }, 10000);
}

// Hide update notification
function hideUpdateNotification() {
  const notification = document.querySelector('.update-notification');
  if (notification) {
    notification.style.animation = 'slideDown 0.3s ease reverse';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }
}

// Scroll to top with highlight effect
function scrollToTopAndHighlight() {
  // Scroll to top smoothly
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  
  // Add highlight effect to the top section
  setTimeout(() => {
    const topSection = document.querySelector('.search-section') || document.querySelector('.main');
    if (topSection) {
      topSection.classList.add('scroll-to-top');
      setTimeout(() => {
        topSection.classList.remove('scroll-to-top');
      }, 2000);
    }
  }, 500);
}

function showLoading(element) {
  element.innerHTML = '<div class="loading"><div class="spinner"></div> Loading...</div>';
}

function hideLoading() {
  const loadingElements = document.querySelectorAll('.loading');
  loadingElements.forEach(el => el.remove());
}

// Get user's current location
function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      error => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

// Format price for display
function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(price);
}

// Generate star rating HTML
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  let starsHtml = '';
  
  for (let i = 0; i < fullStars; i++) {
    starsHtml += '★';
  }
  
  if (hasHalfStar) {
    starsHtml += '☆';
  }
  
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '☆';
  }
  
  return starsHtml;
}