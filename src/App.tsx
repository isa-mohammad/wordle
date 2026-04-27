import { useState, useEffect, useCallback } from 'react'
import './App.css'

const WORDS = [
  'ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT',
  'AFTER', 'AGAIN', 'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT',
  'ALIEN', 'ALIGN', 'ALIKE', 'ALLEY', 'ALLOW', 'ALONE', 'ALONG', 'ALTER',
  'ANGEL', 'ANGLE', 'ANGRY', 'ANKLE', 'APART', 'APPLE', 'APPLY', 'ARENA',
  'ARGUE', 'ARISE', 'ARMOR', 'ARRAY', 'ARROW', 'ASIDE', 'ASSET', 'ATLAS',
  'AUDIO', 'AUDIT', 'AVOID', 'AWAKE', 'AWARD', 'AWARE', 'AWFUL', 'BADLY',
  'BAKER', 'BASIC', 'BEACH', 'BEGIN', 'BEING', 'BELOW', 'BENCH', 'BLACK',
  'BLADE', 'BLAME', 'BLANK', 'BLAST', 'BLAZE', 'BLEED', 'BLESS', 'BLOCK',
  'BLOOD', 'BLOOM', 'BLOWN', 'BLUES', 'BLUNT', 'BOARD', 'BONUS', 'BOOST',
  'BOUND', 'BRAIN', 'BRAND', 'BRAVE', 'BREAD', 'BREAK', 'BREED', 'BRICK',
  'BRIDE', 'BRIEF', 'BRING', 'BROAD', 'BROKE', 'BROWN', 'BRUSH', 'BUILT',
  'BUNCH', 'CABIN', 'CANDY', 'CARRY', 'CATCH', 'CAUSE', 'CHAIN', 'CHAIR',
  'CHARM', 'CHART', 'CHASE', 'CHEAP', 'CHECK', 'CHESS', 'CHEST', 'CHIEF',
  'CHILD', 'CHOIR', 'CHUNK', 'CIVIL', 'CLAIM', 'CLASS', 'CLEAN', 'CLEAR',
  'CLICK', 'CLIFF', 'CLIMB', 'CLOCK', 'CLONE', 'CLOSE', 'CLOUD', 'COACH',
  'COAST', 'COULD', 'COUNT', 'COURT', 'COVER', 'CRAFT', 'CRASH', 'CRAZY',
  'CREAM', 'CREEK', 'CRIME', 'CROSS', 'CROWD', 'CROWN', 'CRUEL', 'CRUSH',
  'CURVE', 'CYCLE', 'DAILY', 'DANCE', 'DEALT', 'DEATH', 'DECAY', 'DELAY',
  'DELTA', 'DENSE', 'DEPTH', 'DIRTY', 'DOUBT', 'DOUGH', 'DRAFT', 'DRAIN',
  'DRAMA', 'DRAWN', 'DREAM', 'DRESS', 'DRIFT', 'DRILL', 'DRINK', 'DRIVE',
  'DROVE', 'DRUNK', 'DYING', 'EAGER', 'EAGLE', 'EARLY', 'EARTH', 'EIGHT',
  'ELECT', 'ELITE', 'EMPTY', 'ENEMY', 'ENJOY', 'ENTER', 'EQUAL', 'ERROR',
  'ESSAY', 'EVENT', 'EVERY', 'EXACT', 'EXIST', 'EXTRA', 'FAINT', 'FAIRY',
  'FAITH', 'FALSE', 'FANCY', 'FAULT', 'FEAST', 'FIELD', 'FIFTH', 'FIFTY',
  'FIGHT', 'FINAL', 'FIRST', 'FIXED', 'FLAME', 'FLASH', 'FLEET', 'FLESH',
  'FLOAT', 'FLOOD', 'FLOOR', 'FLOUR', 'FLUID', 'FOCUS', 'FORCE', 'FORGE',
  'FORTH', 'FORTY', 'FORUM', 'FOUND', 'FRAME', 'FRANK', 'FRAUD', 'FRESH',
  'FRONT', 'FROST', 'FRUIT', 'FUNNY', 'GHOST', 'GIANT', 'GIVEN', 'GLASS',
  'GLOBE', 'GLORY', 'GLOVE', 'GOING', 'GRACE', 'GRADE', 'GRAIN', 'GRAND',
  'GRANT', 'GRAPE', 'GRASP', 'GRASS', 'GRAVE', 'GREAT', 'GREED', 'GREEN',
  'GREET', 'GRIEF', 'GRIND', 'GROAN', 'GROOM', 'GROSS', 'GROUP', 'GROVE',
  'GROWN', 'GUARD', 'GUESS', 'GUEST', 'GUIDE', 'GUILT', 'HAPPY', 'HARSH',
  'HASTE', 'HEART', 'HEAVY', 'HENCE', 'HOTEL', 'HOUSE', 'HUMAN', 'HUMOR',
  'HURRY', 'IDEAL', 'IMAGE', 'INDEX', 'INPUT', 'ISSUE', 'IVORY', 'JELLY',
  'JEWEL', 'JOINT', 'JUDGE', 'JUICE', 'JUICY', 'KARMA', 'KNOCK', 'KNOWN',
  'LABEL', 'LANCE', 'LARGE', 'LASER', 'LATER', 'LAUGH', 'LAYER', 'LEARN',
  'LEASE', 'LEAST', 'LEGAL', 'LEMON', 'LEVEL', 'LIGHT', 'LIVER', 'LOCAL',
  'LODGE', 'LOGIC', 'LOOSE', 'LOWER', 'LUNAR', 'MAGIC', 'MAJOR', 'MAKER',
  'MANOR', 'MAPLE', 'MARCH', 'MATCH', 'MAYOR', 'MEDAL', 'MEDIA', 'MERCY',
  'MERIT', 'METAL', 'METRO', 'MIGHT', 'MINOR', 'MINUS', 'MIXED', 'MODEL',
  'MONEY', 'MONTH', 'MORAL', 'MOTOR', 'MOUNT', 'MOUSE', 'MOUTH', 'MOVIE',
  'MUSIC', 'NAIVE', 'NASTY', 'NAVAL', 'NERVE', 'NEVER', 'NIGHT', 'NOBLE',
  'NOISE', 'NORTH', 'NOTED', 'NOVEL', 'NURSE', 'OCCUR', 'OCEAN', 'OFFER',
  'OFTEN', 'ORDER', 'OTHER', 'OUTER', 'OWNED', 'OWNER', 'PAINT', 'PANEL',
  'PANIC', 'PAPER', 'PARTY', 'PASTA', 'PATCH', 'PAUSE', 'PEACE', 'PEARL',
  'PENNY', 'PHASE', 'PHONE', 'PHOTO', 'PIANO', 'PILOT', 'PIXEL', 'PIZZA',
  'PLACE', 'PLAIN', 'PLANE', 'PLANT', 'PLATE', 'PLAZA', 'POINT', 'POLAR',
  'POSED', 'POUND', 'POWER', 'PRESS', 'PRICE', 'PRIDE', 'PRIME', 'PRINT',
  'PRIOR', 'PRIZE', 'PROBE', 'PRONE', 'PROOF', 'PROSE', 'PROUD', 'PROVE',
  'PULSE', 'PUNCH', 'PUPIL', 'QUEEN', 'QUERY', 'QUEST', 'QUEUE', 'QUICK',
  'QUIET', 'QUOTA', 'QUOTE', 'RADAR', 'RADIO', 'RAISE', 'RANGE', 'RAPID',
  'RATIO', 'REACH', 'REACT', 'REALM', 'REBEL', 'REFER', 'REIGN', 'RELAX',
  'REPAY', 'RESET', 'RIDGE', 'RIDER', 'RISKY', 'RIVER', 'ROBOT', 'ROCKY',
  'ROUND', 'ROUTE', 'ROYAL', 'RULER', 'RURAL', 'SADLY', 'SAINT', 'SALAD',
  'SAUCE', 'SCALE', 'SCENE', 'SCOPE', 'SCORE', 'SCOUT', 'SENSE', 'SERVE',
  'SETUP', 'SEVEN', 'SHADE', 'SHAFT', 'SHALL', 'SHAME', 'SHAPE', 'SHARE',
  'SHARK', 'SHARP', 'SHELF', 'SHELL', 'SHIFT', 'SHINE', 'SHIRT', 'SHOCK',
  'SHOOT', 'SHORE', 'SHORT', 'SHOUT', 'SIGHT', 'SILLY', 'SINCE', 'SIXTH',
  'SKILL', 'SKULL', 'SLATE', 'SLAVE', 'SLEEP', 'SLIDE', 'SLOPE', 'SMART',
  'SMELL', 'SMILE', 'SMOKE', 'SNAKE', 'SOLAR', 'SOLID', 'SOLVE', 'SORRY',
  'SOUTH', 'SPACE', 'SPARK', 'SPEAK', 'SPEED', 'SPEND', 'SPICE', 'SPINE',
  'SPITE', 'SPLIT', 'SPOKE', 'SPOON', 'SPORT', 'SQUAD', 'STACK', 'STAFF',
  'STAGE', 'STAIN', 'STAIR', 'STAKE', 'STAND', 'STARE', 'START', 'STATE',
  'STEAL', 'STEAM', 'STEEL', 'STEEP', 'STEER', 'STERN', 'STICK', 'STIFF',
  'STILL', 'STOCK', 'STONE', 'STOOD', 'STORE', 'STORM', 'STORY', 'STOVE',
  'STRAP', 'STRAW', 'STRIP', 'STUCK', 'STUDY', 'STYLE', 'SUGAR', 'SUITE',
  'SUNNY', 'SUPER', 'SURGE', 'SWAMP', 'SWEAR', 'SWEEP', 'SWEET', 'SWIFT',
  'SWIRL', 'SWORD', 'TABLE', 'TASTE', 'TEACH', 'TEETH', 'TEMPT', 'TENSE',
  'TENTH', 'TERMS', 'THEIR', 'THEME', 'THERE', 'THESE', 'THICK', 'THING',
  'THINK', 'THIRD', 'THOSE', 'THREE', 'THREW', 'THROW', 'THUMB', 'TIGHT',
  'TIMER', 'TIRED', 'TITLE', 'TODAY', 'TOKEN', 'TOPIC', 'TOTAL', 'TOUCH',
  'TOUGH', 'TOWER', 'TOXIC', 'TRACE', 'TRACK', 'TRADE', 'TRAIL', 'TRAIN',
  'TRAIT', 'TRASH', 'TRIAL', 'TRIBE', 'TRICK', 'TRIED', 'TROOP', 'TRUCK',
  'TRULY', 'TRUNK', 'TRUST', 'TRUTH', 'TWICE', 'TWIST', 'ULTRA', 'UNCLE',
  'UNION', 'UNITE', 'UNTIL', 'UPPER', 'UPSET', 'URBAN', 'USAGE', 'USUAL',
  'UTTER', 'VALID', 'VALUE', 'VALVE', 'VIDEO', 'VIRAL', 'VIRUS', 'VISIT',
  'VITAL', 'VIVID', 'VOCAL', 'VOICE', 'VOTER', 'WAGON', 'WASTE', 'WATCH',
  'WATER', 'WEARY', 'WEAVE', 'WEIGH', 'WEIRD', 'WHALE', 'WHEAT', 'WHEEL',
  'WHERE', 'WHICH', 'WHILE', 'WHITE', 'WHOLE', 'WHOSE', 'WIDER', 'WOMAN',
  'WOMEN', 'WORLD', 'WORRY', 'WORSE', 'WORST', 'WORTH', 'WOULD', 'WOUND',
  'WRIST', 'WRITE', 'WROTE', 'YACHT', 'YEARN', 'YIELD', 'YOUNG', 'YOUTH',
  'ZEBRA', 'ZONED',
]

