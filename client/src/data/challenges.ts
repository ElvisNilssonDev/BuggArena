import type { Difficulty } from '../constants'

export interface Solution {
  id: string
  challengeId: string
  authorId: string
  code: string
  explanation: string
  votes: number
  voters: string[]
  createdAt: string
}

export interface Challenge {
  id: string
  title: string
  description: string
  buggyCode: string
  language: string
  difficulty: Difficulty
  tags: string[]
  authorId: string
  createdAt: string
  solutions: Solution[]
}

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'c1',
    title: 'Off-by-One Iterator',
    description:
      'This function is supposed to sum the first N elements of an array, but it keeps throwing an IndexError for certain inputs. Find and fix the bug.',
    buggyCode: `def sum_first_n(arr, n):
    total = 0
    for i in range(n + 1):  # iterates one too many times
        total += arr[i]
    return total

# Test
print(sum_first_n([1, 2, 3, 4, 5], 3))  # Should print 6, throws IndexError`,
    language: 'Python',
    difficulty: 'easy',
    tags: ['loops', 'indexing', 'arrays'],
    authorId: 'u5',
    createdAt: '2024-03-22',
    solutions: [
      {
        id: 's1',
        challengeId: 'c1',
        authorId: 'u1',
        code: `def sum_first_n(arr, n):
    total = 0
    for i in range(n):  # fixed: range(n) not range(n + 1)
        total += arr[i]
    return total`,
        explanation:
          'The bug is `range(n + 1)` which generates indices 0 through n inclusive. For an array of length n, index n is out of bounds. The fix is simply `range(n)` which gives 0 through n-1.',
        votes: 12,
        voters: ['u2', 'u3', 'u4', 'u5'],
        createdAt: '2024-03-22',
      },
      {
        id: 's2',
        challengeId: 'c1',
        authorId: 'u2',
        code: `def sum_first_n(arr, n):
    return sum(arr[:n])  # Pythonic slice approach`,
        explanation:
          'A cleaner Pythonic fix: slice `arr[:n]` gives exactly the first n elements, then `sum()` handles the rest. No manual indexing means no off-by-one risk.',
        votes: 8,
        voters: ['u1', 'u3'],
        createdAt: '2024-03-23',
      },
    ],
  },
  {
    id: 'c2',
    title: 'Async Race Condition',
    description:
      'A counter is being incremented by multiple async operations, but the final count is always wrong. The function loses updates. Identify the race condition and propose a fix.',
    buggyCode: `let counter = 0;

async function incrementCounter() {
  const current = counter;          // reads stale value
  await new Promise(r => setTimeout(r, 10));
  counter = current + 1;            // overwrites concurrent updates
}

// Run 5 concurrent increments
await Promise.all([...Array(5)].map(() => incrementCounter()));
console.log(counter); // Expected: 5 — Actual: 1`,
    language: 'JavaScript',
    difficulty: 'medium',
    tags: ['async', 'concurrency', 'race-condition'],
    authorId: 'u4',
    createdAt: '2024-03-25',
    solutions: [
      {
        id: 's3',
        challengeId: 'c2',
        authorId: 'u1',
        code: `// Option 1: atomic increment (no async gap)
let counter = 0;

async function incrementCounter() {
  await new Promise(r => setTimeout(r, 10));
  counter++;  // increment after await, still racy but better
}

// Option 2: use a mutex / queue
class AsyncMutex {
  #queue = Promise.resolve();
  run(fn) {
    return (this.#queue = this.#queue.then(fn));
  }
}

const mutex = new AsyncMutex();
let safeCounter = 0;

async function safeIncrement() {
  await mutex.run(async () => {
    const current = safeCounter;
    await new Promise(r => setTimeout(r, 10));
    safeCounter = current + 1;
  });
}`,
        explanation:
          'The root cause: all 5 concurrent calls read `counter = 0` before any await resolves, then each writes `0 + 1 = 1`. The fix is serializing updates with an async mutex/queue so each increment reads the latest value.',
        votes: 15,
        voters: ['u2', 'u3', 'u4', 'u5'],
        createdAt: '2024-03-25',
      },
    ],
  },
  {
    id: 'c3',
    title: 'Recursive Stack Overflow',
    description:
      'This Fibonacci implementation crashes with a stack overflow for any input. The base case is incomplete. Find and fix it.',
    buggyCode: `function fibonacci(n) {
  if (n === 1) return 1;         // missing n === 0 case!
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(0));  // Infinite recursion → stack overflow
console.log(fibonacci(5));  // Should be 5`,
    language: 'JavaScript',
    difficulty: 'easy',
    tags: ['recursion', 'base-case', 'fibonacci'],
    authorId: 'u5',
    createdAt: '2024-03-28',
    solutions: [
      {
        id: 's4',
        challengeId: 'c3',
        authorId: 'u4',
        code: `function fibonacci(n) {
  if (n === 0) return 0;  // added missing base case
  if (n === 1) return 1;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`,
        explanation:
          'When `n === 0`, the function called `fibonacci(-1) + fibonacci(-2)` instead of returning 0. Adding `if (n === 0) return 0` closes the recursion properly.',
        votes: 9,
        voters: ['u1', 'u2', 'u5'],
        createdAt: '2024-03-28',
      },
    ],
  },
  {
    id: 'c4',
    title: 'SQL Injection Vector',
    description:
      'This database query function directly interpolates user input into SQL. Identify the vulnerability and rewrite it safely.',
    buggyCode: `import sqlite3

def get_user(db, username):
    # DANGER: direct string interpolation
    query = f"SELECT * FROM users WHERE username = '{username}'"
    return db.execute(query).fetchone()

# Attacker input:
# username = "' OR '1'='1"  → dumps all users
# username = "'; DROP TABLE users; --"  → deletes table`,
    language: 'Python',
    difficulty: 'medium',
    tags: ['security', 'sql-injection', 'database'],
    authorId: 'u2',
    createdAt: '2024-04-01',
    solutions: [
      {
        id: 's5',
        challengeId: 'c4',
        authorId: 'u3',
        code: `import sqlite3

def get_user(db, username):
    # Safe: parameterized query, driver handles escaping
    query = "SELECT * FROM users WHERE username = ?"
    return db.execute(query, (username,)).fetchone()`,
        explanation:
          'Parameterized queries separate SQL code from data. The `?` placeholder is never treated as SQL — the DB driver escapes the value. No amount of quote characters in `username` can break out of the string literal.',
        votes: 18,
        voters: ['u1', 'u2', 'u4', 'u5'],
        createdAt: '2024-04-01',
      },
    ],
  },
  {
    id: 'c5',
    title: 'Memory Leak in Event Listeners',
    description:
      'This component-like function attaches event listeners but never removes them. Over time this leaks memory and causes duplicate handlers. Fix the cleanup.',
    buggyCode: `function setupPanel(panelId) {
  const panel = document.getElementById(panelId);
  const closeBtn = panel.querySelector('.close');

  // New listener added every time setupPanel is called
  // Old ones are never removed
  closeBtn.addEventListener('click', () => {
    panel.classList.remove('open');
  });

  panel.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') panel.classList.remove('open');
  });
}`,
    language: 'JavaScript',
    difficulty: 'medium',
    tags: ['memory-leak', 'dom', 'events'],
    authorId: 'u4',
    createdAt: '2024-04-03',
    solutions: [
      {
        id: 's6',
        challengeId: 'c5',
        authorId: 'u2',
        code: `function setupPanel(panelId) {
  const panel = document.getElementById(panelId);
  const closeBtn = panel.querySelector('.close');

  const closePanel = () => panel.classList.remove('open');
  const onKeydown = (e) => { if (e.key === 'Escape') closePanel(); };

  closeBtn.addEventListener('click', closePanel);
  panel.addEventListener('keydown', onKeydown);

  // Return cleanup so caller can tear down
  return function teardown() {
    closeBtn.removeEventListener('click', closePanel);
    panel.removeEventListener('keydown', onKeydown);
  };
}

// Usage
const cleanup = setupPanel('my-panel');
// Later, when done:
cleanup();`,
        explanation:
          'The fix: (1) extract handlers into named references so they can be passed to `removeEventListener`, and (2) return a teardown function the caller invokes when the panel is destroyed. Inline arrow functions can\'t be removed because each call creates a distinct reference.',
        votes: 11,
        voters: ['u1', 'u3'],
        createdAt: '2024-04-03',
      },
    ],
  },
  {
    id: 'c6',
    title: 'Integer Overflow in Factorial',
    description:
      'This Rust factorial function silently returns wrong answers for inputs above 12 in debug mode and panics in release mode. Fix it to handle larger values.',
    buggyCode: `fn factorial(n: u32) -> u32 {
    // u32::MAX is 4_294_967_295
    // 13! = 6_227_020_800  →  overflows u32
    if n == 0 {
        return 1;
    }
    n * factorial(n - 1)  // overflow for n > 12
}

fn main() {
    println!("{}", factorial(13)); // panics in debug, wraps in release
}`,
    language: 'Rust',
    difficulty: 'hard',
    tags: ['overflow', 'types', 'arithmetic'],
    authorId: 'u3',
    createdAt: '2024-04-05',
    solutions: [
      {
        id: 's7',
        challengeId: 'c6',
        authorId: 'u1',
        code: `fn factorial(n: u64) -> Option<u64> {
    // Use u64 for larger range (up to 20!)
    // Return None on overflow instead of panicking
    (1..=n).try_fold(1u64, |acc, x| acc.checked_mul(x))
}

fn main() {
    match factorial(20) {
        Some(v) => println!("{}", v),  // 2_432_902_008_176_640_000
        None => println!("Overflow!"),
    }
    println!("{:?}", factorial(21)); // None — graceful overflow
}`,
        explanation:
          'Two fixes: (1) switch from `u32` to `u64` to handle up to 20!. (2) Use `checked_mul` via `try_fold` which returns `None` on overflow instead of panicking or silently wrapping. For arbitrary precision you\'d use `BigUint` from the `num` crate.',
        votes: 20,
        voters: ['u2', 'u3', 'u4', 'u5'],
        createdAt: '2024-04-05',
      },
    ],
  },
]
