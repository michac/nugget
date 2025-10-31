# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a game called "Nugget Breakout". A breakout-style game where you bounce a nugget to destroy burger bricks.

The project contains two versions:
- **Desktop Version**: Built with pygame-ce (in root directory)
- **Web Version**: Built with Phaser.js and Vite (in `web/` directory)

## Setup

### Desktop Version (Pygame)

The desktop version uses `uv` for dependency management with a virtual environment.

```bash
# Create virtual environment (if not already created)
uv venv

# Install dependencies
uv pip install -r requirements.txt
```

### Web Version (Phaser.js)

The web version uses npm for dependency management.

```bash
# Navigate to web directory
cd web

# Install dependencies
npm install
```

## Running the Game

### Desktop Version

```bash
# Activate virtual environment first
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # macOS/Linux

# Run the game
python main.py
```

Or run directly with uv:

```bash
uv run python main.py
```

This will launch an 800x600 window with the game. The game uses pygame's event loop and can be closed via the window close button.

### Web Version (Browser)

To run the web version locally with Vite's dev server:

```bash
# Navigate to web directory
cd web

# Start development server
npm run dev
```

This will start a local server at `http://localhost:3000` and automatically open the game in your browser. The dev server includes hot module replacement for instant updates during development.

To build the production version:

```bash
cd web
npm run build
```

The built files will be in `web/dist/` directory.

## Architecture

### Desktop Version (Pygame)

Simple single-file structure:

- **main.py**: Entry point containing the pygame initialization, main game loop, and rendering logic. The game loop handles:
  - Event processing (window close events)
  - Screen clearing and background filling
  - Game objects (Paddle, Ball, Brick classes)
  - Collision detection
  - Display updates via `pygame.display.flip()`

### Web Version (Phaser.js)

Scene-based architecture:

- **web/index.html**: HTML entry point with game canvas container
- **web/main.js**: Phaser game configuration and scene initialization
- **web/scenes/Preload.js**: Asset loading scene
- **web/scenes/Game.js**: Main game scene with all game logic
- **web/public/assets/**: Game assets (images, sounds)
- **web/vite.config.js**: Vite build configuration

## Deployment to GitHub Pages

The web version (Phaser.js) automatically deploys to GitHub Pages when you push to the `main` or `master` branch.

### First-time Setup

1. **Configure GitHub Pages:**
   - Go to repository Settings > Pages
   - Under "Source", select "GitHub Actions"
   - Save the settings

2. **Push your changes:**
   ```bash
   git add .
   git commit -m "Add Phaser.js web version"
   git push
   ```

3. **Access your game:**
   - After the GitHub Action completes, your game will be available at:
   - `https://[username].github.io/[repository-name]/`

The workflow file is located at `.github/workflows/deploy-phaser.yml` and handles the build and deployment automatically. It:
1. Installs Node.js and npm dependencies
2. Builds the production version with Vite
3. Deploys the `web/dist/` directory to GitHub Pages

## Development Environment

### Desktop Version
- Python 3.11+ with pygame-ce installed
- Dependencies managed via uv
- Standard library: sys, asyncio

### Web Version
- Node.js 20+ with npm
- Vite (development server and build tool)
- Phaser.js 3.87.0

## Code Style

### Shared
- Screen dimensions: 800x600
- Colors: Dark blue background (#141e32), white text, gold for win state (#ffd700)
- Assets: nugget.png (30x30 ball), burger_brick.png (bricks), fart.ogg (sound effect)

### Pygame Version
- Color constants as RGB tuples in UPPER_CASE (e.g., WHITE, BLACK, GOLD)
- Class-based game objects (Paddle, Ball, Brick)
- Async/await pattern for browser compatibility

### Phaser.js Version
- Scene-based architecture (Preload, Game)
- Hex color codes for colors
- Phaser's built-in physics and sprite system

## Technical Notes

### Desktop Version (Pygame)
- Uses `asyncio` for cross-platform compatibility
- Simple collision detection with rect.colliderect()
- Manual velocity and position updates

### Web Version (Phaser.js)
- Arcade Physics for movement and collisions
- Asset preloading in dedicated scene
- Automatic canvas scaling and rendering
- OGG audio format for wide browser support
