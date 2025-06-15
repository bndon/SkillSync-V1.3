document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  const sidebar = document.querySelector(".sidebar")

  if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("active")
    })
  }

  // Dropdown functionality
  const dropdownTriggers = document.querySelectorAll(".dropdown-trigger")

  dropdownTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.stopPropagation()
      const dropdown = trigger.closest(".dropdown")

      // Close all other dropdowns
      document.querySelectorAll(".dropdown").forEach((d) => {
        if (d !== dropdown) {
          d.classList.remove("active")
        }
      })

      // Toggle current dropdown
      dropdown.classList.toggle("active")
    })
  })

  // Close dropdowns when clicking outside
  document.addEventListener("click", () => {
    document.querySelectorAll(".dropdown").forEach((dropdown) => {
      dropdown.classList.remove("active")
    })
  })

  // Handle dropdown item clicks
  const dropdownItems = document.querySelectorAll(".dropdown-item")
  dropdownItems.forEach((item) => {
    item.addEventListener("click", function () {
      // If it's a button (like logout) and not a link
      if (this.tagName === "BUTTON") {
        console.log("Logging out...")
        // Here you would typically make a request to your logout endpoint
        // After successful logout, redirect to login page
        window.location.href = "login.html"
      }

      // Find the parent dropdown element
      const dropdown = this.closest(".dropdown")

      // Close the dropdown after clicking an item
      if (dropdown) {
        dropdown.classList.remove("active")
      }
    })
  })

  // Handle notification button click
  const notificationBtn = document.querySelector(".notification-btn")
  if (notificationBtn) {
    notificationBtn.addEventListener("click", () => {
      console.log("Notifications clicked")
      window.location.href = "notifications.html"
    })
  }

  // Sidebar collapse functionality
  const sidebarCollapseBtn = document.querySelector(".sidebar-collapse-btn")

  if (sidebarCollapseBtn && sidebar) {
    sidebarCollapseBtn.addEventListener("click", () => {
      sidebar.classList.toggle("sidebar-collapsed")

      // Save sidebar state to localStorage
      const isCollapsed = sidebar.classList.contains("sidebar-collapsed")
      localStorage.setItem("sidebar-collapsed", isCollapsed)
    })

    // Check localStorage for sidebar state
    const isCollapsed = localStorage.getItem("sidebar-collapsed") === "true"
    if (isCollapsed) {
      sidebar.classList.add("sidebar-collapsed")
    }
  }

  const mainContent = document.querySelector(".main-content")

  // Mobile menu functionality
  const mobileMenuBtnOld = document.createElement("button")
  mobileMenuBtnOld.className = "mobile-menu"
  mobileMenuBtnOld.innerHTML = '<i class="fas fa-bars"></i>'
  mobileMenuBtnOld.setAttribute("aria-label", "Toggle Menu")

  const headerLeft = document.querySelector(".header-left")
  if (headerLeft) {
    headerLeft.prepend(mobileMenuBtnOld)
  }

  mobileMenuBtnOld.addEventListener("click", () => {
    sidebar.classList.add("mobile-visible")
  })

  // Add close button for mobile sidebar
  const mobileCloseBtn = document.createElement("button")
  mobileCloseBtn.className = "mobile-close"
  mobileCloseBtn.innerHTML = '<i class="fas fa-times"></i>'
  mobileCloseBtn.setAttribute("aria-label", "Close Menu")

  const sidebarHeader = document.querySelector(".sidebar-header")
  if (sidebarHeader) {
    sidebarHeader.appendChild(mobileCloseBtn)
  }

  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener("click", () => {
      sidebar.classList.remove("mobile-visible")
    })
  }

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      sidebar &&
      sidebar.classList.contains("mobile-visible") &&
      !sidebar.contains(e.target) &&
      !mobileMenuBtnOld.contains(e.target)
    ) {
      sidebar.classList.remove("mobile-visible")
    }
  })

  // Tab functionality (for pages with tabs)
  const tabButtons = document.querySelectorAll("[data-tab]")

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabId = this.dataset.tab

      // Remove active class from all tabs and content
      document.querySelectorAll("[data-tab]").forEach((tab) => {
        tab.classList.remove("active")
      })

      document.querySelectorAll(".tab-content").forEach((content) => {
        content.classList.remove("active")
      })

      // Add active class to clicked tab and corresponding content
      this.classList.add("active")
      const contentElement = document.getElementById(`${tabId}-content`)
      if (contentElement) {
        contentElement.classList.add("active")
      }
    })
  })

  // Profile tabs functionality
  const profileTabs = document.querySelectorAll(".profile-tab")

  profileTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const tabId = this.dataset.tab

      // Remove active class from all profile tabs and content
      document.querySelectorAll(".profile-tab").forEach((t) => {
        t.classList.remove("active")
      })

      document.querySelectorAll(".tab-content").forEach((content) => {
        content.classList.remove("active")
      })

      // Add active class to clicked profile tab and corresponding content
      this.classList.add("active")
      document.getElementById(`${tabId}-content`).classList.add("active")
    })
  })

  // Settings navigation functionality
  const settingsNavItems = document.querySelectorAll(".settings-nav-item")

  settingsNavItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault()

      const sectionId = this.getAttribute("href").substring(1)

      // Remove active class from all nav items and sections
      document.querySelectorAll(".settings-nav-item").forEach((navItem) => {
        navItem.classList.remove("active")
      })

      document.querySelectorAll(".settings-section").forEach((section) => {
        section.classList.remove("active")
      })

      // Add active class to clicked nav item and corresponding section
      this.classList.add("active")
      document.getElementById(sectionId).classList.add("active")
    })
  })

  // Handle search functionality
  const searchInput = document.querySelector(".search-input")
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault()
        const searchTerm = searchInput.value.trim()
        if (searchTerm) {
          console.log(`Searching for: ${searchTerm}`)
          // Here you would typically redirect to search results page
          // window.location.href = `search.html?q=${encodeURIComponent(searchTerm)}`;
        }
      }
    })
  }

  // Handle course enrollment
  const enrollButtons = document.querySelectorAll(".course-card .outline-btn")
  enrollButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      // Prevent default only if it's not a link with href
      if (!this.getAttribute("href")) {
        e.preventDefault()
        const courseName = this.closest(".course-card").querySelector("h4").textContent
        console.log(`Enrolling in course: ${courseName}`)
        // Here you would typically make a request to enroll in the course
        this.textContent = "Enrolled"
        this.disabled = true
      }
    })
  })

  // Handle resume learning button
  const resumeButton = document.querySelector(".welcome-card .primary-btn")
  if (resumeButton) {
    resumeButton.addEventListener("click", () => {
      console.log("Resuming learning")
      // Here you would typically redirect to the last accessed course
      window.location.href = "course-detail.html"
    })
  }

  // Check for saved theme preference
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme) {
    document.body.classList.add(savedTheme)
  }

  // Check for sidebar state preference
  const sidebarState = localStorage.getItem("sidebarCollapsed")
  if (sidebarState === "true") {
    sidebar.classList.add("collapsed")
    mainContent.classList.add("expanded")
  }

  // Save sidebar state when changed
  if (sidebarCollapseBtn) {
    sidebarCollapseBtn.addEventListener("click", () => {
      localStorage.setItem("sidebarCollapsed", sidebar.classList.contains("collapsed"))
    })
  }

  // Filter and sort dropdowns
  const filterBtn = document.querySelector(".filter-btn")
  const sortBtn = document.querySelector(".sort-btn")

  if (filterBtn) {
    filterBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      document.querySelector(".filter-dropdown").classList.toggle("active")
    })
  }

  if (sortBtn) {
    sortBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      document.querySelector(".sort-dropdown").classList.toggle("active")
    })
  }

  // Sort options functionality
  const sortOptions = document.querySelectorAll(".sort-option")

  sortOptions.forEach((option) => {
    option.addEventListener("click", function () {
      // Remove active class from all sort options
      document.querySelectorAll(".sort-option").forEach((opt) => {
        opt.classList.remove("active")
      })

      // Add active class to clicked sort option
      this.classList.add("active")

      // Close the dropdown
      document.querySelector(".sort-dropdown").classList.remove("active")

      // Here you would add logic to actually sort the items
    })
  })

  // Responsive adjustments
  function handleResponsive() {
    if (window.innerWidth <= 768) {
      if (sidebar && !sidebar.classList.contains("mobile-visible")) {
        sidebar.classList.remove("collapsed")
        mainContent.classList.remove("expanded")
      }
    }
  }

  // Run on load and resize
  handleResponsive()
  window.addEventListener("resize", handleResponsive)

  // Responsive behavior
  function handleResize() {
    if (window.innerWidth < 768) {
      sidebar.classList.remove("sidebar-collapsed")
      sidebar.classList.remove("active")
    }
  }

  window.addEventListener("resize", handleResize)

  // Initialize
  handleResize()
})

