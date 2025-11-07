const THEME_STORAGE_KEY = "theme";
const DEFAULT_THEME = "light";

function applyTheme(theme) {
  const element = document.documentElement;
  if (theme === "dark") {
    element.classList.add("dark");
  } else {
    element.classList.remove("dark");
  }
}

function changeTheme() {
  const element = document.documentElement;
  const isDark = element.classList.contains("dark");
  const theme = isDark ? "light" : "dark";

  const css = document.createElement("style");
  css.appendChild(
    document.createTextNode(
      `* {
           -webkit-transition: none !important;
           -moz-transition: none !important;
           -o-transition: none !important;
           -ms-transition: none !important;
           transition: none !important;
        }`,
    ),
  );
  document.head.appendChild(css);

  applyTheme(theme);

  window.getComputedStyle(css).opacity;
  document.head.removeChild(css);
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

function preloadTheme() {
  let theme = localStorage.getItem(THEME_STORAGE_KEY);
  if (!theme) {
    theme = DEFAULT_THEME;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
  applyTheme(theme);
}

window.onload = () => {
  function initializeThemeControls() {
    const headerThemeButton = document.getElementById("header-theme-button");
    const drawerThemeButton = document.getElementById("drawer-theme-button");
    
    headerThemeButton?.addEventListener("click", changeTheme);
    drawerThemeButton?.addEventListener("click", changeTheme);
  }

  document.addEventListener("astro:after-swap", initializeThemeControls);
  initializeThemeControls();
};

document.addEventListener("astro:after-swap", preloadTheme);
preloadTheme();
