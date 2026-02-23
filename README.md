# Memory Card Flip Game

A simple browser-based **memory matching** game built with **HTML + JavaScript** and styled using **Tailwind CSS (CDN)**. Flip two cards at a time—if the emojis match, they stay revealed; if not, they flip back.

## Demo / Run Locally

This project is static (no build tools required).

### Option 1: Open directly
1. Download/clone the repo
2. Open `index.html` in your browser

### Option 2: Run with a local server (recommended)
From the project folder:

```bash
# Python 3
python -m http.server 5500
```

Then visit: `http://localhost:5500`

## How to Play

- Click a card to reveal an emoji.
- Click a second card:
  - If both emojis match, the pair stays revealed.
  - If they don’t match, both cards hide again after a short delay.
- Use **Reset Game** to reshuffle and restart at any time.

## Project Structure

- `index.html` — page layout + Tailwind CDN + game container
- `script.js` — game logic (shuffle, flip/match handling, reset)

## Features

- Emoji card deck (pairs)
- Shuffle on every new game
- Prevents clicking while two non-matching cards are being resolved (board lock)
- Reset button to restart instantly

## Tech Stack

- **HTML**
- **JavaScript (Vanilla)**
- **Tailwind CSS** via CDN
