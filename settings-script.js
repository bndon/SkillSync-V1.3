// === Theme loader: run before DOM ready ===
(function applyThemeEarly() {
  const explicitTheme = localStorage.getItem("theme");
  const settings = JSON.parse(localStorage.getItem("settingsData") || "{}");
  const storedTheme = explicitTheme || settings?.appearance?.theme;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const defaultSettings = {
    account: {
      email: "john@example.com",
      username: "johndoe",
    },
    profile: {
      fullName: "John Doe",
      bio: "Software developer with a passion for learning and teaching.",
      location: "San Francisco, CA",
      website: "https://johndoe.com",
      profilePicture: "/Images/person-icon.png",
    },
    appearance: {
      theme: "system",
      fontSize: 3,
    },
    notifications: {
      email: {
        courseUpdates: true,
        communityActivity: true,
        messages: false,
      },
      push: {
        courseReminders: true,
        newAchievements: true,
      },
    },
    privacy: {
      profileVisibility: "public",
      showLearningActivity: true,
      twoFactorAuth: false,
    },
    integrations: {
      github: false,
      google: true,
      linkedin: false,
      discord: false,
    },
  };

  let settingsData = JSON.parse(JSON.stringify(defaultSettings));
  const saved = localStorage.getItem("settingsData");

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      settingsData = deepMerge(settingsData, parsed);
    } catch (e) {
      console.warn("Invalid settings in localStorage");
    }
  }

  function deepMerge(target, source) {
    for (let key in source) {
      if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
        if (!target[key]) target[key] = {};
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }

  function saveSettingsData() {
    localStorage.setItem("settingsData", JSON.stringify(settingsData));
  }

  function loadSettingsData() {
    document.getElementById("email").value = settingsData.account.email;
    document.getElementById("username").value = settingsData.account.username;
    document.getElementById("full-name").value = settingsData.profile.fullName;
    document.getElementById("bio").value = settingsData.profile.bio;
    document.getElementById("location").value = settingsData.profile.location;
    document.getElementById("website").value = settingsData.profile.website;

    const theme = localStorage.getItem("theme") || settingsData.appearance.theme;
    const lightRadio = document.getElementById("theme-light");
    const darkRadio = document.getElementById("theme-dark");
    const systemRadio = document.getElementById("theme-system");

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      if (darkRadio) darkRadio.checked = true;
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
      if (lightRadio) lightRadio.checked = true;
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      if (systemRadio) systemRadio.checked = true;
    }

    const fontSizeSlider = document.getElementById("font-size-slider");
    if (fontSizeSlider) {
      fontSizeSlider.value = settingsData.appearance.fontSize;
      const fontSizes = ["0.75rem", "0.875rem", "1rem", "1.125rem", "1.25rem"];
      document.documentElement.style.fontSize = fontSizes[settingsData.appearance.fontSize - 1];
    }
  }

  function setTheme(theme) {
  settingsData.appearance.theme = theme;

  if (theme === "dark") {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else if (theme === "light") {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  } else {
    localStorage.removeItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  saveSettingsData();
  if (typeof showToast === "function") {
    showToast("Theme updated successfully!");
  } else if (theme === "light") {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  } else {
    localStorage.removeItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
  }

  const lightRadio = document.getElementById("theme-light");
  const darkRadio = document.getElementById("theme-dark");
  const systemRadio = document.getElementById("theme-system");

  if (lightRadio) lightRadio.addEventListener("change", () => setTheme("light"));
  if (darkRadio) darkRadio.addEventListener("change", () => setTheme("dark"));
  if (systemRadio) systemRadio.addEventListener("change", () => setTheme("system"));

  loadSettingsData();

  // Preview theme immediately on radio input change
  if (lightRadio) lightRadio.addEventListener("input", () => document.documentElement.classList.remove("dark"));
  if (darkRadio) darkRadio.addEventListener("input", () => document.documentElement.classList.add("dark"));
  if (systemRadio) systemRadio.addEventListener("input", () => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  });
});
