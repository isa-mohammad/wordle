# Rules — Wordle Game

Reference for the game logic implemented in `src/App.tsx`.

---

## Game Rules

- The player has **6 attempts** to guess a secret **5-letter word**
- After each guess, every tile flips to reveal its status:
  - **Green (`correct`)** — right letter, right position
  - **Yellow (`present`)** — right letter, wrong position
  - **Gray (`absent`)** — letter not in the word at all
- Only words in the dictionary (`WORDS` array) are accepted
- Game ends on a correct guess or after 6 failed attempts

---

## Duplicate Letter Rules

The most nuanced part of Wordle scoring. Two-pass algorithm:

**Pass 1** — mark exact matches (`correct`) and remove those letters from the pool.  
**Pass 2** — for remaining letters, check if they appear anywhere in the leftover pool (`present`). Consume each pool slot once.

```ts
function getLetterStatuses(guess: string, solution: string): LetterStatus[] {
  const statuses = Array(5).fill('absent')
  const remaining = solution.split('')       // pool of unmatched letters

  // Pass 1 — exact matches
  guess.split('').forEach((letter, i) => {
    if (letter === solution[i]) {
      statuses[i] = 'correct'
      remaining[i] = null                    // consume from pool
    }
  })

  // Pass 2 — present elsewhere
  guess.split('').forEach((letter, i) => {
    if (statuses[i] === 'correct') return
    const idx = remaining.indexOf(letter)
    if (idx !== -1) {
      statuses[i] = 'present'
      remaining[idx] = null                  // consume so it isn't double-counted
    }
  })

  return statuses
}
```

**Example** — solution `CRANE`, guess `SPEED`:
- `S` → absent (not in CRANE)
- `P` → absent
- `E` → present (E is in CRANE, but position 3 is wrong)
- `E` → absent (only one E in pool, already consumed)
- `D` → absent

---

## State Shape

```ts
const [solution, ...]     // random word chosen once on mount
const [guesses, ...]      // string[] — submitted words, length 0–6
const [currentGuess, ...] // string — what the player is currently typing
const [gameOver, ...]     // true after win or 6th wrong guess
const [message, ...]      // toast text, cleared after timeout
const [shakeRow, ...]     // triggers CSS shake on invalid submit
```

---

## Grid Data Model

`rows` is a 6×5 matrix computed each render. Each cell:

```ts
{
  letter: string        // the character to display, '' if empty
  status: LetterStatus  // correct | present | absent | unknown
  isRevealed: boolean   // true for submitted rows — triggers flip animation
  isActive: boolean     // true for the row the player is currently typing
}
```

Row states:

| Row index | `isRevealed` | `isActive` | `status` |
|---|---|---|---|
| `r < guesses.length` | true | false | computed |
| `r === guesses.length` | false | true | always `unknown` |
| `r > guesses.length` | false | false | always `unknown` |

---

## Keyboard State

`keyStatuses` maps each letter to its best known status across all guesses.
Priority: `correct` > `present` > `absent`. Once a key is green it never downgrades.

```ts
const keyStatuses: Record<string, LetterStatus> = {}
guesses.forEach(guess => {
  getLetterStatuses(guess, solution).forEach((status, i) => {
    const letter = guess[i]
    const current = keyStatuses[letter]
    if (current === 'correct') return
    if (current === 'present' && status !== 'correct') return
    keyStatuses[letter] = status
  })
})
```

---

## Input Handling

Physical keyboard and on-screen keyboard both call `handleKey(key: string)`.

```ts
// Physical keyboard
window.addEventListener('keydown', e => handleKey(e.key.toUpperCase()))

// On-screen keyboard
<button onClick={() => handleKey(key)}>
```

`handleKey` is a no-op when `gameOver` is true.

---

## Animations (CSS)

| Animation | Trigger | Duration |
|---|---|---|
| `reveal` | Cell gets `correct/present/absent` class | 400ms, staggered 120ms per column |
| `pop` | Cell gets `filled` class (letter typed) | 80ms |
| `shake` | Invalid submit — `shakeRow` state true | 500ms |
| `fadeInDown` | `.message` element mounts | 150ms |

Game-over message is delayed by `WORD_LENGTH × 120ms + 300ms` so it appears after the last tile finishes flipping.

---

## Win Messages by Attempt

```ts
const WIN_MESSAGES = ['Genius!', 'Magnificent!', 'Impressive!', 'Splendid!', 'Great!', 'Phew!']
//                     1st try     2nd try          3rd try        4th try     5th try   6th try
```

---

## Files

| File | Purpose |
|---|---|
| `src/App.tsx` | All game logic and JSX |
| `src/App.css` | Wordle-themed dark styles and animations |
| `src/index.css` | Minimal body/root reset only |
