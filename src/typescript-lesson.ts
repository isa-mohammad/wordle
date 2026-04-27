import axios, { AxiosResponse } from 'axios'

// =============================================================================
// 1. PRIMITIVE TYPES
// =============================================================================
// TypeScript adds static types on top of JavaScript.
// The compiler catches type mismatches before your code ever runs.

const username: string = 'Alice'
const age: number = 30
const isAdmin: boolean = false

// Arrays — two equivalent syntaxes
const scores: number[] = [95, 87, 100]
const tags: Array<string> = ['ts', 'axios', 'generics']

// Union — a value that can be one of several types
let id: string | number = 42
id = 'abc-123' // also valid

// Literal type — only this exact value is allowed
type Direction = 'north' | 'south' | 'east' | 'west'
const heading: Direction = 'north'


// =============================================================================
// 2. INTERFACES vs TYPE ALIASES
// =============================================================================
// Both describe the shape of an object. Prefer `interface` for object shapes,
// `type` for unions, primitives, and computed types.

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'viewer'   // literal union inside an interface
  avatar?: string            // ? means optional — may be undefined
}

type Coordinates = {
  lat: number
  lng: number
}

// Extending an interface — adds fields without repeating them
interface AdminUser extends User {
  permissions: Array<string>
}


// =============================================================================
// 3. FUNCTIONS — TYPED PARAMETERS AND RETURN VALUES
// =============================================================================

function greet(user: User): string {
  return `Hello, ${user.name} (${user.role})`
}

// Arrow function with explicit return type
const formatCoords = (coords: Coordinates): string =>
  `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`

// Optional parameter and default value
function paginate(page: number = 1, limit: number = 20): string {
  return `?page=${page}&limit=${limit}`
}

// void — the function intentionally returns nothing
function logMessage(msg: string): void {
  console.log(`[LOG] ${msg}`)
}


// =============================================================================
// 4. GENERICS — REUSABLE LOGIC OVER MULTIPLE TYPES
// =============================================================================
// A generic is a placeholder type written as <T>. The caller decides what T is.
// Think of it like a parameter, but for types instead of values.

// Without generics you'd need a separate function per type:
//   function firstNumber(arr: number[]): number { ... }
//   function firstString(arr: string[]): string { ... }
//
// With a generic, one function handles both:
function first<T>(arr: T[]): T | undefined {
  return arr[0]
}

const firstScore = first([10, 20, 30])    // TypeScript infers T = number
const firstTag = first(['ts', 'react']) // TypeScript infers T = string


// Generic with a constraint — T must have an `id` field
function findById<T extends { id: number }>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id)
}

// Generic interface — wraps any payload in consistent API envelope
interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

// Generic with multiple type parameters
function mapResponse<TIn, TOut>(
  response: ApiResponse<TIn>,
  transform: (data: TIn) => TOut
): ApiResponse<TOut> {
  return {
    ...response,
    data: transform(response.data),
  }
}


// =============================================================================
// 5. AXIOS — TYPED HTTP REQUESTS
// =============================================================================
// We'll use https://jsonplaceholder.typicode.com — a free fake REST API.

// Define what the API actually returns
interface Post {
  userId: number
  id: number
  title: string
  body: string
}

interface Comment {
  postId: number
  id: number
  name: string
  email: string
  body: string
}

// axios.get<T> types the response body as T.
// res.data is then typed as T — full autocomplete and compile-time safety.
async function fetchPost(id: number): Promise<Post> {
  const res: AxiosResponse<Post> = await axios.get(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  )
  return res.data
}

