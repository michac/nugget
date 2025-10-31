# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a pygame-based game called "Nugget Breakout". A breakout-style game where you bounce a nugget to destroy burger bricks. The game is built with pygame-ce and can run both as a native desktop application and in web browsers via WebAssembly.

## Setup

The project uses `uv` for dependency management with a virtual environment.

```bash
# Create virtual environment (if not already created)
uv venv

# Install dependencies
uv pip install -r requirements.txt
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

To test the game in a browser locally:

```bash
# From parent directory
cd ..
nugget\.venv\Scripts\pygbag.exe nugget  # Windows
# nugget/.venv/bin/pygbag nugget  # macOS/Linux
```

Then open `http://localhost:8000` in your browser. The first build may take several minutes.

## Architecture

The project currently uses a simple single-file structure:

- **main.py**: Entry point containing the pygame initialization, main game loop, and rendering logic. The game loop handles:
  - Event processing (window close events)
  - Screen clearing and background filling
  - Title text rendering at the top of the window
  - Display updates via `pygame.display.flip()`

## Deployment to GitHub Pages

The game automatically deploys to GitHub Pages when you push to the `main` or `master` branch.

### First-time Setup

1. **Enable GitHub Actions permissions:**
   - Go to repository Settings > Actions > General
   - Under "Workflow permissions", select "Read and write permissions"
   - Click Save

2. **Configure GitHub Pages:**
   - Go to Settings > Pages
   - Under "Source", select "Deploy from a branch"
   - Under "Branch", select `gh-pages` and `/ (root)`
   - Click Save

3. **Push your changes:**
   ```bash
   git add .
   git commit -m "Add web support with pygbag"
   git push
   ```

4. **Access your game:**
   - After the GitHub Action completes, your game will be available at:
   - `https://[username].github.io/[repository-name]/`

The workflow file is located at `.github/workflows/pygbag.yml` and handles the build and deployment automatically.

## Development Environment

- Python 3.11+ with pygame-ce installed
- pygbag for web builds
- Dependencies managed via uv
- Standard library: sys, asyncio

## Code Style

- Color constants defined as RGB tuples in UPPER_CASE (e.g., WHITE, BLACK, GOLD)
- Screen dimensions: 800x600
- Default font size: 64pt for title text
- Async/await pattern for browser compatibility

## Technical Notes

- The game uses `asyncio` for cross-platform compatibility (desktop and web)
- Audio files must be in OGG format for web deployment
- Images should be PNG, WebP, or JPG (not BMP)
- The `await asyncio.sleep(0)` in the game loop allows the browser to process events
