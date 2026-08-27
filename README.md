<div align="center">

<img src="assets/zdrofit-cli-banner.svg" alt="Zdrofit CLI" width="650">

### Book your Zdrofit classes without leaving the terminal.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](...)
[![Node.js](https://img.shields.io/badge/Node.js-22%2B-339933?logo=node.js&logoColor=white)](...)
[![Ink](https://img.shields.io/badge/UI-Ink-61DAFB?logo=react)](...)
[![License](https://img.shields.io/badge/license-MIT-green)](...)
</div>


## About

**Zdrofit CLI** is an unofficial interactive terminal client for browsing,
booking and managing Zdrofit fitness classes.

It provides a fast, keyboard-driven interface for checking class schedules,
managing reservations and working with multiple accounts without using
the Zdrofit website manually.


## Preview



## Quick Start

Requires **Node.js 22+** and an active Zdrofit account.

```bash
git clone https://github.com/YOUR_USERNAME/zdrofit-cli.git
cd zdrofit-cli
npm install
npm start
```

## Features

- 🔐 Account and session management
- 🏢 Browse Zdrofit clubs
- 📅 Browse classes by date
- ✅ Book available classes
- ❌ Cancel reservations
- 🔄 Synchronize reservations
- ⌨️ Keyboard-driven terminal interface
- 💻 Cross-platform support

## How It Works

**Zdrofit CLI** authenticates the user through a browser session and then uses
the authenticated session to communicate with the Zdrofit website.

The application:
1. Opens a browser session for authentication.
2. Stores the authenticated session locally (system credential store)
3. Fetches clubs and class schedules from the Zdrofit website.
4. Parses HTML responses into application models.
5. Sends booking and cancellation requests directly from the terminal.
6. Synchronizes local reservation data with the current state of the website.

## Tech Stack

| Technology  | Purpose                      |
| ----------- | ---------------------------- |
| TypeScript  | Application language         |
| Node.js     | JavaScript runtime           |
| React + Ink | Terminal user interface      |
| Cheerio     | HTML parsing                 |
| Playwright  | Browser-based authentication |


## Project Structure

The project follows a feature-based structure that separates
UI, business logic, data access and infrastructure concerns.

```text
src/
├── features/
│   ├── account/
│   ├── clubs/
│   ├── classes/
│   └── reservations/
├── components/
├── screens/
├── infrastructure/
├── constants/
└── index.ts
```

## Disclaimer

**Zdrofit CLI** is an independent, unofficial project and is not affiliated
with, endorsed by or associated with Zdrofit or Benefit Systems S.A.

## License

This project is licensed under the MIT License.


