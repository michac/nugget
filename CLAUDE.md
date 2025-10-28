# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a pygame-based game called "Nugget Game". The project is in early development with a basic window setup and title rendering.

## Setup

The project uses `uv` for dependency management with a virtual environment.

```bash
# Create virtual environment (if not already created)
uv venv

# Install dependencies
uv pip install -r requirements.txt
```

## Running the Game

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

This will launch an 800x600 window with the game title displayed. The game uses pygame's event loop and can be closed via the window close button.

## Architecture

The project currently uses a simple single-file structure:

- **main.py**: Entry point containing the pygame initialization, main game loop, and rendering logic. The game loop handles:
  - Event processing (window close events)
  - Screen clearing and background filling
  - Title text rendering at the top of the window
  - Display updates via `pygame.display.flip()`

## Development Environment

- Python with pygame installed
- No additional dependencies beyond pygame and standard library (sys)

## Code Style

- Color constants defined as RGB tuples in UPPER_CASE (e.g., WHITE, BLACK, GOLD)
- Screen dimensions: 800x600
- Default font size: 64pt for title text
