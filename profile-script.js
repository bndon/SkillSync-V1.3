document.addEventListener("DOMContentLoaded", () => {
    // Profile data storage
    let profileData = {
      name: "John Doe",
      title: "Full Stack Developer",
      location: "Jakarta, Indonesia",
      about:
        "Full Stack Developer with 5 years of experience building web applications using JavaScript, React, Node.js, and Python. Passionate about learning new technologies and sharing knowledge with others.",
      skills: ["JavaScript", "React", "Node.js", "Python"],
      avatar: "/placeholder.svg?height=120&width=120",
      cover: "/placeholder.svg?height=200&width=800",
      stats: {
        courses: 12,
        certificates: 5,
        communities: 7,
        projects: 15,
      },
    }
  
    // Load profile data from localStorage
    const savedProfile = localStorage.getItem("profileData")
    if (savedProfile) {
      profileData = { ...profileData, ...JSON.parse(savedProfile) }
      updateProfileDisplay()
    }
  
    // Tab functionality
    const profileTabs = document.querySelectorAll(".profile-tab")
    const tabContents = document.querySelectorAll(".tab-content")
  
    profileTabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        const tabId = this.dataset.tab
  
        // Remove active class from all tabs and content
        profileTabs.forEach((t) => t.classList.remove("active"))
        tabContents.forEach((content) => content.classList.remove("active"))
  
        // Add active class to clicked tab and corresponding content
        this.classList.add("active")
        document.getElementById(`${tabId}-content`).classList.add("active")
      })
    })
  
    // Edit profile functionality
    const editProfileBtn = document.getElementById("edit-profile-btn")
    const editProfileModal = document.getElementById("edit-profile-modal")
    const closeEditModal = document.getElementById("close-edit-modal")
    const cancelEdit = document.getElementById("cancel-edit")
    const saveProfile = document.getElementById("save-profile")
    const editProfileForm = document.getElementById("edit-profile-form")
  
    editProfileBtn.addEventListener("click", openEditModal)
    closeEditModal.addEventListener("click", closeEditModalHandler)
    cancelEdit.addEventListener("click", closeEditModalHandler)
    saveProfile.addEventListener("click", saveProfileHandler)
  
    function openEditModal() {
      // Populate form with current data
      document.getElementById("edit-name").value = profileData.name
      document.getElementById("edit-title").value = profileData.title
      document.getElementById("edit-location").value = profileData.location
      document.getElementById("edit-about").value = profileData.about
  
      updateCharCounter()
      editProfileModal.classList.add("active")
    }
  
    function closeEditModalHandler() {
      editProfileModal.classList.remove("active")
      editProfileForm.reset()
    }
  
    function saveProfileHandler() {
      const formData = new FormData(editProfileForm)
  
      profileData.name = formData.get("name")
      profileData.title = formData.get("title")
      profileData.location = formData.get("location")
      profileData.about = formData.get("about")
  
      saveProfileData()
      updateProfileDisplay()
      closeEditModalHandler()
      showToast("Profile updated successfully!")
    }
  
    // Character counter for about textarea
    const editAboutTextarea = document.getElementById("edit-about")
    const aboutCharCount = document.getElementById("about-char-count")
  
    editAboutTextarea.addEventListener("input", updateCharCounter)
  
    function updateCharCounter() {
      const count = editAboutTextarea.value.length
      aboutCharCount.textContent = count
  
      if (count > 450) {
        aboutCharCount.style.color = "#ef4444"
      } else if (count > 400) {
        aboutCharCount.style.color = "#f59e0b"
      } else {
        aboutCharCount.style.color = "var(--muted-foreground)"
      }
    }
  
    // Inline editing functionality
    const editNameBtn = document.getElementById("edit-name-btn")
    const editTitleBtn = document.getElementById("edit-title-btn")
    const editLocationBtn = document.getElementById("edit-location-btn")
    const editAboutBtn = document.getElementById("edit-about-btn")
  
    editNameBtn.addEventListener("click", () => editInline("name"))
    editTitleBtn.addEventListener("click", () => editInline("title"))
    editLocationBtn.addEventListener("click", () => editInline("location"))
    editAboutBtn.addEventListener("click", toggleAboutEdit)
  
    function editInline(field) {
      const element = document.getElementById(`profile-${field}`)
      const currentValue = element.textContent
  
      const input = document.createElement("input")
      input.type = "text"
      input.value = currentValue
      input.className = "inline-edit-input"
      input.style.cssText = `
              background: var(--background);
              border: 1px solid var(--border);
              border-radius: var(--radius);
              padding: 0.25rem 0.5rem;
              font-size: inherit;
              font-weight: inherit;
              color: inherit;
              width: 100%;
              min-width: 200px;
          `
  
      element.replaceWith(input)
      input.focus()
      input.select()
  
      function saveInlineEdit() {
        const newValue = input.value.trim()
        if (newValue && newValue !== currentValue) {
          profileData[field] = newValue
          saveProfileData()
          showToast(`${field.charAt(0).toUpperCase() + field.slice(1)} updated!`)
        }
  
        const newElement = document.createElement(element.tagName.toLowerCase())
        newElement.id = `profile-${field}`
        newElement.className = element.className
        newElement.textContent = newValue || currentValue
  
        input.replaceWith(newElement)
      }
  
      function cancelInlineEdit() {
        const newElement = document.createElement(element.tagName.toLowerCase())
        newElement.id = `profile-${field}`
        newElement.className = element.className
        newElement.textContent = currentValue
  
        input.replaceWith(newElement)
      }
  
      input.addEventListener("blur", saveInlineEdit)
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          saveInlineEdit()
        } else if (e.key === "Escape") {
          cancelInlineEdit()
        }
      })
    }
  
    // About section editing
    function toggleAboutEdit() {
      const aboutText = document.getElementById("about-text")
      const aboutTextarea = document.getElementById("about-edit-textarea")
      const editActions = document.getElementById("about-edit-actions")
      const editBtn = document.getElementById("edit-about-btn")
  
      if (aboutTextarea.style.display === "none" || !aboutTextarea.style.display) {
        // Enter edit mode
        aboutTextarea.value = profileData.about
        aboutText.style.display = "none"
        aboutTextarea.style.display = "block"
        editActions.style.display = "flex"
        editBtn.style.display = "none"
        aboutTextarea.focus()
      }
    }
  
    const cancelAboutEdit = document.getElementById("cancel-about-edit")
    const saveAboutEdit = document.getElementById("save-about-edit")
  
    cancelAboutEdit.addEventListener("click", () => {
      exitAboutEditMode()
    })
  
    saveAboutEdit.addEventListener("click", () => {
      const newAbout = document.getElementById("about-edit-textarea").value.trim()
      if (newAbout) {
        profileData.about = newAbout
        saveProfileData()
        updateProfileDisplay()
        showToast("About section updated!")
      }
      exitAboutEditMode()
    })
  
    function exitAboutEditMode() {
      const aboutText = document.getElementById("about-text")
      const aboutTextarea = document.getElementById("about-edit-textarea")
      const editActions = document.getElementById("about-edit-actions")
      const editBtn = document.getElementById("edit-about-btn")
  
      aboutText.style.display = "block"
      aboutTextarea.style.display = "none"
      editActions.style.display = "none"
      editBtn.style.display = "flex"
    }
  
    const coverUploadInput = document.getElementById("cover-upload")
    const editCoverBtn = document.getElementById("edit-cover-btn")

    editCoverBtn.addEventListener("click", () => {
        coverUploadInput.click()
    })

    coverUploadInput.addEventListener("change", (e) => {
    const file = e.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
        const imageUrl = e.target.result
        profileData.cover = imageUrl
        saveProfileData()
        updateProfileDisplay()
        showToast("Cover image updated!")
        }
        reader.readAsDataURL(file)
    }
    })
      
  
    // Skills management
    const addSkillBtn = document.getElementById("add-skill-btn")
    const addSkillModal = document.getElementById("add-skill-modal")
    const closeSkillModal = document.getElementById("close-skill-modal")
    const cancelSkill = document.getElementById("cancel-skill")
    const saveSkill = document.getElementById("save-skill")
    const addSkillForm = document.getElementById("add-skill-form")
  
    addSkillBtn.addEventListener("click", () => addSkillModal.classList.add("active"))
    closeSkillModal.addEventListener("click", () => addSkillModal.classList.remove("active"))
    cancelSkill.addEventListener("click", () => addSkillModal.classList.remove("active"))
    saveSkill.addEventListener("click", saveSkillHandler)
  
    function saveSkillHandler() {
      const formData = new FormData(addSkillForm)
      const skillName = formData.get("skillName").trim()
  
      if (skillName && !profileData.skills.includes(skillName)) {
        profileData.skills.push(skillName)
        saveProfileData()
        updateSkillsDisplay()
        addSkillModal.classList.remove("active")
        addSkillForm.reset()
        showToast("Skill added successfully!")
      }
    }
  
    // Filter functionality for achievements and activity
    const achievementsFilter = document.getElementById("achievements-filter")
    const activityFilter = document.getElementById("activity-filter")
  
    achievementsFilter.addEventListener("change", function () {
      filterAchievements(this.value)
    })
  
    activityFilter.addEventListener("change", function () {
      filterActivity(this.value)
    })
  
    function filterAchievements(category) {
      const achievementCards = document.querySelectorAll(".achievement-card")
  
      achievementCards.forEach((card) => {
        if (category === "all" || card.dataset.category === category) {
          card.style.display = "flex"
          card.classList.add("fade-in-up")
        } else {
          card.style.display = "none"
        }
      })
    }
  
    function filterActivity(category) {
      const activityItems = document.querySelectorAll(".activity-item")
  
      activityItems.forEach((item) => {
        if (category === "all" || item.dataset.category === category) {
          item.style.display = "flex"
          item.classList.add("fade-in-up")
        } else {
          item.style.display = "none"
        }
      })
    }
  
    // Utility functions
    function updateProfileDisplay() {
      document.getElementById("profile-name").textContent = profileData.name
      document.getElementById("profile-title").textContent = profileData.title
      document.getElementById("profile-location").textContent = profileData.location
      document.getElementById("about-text").textContent = profileData.about
      document.getElementById("profile-image").src = profileData.avatar
      document.getElementById("cover-image").src = profileData.cover
  
      // Update stats
      document.getElementById("courses-count").textContent = profileData.stats.courses
      document.getElementById("certificates-count").textContent = profileData.stats.certificates
      document.getElementById("communities-count").textContent = profileData.stats.communities
      document.getElementById("projects-count").textContent = profileData.stats.projects
  
      updateSkillsDisplay()
    }
  
    function updateSkillsDisplay() {
      const skillsContainer = document.getElementById("skills-container")
      const addSkillBtn = skillsContainer.querySelector(".add-skill-btn")
  
      // Remove existing skill badges
      const existingSkills = skillsContainer.querySelectorAll(".skill-badge")
      existingSkills.forEach((skill) => skill.remove())
  
      // Add current skills
      profileData.skills.forEach((skill) => {
        const skillBadge = document.createElement("span")
        skillBadge.className = "skill-badge"
        skillBadge.textContent = skill
  
        // Add remove functionality
        skillBadge.addEventListener("click", () => {
          if (confirm(`Remove "${skill}" from your skills?`)) {
            profileData.skills = profileData.skills.filter((s) => s !== skill)
            saveProfileData()
            updateSkillsDisplay()
            showToast("Skill removed!")
          }
        })
  
        skillsContainer.insertBefore(skillBadge, addSkillBtn)
      })
    }
  
    function saveProfileData() {
      localStorage.setItem("profileData", JSON.stringify(profileData))
    }
  
    function showToast(message) {
      const toast = document.getElementById("toast")
      const toastMessage = toast.querySelector(".toast-message")
  
      toastMessage.textContent = message
      toast.classList.add("show")
  
      setTimeout(() => {
        toast.classList.remove("show")
      }, 3000)
    }
  
    // Close modals when clicking outside
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal")) {
        e.target.classList.remove("active")
      }
    })
  
    // Keyboard navigation for modals
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const activeModal = document.querySelector(".modal.active")
        if (activeModal) {
          activeModal.classList.remove("active")
        }
      }
    })
  
    // Initialize profile stats animation
    function animateStats() {
      const statValues = document.querySelectorAll(".stat-value")
  
      statValues.forEach((stat) => {
        const finalValue = Number.parseInt(stat.textContent)
        let currentValue = 0
        const increment = finalValue / 20
  
        const timer = setInterval(() => {
          currentValue += increment
          if (currentValue >= finalValue) {
            stat.textContent = finalValue
            clearInterval(timer)
          } else {
            stat.textContent = Math.floor(currentValue)
          }
        }, 50)
      })
    }
  
    // Animate stats on page load
    setTimeout(animateStats, 500)
  
    // Add experience/education functionality
    const addExperienceBtn = document.getElementById("add-experience-btn")
    const addEducationBtn = document.getElementById("add-education-btn")
  
    addExperienceBtn.addEventListener("click", () => {
      addTimelineItem("work")
    })
  
    addEducationBtn.addEventListener("click", () => {
      addTimelineItem("education")
    })
  
    function addTimelineItem(type) {
      const title = prompt(`Enter ${type === "work" ? "job title" : "degree/program"}:`)
      const company = prompt(`Enter ${type === "work" ? "company name" : "institution name"}:`)
      const startDate = prompt("Enter start date (e.g., 2020):")
      const endDate = prompt('Enter end date (e.g., 2023 or "Present"):')
  
      if (title && company && startDate) {
        const timeline = document.getElementById(`${type === "work" ? "work" : "education"}-timeline`)
        const timelineItem = document.createElement("div")
        timelineItem.className = "timeline-item fade-in-up"
  
        timelineItem.innerHTML = `
                  <div class="timeline-date">${startDate} - ${endDate || "Present"}</div>
                  <div class="timeline-content">
                      <h4 class="timeline-title">${title}</h4>
                      <p class="timeline-company">${company}</p>
                  </div>
              `
  
        timeline.appendChild(timelineItem)
        showToast(`${type === "work" ? "Experience" : "Education"} added!`)
      }
    }
  
    // Auto-save functionality
    let autoSaveTimeout
    function scheduleAutoSave() {
      clearTimeout(autoSaveTimeout)
      autoSaveTimeout = setTimeout(() => {
        saveProfileData()
      }, 1000)
    }
    
    // Share profile functionality
    const shareProfileBtn = document.getElementById("share-profile-btn")
    shareProfileBtn?.addEventListener("click", () => {
    const shareData = {
        title: `${profileData.name}'s Profile`,
        text: `Check out ${profileData.name}'s profile on SkillSync`,
        url: window.location.href,
    }

    if (navigator.share) {
        navigator.share(shareData).catch((err) => {
        showToast("Share canceled.")
        console.error("Share failed", err)
        })
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(shareData.url).then(() => {
        showToast("Profile link copied to clipboard!")
        }).catch(() => {
        showToast("Failed to copy profile link.")
        })
    } else {
        alert("Sharing is not supported on your browser.")
    }
    })

    // Add auto-save to all input events
    document.addEventListener("input", scheduleAutoSave)
    document.addEventListener("change", scheduleAutoSave)
  
    console.log("Profile page initialized successfully!")
  })
  