document.addEventListener("DOMContentLoaded", () => {
    const conversationsEl = document.querySelector(".conversation-list")
    const chatHeader = document.querySelector(".chat-user-name")
    const chatStatus = document.querySelector(".chat-user-status")
    const chatMessages = document.querySelector(".chat-messages")
    const chatAvatar = document.querySelector(".chat-avatar img")
    const messageInput = document.querySelector(".message-input")
    const messageForm = document.querySelector(".message-input-form")
    const newMsgBtn = document.querySelector(".new-message-btn")
    const modal = document.getElementById("new-message-modal")
    const closeModal = document.getElementById("modal-close")
    const newMessageForm = document.getElementById("new-message-form")
    const recipientInput = document.getElementById("recipient")
    const messageTextArea = document.getElementById("message-text")
    const emojiBtn = document.querySelector(".emoji-btn")
    const emojiPicker = document.getElementById("emoji-picker")
    const emojiList = document.getElementById("emoji-list")
    const emojiCategories = document.querySelectorAll(".emoji-category")
     
    const recipients = [
      { id: "1", name: "Sarah Johnson" },
      { id: "2", name: "Michael Chen" },
      { id: "3", name: "Emily Parker" },
      { id: "4", name: "David Wilson" },
    ]
  
    let currentUserIndex = 0
    let conversations = JSON.parse(localStorage.getItem("conversations") || "[]")
    
    const avatarFallback = "https://raw.githubusercontent.com/bndon/SkillSync-V1.3/main/images/essentials/person-icon.png"

    conversations.forEach(conv => {
      if (!conv.avatar || conv.avatar.includes("undefined") || conv.avatar === "") {
        conv.avatar = avatarFallback
      }
    })

    if (conversations.length === 0) {
        conversations = [
          {
            name: "Alex Rodriguez",
            avatar: "https://raw.githubusercontent.com/bndon/SkillSync-V1.3/main/images/essentials/person-icon.png",
            status: "online",
            lastTime: "10:30 AM",
            messages: [
              {
                from: "Alex Rodriguez",
                text: "Hey John! I saw your React project on GitHub and was really impressed with your component architecture.",
                time: "10:15 AM"
              },
              {
                from: "Alex Rodriguez",
                text: "I'm working on a similar project and was wondering if you'd be interested in collaborating?",
                time: "10:16 AM"
              },
              {
                from: "me",
                text: "Hi Alex! Thanks for reaching out and for the kind words about my project.",
                time: "10:20 AM"
              },
              {
                from: "me",
                text: "I'd definitely be interested in collaborating! What kind of project are you working on?",
                time: "10:21 AM"
              },
              {
                from: "Alex Rodriguez",
                text: "It's an e-commerce platform using React and Node.js. I think your expertise in component design would be really valuable!",
                time: "10:30 AM"
              }
            ]
          },
          {
            name: "Sarah Johnson",
            avatar: "https://raw.githubusercontent.com/bndon/SkillSync-V1.3/main/images/essentials/person-icon.png",
            status: "offline",
            lastTime: "Yesterday",
            messages: [
              {
                from: "Sarah Johnson",
                text: "I've shared some resources on advanced CSS techniques that might help with your current project.",
                time: "Yesterday"
              }
            ]
          },
          {
            name: "Michael Chen",
            avatar: "https://raw.githubusercontent.com/bndon/SkillSync-V1.3/main/images/essentials/person-icon.png",
            status: "online",
            lastTime: "Yesterday",
            messages: [
              {
                from: "Michael Chen",
                text: "Thanks for your feedback on my UX design. I've made the changes you suggested.",
                time: "Yesterday"
              }
            ]
          },
          {
            name: "Emily Parker",
            avatar: "https://raw.githubusercontent.com/bndon/SkillSync-V1.3/main/images/essentials/person-icon.png",
            status: "away",
            lastTime: "2 days ago",
            messages: [
              {
                from: "Emily Parker",
                text: "Do you have time to review my code this week? I'm stuck on implementing the authentication flow.",
                time: "2 days ago"
              }
            ]
          },
          {
            name: "David Wilson",
            avatar: "https://raw.githubusercontent.com/bndon/SkillSync-V1.3/main/images/essentials/person-icon.png",
            status: "offline",
            lastTime: "3 days ago",
            messages: [
              {
                from: "David Wilson",
                text: "I'm organizing a study group for the upcoming JavaScript course. Would you like to join?",
                time: "3 days ago"
              }
            ]
          }
        ]
      
        localStorage.setItem("conversations", JSON.stringify(conversations))
      }
      
  
    function populateRecipientDropdown() {
      recipientInput.innerHTML = '<option value="">Select a recipient</option>'
      recipients.forEach(r => {
        const option = document.createElement("option")
        option.value = r.id
        option.textContent = r.name
        recipientInput.appendChild(option)
      })
    }
  
    function loadConversationList() {
      conversationsEl.innerHTML = ""
      conversations.forEach((conv, index) => {
        const el = document.createElement("div")
        el.className = "conversation-item"
        if (index === currentUserIndex) el.classList.add("active")
        el.innerHTML = `
          <div class="conversation-avatar">
            <img src="${conv.avatar}" alt="${conv.name}">
            <span class="status-indicator ${conv.status}"></span>
          </div>
          <div class="conversation-info">
            <div class="conversation-header">
              <h3 class="conversation-name">${conv.name}</h3>
              <span class="conversation-time">${conv.lastTime || ""}</span>
            </div>
            <p class="conversation-preview">${conv.messages.at(-1)?.text || ""}</p>
          </div>
        `
        el.addEventListener("click", () => switchConversation(index))
        conversationsEl.appendChild(el)
      })
    }
  
    function switchConversation(index) {
      currentUserIndex = index
      document.querySelectorAll(".conversation-item").forEach((el, i) => {
        el.classList.toggle("active", i === index)
      })
      renderConversation()
    }
  
    function renderConversation() {
      const user = conversations[currentUserIndex]
      chatHeader.textContent = user.name
      chatStatus.textContent = user.status === "online" ? "Online" : "Offline"
      chatAvatar.src = user.avatar
  
      chatMessages.innerHTML = ""
      user.messages.forEach((msg) => {
        const item = document.createElement("div")
        item.className = `message-item ${msg.from === "me" ? "sent" : "received"}`
        item.innerHTML = `
          ${msg.from !== "me" ? `<div class="message-avatar"><img src="${user.avatar}" alt="${user.name}"></div>` : ""}
          <div class="message-content">
            <div class="message-bubble"><p>${msg.text}</p></div>
            <span class="message-time">${msg.time}</span>
          </div>
        `
        chatMessages.appendChild(item)
      })
      chatMessages.scrollTop = chatMessages.scrollHeight
    }
  
    function sendMessage(text) {
      if (!text.trim()) return
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      const user = conversations[currentUserIndex]
      user.messages.push({ from: "me", text, time })
      user.lastTime = time
      save()
      renderConversation()
      loadConversationList()
    }
  
    messageForm.addEventListener("submit", (e) => {
      e.preventDefault()
      sendMessage(messageInput.value)
      messageInput.value = ""
    })
  
    newMsgBtn.addEventListener("click", () => modal.classList.add("active"))
    closeModal.addEventListener("click", () => modal.classList.remove("active"))
  
    newMessageForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const name = recipientInput.options[recipientInput.selectedIndex].text
      const recipientId = recipientInput.value
      const messageText = messageTextArea.value.trim()
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      if (!recipientId || !messageText) return
  
      let existing = conversations.findIndex(c => c.name === name)
      if (existing !== -1) {
        conversations[existing].messages.push({ from: "me", text: messageText, time })
        conversations[existing].lastTime = time
        currentUserIndex = existing
      } else {
        conversations.unshift({
          name,
          avatar: "https://raw.githubusercontent.com/bndon/SkillSync-V1.3/main/images/essentials/person-icon.png",
          status: "online",
          lastTime: time,
          messages: [{ from: "me", text: messageText, time }]
        })
        currentUserIndex = 0
      }
      save()
      modal.classList.remove("active")
      newMessageForm.reset()
      loadConversationList()
      switchConversation(currentUserIndex)
    })
  
    function save() {
      localStorage.setItem("conversations", JSON.stringify(conversations))
    }
  
    // Emoji Picker
    emojiBtn.addEventListener("click", () => {
      emojiPicker.classList.toggle("active")
      emojiPicker.style.bottom = "70px"
    })
  
    document.getElementById("emoji-picker-close").addEventListener("click", () => {
      emojiPicker.classList.remove("active")
    })
  
    emojiCategories.forEach((cat) => {
      cat.addEventListener("click", () => {
        document.querySelectorAll(".emoji-category").forEach(c => c.classList.remove("active"))
        cat.classList.add("active")
        loadEmojis(cat.dataset.category)
      })
    })
  
    const emojiData = {
      smileys: ["😀","😃","😄","😁","😆"],
      people: ["👋","👍","🙌"],
      animals: ["🐶","🐱","🐭"],
      food: ["🍎","🍕","🍔"],
      travel: ["🚗","✈️","🚀"],
      activities: ["⚽","🏀","🎮"],
      objects: ["💡","📱","🎧"],
      symbols: ["❤️","✨","🔥"]
    }
  
    function loadEmojis(category) {
      emojiList.innerHTML = ""
      emojiData[category].forEach((emoji) => {
        const btn = document.createElement("button")
        btn.className = "emoji"
        btn.textContent = emoji
        btn.addEventListener("click", () => {
          const cursorPos = messageInput.selectionStart
          const value = messageInput.value
          messageInput.value = value.slice(0, cursorPos) + emoji + value.slice(cursorPos)
          messageInput.focus()
          emojiPicker.classList.remove("active")
        })
        emojiList.appendChild(btn)
      })
    }
  
    populateRecipientDropdown()
    loadEmojis("smileys")
    loadConversationList()
    switchConversation(0)
    document.getElementById("attachment-btn").addEventListener("click", () => {
    document.getElementById("attachment-input").click()
  })
  
  })
  
