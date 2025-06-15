// Tab functionality
document.addEventListener("DOMContentLoaded", () => {
    const navTabs = document.querySelectorAll(".nav-tab")
    const tabContents = document.querySelectorAll(".tab-content")
  
    navTabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        const targetTab = this.getAttribute("data-tab")
  
        // Remove active class from all tabs and contents
        navTabs.forEach((t) => t.classList.remove("active"))
        tabContents.forEach((content) => content.classList.remove("active"))
  
        // Add active class to clicked tab and corresponding content
        this.classList.add("active")
        document.getElementById(targetTab).classList.add("active")
      })
    })
  
    // Mobile menu functionality
    const mobileMenuBtn = document.getElementById("mobileMenuBtn")
    const nav = document.querySelector(".nav")
  
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener("click", () => {
        nav.classList.toggle("active")
      })
    }
  
    // Dropdown functionality
    const dropdowns = document.querySelectorAll(".dropdown")
  
    dropdowns.forEach((dropdown) => {
      const trigger = dropdown.querySelector(".dropdown-trigger")
  
      if (trigger) {
        trigger.addEventListener("click", (e) => {
          e.stopPropagation()
          dropdown.classList.toggle("active")
        })
      }
    })
  
    // Close dropdowns when clicking outside
    document.addEventListener("click", () => {
      dropdowns.forEach((dropdown) => {
        dropdown.classList.remove("active")
      })
    })
  
    // Like/Unlike functionality for discussions
    const likeButtons = document.querySelectorAll(".discussion-btn")
  
    likeButtons.forEach((button) => {
      if (button.innerHTML.includes("thumbs-up")) {
        button.addEventListener("click", function () {
          const currentCount = Number.parseInt(this.textContent.trim())
          const newCount = this.classList.contains("liked") ? currentCount - 1 : currentCount + 1
  
          this.innerHTML = `<i class="fas fa-thumbs-up"></i> ${newCount}`
          this.classList.toggle("liked")
        })
      }
    })
  })
  