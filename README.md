# SovereignQuest

Welcome to the **SovereignQuest** project! This is a custom virtual tabletop (VTT) application built from the ground up to provide a unique experience for the SovereignQuest world.

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Development Setup](#development-setup)
- [Scripts](#scripts)
- [Code Quality and Pre-Commit Hooks](#code-quality-and-pre-commit-hooks)
- [Contributing](#contributing)
- [License](#license)

## Introduction

**SovereignQuest** is an immersive VTT application designed to bring the world of SovereignQuest to life, enabling players and game masters to easily run their campaigns in a fully customizable environment. This project is a collaborative effort, and contributions are welcome to help make it better.

## Installation

To set up **SovereignQuest** locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/TheNetworkOfficial/SovereignQuest.git
   cd SovereignQuest
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Prepare Husky**:
   Husky needs to be initialized after installing dependencies:
   ```bash
   npm run prepare
   ```

## Development Setup

This project uses Webpack for bundling and requires Node.js and npm. Please ensure you have the following installed:

- Node.js (v16 or later)
- npm (v7 or later)

After installing dependencies, you should be ready to start contributing to the project. To maintain code quality, make sure to follow the guidelines mentioned in the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## Running Webpack

To interact with the project using Webpack, use the following commands:

- npm run start: Starts the development server with Webpack.
- npm run build: Builds the project for production.

## Scripts

A number of scripts have been set up for development convenience:

- **`npm run prepare`**: Installs Husky hooks for code quality checks.
- **`npm run lint`**: Runs ESLint across the project to identify code issues.
- **`npm run prettier`**: Formats the codebase according to Prettier rules.
- **`npm run test`**: Runs any test scripts (currently none defined).

## Code Quality and Pre-Commit Hooks

**SovereignQuest** uses **Husky** and **lint-staged** to enforce code quality standards before commits are allowed. The following tools are in place:

- **ESLint**: Ensures consistent JavaScript code style and detects syntax issues.
- **Prettier**: A formatter to enforce consistent code formatting.
- **Husky**: Pre-commit hooks are set up to run ESLint and Prettier on staged files before allowing a commit, ensuring all code is checked and formatted properly.

These tools help maintain a high standard of code quality and make the development process smoother for all contributors, including those new to programming.

### Lint-Staged Configuration

- During a pre-commit operation, all staged `.js` files are automatically checked and formatted with **ESLint** and **Prettier**.
- To run these manually:
  ```bash
  npx lint-staged
  ```

## Contributing

We welcome contributions of all types! Please refer to the [CONTRIBUTING.md](CONTRIBUTING.md) file for information on how to get started. It includes important details on:

- Branching conventions
- Pull request guidelines
- Code style standards
- Issue tracking

### Setting Up for Contribution

- **Fork** the repository and clone it locally.
- Set up your environment by following the installation and development steps above.
- **Make sure to follow the pre-commit checks** to ensure your contributions meet project standards.

## License

The **SovereignQuest** project is proprietary software. All rights reserved. Please contact the project maintainers for more information.

---

Thank you for being part of **SovereignQuest**. Let's build something amazing together!