const WORD_LENGTH = 5
const MAX_GUESSES = 6
const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
]
const WIN_MESSAGES = ['Genius!', 'Magnificent!', 'Impressive!', 'Splendid!', 'Great!', 'Phew!']

type LetterStatus = 'correct' | 'present' | 'absent' | 'unknown'

function getLetterStatuses(guess: string, solution: string): LetterStatus[] {
  const statuses: LetterStatus[] = Array(WORD_LENGTH).fill('absent')
  const remaining: (string | null)[] = solution.split('')

  guess.split('').forEach((letter, i) => {
    if (letter === solution[i]) {
      statuses[i] = 'correct'
      remaining[i] = null
    }
  })

  guess.split('').forEach((letter, i) => {
    if (statuses[i] === 'correct') return
    const idx = remaining.indexOf(letter)
    if (idx !== -1) {
      statuses[i] = 'present'
      remaining[idx] = null
    }
  })

  return statuses
}

function App() {
  const [solution] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)])
  const [guesses, setGuesses] = useState<string[]>([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [gameOver, setGameOver] = useState(false)
  const [message, setMessage] = useState('')
  const [shakeRow, setShakeRow] = useState(false)

  const won = guesses[guesses.length - 1] === solution

  const showMessage = useCallback((msg: string, duration = 2000) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), duration)
  }, [])

  const submitGuess = useCallback(() => {
    if (currentGuess.length < WORD_LENGTH) {
      setShakeRow(true)
      setTimeout(() => setShakeRow(false), 600)
      showMessage('Not enough letters')
      return
    }
    if (!WORDS.includes(currentGuess)) {
      setShakeRow(true)
      setTimeout(() => setShakeRow(false), 600)
      showMessage('Not in word list')
      return
    }

    const newGuesses = [...guesses, currentGuess]
    setGuesses(newGuesses)
    setCurrentGuess('')

    const revealDelay = WORD_LENGTH * 120 + 300
    if (currentGuess === solution) {
      setTimeout(() => {
        showMessage(WIN_MESSAGES[newGuesses.length - 1] ?? 'Got it!', 2500)
        setGameOver(true)
      }, revealDelay)
    } else if (newGuesses.length >= MAX_GUESSES) {
      setTimeout(() => {
        showMessage(solution, 4000)
        setGameOver(true)
      }, revealDelay)
    }
  }, [currentGuess, guesses, solution, showMessage])

  const handleKey = useCallback((key: string) => {
    if (gameOver) return
    if (key === 'ENTER') {
      submitGuess()
    } else if (key === '⌫' || key === 'BACKSPACE') {
      setCurrentGuess(g => g.slice(0, -1))
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(g => g + key)
    }
  }, [gameOver, submitGuess, currentGuess.length])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      handleKey(e.key.toUpperCase())
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleKey])

  // Aggregate keyboard letter statuses
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

  // Build 6-row grid data
  const rows = Array.from({ length: MAX_GUESSES }, (_, r) => {
    const isActive = r === guesses.length
    const isRevealed = r < guesses.length
    const word = isActive ? currentGuess : (guesses[r] ?? '')
    const statuses = isRevealed ? getLetterStatuses(word, solution) : null

    return Array.from({ length: WORD_LENGTH }, (_, c) => ({
      letter: word[c] ?? '',
      status: (statuses?.[c] ?? 'unknown') as LetterStatus,
      isRevealed,
      isActive,
    }))
  })

  // suppress unused warning — won is used to prevent handleKey after win
  void won

  return (
    <div className="game">
      <header className="header">
        <h1>Wordle</h1>
      </header>

      {message && <div className="message">{message}</div>}

      <div className="board">
        {rows.map((row, r) => (
          <div
            key={r}
            className={`row${r === guesses.length && shakeRow ? ' shake' : ''}`}
          >
            {row.map((cell, c) => (
              <div
                key={c}
                className={[
                  'cell',
                  cell.status,
                  cell.isActive && cell.letter ? 'filled' : '',
                ].filter(Boolean).join(' ')}
                style={cell.isRevealed ? { animationDelay: `${c * 120}ms` } : {}}
              >
                {cell.letter}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="keyboard">
        {KEYBOARD_ROWS.map((row, r) => (
          <div key={r} className="keyboard-row">
            {row.map(key => (
              <button
                key={key}
                className={[
                  'key',
                  keyStatuses[key] ?? 'unknown',
                  key.length > 1 ? 'wide' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => handleKey(key)}
                aria-label={key}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>

      {gameOver && (
        <button className="new-game-btn" onClick={() => window.location.reload()}>
          New Game
        </button>
      )}
    </div>
  )
}

export default App