// Toggle mobile menu
document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  const mobileMenuButton = document.querySelector(".mobile-menu-button")
  const sidebar = document.querySelector(".sidebar")

  if (mobileMenuButton && sidebar) {
    mobileMenuButton.addEventListener("click", () => {
      sidebar.classList.toggle("hidden")
    })
  }

  // Close sidebar when clicking outside on mobile
  document.addEventListener("click", (event) => {
    if (
      sidebar &&
      !sidebar.contains(event.target) &&
      mobileMenuButton &&
      !mobileMenuButton.contains(event.target) &&
      window.innerWidth < 768 &&
      !sidebar.classList.contains("hidden")
    ) {
      sidebar.classList.add("hidden")
    }
  })

  // Handle window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768 && sidebar) {
      sidebar.classList.remove("hidden")
    }
  })

  // Dropdown toggles
  const dropdownButtons = document.querySelectorAll(".dropdown-button")

  dropdownButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.stopPropagation()
      const dropdown = this.nextElementSibling

      // Close all other dropdowns
      dropdownButtons.forEach((otherButton) => {
        if (otherButton !== button) {
          const otherDropdown = otherButton.nextElementSibling
          if (otherDropdown && !otherDropdown.classList.contains("hidden")) {
            otherDropdown.classList.add("hidden")
          }
        }
      })

      // Toggle current dropdown
      if (dropdown) {
        dropdown.classList.toggle("hidden")
      }
    })
  })

  // Close dropdowns when clicking outside
  document.addEventListener("click", () => {
    dropdownButtons.forEach((button) => {
      const dropdown = button.nextElementSibling
      if (dropdown && !dropdown.classList.contains("hidden")) {
        dropdown.classList.add("hidden")
      }
    })
  })

  // Theme toggle
  const themeToggle = document.getElementById("theme-toggle")
  const htmlElement = document.documentElement

  // Check for saved theme preference or use system preference
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    htmlElement.classList.add("dark")
    if (themeToggle) {
      themeToggle.checked = true
    }
  }

  // Theme toggle event listener
  if (themeToggle) {
    themeToggle.addEventListener("change", function () {
      if (this.checked) {
        htmlElement.classList.add("dark")
        localStorage.setItem("theme", "dark")
      } else {
        htmlElement.classList.remove("dark")
        localStorage.setItem("theme", "light")
      }
    })
  }

  // Tabs functionality
  const tabButtons = document.querySelectorAll('[role="tab"]')
  const tabPanels = document.querySelectorAll('[role="tabpanel"]')

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Deactivate all tabs
      tabButtons.forEach((btn) => {
        btn.setAttribute("aria-selected", "false")
        btn.classList.remove("border-primary", "text-primary")
        btn.classList.add("border-transparent", "text-muted")
      })

      // Hide all tab panels
      tabPanels.forEach((panel) => {
        panel.classList.add("hidden")
      })

      // Activate current tab
      this.setAttribute("aria-selected", "true")
      this.classList.remove("border-transparent", "text-muted")
      this.classList.add("border-primary", "text-primary")

      // Show current tab panel
      const panelId = this.getAttribute("aria-controls")
      const panel = document.getElementById(panelId)
      if (panel) {
        panel.classList.remove("hidden")
      }
    })
  })

  // Calendar functionality (if on calendar page)
  const calendarContainer = document.querySelector(".calendar-container")
  if (calendarContainer) {
    renderCalendar()
  }

  // Messages functionality (if on messages page)
  const messagesContainer = document.querySelector(".messages-container")
  if (messagesContainer) {
    initializeMessages()
  }

  // Course enrollment functionality
  const enrollButtons = document.querySelectorAll(".enroll-button")
  enrollButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const courseId = this.getAttribute("data-course-id")
      enrollInCourse(courseId)
    })
  })

  // Community join functionality
  const joinButtons = document.querySelectorAll(".join-button")
  joinButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const communityId = this.getAttribute("data-community-id")
      joinCommunity(communityId)
    })
  })

  // Search functionality
  const searchForm = document.querySelector(".search-form")
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault()
      const searchInput = this.querySelector('input[type="search"]')
      if (searchInput) {
        performSearch(searchInput.value)
      }
    })
  }

  // Notification functionality
  const notificationButtons = document.querySelectorAll(".notification-button")
  notificationButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const notificationId = this.getAttribute("data-notification-id")
      markNotificationAsRead(notificationId)
    })
  })
})

