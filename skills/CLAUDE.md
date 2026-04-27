# Skills — TypeScript API Integration

Reference for patterns used in `src/typescript-lesson.ts`.

---

## Stack

- Language: TypeScript (strict mode)
- HTTP client: axios
- Runtime: Node.js via `npx tsx`
- Fake API: https://jsonplaceholder.typicode.com

---

## Core Patterns

### 1. Define an interface for every API shape

Always model what the server returns before writing any fetch logic.

```ts
interface Post {
  userId: number
  id: number
  title: string
  body: string
}
```

Never use `any` for response bodies — it defeats TypeScript entirely.

---

### 2. Type axios responses explicitly

```ts
// Option A — type the variable
const res: AxiosResponse<Post> = await axios.get('/posts/1')

// Option B — type the generic (preferred, less verbose)
const res = await axios.get<Post>('/posts/1')

// res.data is now typed as Post in both cases
```

---

### 3. Generic fetch helper

One reusable function instead of a typed wrapper per endpoint.

```ts
async function get<T>(url: string): Promise<T> {
  const res = await axios.get<T>(url)
  return res.data
}

// Usage
const post     = await get<Post>('...posts/1')
const posts    = await get<Post[]>('...posts')
const comments = await get<Comment[]>('...comments?postId=1')
```

---

### 4. Axios instance — shared config

Create one instance per API. Never hardcode base URLs in individual calls.

```ts
const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
})
```

---

### 5. Interceptors

```ts
// Inject auth token on every request
api.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  res => res,
  (err: AxiosError) => {
    if (err.response?.status === 401) redirectToLogin()
    return Promise.reject(err)
  }
)
```

---

### 6. Error handling — always narrow the error type

`catch` gives you `unknown`, not `Error`. Narrow it before reading fields.

```ts
try {
  const data = await get<Post>(url)
} catch (err) {
  if (err instanceof AxiosError) {
    console.error(err.response?.status, err.message)
  }
}
```

---

### 7. Utility types for request bodies

```ts
// Partial<T> — every field optional (use for PATCH)
async function update(id: number, changes: Partial<NewPost>): Promise<Post>

// Omit<T, K> — remove fields (e.g. server-generated id)
type NewPost = Omit<Post, 'id'>

// Pick<T, K> — keep only specific fields
type PostPreview = Pick<Post, 'id' | 'title'>
```

---

### 8. Service class pattern

Encapsulate all calls to one API in a class. Consumers never touch axios directly.

```ts
class PostService {
  private http = api

  getAll(): Promise<Post[]>      { ... }
  getById(id: number): Promise<Post> { ... }
  create(payload: NewPost): Promise<Post> { ... }
  update(id: number, changes: Partial<NewPost>): Promise<Post> { ... }
  remove(id: number): Promise<void> { ... }
}
```

---

## Rules

- Never type a response as `any` — always provide a generic or interface
- Put interfaces above the functions that use them
- One axios instance per API domain — never `axios.get` directly in components
- Always handle errors — unhandled promise rejections crash Node
- Use `Partial<T>` for PATCH bodies, `Omit<T, 'id'>` for POST bodies
- Run with `npx tsx src/typescript-lesson.ts` to execute the file directly
