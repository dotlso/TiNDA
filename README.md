<div align="center">

# TiNDA
### Empowering Rural Retail, Anytime, Anywhere.

![Version](https://img.shields.io/badge/version-1.0.0-4A6B3A?style=for-the-badge)
![Platform](https://img.shields.io/badge/platform-Windows-4A6B3A?style=for-the-badge&logo=windows)
![Electron](https://img.shields.io/badge/Electron-desktop-47848F?style=for-the-badge&logo=electron)
![License](https://img.shields.io/badge/license-Academic-C8D9B8?style=for-the-badge)

*A lightweight offline-capable Point of Sale system built for rural retail stores.*

</div>

---

## Overview

**TiNDA** is a standalone Windows desktop POS application built with Electron, Node.js, and SQLite. It runs fully offline — no internet connection required — making it ideal for sari-sari stores, small shops, and community retailers in areas with limited connectivity.

---

## Features

| | Feature | Description |
|---|---|---|
| 🛒 | **Sales Transaction** | Process sales with product search, quantity input, and automatic totals |
| 📦 | **Inventory Management** | Add, edit, and track products with stock levels and low-stock alerts |
| 📊 | **Sales Reports** | View daily, weekly, and monthly sales summaries |
| 💾 | **Local Database** | All data stored locally via SQLite — fully offline, no cloud needed |
| 🖥️ | **Standalone App** | Packaged as a Windows `.exe` installer — no setup complexity |
| 🧾 | **Simple Interface** | Clean UI designed for non-technical retail store owners |

---

## Tech Stack

| Technology | Purpose | Version |
|---|---|---|
| **Electron** | Desktop app shell, window management | latest |
| **Node.js** | Backend runtime and server logic | 18+ |
| **Express.js** | REST API backend server | 4.x |
| **SQLite** | Local database engine | 3.x |
| **HTML / CSS / JS** | Frontend UI | ES2020+ |
| **electron-builder** | Packages the app into a `.exe` installer | 26.x |

---

## Project Structure

```
TiNDA/
├── backend/             # Express.js API server
├── database/            # SQLite database files
├── frontend/            # HTML, CSS, JavaScript UI
│   └── index.html       # Main entry point
├── node_modules/        # Dependencies
├── main.js              # Electron main process
├── package.json         # Project config & build settings
└── package-lock.json    # Dependency lock file
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)
- Windows 10 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tinda.git
   cd tinda
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run in development mode**
   ```bash
   npm start
   ```

### Build Windows Installer

```bash
npm run build
```

The `.exe` installer will be generated in the `/dist` folder.

---

## Database

TiNDA uses SQLite — all data is stored locally on the user's machine. When packaged as a `.exe`, the database lives at:

```
C:\Users\<Username>\AppData\Roaming\TiNDA\tinda.db
```

This ensures data is always writable and survives app updates.

---

## Usage

**Processing a Sale**
1. Search for a product by name
2. Enter quantity and add to cart
3. Review the total and confirm the sale

**Managing Inventory**
1. Navigate to the Inventory section
2. Add or edit products with name, price, and stock count
3. Monitor low-stock alerts on the dashboard

**Viewing Reports**
1. Go to the Reports section
2. Select a date range (daily / weekly / monthly)
3. View total sales, top products, and transaction history

---

## License

This project was developed as a **System Analysis and Design** academic project.

---

<div align="center">
  <sub>TiNDA — Empowering Rural Retail, Anytime, Anywhere. 🌿</sub>
</div>
