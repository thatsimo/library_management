# Library Management App

## Overview
This is a modern web application for managing a library, built with React, Tailwind CSS, and various Radix UI components. It leverages Vite for fast development and TypeScript for type safety.

## Prerequisites
Before you start, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or later recommended)
- [pnpm](https://www.pnpm.io/)

## Installation

Install dependencies:
```sh
pnpm install
```

## Running the Development Server

To start the development server, run:
```sh
pnpm dev
```
This will launch the app and you can access it at `http://localhost:5173` (or another port specified by Vite).

## Building for Production

To create a production build:
```sh
pnpm build
```
This will generate an optimized build in the `dist` folder.

To preview the production build locally:
```sh
pnpm preview
```

## Linting

To check for linting errors:
```sh
pnpm lint
```

## Project Structure

- `src/` - Contains the application source code
- `public/` - Static assets
- `dist/` - Compiled production build (generated after running `pnpm build`)
- `package.json` - Project dependencies and scripts

## Technologies Used

- **React 19** - UI Library
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI components
- **React Router** - Client-side routing