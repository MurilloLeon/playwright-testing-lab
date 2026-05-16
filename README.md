# Playwright Testing Lab

[![Playwright Tests](https://github.com/MurilloLeon/playwright-testing-lab/actions/workflows/playwright.yml/badge.svg?branch=develop)](https://github.com/MurilloLeon/playwright-testing-lab/actions/workflows/playwright.yml)

A production-grade test automation framework built with **Playwright** and **TypeScript**, targeting the [Restful-Booker Platform](https://automationintesting.online) — a real-world hotel booking application with both a frontend and a REST API.

This project is designed as a portfolio showcase demonstrating industry-standard QA automation patterns.

---

## Application Under Test

| Layer | URL |
|---|---|
| UI (Web App) | https://automationintesting.online |
| API (REST) | https://automationintesting.online |

---

## Tech Stack

- **[Playwright](https://playwright.dev/)** — cross-browser end-to-end and API testing
- **[TypeScript](https://www.typescriptlang.org/)** — static typing for reliability
- **[dotenv](https://github.com/motdotla/dotenv)** — environment-based configuration
- **[GitHub Actions](https://github.com/features/actions)** — CI/CD with parallel sharding

---

## Project Structure

```
playwright-testing-lab/
├── .github/
│   └── workflows/
│       └── playwright.yml       # CI: UI (sharded) + API jobs
├── src/
│   ├── pages/                   # Page Object Model classes
│   │   ├── BasePage.ts          # Abstract base with shared helpers
│   │   ├── LoginPage.ts         # Admin login form
│   │   ├── AdminPage.ts         # Admin dashboard navigation
│   │   ├── RoomsPage.ts         # Room creation and listing
│   │   ├── BookingPage.ts       # Guest booking flow
│   │   └── components/
│   │       ├── NavBar.ts        # Top navigation component
│   │       └── RoomCard.ts      # Individual room card component
│   ├── fixtures/
│   │   ├── auth.fixture.ts      # Custom fixtures via test.extend()
│   │   └── index.ts             # Barrel export
│   ├── helpers/
│   │   ├── test-data.ts         # Factory functions for test data
│   │   └── api-client.ts        # Typed API request wrapper
│   └── types/
│       ├── auth.ts              # Auth domain types
│       ├── booking.ts           # Booking domain types
│       └── room.ts              # Room domain types
├── tests/
│   ├── ui/                      # Browser tests (Chromium + Firefox)
│   │   ├── auth/
│   │   │   ├── login.spec.ts
│   │   │   └── logout.spec.ts
│   │   ├── rooms/
│   │   │   └── room-management.spec.ts
│   │   └── booking/
│   │       └── booking-flow.spec.ts
│   └── api/                     # API tests (no browser)
│       ├── auth.api.spec.ts
│       ├── booking.api.spec.ts
│       └── room.api.spec.ts
├── .env.example                 # Environment variables template
├── playwright.config.ts         # Playwright configuration
├── tsconfig.json
└── package.json
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/MurilloLeon/playwright-testing-lab.git
cd playwright-testing-lab

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps chromium firefox
```

### Environment Setup

```bash
# Copy the example file and fill in your values
cp .env.example .env
```

The `.env` file accepts the following variables:

| Variable | Default | Description |
|---|---|---|
| `BASE_URL` | `https://automationintesting.online` | Web app base URL |
| `API_BASE_URL` | `https://automationintesting.online` | REST API base URL |
| `ADMIN_USERNAME` | `admin` | Admin login username |
| `ADMIN_PASSWORD` | `password` | Admin login password |

---

## Running Tests

```bash
# Run all tests (UI + API)
npm test

# Run only UI tests
npm run test:ui

# Run only API tests
npm run test:api

# Run UI tests in headed mode (see the browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Open the HTML report
npm run report

# Type-check without running tests
npm run lint
```

---

## CI/CD

The GitHub Actions workflow (`.github/workflows/playwright.yml`) runs on every push to `develop` or `main` and on pull requests targeting `main`.

**Jobs:**

- **`test-ui`** — UI tests split into 3 shards running in parallel on `ubuntu-latest`
- **`test-api`** — API tests running as a single lightweight job

On failure, the HTML report is uploaded as a workflow artifact with a 7-day retention period.

---

## Patterns and Techniques

### Page Object Model (POM)

Each page or component has a dedicated class with encapsulated locators and actions. Tests interact with the page through methods, never directly with selectors.

```typescript
// BAD — selectors scattered in tests
await page.locator('[data-testid="username"]').fill('admin');

// GOOD — actions exposed via POM
await loginPage.loginAsAdmin();
```

### Custom Fixtures (`test.extend`)

Repetitive setup is extracted into Playwright fixtures, providing dependency-injected, pre-configured objects.

```typescript
// Every test that needs an authenticated session:
test('admin sees the dashboard', async ({ adminPage }) => {
  await expect(adminPage.logoutButton).toBeVisible();
});
```

### Factory-Based Test Data

Test data is generated by factory functions with randomised fields, preventing conflicts in parallel runs.

```typescript
const booking = createBookingApiPayload(roomId);
// { firstname: 'John', email: 'test.4821@example.com', ... }
```

### UI vs API Test Separation

Two independent Playwright projects are configured in `playwright.config.ts`:

- `ui` — full browser context, `tests/ui/**`
- `api` — no browser, lightweight request context, `tests/api/**`

### Accessibility-First Selectors

Selectors are chosen in this order of preference:

1. `getByRole` — semantic HTML roles
2. `getByLabel` — form labels
3. `getByText` — visible text
4. `getByTestId` — `data-testid` attributes

---

## Branch Strategy

```
main       ← stable, review-gated
  └── develop  ← active development, all commits land here
```

---

## License

MIT