// Calendar functions
function renderCalendar() {
  const date = new Date()
  const month = date.getMonth()
  const year = date.getFullYear()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const daysInMonth = lastDay.getDate()
  const startingDay = firstDay.getDay()

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const calendarHeader = document.querySelector(".calendar-month")
  if (calendarHeader) {
    calendarHeader.textContent = `${monthNames[month]} ${year}`
  }

  const calendarDays = document.querySelector(".calendar-days")
  if (calendarDays) {
    calendarDays.innerHTML = ""

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      const emptyDay = document.createElement("div")
      emptyDay.className = "calendar-day empty"
      calendarDays.appendChild(emptyDay)
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const dayElement = document.createElement("div")
      dayElement.className = "calendar-day"
      dayElement.textContent = i

      // Highlight current day
      if (i === date.getDate() && month === date.getMonth() && year === date.getFullYear()) {
        dayElement.classList.add("current-day")
      }

      // Add sample events (in a real app, these would come from a database)
      if (i === 10 || i === 15 || i === 22) {
        const eventIndicator = document.createElement("div")
        eventIndicator.className = "event-indicator"
        dayElement.appendChild(eventIndicator)

        dayElement.addEventListener("click", () => {
          showEvents(i, month, year)
        })
      }

      calendarDays.appendChild(dayElement)
    }
  }
}

