# 🌍 The Global Doctrine

> **Geopolitics without gatekeeping.**  
> The official web platform for independent reporting on world conflicts, diplomacy, and global affairs through the lens of ordinary people.

![The Global Doctrine Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Tailwind%20%7C%20Sanity.io-blue)
![Status](https://img.shields.io/badge/Status-Active-success)

## 📖 Overview

The Global Doctrine is a fully custom, full-stack web platform built for a student-run independent geopolitical magazine. The architecture was designed to provide a premium, editorial-style reading experience while offering a frictionless, code-free publishing workflow for the editorial team.

# ✨ Key Features

- **Editorial UI/UX:** A bespoke design language utilizing fluid typography and CSS Grid, engineered to mimic the feel of a high-end print magazine.
- **Dynamic Theming:** Seamless Dark/Light mode capabilities. Features intelligent color inversion on complex components (like the submission forms and dropdowns) using custom Tailwind CSS variables.
- **Headless CMS Integration:** Powered by **Sanity.io**, allowing the editorial team to instantly publish articles, magazine issues, cover stories, and update the 'About' pages without developer intervention.
- **Serverless Data Pipelines ("The Doctrine Brief"):** A custom public submission portal that bypasses browser CORS restrictions using `text/plain` headers, securely transmitting user briefs directly to a private Google Sheet via a custom Google Apps Script API.
- **Custom Animations:** Smooth, performant UI transitions including staggering form entrances, animated custom select dropdowns, and responsive hover states.

# 🛠 Tech Stack

# Frontend
- **React.js** (UI Framework)
- **React Router** (Client-side routing)
- **Tailwind CSS** (Styling & Theming)
- **Lucide React** (Iconography)
- **Portable Text** (Rendering rich text from Sanity)

# Backend & CMS
- **Sanity.io** (Headless CMS & Content API)
- **Google Apps Script** (Serverless API endpoints)
- **Google Sheets** (Database for user submissions)

📬 Google Apps Script Integration
The "Doctrine Brief" form relies on a deployed Google Apps Script to function as a serverless backend.
The script processes POST requests and appends the JSON payload to a connected Google Sheet.

The live deployment URL is hardcoded in src/components/DoctrineBrief.tsx. If you fork this project, you will need to deploy your own Google Apps Script and update the GOOGLE_SCRIPT_URL variable.

🤝 Acknowledgements
Founded and run by International Relations students committed to independent, people-first geopolitical reporting.

Designed and Architected by [https://github.com/IshfaqElahi]
