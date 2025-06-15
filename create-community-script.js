document.addEventListener("DOMContentLoaded", () => {
    // Modal elements
    const createCommunityBtn = document.getElementById("createCommunityBtn")
    const modal = document.getElementById("createCommunityModal")
    const closeModalBtn = document.getElementById("closeModalBtn")
    const cancelBtn = document.getElementById("cancelBtn")
    const form = document.getElementById("createCommunityForm")
    const submitBtn = document.getElementById("submitBtn")
    const successToast = document.getElementById("successToast")
  
    // Form elements
    const communityName = document.getElementById("communityName")
    const communityDescription = document.getElementById("communityDescription")
    const communityCategory = document.getElementById("communityCategory")
    const communityTags = document.getElementById("communityTags")
    const communityRules = document.getElementById("communityRules")
    const agreeTerms = document.getElementById("agreeTerms")
  
    // Open modal
    createCommunityBtn.addEventListener("click", () => {
      modal.style.display = "flex"
      document.body.style.overflow = "hidden"
      communityName.focus()
    })
  
    // Close modal functions
    function closeModal() {
      modal.style.display = "none"
      document.body.style.overflow = ""
      form.reset()
      clearValidationErrors()
    }
  
    closeModalBtn.addEventListener("click", closeModal)
    cancelBtn.addEventListener("click", closeModal)
  
    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal()
      }
    })
  
    // Close modal with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.style.display === "flex") {
        closeModal()
      }
    })
  
    // Form validation
    function validateForm() {
      clearValidationErrors()
      let isValid = true
  
      // Required fields validation
      const requiredFields = [
        { element: communityName, message: "Community name is required" },
        { element: communityDescription, message: "Description is required" },
        { element: communityCategory, message: "Please select a category" },
      ]
  
      requiredFields.forEach((field) => {
        if (!field.element.value.trim()) {
          showFieldError(field.element, field.message)
          isValid = false
        }
      })
  
      // Name length validation
      if (communityName.value.trim() && communityName.value.trim().length < 3) {
        showFieldError(communityName, "Community name must be at least 3 characters")
        isValid = false
      }
  
      // Description length validation
      if (communityDescription.value.trim() && communityDescription.value.trim().length < 10) {
        showFieldError(communityDescription, "Description must be at least 10 characters")
        isValid = false
      }
  
      // Terms agreement validation
      if (!agreeTerms.checked) {
        showFieldError(agreeTerms, "You must agree to the terms and conditions")
        isValid = false
      }
  
      return isValid
    }
  
    function showFieldError(field, message) {
      field.classList.add("error")
  
      // Remove existing error message
      const existingError = field.parentNode.querySelector(".error-message")
      if (existingError) {
        existingError.remove()
      }
  
      // Add new error message
      const errorDiv = document.createElement("div")
      errorDiv.className = "error-message"
      errorDiv.textContent = message
      errorDiv.style.color = "#ef4444"
      errorDiv.style.fontSize = "0.75rem"
      errorDiv.style.marginTop = "0.25rem"
  
      field.parentNode.appendChild(errorDiv)
    }
  
    function clearValidationErrors() {
      const errorFields = form.querySelectorAll(".error")
      const errorMessages = form.querySelectorAll(".error-message")
  
      errorFields.forEach((field) => field.classList.remove("error"))
      errorMessages.forEach((message) => message.remove())
    }
  
    // Form submission
    form.addEventListener("submit", (e) => {
      e.preventDefault()
  
      if (!validateForm()) {
        return
      }
  
      // Show loading state
      submitBtn.disabled = true
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating...'
  
      // Simulate API call
      setTimeout(() => {
        createCommunity()
      }, 1000)
    })
  
    function createCommunity() {
      // Get form data
      const formData = {
        id: Date.now(),
        name: communityName.value.trim(),
        description: communityDescription.value.trim(),
        category: communityCategory.value,
        tags: communityTags.value
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        type: document.querySelector('input[name="communityType"]:checked').value,
        rules: communityRules.value.trim(),
        createdAt: new Date().toISOString(),
        members: 1, // Creator is the first member
        activity: "New",
        joined: true,
        creator: true,
        image: `https://raw.githubusercontent.com/bndon/SkillSync-V1.3/main/images/essentials/person-icons.png?text=${communityName.value.charAt(0).toUpperCase()}`,
        banner: `https://raw.githubusercontent.com/bndon/SkillSync-V1.3/main/images/essentials/Default.png?text=${encodeURIComponent(communityName.value)}`,
      }
  
      // Save to localStorage
      const communities = JSON.parse(localStorage.getItem("userCommunities") || "[]")
      communities.unshift(formData) // Add to beginning of array
      localStorage.setItem("userCommunities", JSON.stringify(communities))
  
      // Add to page
      addCommunityToPage(formData)
  
      // Reset form and close modal
      submitBtn.disabled = false
      submitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Create Community'
      closeModal()
  
      // Show success toast
      showSuccessToast()
    }
  
    function addCommunityToPage(community) {
      const communitiesGrid = document.querySelector(".communities-grid")
  
      const communityCard = document.createElement("div")
      communityCard.className = "community-card"
      communityCard.dataset.id = community.id
      communityCard.innerHTML = `
        <div class="community-header">
          <img src="${community.banner}" alt="${community.name}" class="community-banner">
          <div class="community-avatar">
            <img src="${community.image}" alt="${community.name}">
          </div>
        </div>
        <div class="community-body">
          <h3 class="community-title">${community.name}</h3>
          <p class="community-description">${community.description}</p>
          <div class="community-meta">
            <span class="community-members">
              <i class="fa-solid fa-user-group"></i>
              ${community.members} member${community.members !== 1 ? "s" : ""}
            </span>
            <span class="community-activity">
              <i class="fa-solid fa-bolt"></i>
              ${community.activity}
            </span>
          </div>
          <div class="community-tags">
            ${community.tags.map((tag) => `<span class="community-tag">${tag}</span>`).join("")}
          </div>
        </div>
        <div class="community-footer">
          ${
            community.creator
              ? `
              <a href="community-detail.html?id=${community.id}" class="community-btn">Manage Community</a>
              <div class="community-notification active">
                <i class="fa-solid fa-crown" title="Creator"></i>
                <span class="sr-only">Community Creator</span>
              </div>
              `
              : `
              <a href="community-detail.html?id=${community.id}" class="community-btn">View Community</a>
              <div class="community-actions">
                <div class="community-notification">
                  <i class="fa-solid fa-bell-slash" title="Notifications Off"></i>
                  <span class="sr-only">Notifications Off</span>
                </div>
                <button class="community-leave-btn">Leave</button>
              </div>
              `
          }
        </div>
      `
  
      // Add animation
      communityCard.style.opacity = "0"
      communityCard.style.transform = "translateY(20px)"
  
      // Insert at the beginning
      if (communitiesGrid.firstChild) {
        communitiesGrid.insertBefore(communityCard, communitiesGrid.firstChild)
      } else {
        communitiesGrid.appendChild(communityCard)
      }
  
      // Animate in
      setTimeout(() => {
        communityCard.style.transition = "all 0.3s ease"
        communityCard.style.opacity = "1"
        communityCard.style.transform = "translateY(0)"
      }, 100)

      setupLeaveButtons()
    }
  
    function showSuccessToast() {
      successToast.style.display = "flex"
      successToast.style.opacity = "1"
      successToast.style.transform = "translateY(0)"
  
      setTimeout(() => {
        successToast.style.opacity = "0"
        successToast.style.transform = "translateY(10px)"
  
        setTimeout(() => {
          successToast.style.display = "none"
        }, 300)
      }, 3000)
    }
  
    // Load existing communities on page load
    function loadExistingCommunities() {
      const communities = JSON.parse(localStorage.getItem("userCommunities") || "[]")
      communities.forEach((community) => {
        // Check if community already exists on page to avoid duplicates
        const existingCommunity = document.querySelector(`.community-card[data-id="${community.id}"]`)
        if (!existingCommunity) {
          addCommunityToPage(community)
        }
      })
    }
  
    // Load communities when page loads
    loadExistingCommunities()
  
    // Real-time character counter for description
    const descriptionCounter = document.createElement("div")
    descriptionCounter.className = "character-counter"
    descriptionCounter.style.fontSize = "0.75rem"
    descriptionCounter.style.color = "var(--muted-foreground)"
    descriptionCounter.style.textAlign = "right"
    descriptionCounter.style.marginTop = "0.25rem"
  
    communityDescription.parentNode.appendChild(descriptionCounter)
  
    communityDescription.addEventListener("input", function () {
      const length = this.value.length
      const maxLength = 500
      descriptionCounter.textContent = `${length}/${maxLength} characters`
  
      if (length > maxLength) {
        descriptionCounter.style.color = "#ef4444"
        this.value = this.value.substring(0, maxLength)
      } else {
        descriptionCounter.style.color = "var(--muted-foreground)"
      }
    })
  
    // Initialize counter
    communityDescription.dispatchEvent(new Event("input"))
  
    // Tag input enhancement
    communityTags.addEventListener("input", function () {
      const tags = this.value.split(",")
      if (tags.length > 10) {
        this.value = tags.slice(0, 10).join(",")
        showFieldError(this, "Maximum 10 tags allowed")
      }
    })
  
    // Auto-focus next field on Enter (except textarea)
    const formInputs = form.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]), select')
    formInputs.forEach((input, index) => {
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && this.type !== "textarea") {
          e.preventDefault()
          const nextInput = formInputs[index + 1]
          if (nextInput) {
            nextInput.focus()
          } else {
            submitBtn.focus()
          }
        }
      })
    })
  })
  // Add leave functionality for joined communities
  if (!community.creator) {
    const leaveBtn = communityCard.querySelector(".community-leave-btn")
    leaveBtn?.addEventListener("click", () => {
      if (confirm(`Leave ${community.name}?`)) {
        const updated = JSON.parse(localStorage.getItem("userCommunities") || "[]").filter(c => c.id !== community.id)
        localStorage.setItem("userCommunities", JSON.stringify(updated))
        communityCard.remove()
      }
    })
  }

  function setupLeaveButtons() {
    const leaveButtons = document.querySelectorAll(".community-leave-btn")
  
    leaveButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".community-card")
        const name = card.querySelector(".community-title")?.innerText
  
        if (confirm(`Leave ${name}?`)) {
          // Remove from localStorage
          const communities = JSON.parse(localStorage.getItem("userCommunities") || "[]")
          const updated = communities.filter(c => c.name !== name)
          localStorage.setItem("userCommunities", JSON.stringify(updated))
  
          // Remove from DOM
          card.remove()
        }
      })
    })
  }
  
  // Run this on load
  setupLeaveButtons()

  