function showEvents(day, month, year) {
  const eventsContainer = document.querySelector(".events-container")
  if (eventsContainer) {
    // In a real app, you would fetch events for this day from a database
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]

    eventsContainer.innerHTML = `
            <h3 class="text-lg font-semibold mb-2">Events for ${monthNames[month]} ${day}, ${year}</h3>
            <div class="event p-2 bg-primary/10 rounded mb-2">
                <p class="font-medium">Course: Introduction to JavaScript</p>
                <p class="text-sm text-muted">10:00 AM - 11:30 AM</p>
            </div>
            <div class="event p-2 bg-primary/10 rounded">
                <p class="font-medium">Community Meeting: Web Developers</p>
                <p class="text-sm text-muted">2:00 PM - 3:00 PM</p>
            </div>
        `
  }
}

// Messages functions
function initializeMessages() {
  const messageItems = document.querySelectorAll(".message-item")
  messageItems.forEach((item) => {
    item.addEventListener("click", function () {
      const messageId = this.getAttribute("data-message-id")
      loadMessageContent(messageId)

      // Mark as active
      messageItems.forEach((mi) => mi.classList.remove("bg-primary/10"))
      this.classList.add("bg-primary/10")
    })
  })

  // Load first message by default
  if (messageItems.length > 0) {
    messageItems[0].click()
  }

  // Handle new message form
  const newMessageForm = document.querySelector(".new-message-form")
  if (newMessageForm) {
    newMessageForm.addEventListener("submit", function (e) {
      e.preventDefault()
      const messageInput = this.querySelector("textarea")
      if (messageInput && messageInput.value.trim() !== "") {
        sendMessage(messageInput.value)
        messageInput.value = ""
      }
    })
  }
}

