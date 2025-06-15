// Authentication System
class AuthSystem {
  constructor() {
    this.init()
  }

  init() {
    // Check if user is already authenticated on protected pages
    this.checkAuthOnProtectedPages()

    // Initialize form handlers
    this.initializeSignupForm()
    this.initializeLoginForm()
    this.initializeForgotPasswordForm()
    this.initializePasswordToggles()
    this.initializeModalHandlers()
  }

  // Check authentication for protected pages
  checkAuthOnProtectedPages() {
    const currentPage = window.location.pathname.split("/").pop()
    const protectedPages = [
      "dashboard.html",
      "dashboard.html",
      "courses.html",
      "communities.html",
      "profile.html",
      "settings.html",
      "messages.html",
      "notifications.html",
      "achievements.html",
      "projects.html",
      "help.html",
      "explore.html",
      "calendar.html",
      "course-detail.html",
      "project-detail.html",
      "community-detail.html",
    ]

    if (protectedPages.includes(currentPage)) {
      const user = this.getCurrentUser()
      if (!user) {
        this.showToast("Please log in to access this page", "warning")
        setTimeout(() => {
          window.location.href = "login.html"
        }, 1500)
        return
      }

      // Update UI with user data
      this.updateUIWithUserData(user)
    }
  }

  // Initialize signup form
  initializeSignupForm() {
    const signupForm = document.getElementById("signup-form")
    if (!signupForm) return

    const passwordInput = document.getElementById("password")
    const confirmPasswordInput = document.getElementById("confirm-password")

    // Real-time password strength checking
    if (passwordInput) {
      passwordInput.addEventListener("input", () => {
        this.checkPasswordStrength(passwordInput.value)
      })
    }

    // Real-time password confirmation checking
    if (confirmPasswordInput) {
      confirmPasswordInput.addEventListener("input", () => {
        this.validatePasswordConfirmation()
      })
    }

    // Form submission
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault()
      this.handleSignup(signupForm)
    })
  }

  // Initialize login form
  initializeLoginForm() {
    const loginForm = document.getElementById("login-form")
    if (!loginForm) return

    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()
      this.handleLogin(loginForm)
    })
  }

  // Initialize forgot password form
  initializeForgotPasswordForm() {
    const forgotPasswordLink = document.getElementById("forgot-password")
    const forgotPasswordModal = document.getElementById("forgot-password-modal")
    const forgotPasswordForm = document.getElementById("forgot-password-form")

    if (forgotPasswordLink && forgotPasswordModal) {
      forgotPasswordLink.addEventListener("click", (e) => {
        e.preventDefault()
        forgotPasswordModal.style.display = "flex"
      })
    }

    if (forgotPasswordForm) {
      forgotPasswordForm.addEventListener("submit", (e) => {
        e.preventDefault()
        this.handleForgotPassword(forgotPasswordForm)
      })
    }
  }

  // Initialize password toggle buttons
  initializePasswordToggles() {
    const passwordToggles = document.querySelectorAll(".password-toggle")

    passwordToggles.forEach((toggle) => {
      toggle.addEventListener("click", (e) => {
        e.preventDefault()
        const input = toggle.parentElement.querySelector("input")
        const icon = toggle.querySelector("i")

        if (input.type === "password") {
          input.type = "text"
          icon.classList.remove("fa-eye")
          icon.classList.add("fa-eye-slash")
        } else {
          input.type = "password"
          icon.classList.remove("fa-eye-slash")
          icon.classList.add("fa-eye")
        }
      })
    })
  }

  // Initialize modal handlers
  initializeModalHandlers() {
    const modals = document.querySelectorAll(".modal-overlay")
    const closeButtons = document.querySelectorAll(".modal-close")

    // Close modal when clicking overlay
    modals.forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.style.display = "none"
        }
      })
    })

    // Close modal when clicking close button
    closeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const modal = button.closest(".modal-overlay")
        if (modal) {
          modal.style.display = "none"
        }
      })
    })

    // Close modal with ESC key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        modals.forEach((modal) => {
          if (modal.style.display === "flex") {
            modal.style.display = "none"
          }
        })
      }
    })
  }

  // Handle signup
  async handleSignup(form) {
    const submitButton = document.getElementById("signup-btn")
    const formData = new FormData(form)
    const userData = Object.fromEntries(formData.entries())

    // Clear previous errors
    this.clearErrors()

    // Validate form
    if (!this.validateSignupForm(userData)) {
      return
    }

    // Show loading state
    this.setButtonLoading(submitButton, true)

    try {
      // Simulate API call
      await this.simulateAPICall(1500)

      // Check if user already exists
      const existingUsers = this.getStoredUsers()
      if (existingUsers.some((user) => user.email === userData.email)) {
        this.showError("email", "An account with this email already exists")
        this.setButtonLoading(submitButton, false)
        return
      }

      // Create user object
      const newUser = {
        id: Date.now().toString(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        fullName: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        password: userData.password, // In real app, this would be hashed
        skills: userData.skills || "",
        createdAt: new Date().toISOString(),
        isActive: true,
        profilePicture: "/placeholder.svg?height=40&width=40",
        bio: "",
        location: "",
        website: "",
        joinedCommunities: [],
        enrolledCourses: [],
        achievements: [],
        projects: [],
      }

      // Store user
      this.storeUser(newUser)
      this.setCurrentUser(newUser)

      // Show success message
      this.showToast("Account created successfully! Redirecting...", "success")

      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = "dashboard.html"
      }, 2000)
    } catch (error) {
      this.showToast("An error occurred. Please try again.", "error")
      this.setButtonLoading(submitButton, false)
    }
  }

  // Handle login
  async handleLogin(form) {
    const submitButton = document.getElementById("login-btn")
    const formData = new FormData(form)
    const loginData = Object.fromEntries(formData.entries())

    // Clear previous errors
    this.clearErrors()

    // Validate form
    if (!this.validateLoginForm(loginData)) {
      return
    }

    // Show loading state
    this.setButtonLoading(submitButton, true)

    try {
      // Simulate API call
      await this.simulateAPICall(1500)

      // Check credentials
      const users = this.getStoredUsers()
      const user = users.find((u) => u.email === loginData.email && u.password === loginData.password)

      if (!user) {
        this.showError("password", "Invalid email or password")
        this.setButtonLoading(submitButton, false)
        return
      }

      // Set current user
      this.setCurrentUser(user)

      // Handle remember me
      if (loginData.remember) {
        localStorage.setItem("rememberUser", "true")
      }

      // Show success message
      this.showToast(`Welcome back, ${user.firstName}!`, "success")

      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = "dashboard.html"
      }, 1500)
    } catch (error) {
      this.showToast("An error occurred. Please try again.", "error")
      this.setButtonLoading(submitButton, false)
    }
  }

  // Handle forgot password
  async handleForgotPassword(form) {
    const formData = new FormData(form)
    const email = formData.get("resetEmail")
    const submitButton = form.querySelector('button[type="submit"]')

    // Clear previous errors
    document.getElementById("reset-email-error").textContent = ""

    // Validate email
    if (!email || !this.validateEmail(email)) {
      this.showError("reset-email", "Please enter a valid email address")
      return
    }

    // Show loading state
    this.setButtonLoading(submitButton, true)

    try {
      // Simulate API call
      await this.simulateAPICall(2000)

      // Check if user exists
      const users = this.getStoredUsers()
      const userExists = users.some((user) => user.email === email)

      if (!userExists) {
        this.showError("reset-email", "No account found with this email address")
        this.setButtonLoading(submitButton, false)
        return
      }

      // Show success message
      this.showToast("Password reset link sent to your email!", "success")

      // Close modal
      document.getElementById("forgot-password-modal").style.display = "none"
      form.reset()
    } catch (error) {
      this.showToast("An error occurred. Please try again.", "error")
    } finally {
      this.setButtonLoading(submitButton, false)
    }
  }

  // Validate signup form
  validateSignupForm(data) {
    let isValid = true

    // First name validation
    if (!data.firstName || data.firstName.trim().length < 2) {
      this.showError("firstName", "First name must be at least 2 characters")
      isValid = false
    }

    // Last name validation
    if (!data.lastName || data.lastName.trim().length < 2) {
      this.showError("lastName", "Last name must be at least 2 characters")
      isValid = false
    }

    // Email validation
    if (!data.email || !this.validateEmail(data.email)) {
      this.showError("email", "Please enter a valid email address")
      isValid = false
    }

    // Password validation
    const passwordStrength = this.getPasswordStrength(data.password)
    if (passwordStrength.score < 3) {
      this.showError("password", "Password is too weak. Please follow the requirements.")
      isValid = false
    }

    // Confirm password validation
    if (data.password !== data.confirmPassword) {
      this.showError("confirmPassword", "Passwords do not match")
      isValid = false
    }

    // Terms validation
    if (!data.terms) {
      this.showError("terms", "You must agree to the terms and conditions")
      isValid = false
    }

    return isValid
  }

  // Validate login form
  validateLoginForm(data) {
    let isValid = true

    // Email validation
    if (!data.email || !this.validateEmail(data.email)) {
      this.showError("email", "Please enter a valid email address")
      isValid = false
    }

    // Password validation
    if (!data.password || data.password.length < 8) {
      this.showError("password", "Password must be at least 8 characters")
      isValid = false
    }

    return isValid
  }

  // Check password strength
  checkPasswordStrength(password) {
    const strengthData = this.getPasswordStrength(password)
    const strengthContainer = document.getElementById("password-strength")

    if (!strengthContainer) return

    if (password.length === 0) {
      strengthContainer.innerHTML = ""
      return
    }

    const strengthHTML = `
    <div class="strength-indicator">
      <div class="strength-bar strength-${strengthData.level}">
        <div class="strength-fill" style="width: ${(strengthData.score / 5) * 100}%"></div>
      </div>
      <span class="strength-text">${strengthData.text}</span>
    </div>
    ${strengthData.feedback.length > 0 ? `<div class="strength-requirements">Missing: ${strengthData.feedback.join(", ")}</div>` : ""}
  `

    strengthContainer.innerHTML = strengthHTML
  }

  // Get password strength
  getPasswordStrength(password) {
    let score = 0
    const feedback = []

    if (password.length >= 8) score++
    else feedback.push("at least 8 characters")

    if (/[a-z]/.test(password)) score++
    else feedback.push("lowercase letter")

    if (/[A-Z]/.test(password)) score++
    else feedback.push("uppercase letter")

    if (/[0-9]/.test(password)) score++
    else feedback.push("number")

    if (/[^A-Za-z0-9]/.test(password)) score++
    else feedback.push("special character")

    const levels = ["normal", "weak", "fair", "good", "strong", "very-strong"]
    const texts = ["normal", "Weak", "Fair", "Good", "Strong", "Very Strong"]

    // Fix the indexing - ensure we don't go out of bounds
    const levelIndex = Math.min(score, levels.length - 1)
    const textIndex = Math.min(score, texts.length - 1)

    return {
      score,
      level: levels[levelIndex],
      text: texts[textIndex],
      feedback,
    }
  }

  // Validate password confirmation
  validatePasswordConfirmation() {
    const password = document.getElementById("password").value
    const confirmPassword = document.getElementById("confirm-password").value
    const errorElement = document.getElementById("confirmPassword-error")

    if (confirmPassword && password !== confirmPassword) {
      errorElement.textContent = "Passwords do not match"
      document.getElementById("confirm-password").classList.add("error")
    } else {
      errorElement.textContent = ""
      document.getElementById("confirm-password").classList.remove("error")
      if (confirmPassword && password === confirmPassword) {
        document.getElementById("confirm-password").classList.add("success")
      }
    }
  }

  // Validate email format
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  // Show error message
  showError(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}-error`)
    const inputElement = document.getElementById(fieldName) || document.querySelector(`[name="${fieldName}"]`)

    if (errorElement) {
      errorElement.textContent = message
    }

    if (inputElement) {
      inputElement.classList.add("error")
    }
  }

  // Clear all errors
  clearErrors() {
    const errorElements = document.querySelectorAll(".error-message")
    const inputElements = document.querySelectorAll(".form-input")

    errorElements.forEach((element) => {
      element.textContent = ""
    })

    inputElements.forEach((element) => {
      element.classList.remove("error", "success")
    })
  }

  // Set button loading state
  setButtonLoading(button, loading) {
    if (loading) {
      button.classList.add("loading")
      button.disabled = true
    } else {
      button.classList.remove("loading")
      button.disabled = false
    }
  }

  // Show toast notification
  showToast(message, type = "info") {
    const toast = document.createElement("div")
    toast.className = `toast ${type}`

    const icons = {
      success: "fa-check-circle",
      error: "fa-exclamation-circle",
      warning: "fa-exclamation-triangle",
      info: "fa-info-circle",
    }

    toast.innerHTML = `
      <div class="toast-icon">
        <i class="fa-solid ${icons[type]}"></i>
      </div>
      <div class="toast-content">
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close">
        <i class="fa-solid fa-times"></i>
      </button>
    `

    document.body.appendChild(toast)

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    }, 5000)

    // Manual close
    toast.querySelector(".toast-close").addEventListener("click", () => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    })
  }

  // Storage methods
  getStoredUsers() {
    const users = localStorage.getItem("skillsync_users")
    return users ? JSON.parse(users) : []
  }

  storeUser(user) {
    const users = this.getStoredUsers()
    users.push(user)
    localStorage.setItem("skillsync_users", JSON.stringify(users))
  }

  getCurrentUser() {
    const user = sessionStorage.getItem("skillsync_current_user")
    return user ? JSON.parse(user) : null
  }

  setCurrentUser(user) {
    sessionStorage.setItem("skillsync_current_user", JSON.stringify(user))

    // Also store in localStorage if remember me is checked
    if (localStorage.getItem("rememberUser") === "true") {
      localStorage.setItem("skillsync_remembered_user", JSON.stringify(user))
    }
  }

  logout() {
    sessionStorage.removeItem("skillsync_current_user")
    localStorage.removeItem("rememberUser")
    localStorage.removeItem("skillsync_remembered_user")
    window.location.href = "login.html"
  }

  // Update UI with user data
  updateUIWithUserData(user) {
    // Update user name displays
    const userNameElements = document.querySelectorAll(".user-name, .username, .user-display-name")
    userNameElements.forEach((element) => {
      element.textContent = user.fullName || `${user.firstName} ${user.lastName}`
    })

    // Update user email displays
    const userEmailElements = document.querySelectorAll(".user-email")
    userEmailElements.forEach((element) => {
      element.textContent = user.email
    })

    // Update profile pictures
    const profilePicElements = document.querySelectorAll(".profile-pic, .user-avatar, .profile-picture")
    profilePicElements.forEach((element) => {
      if (element.tagName === "IMG") {
        element.src = user.profilePicture || "/placeholder.svg?height=40&width=40"
        element.alt = user.fullName || "User Avatar"
      }
    })

    // Update welcome messages
    const welcomeElements = document.querySelectorAll(".welcome-message")
    welcomeElements.forEach((element) => {
      element.textContent = `Welcome back, ${user.firstName}!`
    })
  }

  // Simulate API call
  simulateAPICall(delay = 1000) {
    return new Promise((resolve) => {
      setTimeout(resolve, delay)
    })
  }
}

// Initialize authentication system when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new AuthSystem()

  // Check for remembered user on login page
  if (window.location.pathname.includes("login.html")) {
    const rememberedUser = localStorage.getItem("skillsync_remembered_user")
    if (rememberedUser) {
      const user = JSON.parse(rememberedUser)
      sessionStorage.setItem("skillsync_current_user", JSON.stringify(user))
      window.location.href = "dashboard.html"
    }
  }
})

// Global logout function for other pages
window.logout = () => {
  const authSystem = new AuthSystem()
  authSystem.logout()
}

// Global function to get current user for other pages
window.getCurrentUser = () => {
  const authSystem = new AuthSystem()
  return authSystem.getCurrentUser()
}

// Global function to update user data
window.updateCurrentUser = (userData) => {
  const authSystem = new AuthSystem()
  const currentUser = authSystem.getCurrentUser()
  if (currentUser) {
    const updatedUser = { ...currentUser, ...userData }
    sessionStorage.setItem("skillsync_current_user", JSON.stringify(updatedUser))

    // Update stored users array
    const users = authSystem.getStoredUsers()
    const userIndex = users.findIndex((u) => u.id === updatedUser.id)
    if (userIndex !== -1) {
      users[userIndex] = updatedUser
      localStorage.setItem("skillsync_users", JSON.stringify(users))
    }

    // Update UI
    authSystem.updateUIWithUserData(updatedUser)
  }
}
