# GitHub Pulse ⚡
> **GitHub Repository Discovery & Analytics Dashboard**  
> Discover trending GitHub repositories and analyze their weekly development velocity and contributor activity with interactive Highcharts visualizations.

---

## 🚀 Overview

**GitHub Pulse** is a modern, responsive web application designed for developers, students, and open-source contributors to discover newly created popular repositories and dissect their commit, addition, and deletion patterns over time.

By communicating directly with the official GitHub REST API, GitHub Pulse:
1. Surfaces popular repositories created within the last **7, 14, or 30 days** sorted by stars.
2. Supports **Infinite Scrolling** powered by the browser's native `IntersectionObserver` API.
3. Provides an interactive **Analytics Dashboard** showcasing:
   - **Total Activity Chart**: 52-week timeline tracking weekly commits, code additions, and code deletions.
   - **Contributor Activity Chart**: Multi-line comparative timeline visualizing individual contributor outputs.
   - **Interactive Contributor Legend**: Granular show/hide toggles for every contributor with color-coded chips and "Show All / Hide All" helpers.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| **React 19** | Component-based UI architecture |
| **Redux Toolkit** | Global predictable application state management |
| **Redux Saga** | Asynchronous orchestration and API side effects |
| **Material UI (MUI v6)** | Design system, accessible components, and theming |
| **Highcharts & Highcharts React** | Interactive charts, spline curves, and tooltips |
| **Vite** | Blazing-fast build tool and development server |
| **React Router v7** | Single-page client-side routing |
| **date-fns** | ISO date parsing, formatting, and relative timeline utilities |
| **GitHub REST API** | Official GitHub Search & Repository Statistics endpoints |

---

## 📋 Features

### 1. Repository Discovery Dashboard (`/`)
- **Date Range Filters**: Instant toggling between **Last 7 Days**, **Last 14 Days**, and **Last 30 Days**.
- **Star-Based Ranking**: Real-time sorting in descending order of stars (`stargazers_count`).
- **Comprehensive Repository Cards**:
  - Owner avatar with fallback placeholder
  - Repository name & owner username
  - Formatted repository description with fallback
  - Stars counter chip
  - Open issues counter chip
  - Primary programming language badge
  - Relative update/push timestamp
  - Direct external link to original GitHub repository
- **Infinite Scrolling**: Smooth, pagination-aware scrolling that automatically loads additional repositories while avoiding duplicates and respecting GitHub API limits (up to 1,000 results).
- **Graceful States**: Skeleton loading screens, empty states, and descriptive error messages with retry options.

### 2. Repository Analytics Dashboard (`/repo/:owner/:repo`)
- **Repository Overview Header**: Full details, metrics, and quick navigation back to the discovery dashboard.
- **Activity Metric Selector**:
  - **Commits**: Total and per-contributor weekly commit volume.
  - **Additions**: Weekly lines of code added.
  - **Deletions**: Weekly lines of code deleted (negatives automatically converted to positive counts for visual consistency).
- **Total Activity Chart**: Area chart with gradient fill, formatted weekly X-axis dates, numeric Y-axis, and custom HTML hover tooltips.
- **Contributor Multi-Line Chart**: Visualizes each contributor's activity across the shared weekly timeline.
- **Interactive Contributor Legend**: Clickable contributor pills with color indicators to isolate individual contributors.
- **GitHub 202 Async Stats Handling**: Automatically retries statistics requests when GitHub returns `HTTP 202 Accepted` while compiling backend analytics.

---

## 📁 Project Structure

```
github-pulse/
├── public/
│   └── favicon.svg
├── src/
│   ├── app/
│   │   ├── store.js             # Redux Toolkit store + Saga middleware
│   │   └── rootSaga.js          # Combined root saga
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx       # Application navigation bar & brand
│   │   │   └── Footer.jsx       # Footer with API attribution
│   │   ├── repositories/
│   │   │   ├── DateFilter.jsx   # 7, 14, 30 days filter buttons
│   │   │   ├── RepositoryCard.jsx # Repo card matching design specifications
│   │   │   ├── RepositoryList.jsx # Infinite scroll list with IntersectionObserver
│   │   │   └── RepositorySkeleton.jsx # Skeleton loader cards
│   │   ├── analytics/
│   │   │   ├── ActivitySelector.jsx # Metric switch (commits/additions/deletions)
│   │   │   ├── TotalActivityChart.jsx # Highcharts area chart for total repository activity
│   │   │   ├── ContributorChart.jsx # Highcharts multi-line contributor activity chart
│   │   │   └── ContributorLegend.jsx # Interactive show/hide contributor pills
│   │   └── common/
│   │       ├── Loader.jsx       # Centered loading spinner
│   │       ├── ErrorMessage.jsx # Error banner with retry trigger
│   │       └── EmptyState.jsx   # No results view
│   ├── features/
│   │   ├── repositories/
│   │   │   ├── repositorySlice.js # Repository state and reducers
│   │   │   └── repositorySaga.js  # Saga for search API requests & pagination
│   │   └── analytics/
│   │       ├── analyticsSlice.js  # Analytics state, metrics, contributor visibility
│   │       └── analyticsSaga.js   # Saga for stats fetching and data normalization
│   ├── hooks/
│   │   └── reduxHooks.js        # Typed Redux hooks (useAppDispatch, useAppSelector)
│   ├── pages/
│   │   ├── Home.jsx             # Discovery dashboard page
│   │   └── RepositoryDetails.jsx# Repository analytics page
│   ├── services/
│   │   └── githubApi.js         # GitHub REST API client with cache & 202 retry logic
│   ├── theme/
│   │   └── theme.js             # Material UI theme matching PRD color palette
│   ├── utils/
│   │   ├── chartUtils.js        # Timeline alignment & stats normalization
│   │   ├── dateUtils.js         # date-fns helpers & formatters
│   │   └── formatUtils.js       # Color palette & text truncation
│   ├── App.jsx                  # Main router and shell layout
│   ├── index.css                # Global styles and scrollbar overrides
│   └── main.jsx                 # React root bootstrap
├── .env.example
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## ⚙️ Installation & Local Development

### 1. Clone the repository
```bash
git clone https://github.com/your-username/github-pulse.git
cd github-pulse
```

### 2. Install dependencies
```bash
npm install
```

### 3. Optional Environment Variables
By default, the application runs against the public GitHub REST API (60 unauthenticated requests per hour per IP). To raise the limit to 5,000 requests per hour for development, you can create a `.env` file:
```bash
cp .env.example .env
```
Inside `.env`:
```env
VITE_GITHUB_TOKEN=your_github_personal_access_token_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 5. Production Build
```bash
npm run build
npm run preview
```

---

## 🌐 CodeSandbox Deployment

This project is development-ready and can be directly imported into [CodeSandbox](https://codesandbox.io/):
1. Import from your GitHub repository or drag and drop this project directory into CodeSandbox.
2. Select the **Vite + React** template.
3. CodeSandbox will automatically detect `package.json`, install dependencies, and launch the dev server.

---

## 🔒 Security & Rate Limiting

- **No Secret Leakage**: The frontend code never hardcodes personal access tokens.
- **Rate Limit Warnings**: Whenever GitHub's rate limit is reached, the application detects the `x-ratelimit-reset` header and informs the user of the exact reset time.
- **In-Memory Cache**: Repeated searches and visited repositories are cached in memory to minimize outbound HTTP calls.
- **Sanitized Links**: All external GitHub links include `rel="noopener noreferrer"`.
