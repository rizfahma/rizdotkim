import type { Site, Page, Links, Socials } from "@types"

// Global
export const SITE: Site = {
  TITLE: "Rizqi Fahma",
  DESCRIPTION: "Welcome to Rizqi Fahma personal website/ blog",
  AUTHOR: "Rizqi Fahma",
}

// Work Page
export const WORK: Page = {
  TITLE: "Work",
  DESCRIPTION: "Places I have worked.",
}

// Blog Page
export const BLOG: Page = {
  TITLE: "Blog",
  DESCRIPTION: "Writing on topics I am passionate about.",
}
// About Page 
export const ABOUT: Page = {
  TITLE: "About",
  DESCRIPTION: "About Rizqi Fahma.",
}

// Projects Page 
export const PROJECTS: Page = {
  TITLE: "Projects",
  DESCRIPTION: "Recent projects I have worked on.",
}

// Search Page
export const SEARCH: Page = {
  TITLE: "Search",
  DESCRIPTION: "Search all posts and projects by keyword.",
}

// Links
export const LINKS: Links = [
  { 
    TEXT: "Home", 
    HREF: "/", 
  },
  // { 
  //   TEXT: "Work", 
  //   HREF: "/work", 
  // },
  { 
    TEXT: "Blog", 
    HREF: "/blog", 
  },
  { 
    TEXT: "About", 
    HREF: "/about", 
  },
  // { 
  //   TEXT: "Projects", 
  //   HREF: "/projects", 
  // },
]

// Socials
export const SOCIALS: Socials = [
  
  { 
    NAME: "LinkedIn",
    ICON: "linkedin",
    TEXT: "Rizqi Fahma",
    HREF: "https://www.linkedin.com/in/rizqifahma/",
  },
  { 
    NAME: "Twitter",
    ICON: "twitter-x",
    TEXT: "rizfahma",
    HREF: "https://twitter.com/rizfahma",
  },
  
]

