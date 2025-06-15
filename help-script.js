// Help & Support Page JavaScript
document.addEventListener("DOMContentLoaded", () => {
    // Initialize help page functionality
    initializeFAQ()
    initializeSearch()
    initializeContactModals()
    initializeGuidesModal()
    initializeCommunityLinks()
    initializeSidebar()
    initializeDropdown()
  })
  
  // FAQ Functionality
  function initializeFAQ() {
    const faqItems = document.querySelectorAll(".faq-item")
  
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question")
      const toggle = item.querySelector(".faq-toggle")
  
      question.addEventListener("click", () => {
        const isActive = item.classList.contains("active")
  
        // Close all other FAQ items
        faqItems.forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.classList.remove("active")
            const otherToggle = otherItem.querySelector(".faq-toggle i")
            otherToggle.classList.remove("fa-chevron-up")
            otherToggle.classList.add("fa-chevron-down")
          }
        })
  
        // Toggle current item
        if (isActive) {
          item.classList.remove("active")
          toggle.querySelector("i").classList.remove("fa-chevron-up")
          toggle.querySelector("i").classList.add("fa-chevron-down")
        } else {
          item.classList.add("active")
          toggle.querySelector("i").classList.remove("fa-chevron-down")
          toggle.querySelector("i").classList.add("fa-chevron-up")
        }
      })
    })
  }
  
  // Search Functionality
  function initializeSearch() {
    const searchForm = document.getElementById("help-search-form")
    const searchInput = document.getElementById("help-search-input")
    const searchResults = document.getElementById("search-results")
    const searchResultsContent = document.getElementById("search-results-content")
    const closeSearchBtn = document.getElementById("close-search-btn")
  
    // Search data
    const searchData = [
      {
        title: "How to reset password",
        description: "Learn how to reset your password if you've forgotten it",
        category: "Account",
        content: "password reset forgot login",
      },
      {
        title: "Enrolling in courses",
        description: "Step-by-step guide to enroll in courses",
        category: "Courses",
        content: "enroll course registration sign up",
      },
      {
        title: "Tracking progress",
        description: "How to monitor your learning progress",
        category: "Progress",
        content: "progress track dashboard completion",
      },
      {
        title: "Getting certificates",
        description: "How to earn and download certificates",
        category: "Certificates",
        content: "certificate completion download share",
      },
      {
        title: "Canceling subscription",
        description: "How to cancel your subscription",
        category: "Billing",
        content: "cancel subscription billing payment",
      },
      {
        title: "Joining communities",
        description: "How to find and join learning communities",
        category: "Communities",
        content: "join community group discussion forum",
      },
      {
        title: "Browser compatibility",
        description: "Supported browsers and system requirements",
        category: "Technical",
        content: "browser support chrome firefox safari edge",
      },
      {
        title: "Mobile app availability",
        description: "Information about mobile applications",
        category: "Mobile",
        content: "mobile app ios android phone tablet",
      },
      {
        title: "Account security",
        description: "How to secure your account and enable 2FA",
        category: "Security",
        content: "security two factor authentication 2fa password",
      },
      {
        title: "Profile settings",
        description: "How to update your profile information",
        category: "Profile",
        content: "profile settings update information personal",
      },
    ]
  
    // Search form submission
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault()
      performSearch()
    })
  
    // Real-time search as user types
    searchInput.addEventListener("input", debounce(performSearch, 300))
  
    // Close search results
    closeSearchBtn.addEventListener("click", () => {
      searchResults.style.display = "none"
      searchInput.value = ""
    })
  
    // Close search when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".help-search")) {
        searchResults.style.display = "none"
      }
    })
  
    function performSearch() {
      const query = searchInput.value.trim().toLowerCase()
  
      if (query.length === 0) {
        searchResults.style.display = "none"
        return
      }
  
      const results = searchData.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.content.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query),
      )
  
      displaySearchResults(results, query)
    }
  
    function displaySearchResults(results, query) {
      if (results.length === 0) {
        searchResultsContent.innerHTML = `
          <div class="no-results">
            <i class="fa-solid fa-search" style="font-size: 2rem; color: var(--muted-foreground); margin-bottom: 1rem;"></i>
            <p>No results found for "${query}"</p>
            <p style="font-size: 0.875rem; margin-top: 0.5rem;">Try different keywords or browse our help categories below.</p>
          </div>
        `
      } else {
        searchResultsContent.innerHTML = results
          .map(
            (result) => `
          <div class="search-result-item" onclick="handleSearchResultClick('${result.category.toLowerCase()}')">
            <div class="search-result-title">${highlightText(result.title, query)}</div>
            <div class="search-result-description">${highlightText(result.description, query)}</div>
            <div class="search-result-category">${result.category}</div>
          </div>
        `,
          )
          .join("")
      }
  
      searchResults.style.display = "block"
    }
  
    function highlightText(text, query) {
      const regex = new RegExp(`(${query})`, "gi")
      return text.replace(regex, '<mark style="background-color: yellow; padding: 0 2px;">$1</mark>')
    }
  
    function handleSearchResultClick(category) {
      searchResults.style.display = "none"
      searchInput.value = ""
  
      // Scroll to relevant FAQ or section
      const faqItems = document.querySelectorAll(".faq-item")
      const relevantFaq = Array.from(faqItems).find((item) => item.dataset.category === category)
  
      if (relevantFaq) {
        relevantFaq.scrollIntoView({ behavior: "smooth" })
        relevantFaq.querySelector(".faq-question").click()
        showToast("Found relevant information!")
      }
    }
  }
  
  // Contact Modals Functionality
  function initializeContactModals() {
    // Live Chat Modal
    const startChatBtn = document.getElementById("start-chat-btn")
    const chatModalOverlay = document.getElementById("chat-modal-overlay")
    const closeChatModal = document.getElementById("close-chat-modal")
    const chatInput = document.getElementById("chat-input")
    const chatSendBtn = document.getElementById("chat-send-btn")
    const chatMessages = document.getElementById("chat-messages")
  
    startChatBtn.addEventListener("click", () => {
      chatModalOverlay.classList.add("active")
      chatInput.focus()
    })
  
    closeChatModal.addEventListener("click", () => {
      chatModalOverlay.classList.remove("active")
    })
  
    // Chat functionality
    chatSendBtn.addEventListener("click", sendChatMessage)
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendChatMessage()
      }
    })
  
    function sendChatMessage() {
      const message = chatInput.value.trim()
      if (!message) return
  
      // Add user message
      addChatMessage(message, "user")
      chatInput.value = ""
  
      // Simulate support response
      setTimeout(
        () => {
          const responses = [
            "Thank you for your message. I'm here to help!",
            "I understand your concern. Let me assist you with that.",
            "That's a great question! Here's what I can tell you...",
            "I'd be happy to help you resolve this issue.",
            "Let me check that information for you right away.",
          ]
          const randomResponse = responses[Math.floor(Math.random() * responses.length)]
          addChatMessage(randomResponse, "support")
        },
        1000 + Math.random() * 2000,
      )
    }
  
    function addChatMessage(message, sender) {
      const messageDiv = document.createElement("div")
      messageDiv.className = `chat-message ${sender}-message`
  
      const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  
      messageDiv.innerHTML = `
        <div class="message-avatar">
          ${sender === "user" ? '<i class="fa-solid fa-user"></i>' : '<i class="fa-solid fa-headset"></i>'}
        </div>
        <div class="message-content">
          <div class="message-header">
            <span class="message-sender">${sender === "user" ? "You" : "Support Agent"}</span>
            <span class="message-time">${currentTime}</span>
          </div>
          <div class="message-text">${message}</div>
        </div>
      `
  
      chatMessages.appendChild(messageDiv)
      chatMessages.scrollTop = chatMessages.scrollHeight
    }
  
    // Email Support Modal
    const sendEmailBtn = document.getElementById("send-email-btn")
    const emailModalOverlay = document.getElementById("email-modal-overlay")
    const closeEmailModal = document.getElementById("close-email-modal")
    const cancelEmailBtn = document.getElementById("cancel-email-btn")
    const emailSupportForm = document.getElementById("email-support-form")
  
    sendEmailBtn.addEventListener("click", () => {
      emailModalOverlay.classList.add("active")
    })
  
    closeEmailModal.addEventListener("click", () => {
      emailModalOverlay.classList.remove("active")
    })
  
    cancelEmailBtn.addEventListener("click", () => {
      emailModalOverlay.classList.remove("active")
    })
  
    emailSupportForm.addEventListener("submit", (e) => {
      e.preventDefault()
  
      const formData = new FormData(emailSupportForm)
      const emailData = {
        subject: formData.get("subject"),
        category: formData.get("category"),
        message: formData.get("message"),
      }
  
      // Simulate email sending
      setTimeout(() => {
        showToast("Email sent successfully! We'll respond within 24 hours.")
        emailModalOverlay.classList.remove("active")
        emailSupportForm.reset()
      }, 1000)
    })
  
    // Ticket Modal
    const createTicketBtn = document.getElementById("create-ticket-btn")
    const ticketModalOverlay = document.getElementById("ticket-modal-overlay")
    const closeTicketModal = document.getElementById("close-ticket-modal")
    const cancelTicketBtn = document.getElementById("cancel-ticket-btn")
    const ticketForm = document.getElementById("ticket-form")
  
    createTicketBtn.addEventListener("click", () => {
      ticketModalOverlay.classList.add("active")
    })
  
    closeTicketModal.addEventListener("click", () => {
      ticketModalOverlay.classList.remove("active")
    })
  
    cancelTicketBtn.addEventListener("click", () => {
      ticketModalOverlay.classList.remove("active")
    })
  
    ticketForm.addEventListener("submit", (e) => {
      e.preventDefault()
  
      const formData = new FormData(ticketForm)
      const ticketData = {
        title: formData.get("title"),
        priority: formData.get("priority"),
        category: formData.get("category"),
        description: formData.get("description"),
        attachment: formData.get("attachment"),
      }
  
      // Generate ticket ID
      const ticketId = "TK-" + Math.random().toString(36).substr(2, 9).toUpperCase()
  
      // Simulate ticket creation
      setTimeout(() => {
        showToast(`Support ticket ${ticketId} created successfully!`)
        ticketModalOverlay.classList.remove("active")
        ticketForm.reset()
      }, 1000)
    })
  
    // Close modals on overlay click
    ;[chatModalOverlay, emailModalOverlay, ticketModalOverlay].forEach((overlay) => {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          overlay.classList.remove("active")
        }
      })
    })
  
    // Close modals on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        ;[chatModalOverlay, emailModalOverlay, ticketModalOverlay].forEach((overlay) => {
          overlay.classList.remove("active")
        })
      }
    })
  }
  
  // Guides Modal Functionality
  function initializeGuidesModal() {
    const guidesModalOverlay = document.getElementById("guides-modal-overlay")
    const guidesModalTitle = document.getElementById("guides-modal-title")
    const guidesContent = document.getElementById("guides-content")
    const closeGuidesModal = document.getElementById("close-guides-modal")
    const categoryLinks = document.querySelectorAll("[data-guides]")
  
    // Guides data
    const guidesData = {
      "getting-started": {
        title: "Getting Started Guides",
        guides: [
          {
            title: "Welcome to SkillSync",
            description: "Learn the basics of navigating and using SkillSync platform",
          },
          {
            title: "Setting Up Your Profile",
            description: "Complete your profile to get personalized recommendations",
          },
          {
            title: "Finding Your First Course",
            description: "Discover courses that match your interests and skill level",
          },
          {
            title: "Understanding the Dashboard",
            description: "Navigate your learning dashboard and track progress",
          },
        ],
      },
      courses: {
        title: "Course Guides",
        guides: [
          {
            title: "How to Enroll in Courses",
            description: "Step-by-step guide to course enrollment",
          },
          {
            title: "Course Navigation",
            description: "Learn how to navigate through course content",
          },
          {
            title: "Submitting Assignments",
            description: "How to complete and submit course assignments",
          },
          {
            title: "Taking Quizzes and Exams",
            description: "Guidelines for assessments and examinations",
          },
        ],
      },
      communities: {
        title: "Community Guides",
        guides: [
          {
            title: "Joining Communities",
            description: "How to find and join learning communities",
          },
          {
            title: "Community Guidelines",
            description: "Rules and best practices for community participation",
          },
          {
            title: "Creating Discussions",
            description: "How to start meaningful discussions in communities",
          },
          {
            title: "Networking Tips",
            description: "Make the most of your community connections",
          },
        ],
      },
      billing: {
        title: "Billing & Payment Guides",
        guides: [
          {
            title: "Subscription Plans",
            description: "Understanding different subscription options",
          },
          {
            title: "Payment Methods",
            description: "How to add and manage payment methods",
          },
          {
            title: "Billing History",
            description: "View and download your billing statements",
          },
          {
            title: "Refund Policy",
            description: "Understanding our refund and cancellation policy",
          },
        ],
      },
      security: {
        title: "Account & Security Guides",
        guides: [
          {
            title: "Account Security Best Practices",
            description: "Keep your account safe and secure",
          },
          {
            title: "Two-Factor Authentication",
            description: "Enable 2FA for enhanced security",
          },
          {
            title: "Privacy Settings",
            description: "Manage your privacy and data sharing preferences",
          },
          {
            title: "Password Management",
            description: "Creating and managing strong passwords",
          },
        ],
      },
      certificates: {
        title: "Certificate Guides",
        guides: [
          {
            title: "Earning Certificates",
            description: "Requirements for earning course certificates",
          },
          {
            title: "Downloading Certificates",
            description: "How to download and save your certificates",
          },
          {
            title: "Sharing Certificates",
            description: "Share your achievements on social platforms",
          },
          {
            title: "Certificate Verification",
            description: "How others can verify your certificates",
          },
        ],
      },
    }
  
    categoryLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const category = link.dataset.guides
        showGuides(category)
      })
    })
  
    closeGuidesModal.addEventListener("click", () => {
      guidesModalOverlay.classList.remove("active")
    })
  
    guidesModalOverlay.addEventListener("click", (e) => {
      if (e.target === guidesModalOverlay) {
        guidesModalOverlay.classList.remove("active")
      }
    })
  
    function showGuides(category) {
      const data = guidesData[category]
      if (!data) return
  
      guidesModalTitle.textContent = data.title
      guidesContent.innerHTML = data.guides
        .map(
          (guide) => `
        <div class="guide-item" onclick="showToast('Opening: ${guide.title}')">
          <div class="guide-title">${guide.title}</div>
          <div class="guide-description">${guide.description}</div>
        </div>
      `,
        )
        .join("")
  
      guidesModalOverlay.classList.add("active")
    }
  }
  
  // Community Links Functionality
  function initializeCommunityLinks() {
    const discussionForumsLink = document.getElementById("discussion-forums-link")
    const discordCommunityLink = document.getElementById("discord-community-link")
    const featureRequestsLink = document.getElementById("feature-requests-link")
  
    discussionForumsLink.addEventListener("click", (e) => {
      e.preventDefault()
      showToast("Redirecting to Discussion Forums...")
      // In a real app, this would redirect to the forums
      setTimeout(() => {
        window.location.href = "communities.html"
      }, 1000)
    })
  
    discordCommunityLink.addEventListener("click", (e) => {
      e.preventDefault()
      showToast("Opening Discord Community...")
      // In a real app, this would open Discord
      setTimeout(() => {
        window.open("https://discord.gg/skillsync", "_blank")
      }, 1000)
    })
  
    featureRequestsLink.addEventListener("click", (e) => {
      e.preventDefault()
      showToast("Opening Feature Requests...")
      // In a real app, this would redirect to feature requests page
      setTimeout(() => {
        window.location.href = "communities.html"
      }, 1000)
    })
  }
  
  // Sidebar Functionality
  function initializeSidebar() {
    const sidebar = document.querySelector(".sidebar")
    const toggleBtn = document.querySelector(".sidebar-collapse-btn")
  
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed")
      })
    }
  
    document.querySelector("#sidebar-toggle-visibility")?.addEventListener("click", () => {
      sidebar.classList.toggle("visible")
    })
  }
  
  // Dropdown Functionality
  function initializeDropdown() {
    const dropdown = document.querySelector(".dropdown")
    const dropdownTrigger = document.querySelector(".dropdown-trigger")
  
    if (dropdownTrigger) {
      dropdownTrigger.addEventListener("click", (e) => {
        e.stopPropagation()
        dropdown.classList.toggle("active")
      })
  
      document.addEventListener("click", () => {
        dropdown.classList.remove("active")
      })
    }
  }
  
  // Utility Functions
  function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }
  
  function showToast(message, type = "success") {
    const toast = document.getElementById("toast")
    const toastMessage = toast.querySelector(".toast-message")
    const toastIcon = toast.querySelector(".toast-icon")
  
    toastMessage.textContent = message
  
    // Update icon based on type
    toastIcon.className = `toast-icon fa-solid ${
      type === "success" ? "fa-check-circle" : type === "error" ? "fa-exclamation-circle" : "fa-info-circle"
    }`
  
    toast.classList.add("show")
  
    setTimeout(() => {
      toast.classList.remove("show")
    }, 3000)
  }
  
  // Theme handling
  const theme = localStorage.getItem("theme")
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  if (theme === "dark" || (!theme && prefersDark)) {
    document.documentElement.classList.add("dark")
  } else {
    document.documentElement.classList.remove("dark")
  }
  