function loadMessageContent(messageId) {
  const messageContent = document.querySelector(".message-content")
  if (messageContent) {
    // In a real app, you would fetch the message content from a database
    // This is just a simulation
    const messages = {
      1: {
        sender: "John Doe",
        avatar: "/placeholder.svg?height=40&width=40",
        time: "10:30 AM",
        content: "Hi there! I wanted to ask about the JavaScript course you're taking. How is it going?",
        replies: [
          {
            sender: "You",
            time: "10:35 AM",
            content: "It's going great! I'm learning a lot and the instructor is excellent.",
          },
          {
            sender: "John Doe",
            time: "10:40 AM",
            content: "That's awesome! I'm thinking of enrolling in it too. Would you recommend it?",
          },
        ],
      },
      2: {
        sender: "Jane Smith",
        avatar: "/placeholder.svg?height=40&width=40",
        time: "Yesterday",
        content: "Hello! I saw your project on the community board. It looks really impressive!",
        replies: [
          {
            sender: "You",
            time: "Yesterday",
            content: "Thank you so much! I worked really hard on it.",
          },
        ],
      },
      3: {
        sender: "Web Dev Community",
        avatar: "/placeholder.svg?height=40&width=40",
        time: "Monday",
        content: "Welcome to the Web Development Community! Feel free to introduce yourself and join the discussions.",
        replies: [],
      },
    }

    const message = messages[messageId]
    if (message) {
      let html = `
                <div class="message-header flex items-center justify-between p-4 border-b">
                    <div class="flex items-center gap-2">
                        <img src="${message.avatar}" alt="${message.sender}" class="w-10 h-10 rounded-full">
                        <div>
                            <h3 class="font-semibold">${message.sender}</h3>
                            <p class="text-sm text-muted">${message.time}</p>
                        </div>
                    </div>
                    <button class="text-muted hover:text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                    </button>
                </div>
                <div class="message-body p-4 overflow-y-auto flex-1">
                    <div class="message-bubble received p-3 bg-muted rounded-lg mb-4 max-w-[80%]">
                        <p>${message.content}</p>
                    </div>
            `

      message.replies.forEach((reply) => {
        const isYou = reply.sender === "You"
        html += `
                    <div class="message-bubble ${isYou ? "sent ml-auto" : "received"} p-3 ${isYou ? "bg-primary text-white" : "bg-muted"} rounded-lg mb-4 max-w-[80%]">
                        <p>${reply.content}</p>
                        <span class="text-xs ${isYou ? "text-primary-foreground/70" : "text-muted-foreground"} block mt-1">${reply.time}</span>
                    </div>
                `
      })

      html += `</div>`

      messageContent.innerHTML = html
    }
  }
}

function sendMessage(content) {
  const messageContent = document.querySelector(".message-body")
  if (messageContent) {
    const newMessage = document.createElement("div")
    newMessage.className = "message-bubble sent ml-auto p-3 bg-primary text-white rounded-lg mb-4 max-w-[80%]"
    newMessage.innerHTML = `
            <p>${content}</p>
            <span class="text-xs text-primary-foreground/70 block mt-1">Just now</span>
        `
    messageContent.appendChild(newMessage)
    messageContent.scrollTop = messageContent.scrollHeight
  }
}

// Course enrollment function
function enrollInCourse(courseId) {
  // In a real app, this would make an API call to enroll the user
  console.log(`Enrolling in course ${courseId}`)

  const button = document.querySelector(`.enroll-button[data-course-id="${courseId}"]`)
  if (button) {
    button.textContent = "Enrolled"
    button.disabled = true
    button.classList.remove("bg-primary", "hover:bg-primary/90")
    button.classList.add("bg-green-500", "cursor-not-allowed")

    // Show success message
    const successMessage = document.createElement("div")
    successMessage.className = "fixed top-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg z-50"
    successMessage.textContent = "Successfully enrolled in course!"
    document.body.appendChild(successMessage)

    setTimeout(() => {
      successMessage.remove()
    }, 3000)
  }
}

// Community join function
function joinCommunity(communityId) {
  // In a real app, this would make an API call to join the community
  console.log(`Joining community ${communityId}`)

  const button = document.querySelector(`.join-button[data-community-id="${communityId}"]`)
  if (button) {
    button.textContent = "Joined"
    button.disabled = true
    button.classList.remove("bg-primary", "hover:bg-primary/90")
    button.classList.add("bg-green-500", "cursor-not-allowed")

    // Show success message
    const successMessage = document.createElement("div")
    successMessage.className = "fixed top-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg z-50"
    successMessage.textContent = "Successfully joined community!"
    document.body.appendChild(successMessage)

    setTimeout(() => {
      successMessage.remove()
    }, 3000)
  }
}

// Search function
function performSearch(query) {
  // In a real app, this would make an API call to search
  console.log(`Searching for: ${query}`)

  // Redirect to search results page
  window.location.href = `search-results.html?q=${encodeURIComponent(query)}`
}

// Notification function
function markNotificationAsRead(notificationId) {
  // In a real app, this would make an API call to mark the notification as read
  console.log(`Marking notification ${notificationId} as read`)

  const notification = document.querySelector(`.notification[data-notification-id="${notificationId}"]`)
  if (notification) {
    notification.classList.remove("bg-primary/5")
    notification.classList.add("bg-transparent")

    const indicator = notification.querySelector(".unread-indicator")
    if (indicator) {
      indicator.remove()
    }
  }
}