async function fetchComments(postId: number): Promise<Comment[]> {
  const res: AxiosResponse<Comment[]> = await axios.get(
    `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
  )
  return res.data
}


// =============================================================================
// 6. GENERIC FETCH HELPER — combining generics + axios
// =============================================================================
// Instead of writing a typed axios call every time, build one reusable helper.
// T is the expected response body type — the caller decides it.

async function get<T>(url: string): Promise<T> {
  const res: AxiosResponse<T> = await axios.get<T>(url)
  return res.data
}

// --- DEMO ---
get<Post>('https://jsonplaceholder.typicode.com/posts/1')
  .then(post => {
    console.log('id:',    post.id)
    console.log('title:', post.title)
    console.log('body:',  post.body)
  })

get<Post[]>('https://jsonplaceholder.typicode.com/posts')
  .then(posts => {
    console.log('total posts:', posts.length)
    console.log('first title:', posts[0].title)
  })

get<Comment[]>('https://jsonplaceholder.typicode.com/comments?postId=1')
  .then(comments => {
    console.log('total comments:', comments.length)
    console.log('first email:',    comments[0].email)
  })

// Usage — T is inferred from the explicit type annotation on the left:
async function examples() {
  const post = await get<Post>('https://jsonplaceholder.typicode.com/posts/1')
  const posts = await get<Post[]>('https://jsonplaceholder.typicode.com/posts')
  const comment = await get<Comment>('https://jsonplaceholder.typicode.com/comments/1')

  console.log(post.title)    // ✅ TypeScript knows .title exists
  console.log(posts.length)  // ✅ TypeScript knows it's an array
  console.log(comment.email) // ✅ TypeScript knows .email exists
}


// =============================================================================
// 7. ERROR HANDLING — axios errors have a known shape
// =============================================================================
import { AxiosError } from 'axios'

async function safeFetch<T>(url: string): Promise<T | null> {
  try {
    const res = await axios.get<T>(url)
    return res.data
  } catch (err) {
    // `err` is `unknown` in TypeScript — you must narrow it before using it
    if (err instanceof AxiosError) {
      console.error('HTTP error:', err.response?.status, err.message)
    } else {
      console.error('Unexpected error:', err)
    }
    return null
  }
}


// =============================================================================
// 8. POST / PUT / DELETE — typed request bodies
// =============================================================================

interface NewPost {
  title: string
  body: string
  userId: number
}

async function createPost(payload: NewPost): Promise<Post> {
  const res = await axios.post<Post>(
    'https://jsonplaceholder.typicode.com/posts',
    payload                          // axios infers the body from the object
  )
  return res.data
}

async function updatePost(id: number, changes: Partial<NewPost>): Promise<Post> {
  // Partial<T> makes every field of T optional — great for PATCH/PUT payloads
  const res = await axios.patch<Post>(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
    changes
  )
  return res.data
}

async function deletePost(id: number): Promise<void> {
  await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`)
}


// =============================================================================
// 9. AXIOS INSTANCE — shared base URL + headers
// =============================================================================
// In real apps you create one instance per API rather than hardcoding URLs.

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
})

// Interceptor — runs before every request (e.g. inject auth token)
api.interceptors.request.use(config => {
  const token = 'my-auth-token'
  config.headers.Authorization = `Bearer ${token}`
  return config
})

// Interceptor — runs on every response error (e.g. redirect on 401)
api.interceptors.response.use(
  response => response,
  (err: AxiosError) => {
    if (err.response?.status === 401) {
      console.warn('Unauthorised — redirect to login')
    }
    return Promise.reject(err)
  }
)

// Using the instance — same typed API, no base URL needed
async function fetchWithInstance(id: number): Promise<Post> {
  const res = await api.get<Post>(`/posts/${id}`)
  return res.data
}


// =============================================================================
// 10. PUTTING IT ALL TOGETHER — a typed data layer
// =============================================================================

class PostService {
  private readonly http = api

  async getAll(): Promise<Post[]> {
    const res = await this.http.get<Post[]>('/posts')
    return res.data
  }

  async getById(id: number): Promise<Post> {
    const res = await this.http.get<Post>(`/posts/${id}`)
    return res.data
  }

  async getComments(postId: number): Promise<Comment[]> {
    const res = await this.http.get<Comment[]>(`/posts/${postId}/comments`)
    return res.data
  }

  async create(payload: NewPost): Promise<Post> {
    const res = await this.http.post<Post>('/posts', payload)
    return res.data
  }

  async update(id: number, changes: Partial<NewPost>): Promise<Post> {
    const res = await this.http.patch<Post>(`/posts/${id}`, changes)
    return res.data
  }

  async remove(id: number): Promise<void> {
    await this.http.delete(`/posts/${id}`)
  }
}

const postService = new PostService()

// Example — TypeScript knows the exact shape of everything returned
async function run() {
  const posts = await postService.getAll()               // Post[]
  const post = await postService.getById(1)             // Post
  const comments = await postService.getComments(1)      // Comment[]

  console.log(`Post: "${post.title}" has ${comments.length} comments`)

  const created = await postService.create({
    title: 'Learning TypeScript',
    body: 'Generics and axios are powerful together.',
    userId: 1,
  })
  console.log('Created post id:', created.id)
}

run().catch(console.error)


// =============================================================================
// CALLING get<T>
// =============================================================================

async function callGet() {
  // T = Post — res.data will be a single Post object
  const post = await get<Post>('https://jsonplaceholder.typicode.com/posts/1')
  console.log('Single post:', post.title)

  // T = Post[] — res.data will be an array of Posts
  const posts = await get<Post[]>('https://jsonplaceholder.typicode.com/posts')
  console.log('All posts count:', posts.length)
  console.log('First post title:', posts[0].title)

  // T = Comment[] — same function, completely different shape
  const comments = await get<Comment[]>('https://jsonplaceholder.typicode.com/comments?postId=1')
  console.log('Comments on post 1:', comments.length)
  console.log('First commenter email:', comments[0].email)
}

callGet().catch(console.error)
