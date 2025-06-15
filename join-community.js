// Join Community Logic (to be placed in explore.html or linked external JS)
document.addEventListener("DOMContentLoaded", () => {
  const joinButtons = document.querySelectorAll(".community-join-btn")

  // Prevent rejoining
  const joinedCommunities = JSON.parse(localStorage.getItem("userCommunities") || "[]")
  const joinedNames = new Set(joinedCommunities.map(c => c.name))

  joinButtons.forEach((btn) => {
    const card = btn.closest(".community-card")
    const title = card.querySelector(".community-title")?.innerText || "Unnamed"

    if (joinedNames.has(title)) {
      btn.innerText = "Joined"
      btn.disabled = true
      btn.classList.add("joined")
    }

    btn.addEventListener("click", () => {
      const communityData = {
        id: Date.now(),
        name: title,
        description: card.querySelector(".community-description")?.innerText || "",
        banner: card.querySelector(".community-banner")?.src || "",
        image: card.querySelector(".community-avatar img")?.src || "",
        members: card.querySelector(".community-members")?.innerText || "0",
        activity: card.querySelector(".community-activity")?.innerText || "-",
        tags: [],
        joined: true,
        creator: false,
        createdAt: new Date().toISOString(),
      }

      // Save to localStorage
      const communities = JSON.parse(localStorage.getItem("userCommunities") || "[]")
      communities.unshift(communityData)
      localStorage.setItem("userCommunities", JSON.stringify(communities))

      // Update button
      btn.innerText = "Joined"
      btn.disabled = true
      btn.classList.add("joined")

      alert(`${communityData.name} added to your communities!`)
    })
  })
})
