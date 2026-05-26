/**
 * One-off generator for prompt JSON files (high / strong / niche demand).
 * Run: node scripts/generate-extra-categories.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const promptsDir = path.join(__dirname, "..", "prompts");

/** @param {string} prefix @param {string} label @param {string} desc @param {string} detail @param {string} body */
function p(prefix, n, label, desc, detail, body) {
  const id = `${prefix}-${String(n).padStart(2, "0")}`;
  return { id, label, description: desc, detail, text: body.trim() };
}

/** @param {string} cat @param {string} categoryLabel @param {string} prefix @param {Array<[string, string, string, string]>} items */
function cat(cat, categoryLabel, prefix, items) {
  return {
    category: cat,
    categoryLabel,
    prompts: items.map(([label, desc, detail, text], i) =>
      p(prefix, i + 1, label, desc, detail, text)
    ),
  };
}

const catalog = [
  cat("nextjs", "Next.js", "nextjs", [
    [
      "New Next.js app (App Router)",
      "setup",
      "create-next-app",
      `Create a beginner Next.js 14+ project with App Router.\n\n- npx create-next-app steps (TypeScript, ESLint, Tailwind optional)\n- Explain app/page.tsx and app/layout.tsx\n- Change home page to Hello Next\n- npm run dev and open localhost URL\n\nList created folders in plain language.`,
    ],
    [
      "Page and Link navigation",
      "routing",
      "app/about/page.tsx",
      `Add a second page to a Next.js App Router project.\n\n- app/about/page.tsx with title and paragraph\n- Link from home using next/link\n- Explain file-based routing\n\nProvide full file contents.`,
    ],
    [
      "Dynamic route [id]",
      "routing",
      "blog/[slug]",
      `Teach dynamic routes in Next.js App Router.\n\n- app/blog/[slug]/page.tsx\n- Example slugs hello and world with different content\n- Explain params prop type in TypeScript\n\nKeep example minimal.`,
    ],
    [
      "Server Component vs Client",
      "components",
      "'use client' button",
      `Explain Server vs Client Components for a beginner.\n\n- Home as Server Component with static text\n- Counter as Client Component with useState\n- When to add 'use client'\n\nProvide both files and 4 bullet comparison.`,
    ],
    [
      "Fetch data in Server Component",
      "data",
      "async page fetch",
      `Fetch JSON in a Server Component (no useEffect).\n\n- async function Page() fetching jsonplaceholder post\n- Show loading not needed on server; mention error handling briefly\n- TypeScript interface for Post\n\nApp Router only.`,
    ],
    [
      "API Route handler GET",
      "api",
      "app/api/hello/route.ts",
      `Create a Route Handler GET /api/hello returning JSON.\n\n- app/api/hello/route.ts\n- Test with browser or curl\n- Contrast with pages in 2 sentences\n\nTypeScript.`,
    ],
    [
      "Environment variables",
      "config",
      ".env.local",
      `Explain env vars in Next.js for beginners.\n\n- .env.local with NEXT_PUBLIC_APP_NAME\n- Use in server vs client components (rules)\n- Never commit secrets\n\nShow .env.example without real keys.`,
    ],
    [
      "Metadata and page title",
      "seo",
      "export const metadata",
      `Set page title and description using Metadata API.\n\n- Static metadata on home page\n- Explain why it matters for SEO\n\nApp Router syntax only.`,
    ],
    [
      "Deploy to Vercel checklist",
      "deploy",
      "production build",
      `Give a beginner checklist to deploy Next.js on Vercel.\n\n- git push, import project, env vars on dashboard\n- npm run build locally first\n- Common build errors (types, env) in bullets\n\nNo account-specific steps.`,
    ],
    [
      "Layout shared navbar",
      "layout",
      "app/layout.tsx",
      `Add a shared navbar in root layout.\n\n- layout.tsx with html/body, nav links Home and About\n- children slot for pages\n- Minimal CSS or Tailwind if already enabled\n\nShow full layout.tsx.`,
    ],
  ]),
  cat("fastapi", "FastAPI", "fastapi", [
    [
      "First FastAPI app",
      "setup",
      "GET /",
      `Create a minimal FastAPI app for a beginner.\n\n- main.py with GET / returning {"message": "hello"}\n- uvicorn run command\n- requirements.txt with fastapi and uvicorn\n\nExplain automatic OpenAPI docs URL.`,
    ],
    [
      "Path and query parameters",
      "routing",
      "/items/{id}",
      `Teach path and query params in FastAPI.\n\n- GET /items/{item_id} with item_id: int\n- Optional query q: str | None\n- Example URLs to try in browser\n\nInclude type hints and validation benefits.`,
    ],
    [
      "POST with Pydantic model",
      "body",
      "ItemCreate schema",
      `Add POST /items with a Pydantic model.\n\n- Models ItemCreate and ItemResponse\n- In-memory list store for demo\n- Return 201 and created item\n\nExplain Pydantic vs dict in 2 sentences.`,
    ],
    [
      "Dependency injection intro",
      "deps",
      "get_db stub",
      `Introduce Depends() with a fake database dependency.\n\n- def get_db() generator yielding connection stub\n- Route uses db=Depends(get_db)\n- Why DI helps testing — 3 bullets\n\nKeep code short.`,
    ],
    [
      "HTTPException 404",
      "errors",
      "raise HTTPException",
      `Show proper 404 errors in FastAPI.\n\n- GET /users/{id} with fake list\n- raise HTTPException(status_code=404, detail="User not found")\n- How it appears in OpenAPI docs\n\nOne file example.`,
    ],
    [
      "Router APIRouter modules",
      "structure",
      "routers/users.py",
      `Split FastAPI into routers for a small API.\n\n- routers/users.py and routers/items.py\n- Include_router in main.py with prefix /api\n\nExplain project growth pattern.`,
    ],
    [
      "CORS for frontend dev",
      "middleware",
      "CORSMiddleware",
      `Enable CORS for local React/Vite on port 5173.\n\n- CORSMiddleware settings\n- Why browsers block cross-origin\n\nShow main.py snippet only.`,
    ],
    [
      "Async endpoint",
      "async",
      "async def read",
      `Explain async def routes in FastAPI briefly.\n\n- One async route simulating await asyncio.sleep\n- When to use async vs def for beginners\n\nRunnable example.`,
    ],
    [
      "JWT auth overview",
      "auth",
      "conceptual",
      `High-level JWT auth plan for FastAPI (no full production code).\n\n- Login issues token, protected route needs Authorization header\n- Outline libraries: python-jose, passlib\n- Security warnings: HTTPS, secret key in env\n\nBullet roadmap for learning.`,
    ],
    [
      "Connect SQLAlchemy later",
      "database",
      "roadmap",
      `Explain steps to add SQLAlchemy + FastAPI after the tutorial API.\n\n- Models, Session, lifespan event\n- Migrations with Alembic mention\n- Do not implement full ORM now — checklist only\n\nFor someone who finished in-memory CRUD.`,
    ],
  ]),
  cat("docker", "Docker", "docker", [
    [
      "Dockerfile for Node app",
      "image",
      "node:20-alpine",
      `Write a beginner Dockerfile for a simple Node Express app.\n\n- FROM node:20-alpine, WORKDIR, COPY package*, npm ci, COPY ., CMD\n- .dockerignore for node_modules\n- docker build and docker run commands\n\nExplain each instruction.`,
    ],
    [
      "Dockerfile for Python app",
      "image",
      "python:3.12-slim",
      `Dockerfile for a FastAPI or Flask app with uvicorn.\n\n- Slim Python image, requirements.txt, expose port\n- Run uvicorn command\n- Build and run example\n\nKeep layers minimal for learning.`,
    ],
    [
      "docker-compose two services",
      "compose",
      "web + db",
      `Create docker-compose.yml with web and postgres services.\n\n- web builds from Dockerfile, depends_on db\n- db uses postgres image with env POSTGRES_PASSWORD\n- Volumes for db data\n\nExplain docker compose up -d.`,
    ],
    [
      "Environment variables in Compose",
      "compose",
      "env_file",
      `Show .env with docker-compose for a web app.\n\n- env_file: .env\n- Do not commit secrets\n- Variable substitution in compose\n\nExample .env.example safe template.`,
    ],
    [
      "Volumes for persistent data",
      "storage",
      "named volume",
      `Explain Docker volumes vs bind mounts for beginners.\n\n- Named volume for database\n- When bind mount is useful for development\n\nShort compose snippet.`,
    ],
    [
      "Docker networks basics",
      "network",
      "service DNS name",
      `How do containers talk in Compose?\n\n- Default network, service name as hostname\n- Example: web connects to postgres://db:5432\n\nDiagram in ASCII optional.`,
    ],
    [
      "Multi-stage build smaller image",
      "optimize",
      "builder stage",
      `Introduce multi-stage Dockerfile for a Node TypeScript build.\n\n- Stage 1 npm run build, stage 2 copy dist only\n- Why image size matters\n\nSimplified Dockerfile.`,
    ],
    [
      "Debug container won't start",
      "troubleshoot",
      "logs exec",
      `Checklist when docker run fails for beginners.\n\n- docker logs, docker ps -a\n- Wrong port mapping -p 3000:3000\n- File permissions and ENTRYPOINT typos\n\n5–7 bullet fixes.`,
    ],
    [
      ".dockerignore essentials",
      "config",
      "ignore patterns",
      `Create .dockerignore for Node and Python projects.\n\n- node_modules, .git, .env, __pycache__, dist\n- Why smaller context speeds build\n\nFull file content.`,
    ],
    [
      "Dev vs prod containers",
      "workflow",
      "compose override",
      `Explain dev vs production Docker workflow.\n\n- Dev: bind mount source, hot reload\n- Prod: slim image, no dev dependencies\n- Mention compose.override.yml idea\n\nConceptual, 2 scenarios.`,
    ],
  ]),
  cat("testing", "Testing", "test", [
    [
      "First pytest test",
      "pytest",
      "test_add.py",
      `I'm new to testing. Write pytest for function add(a,b).\n\n- test_add.py with 3 cases including edge zero\n- Run pytest -v\n- Explain assert and arrange-act-assert\n\nPython only.`,
    ],
    [
      "pytest fixtures",
      "pytest",
      "@pytest.fixture",
      `Teach pytest fixtures with a sample database dict fixture.\n\n- Fixture provides empty user db\n- Two tests insert and read users\n\nShort comments on setup/teardown idea.`,
    ],
    [
      "Mock requests with pytest",
      "pytest",
      "monkeypatch",
      `Test a function that calls HTTP without real network.\n\n- Use pytest monkeypatch or unittest.mock\n- Fake response for requests.get\n\nOne module under test + test file.`,
    ],
    [
      "Jest first test",
      "jest",
      "sum.test.js",
      `Set up Jest for a tiny Node or Vite project.\n\n- Install jest, sample sum.js and sum.test.js\n- npm test script\n- Expect 2+2 toBe 4\n\nShow package.json scripts.`,
    ],
    [
      "React Testing Library click",
      "react",
      "render screen",
      `Test a React button click with Testing Library.\n\n- Component Counter, test increments on click\n- getByRole queries\n- npm test command\n\nTypeScript optional.`,
    ],
    [
      "Playwright E2E smoke test",
      "e2e",
      "open homepage",
      `Add one Playwright test that opens localhost homepage.\n\n- npx playwright install hint\n- test expects title or heading visible\n\nFor Vite or Next dev server.`,
    ],
    [
      "Test coverage basics",
      "coverage",
      "pytest --cov",
      `Explain code coverage for beginners.\n\n- Run pytest --cov=src or jest --coverage\n- What 100% does NOT mean\n- Reasonable goal for learning project\n\nNo obsession with metrics.`,
    ],
    [
      "TDD small kata",
      "tdd",
      "fizzbuzz",
      `Walk through TDD on FizzBuzz in small steps.\n\n- Write failing test first, then minimal code\n- Show 3 red-green cycles in comments\n\nPick Python or JavaScript and stick to one.`,
    ],
    [
      "Snapshot test when to use",
      "jest",
      "snapshots",
      `Explain Jest snapshot tests pros and cons.\n\n- One example snapshot of a small JSON export\n- When snapshots hurt maintenance\n\nBeginner warning in 3 bullets.`,
    ],
    [
      "CI run tests on push",
      "ci",
      "GitHub Actions",
      `GitHub Actions workflow to run pytest or npm test on push.\n\n- Trigger on push main\n- Setup Python or Node, install deps, run tests\n\nYAML file content only.`,
    ],
  ]),
  cat("tailwind", "Tailwind CSS", "tw", [
    [
      "Install Tailwind in Vite",
      "setup",
      "tailwind.config",
      `Add Tailwind CSS to a Vite + React project step by step.\n\n- Install packages per official guide\n- tailwind.config content paths\n- Import in index.css\n\nList terminal commands.`,
    ],
    [
      "Utility classes layout",
      "layout",
      "flex gap-4",
      `Build a card row using Tailwind utilities only.\n\n- flex, gap, p-4, rounded-lg, shadow\n- Three cards responsive wrap\n\nHTML/JSX snippet.`,
    ],
    [
      "Responsive md: lg:",
      "responsive",
      "grid cols",
      `Teach responsive prefixes with a grid gallery.\n\n- grid-cols-1 md:grid-cols-2 lg:grid-cols-3\n- Explain mobile-first\n\nMinimal page example.`,
    ],
    [
      "Dark mode class strategy",
      "dark",
      "dark:bg-gray-900",
      `Enable class-based dark mode in tailwind.config.\n\n- darkMode: 'class'\n- Toggle on html element with JS\n- Example text and background colors\n\nShort script for toggle.`,
    ],
    [
      "Buttons and hover focus",
      "components",
      "btn primary",
      `Design primary and secondary buttons with Tailwind.\n\n- hover:, focus-visible:ring, disabled:opacity-50\n- Accessible contrast note\n\nReusable class string or @apply in component layer — explain both.`,
    ],
    [
      "@apply component class",
      "organize",
      "components.css",
      `When to use @apply for a .btn class vs inline utilities.\n\n- Small example in @layer components\n- Team style guide opinion\n\nOne file css excerpt.`,
    ],
    [
      "Forms styling",
      "forms",
      "input border focus",
      `Style a login form with Tailwind.\n\n- labels, inputs, error text red-600\n- spacing and w-full max-w-sm\n\nJSX or HTML form.`,
    ],
    [
      "Tailwind + Next.js",
      "next",
      "postcss",
      `Confirm Tailwind setup steps for Next.js (App Router).\n\n- postcss.config, globals.css directives\n- Avoid wrong content paths\n\nChecklist only.`,
    ],
    [
      "Typography plugin prose",
      "plugin",
      "@tailwindcss/typography",
      `Use typography plugin for a blog article page.\n\n- Install @tailwindcss/typography\n- article with class prose\n\nShort example markdown rendered as HTML block.`,
    ],
    [
      "Migrate from plain CSS",
      "migration",
      "incremental",
      `I have a site with custom CSS. Plan to migrate to Tailwind incrementally.\n\n- Start with layout utilities, keep old CSS file temporarily\n- 5 step strategy for beginners\n\nNo need to rewrite entire site in one PR.`,
    ],
  ]),
];

// Strong demand + niche — continued in same file
const catalog2 = [
  cat("nodejs", "Node.js Backend", "node", [
    [
      "Express middleware order",
      "express",
      "json logger",
      `Explain Express middleware order for beginners.\n\n- express.json(), custom logger, routes, 404 handler\n- Why order matters with a failing example\n\nMinimal server.js.`,
    ],
    [
      "REST CRUD Express",
      "express",
      "in-memory items",
      `Build CRUD /api/items with Express and in-memory array.\n\n- GET list, GET id, POST, PUT, DELETE\n- Test with curl examples\n\nNo database yet.`,
    ],
    [
      "Zod validation body",
      "validation",
      "zod schema",
      `Validate POST body with Zod in Express.\n\n- Schema createItemSchema\n- Return 400 with error details on fail\n\nTypeScript preferred.`,
    ],
    [
      "Prisma + SQLite setup",
      "orm",
      "schema.prisma",
      `Outline Prisma setup with SQLite for a todo API.\n\n- schema model Todo, migrate dev\n- CRUD routes sketch\n\nSteps and key files, not full 200 lines.`,
    ],
    [
      "JWT middleware protect route",
      "auth",
      "bearer token",
      `Protect one Express route with JWT middleware (learning project).\n\n- Login returns fake token, GET /me requires Authorization\n- Security caveats for production\n\nSimplified code.`,
    ],
    [
      "File upload multer intro",
      "files",
      "multipart",
      `Single file upload with multer conceptually.\n\n- POST /upload, save to uploads/\n- Limit file size\n\nMention security scanning in production.`,
    ],
    [
      "WebSocket Socket.io hello",
      "realtime",
      "emit on connect",
      `Minimal Socket.io server and client echo.\n\n- Server logs connection, client sends hello\n- When to use WebSockets vs REST\n\nTwo small files.`,
    ],
    [
      "Rate limiting express-rate-limit",
      "security",
      "100 per 15min",
      `Add basic rate limiting to public API.\n\n- express-rate-limit config\n- Explain abuse prevention\n\nSnippet only.`,
    ],
    [
      "Structured logging pino",
      "ops",
      "json logs",
      `Replace console.log with pino logger in Express.\n\n- Log requests with method and url\n- Why JSON logs help in production\n\nShort integration.`,
    ],
    [
      "Node project structure",
      "structure",
      "src routes",
      `Recommend folder structure for growing Node API.\n\n- src/routes, controllers, services, config\n- When to split files\n\nTree diagram in text.`,
    ],
  ]),
  cat("vue", "Vue", "vue", [
    [
      "Vue 3 Vite create project",
      "setup",
      "npm create vue",
      `Create Vue 3 + Vite project for a beginner.\n\n- Official create command options explained simply\n- Hello in App.vue\n- npm run dev\n\nList generated files.`,
    ],
    [
      "ref and reactive",
      "reactivity",
      "counter",
      `Teach ref vs reactive with a counter and form field.\n\n- script setup syntax\n- Why ref for primitives\n\nSingle App.vue example.`,
    ],
    [
      "v-for and :key",
      "template",
      "todo list",
      `Render todo list with v-for and :key.\n\n- Add todo from input\n- Explain key importance\n\nComposition API.`,
    ],
    [
      "computed and watch",
      "reactivity",
      "filtered list",
      `Use computed for filtered todos and watch for side effect.\n\n- filter text input\n- watch logs count change\n\nOne component.`,
    ],
    [
      "Props and emit",
      "components",
      "ChildButton",
      `Parent passes title prop, child emits click event.\n\n- defineProps and defineEmits in script setup\n\nTwo components.`,
    ],
    [
      "Vue Router two routes",
      "router",
      "Home About",
      `Add vue-router with Home and About views.\n\n- router/index.js and router-view in App.vue\n- router-link navigation\n\nFull minimal setup.`,
    ],
    [
      "Pinia store counter",
      "state",
      "defineStore",
      `Introduce Pinia for shared counter state.\n\n- stores/counter.js and use in two components\n- Compare to prop drilling in 2 bullets\n\nVue 3 + Pinia.`,
    ],
    [
      "Fetch onMounted",
      "async",
      "load users",
      `Fetch users from jsonplaceholder onMounted.\n\n- loading and error refs\n- template v-if states\n\nComposition API.`,
    ],
    [
      "Form v-model",
      "forms",
      "two-way binding",
      `Contact form with v-model on fields and submit handler.\n\n- prevent default, show JSON in alert\n\nAccessible labels.`,
    ],
    [
      "Deploy Vue static build",
      "deploy",
      "npm run build",
      `Build static dist and deploy options (Netlify, GitHub Pages).\n\n- npm run build output dist/\n- SPA fallback note for history mode\n\nChecklist.`,
    ],
  ]),
  cat("php-laravel", "PHP / Laravel", "laravel", [
    [
      "New Laravel project",
      "setup",
      "composer create-project",
      `Install Laravel for a beginner on Windows.\n\n- composer create-project, .env copy, php artisan key:generate\n- php artisan serve\n- Explain routes/web.php first route\n\nLaravel 11 style if possible.`,
    ],
    [
      "Blade template hello",
      "views",
      "resources/views",
      `Create a Blade view and return from route.\n\n- welcome customization with @section @yield layout\n\nShow routes and two blade files.`,
    ],
    [
      "Migration and Eloquent model",
      "database",
      "posts table",
      `Create Post model with migration title and body.\n\n- php artisan make:model -m\n- migrate, tinker create one post\n\nExplain Eloquent ORM simply.`,
    ],
    [
      "Controller resource index",
      "mvc",
      "PostController",
      `Resource controller for posts index and show only.\n\n- Route::resource limited actions\n- Return Blade views with compact posts\n\nList artisan commands used.`,
    ],
    [
      "Form validation Request",
      "forms",
      "store post",
      `Store post with validation rules title required max 255.\n\n- Form Request or validate in controller\n- Show errors in Blade @error\n\nCSRF @csrf mention.`,
    ],
    [
      "Auth Breeze overview",
      "auth",
      "starter kit",
      `Explain Laravel Breeze for login/register at high level.\n\n- composer require, npm build, migrations\n- What routes appear\n\nNot full install log — learning map.`,
    ],
    [
      "API routes Sanctum intro",
      "api",
      "json tokens",
      `Outline API + Sanctum token auth for SPA.\n\n- routes/api.php GET /user with auth:sanctum\n- Difference web vs api middleware\n\nConceptual steps.`,
    ],
    [
      "Seeder fake data",
      "database",
      "DatabaseSeeder",
      `Create factory and seeder for 20 fake posts.\n\n- php artisan db:seed\n- Use Faker via factory\n\nWhy seeders help development.`,
    ],
    [
      "Queue jobs concept",
      "queues",
      "ShouldQueue",
      `Explain queues and jobs without full Redis setup.\n\n- When to dispatch slow mail send\n- database driver mention\n\nDiagram optional.`,
    ],
    [
      "Deploy shared hosting notes",
      "deploy",
      "public folder",
      `Laravel deployment basics: public docroot, storage link, optimize.\n\n- php artisan config:cache on server\n- Never expose .env\n\nBullet checklist.`,
    ],
  ]),
  cat("csharp", "C# / .NET", "csharp", [
    [
      "Console Hello .NET",
      "console",
      "dotnet new",
      `Create first C# console app with dotnet CLI.\n\n- dotnet new console, Program.cs top-level statements\n- dotnet run\n\nExplain SDK vs Runtime briefly.`,
    ],
    [
      "ASP.NET Core Web API",
      "api",
      "Minimal API",
      `Minimal API with GET /hello returning JSON.\n\n- dotnet new web, MapGet\n- launchSettings https URL\n\n.NET 8 style.`,
    ],
    [
      "Entity Framework Core intro",
      "ef",
      "DbContext",
      `Outline EF Core with SQLite for a Todo entity.\n\n- Models, DbContext, migration commands\n- CRUD endpoints sketch\n\nLearning path not full app.`,
    ],
    [
      "Dependency injection built-in",
      "di",
      "builder.Services",
      `Explain DI in ASP.NET Core with ITodoService and implementation.\n\n- Register AddScoped in Program.cs\n- Inject in endpoint or controller\n\nWhy interfaces help tests.`,
    ],
    [
      "MVC Razor page",
      "mvc",
      "Views Home Index",
      `Create MVC project with Home Index view.\n\n- dotnet new mvc difference from web api\n- Views/Home/Index.cshtml simple html\n\nWhen to pick MVC vs Razor Pages vs API — 3 bullets.`,
    ],
    [
      "async await C# HTTP",
      "async",
      "HttpClient",
      `Fetch JSON with HttpClient async in a console or minimal API.\n\n- GetStringAsync try/catch\n- Why async matters for servers\n\nShort sample.`,
    ],
    [
      "xUnit first test",
      "testing",
      "dotnet test",
      `Add xUnit test project for a Calculator class.\n\n- dotnet new xunit, reference main project\n- One Fact test Add\n\nRun dotnet test.`,
    ],
    [
      "Configuration appsettings.json",
      "config",
      "IOptions",
      `Read settings from appsettings.json in minimal API.\n\n- Bind section AppSettings\n- Never commit secrets — User Secrets for dev\n\nExample JSON.`,
    ],
    [
      "Blazor WebAssembly overview",
      "blazor",
      "client SPA",
      `What is Blazor WASM vs Server in simple terms?\n\n- When beginners should choose React instead\n- dotnet new blazorwasm mention\n\nNo full tutorial — decision guide.`,
    ],
    [
      "Publish to folder",
      "deploy",
      "dotnet publish",
      `dotnet publish -c Release steps and output folder.\n\n- Self-contained vs framework-dependent one line each\n\nDeployment checklist for IIS or Linux.`,
    ],
  ]),
  cat("java", "Java / Spring", "java", [
    [
      "Hello Java Maven project",
      "basics",
      "mvn archetype",
      `Create Maven project printing Hello with java 17+.\n\n- pom.xml dependencies section empty\n- mvn compile exec or main class\n\nExplain JDK vs JRE.`,
    ],
    [
      "Spring Boot initializr",
      "spring",
      "start.spring.io",
      `Generate Spring Boot web project from start.spring.io.\n\n- Dependencies: Spring Web\n- Application.java and @RestController /hello\n- mvn spring-boot:run\n\nList files.`,
    ],
    [
      "REST controller CRUD",
      "rest",
      "@RestController",
      `Simple in-memory REST CRUD for Item in Spring Boot.\n\n- GET POST without database\n- ResponseEntity status codes\n\nJava records or class for Item.`,
    ],
    [
      "Spring Data JPA entity",
      "jpa",
      "@Entity User",
      `Add User entity and JpaRepository.\n\n- application.properties H2 console for learning\n- findAll endpoint\n\nMigration with ddl-auto=update warning.`,
    ],
    [
      "application.yml profiles",
      "config",
      "dev prod",
      `Explain Spring profiles dev and prod in application.yml.\n\n- Different datasource URLs placeholder\n- Activate with spring.profiles.active\n\nNo real passwords.`,
    ],
    [
      "Validation @Valid",
      "validation",
      "Bean Validation",
      `POST user with @Valid and jakarta validation annotations.\n\n- @NotBlank email etc\n- Return 400 on errors\n\nController + DTO example.`,
    ],
    [
      "ExceptionHandler advice",
      "errors",
      "@ControllerAdvice",
      `Global exception handler returning JSON error body.\n\n- Custom NotFoundException -> 404\n\nOne advice class snippet.`,
    ],
    [
      "JUnit 5 Spring Boot test",
      "testing",
      "@SpringBootTest",
      `Slice test or @WebMvcTest for hello endpoint.\n\n- MockMvc perform get expect 200\n\nMaven surefire run.`,
    ],
    [
      "Gradle vs Maven choice",
      "build",
      "build.gradle",
      `Compare Maven and Gradle for beginners picking Spring.\n\n- When IntelliJ defaults matter\n- Simple Gradle kotlin dsl hello if switching\n\nNeutral recommendation.`,
    ],
    [
      "Package JAR run",
      "deploy",
      "java -jar",
      `Build executable JAR and run java -jar app.jar.\n\n- spring-boot-maven-plugin repackage\n- PORT env variable\n\nProduction note on secrets.`,
    ],
  ]),
  cat("linux", "Linux / Bash", "linux", [
    [
      "Essential shell commands",
      "basics",
      "ls cd pwd",
      `Teach 15 essential Linux commands for developers new to terminal.\n\n- ls, cd, pwd, mkdir, rm, cp, mv, cat, less, grep, chmod, man\n- One example each\n\nAssume Ubuntu or WSL.`,
    ],
    [
      "Bash script variables",
      "bash",
      "hello.sh",
      `Write hello.sh with variables and echo.\n\n- shebang, chmod +x\n- positional parameters $1\n\nSafe quoting double vs single.`,
    ],
    [
      "if and loops in Bash",
      "bash",
      "for file in",
      `Script that loops over *.txt files and counts lines.\n\n- if [ -f ], for loop, wc -l\n\nAdd comments for beginners.`,
    ],
    [
      "grep and find",
      "search",
      "find . -name",
      `Find all .py files under project and search TODO with grep -r.\n\n- Explain pipes |\n\nPractical examples.`,
    ],
    [
      "chmod and chown basics",
      "permissions",
      "755",
      `Explain rwx permissions and chmod 755 for a script.\n\n- ls -l reading drwxr-xr-x\n- Never chmod 777 on production — warning\n\nShort lesson.`,
    ],
    [
      "curl test API",
      "network",
      "curl -X POST",
      `curl examples GET and POST JSON to localhost API.\n\n- Headers Content-Type application/json\n- -d body file\n\nFor testing FastAPI or Express.`,
    ],
    [
      "ssh connect to server",
      "ssh",
      "key-based auth",
      `Beginner guide to ssh user@host and ssh-keygen.\n\n- Copy public key to server concept\n- Config file ~/.ssh/config Host alias\n\nSecurity hygiene.`,
    ],
    [
      "systemd service overview",
      "services",
      "unit file",
      `What is systemd and a simple service unit for Node app (conceptual).\n\n- systemctl start stop status\n- Not full production hardening\n\nOutline only.`,
    ],
    [
      "tail journalctl logs",
      "logs",
      "debug service",
      `Read logs with journalctl -u myapp -f and tail -f file.log.\n\n- When debugging failed deploy\n\n5 commands cheat sheet.`,
    ],
    [
      "WSL2 on Windows dev",
      "wsl",
      "Ubuntu",
      `Set up WSL2 for web development on Windows.\n\n- Install Ubuntu, git, node, docker optional\n- Access files from Windows path /mnt/c/\n\nCommon pitfalls.`,
    ],
  ]),
  cat("cicd", "CI/CD", "cicd", [
    [
      "GitHub Actions Node test",
      "github",
      "actions/checkout",
      `YAML workflow: on push run npm ci and npm test for Node project.\n\n- ubuntu-latest, setup-node with version\n\nFull workflow file.`,
    ],
    [
      "GitHub Actions Python pytest",
      "github",
      "setup-python",
      `Workflow for Python with pip install -r requirements and pytest.\n\n- Cache pip optional mention\n\nComplete yaml.`,
    ],
    [
      "Lint job separate stage",
      "quality",
      "eslint ruff",
      `Split CI into lint and test jobs.\n\n- Fail fast on lint\n- needs: dependency between jobs optional\n\nExample for JS or Python.`,
    ],
    [
      "Build Docker image in CI",
      "docker",
      "docker/build-push-action",
      `High-level steps to build Docker image on GitHub Actions.\n\n- login to registry secrets DOCKER_TOKEN\n- tags and push main branch only\n\nOutline yaml sections.`,
    ],
    [
      "Deploy to Vercel automatic",
      "deploy",
      "vercel action",
      `Connect GitHub repo to Vercel for Next.js — conceptual CI/CD.\n\n- Preview deployments on PR\n- Production on main\n\nNo secrets in chat.`,
    ],
    [
      "GitLab CI basic pipeline",
      "gitlab",
      ".gitlab-ci.yml",
      `Minimal .gitlab-ci.yml with test stage for Node or Python.\n\n- image node:20 or python:3.12\n- script commands\n\nCompare to GitHub Actions in 3 bullets.`,
    ],
    [
      "Environment secrets in CI",
      "secrets",
      "GITHUB_SECRET",
      `How to store API keys in GitHub Actions secrets and use in workflow.\n\n- Never print secrets in logs\n- Rotation reminder\n\nExample env: API_KEY: \${{ secrets.API_KEY }}`,
    ],
    [
      "Matrix build Node versions",
      "matrix",
      "18 and 20",
      `strategy.matrix node-version [18, 20] run tests on both.\n\n- Why matrix helps\n\nYaml snippet.`,
    ],
    [
      "Manual approval production",
      "deploy",
      "environment",
      `GitHub environments with required reviewers before prod deploy.\n\n- When teams use manual gate\n\nProcess description.`,
    ],
    [
      "CI failure debug checklist",
      "troubleshoot",
      "works locally",
      `Checklist when tests pass locally but fail in CI.\n\n- env vars, node version, timezone, file paths case sensitivity\n- Re-run with debug logging\n\n7 bullets.`,
    ],
  ]),
  cat("rest-api", "REST / OpenAPI", "api", [
    [
      "Design REST resources",
      "design",
      "nouns not verbs",
      `Explain REST resource naming for beginners.\n\n- Good: GET /users, POST /users, bad: /getUsers\n- HTTP methods map to CRUD table\n\n5 examples.`,
    ],
    [
      "Status codes cheat sheet",
      "http",
      "200 201 400 404",
      `Teach common HTTP status codes with when to use each.\n\n- 200, 201, 204, 400, 401, 403, 404, 500\n- One sentence per code\n\nNo memorizing entire RFC.`,
    ],
    [
      "OpenAPI YAML skeleton",
      "openapi",
      "paths /items",
      `Write minimal openapi 3 yaml for items CRUD paths.\n\n- info, servers, paths, components schemas Item\n\nValid structure beginners can extend.`,
    ],
    [
      "Pagination query params",
      "design",
      "page limit",
      `Design pagination with ?page=1&limit=20 and response meta total.\n\n- JSON response shape example\n\nBest practices.`,
    ],
    [
      "Error JSON format",
      "errors",
      "RFC 7807 idea",
      `Propose consistent error body: code, message, details array.\n\n- Example 400 validation errors field map\n\nFramework agnostic.`,
    ],
    [
      "Versioning /api/v1",
      "versioning",
      "breaking changes",
      `When to bump API version and strategies URL vs header.\n\n- Backward compatible changes list\n\nShort guide.`,
    ],
    [
      "Idempotency POST",
      "design",
      "Idempotency-Key",
      `Explain idempotent POST for payments with Idempotency-Key header.\n\n- Why retries matter\n\nConceptual, no real payment API.`,
    ],
    [
      "Generate client from OpenAPI",
      "tools",
      "openapi-generator",
      `Steps to generate TypeScript fetch client from openapi.yaml.\n\n- Mention openapi-generator or orval\n\nHigh level CLI example.`,
    ],
    [
      "Mock server Prism",
      "tools",
      "mock api",
      `Use mock API from OpenAPI for frontend dev before backend ready.\n\n- Stoplight Prism or similar one-liner concept\n\nWorkflow benefit.`,
    ],
    [
      "Document auth in OpenAPI",
      "security",
      "bearerAuth",
      `Add components.securitySchemes bearer JWT to OpenAPI and apply globally.\n\n- Example security requirement on paths\n\nYaml snippet.`,
    ],
  ]),
  cat("mongodb", "MongoDB", "mongo", [
    [
      "MongoDB concepts vs SQL",
      "basics",
      "collections documents",
      `Compare SQL tables to MongoDB collections and documents for beginners.\n\n- When document model fits\n- JSON-like _id field\n\nNo installation required in text.`,
    ],
    [
      "mongosh insert find",
      "shell",
      "db.users.insertOne",
      `mongosh commands to create db, insert 3 users, find all, find one by filter.\n\n- Basic query operators $gt\n\nCopy-paste examples.`,
    ],
    [
      "Node mongoose connect",
      "mongoose",
      "Schema User",
      `Connect Node app to MongoDB with mongoose.\n\n- Schema name email, model User, create and find\n- Connection string from env MONGODB_URI\n\nMinimal server snippet.`,
    ],
    [
      "Update and delete operators",
      "queries",
      "updateMany",
      `Examples updateOne $set and deleteMany with filter.\n\n- Explain matched vs modified count\n\nmongosh or mongoose.`,
    ],
    [
      "Embed vs reference",
      "modeling",
      "orders in user",
      `Teach embedding subdocuments vs separate collection references.\n\n- Example order items embedded in order doc\n- When to reference user_id instead\n\n2 scenarios.`,
    ],
    [
      "Indexes in MongoDB",
      "performance",
      "createIndex",
      `Create index on email unique.\n\n- db.users.createIndex({ email: 1 }, { unique: true })\n- Query explain briefly\n\nWhy duplicates fail.`,
    ],
    [
      "Aggregation pipeline intro",
      "aggregation",
      "$group $sum",
      `Aggregation counting orders per user with $group and $sum.\n\n- Sample docs and pipeline stages listed\n\nBeginner readable.`,
    ],
    [
      "MongoDB Atlas free tier",
      "cloud",
      "connection string",
      `Steps to create free Atlas cluster and connect from local app.\n\n- IP allowlist 0.0.0.0/0 warning for learning only\n- Put URI in .env\n\nChecklist.`,
    ],
    [
      "Transactions when needed",
      "advanced",
      "multi-doc",
      `When beginners need multi-document transactions (brief).\n\n- Transfer balance example story\n- Prefer single document design first\n\nConceptual.`,
    ],
    [
      "Validate with JSON Schema",
      "validation",
      "$jsonSchema",
      `Collection validator with required fields name and email.\n\n- mongosh collMod or createCollection validator\n\nOne example.`,
    ],
  ]),
  cat("mobile", "Mobile (Flutter & RN)", "mobile", [
    [
      "Flutter first app",
      "flutter",
      "flutter create",
      `Create Flutter counter app explaining lib/main.dart.\n\n- flutter create, hot reload\n- StatefulWidget increment button\n\nInstall SDK overview.`,
    ],
    [
      "Flutter layout Column Row",
      "flutter",
      "widgets",
      `Build profile card with Column, Row, Image.network placeholder.\n\n- Padding and Expanded explained\n\nOne screen code.`,
    ],
    [
      "Flutter navigation push",
      "flutter",
      "Navigator.push",
      `Two routes Home and Details with push/pop.\n\n- MaterialApp routes map or Navigator 2 mention only briefly\n\nSimple imperative navigation.`,
    ],
    [
      "React Native Expo start",
      "react-native",
      "npx create-expo-app",
      `Start Expo app with TypeScript template.\n\n- npx create-expo-app, npm start, scan QR\n- Edit App.tsx text\n\nWindows + Android emulator note.`,
    ],
    [
      "RN View Text StyleSheet",
      "react-native",
      "components",
      `Screen with View, Text, Pressable styled via StyleSheet.\n\n- Flexbox similar to web\n\nExpo snippet.`,
    ],
    [
      "RN FlatList data",
      "react-native",
      "list",
      `FlatList of items with keyExtractor and renderItem.\n\n- Pull sample JSON from const array\n\nPerformance tip one line.`,
    ],
    [
      "Flutter fetch http package",
      "flutter",
      "async FutureBuilder",
      `Load post from JSON placeholder with http and FutureBuilder.\n\n- loading and error UI states\n\nAdd dependency pubspec.`,
    ],
    [
      "RN fetch useEffect",
      "react-native",
      "fetch api",
      `Fetch users in useEffect with loading state in Expo app.\n\n- Same API as web fetch\n\nFunctional component.`,
    ],
    [
      "App icons splash Expo",
      "expo",
      "app.json",
      `Configure app name icon and splash in app.json for Expo.\n\n- asset paths\n- Build preview optional\n\nSteps.`,
    ],
    [
      "Flutter vs RN choose",
      "compare",
      "decision",
      `Compare Flutter vs React Native for a beginner with web background.\n\n- Learning curve, job market, native modules\n- Neutral 5 bullet comparison\n\nNo flame war.`,
    ],
  ]),
  cat("go", "Go", "go", [
    [
      "Hello Go module",
      "basics",
      "go mod init",
      `First Go program with go mod init example.com/hello and fmt.Println.\n\n- go run .\n- Explain packages and main package\n\nGo 1.22+.`,
    ],
    [
      "HTTP server net/http",
      "web",
      "ListenAndServe",
      `Minimal HTTP server /hello handler in Go.\n\n- http.HandleFunc, log.Fatal ListenAndServe\n- Test with curl\n\nStandard library only.`,
    ],
    [
      "Structs and methods",
      "types",
      "receiver",
      `Define type User struct and method Greeting() string.\n\n- Pointer vs value receiver one paragraph\n\nSmall main demo.`,
    ],
    [
      "Error handling if err",
      "errors",
      "return err",
      `Idiomatic Go error handling reading a file.\n\n- os.Open, if err != nil, defer Close\n\nContrast with exceptions briefly.`,
    ],
    [
      "Slices and range loop",
      "basics",
      "append",
      `Examples slice literals, append, range sum function.\n\n- capacity vs length intro\n\nCode only.`,
    ],
    [
      "Goroutine and channel intro",
      "concurrency",
      "chan int",
      `Teach goroutine with waitgroup or channel ping pong simple.\n\n- Warning: don't spawn unbounded goroutines\n\nTiny example.`,
    ],
    [
      "JSON encoding",
      "json",
      "Marshal Unmarshal",
      `Struct tags json and handler returning application/json.\n\n- Encode User to ResponseWriter\n\nAPI snippet.`,
    ],
    [
      "Go test table driven",
      "testing",
      "testing package",
      `Table driven test for Add function.\n\n- go test -v\n\nShow test file.`,
    ],
    [
      "Modules versioning",
      "modules",
      "go get",
      `Explain go.mod require and upgrading dependency.\n\n- go get example.com/pkg@v1.2.3\n\nMinimal.`,
    ],
    [
      "Project layout std",
      "structure",
      "cmd internal",
      `Recommend cmd/ and internal/ folder layout for Go service.\n\n- When to use internal package\n\nText tree.`,
    ],
  ]),
  cat("rust", "Rust", "rust", [
    [
      "cargo new hello",
      "basics",
      "cargo run",
      `Create cargo new hello project and explain src/main.rs and Cargo.toml.\n\n- cargo run and cargo build\n- Ownership one sentence teaser\n\nBeginner friendly.`,
    ],
    [
      "Variables mut ownership",
      "ownership",
      "borrow",
      `Explain let, mut, and borrow &str with small examples.\n\n- Why compiler prevents double mutable borrow\n\nShort lesson not full book.`,
    ],
    [
      "Struct impl methods",
      "types",
      "impl block",
      `Rectangle struct with area method.\n\n- derive Debug and println {:?}\n\nRunnable code.`,
    ],
    [
      "Result Option handling",
      "errors",
      "? operator",
      `Read file returning Result and use match or ? in main.\n\n- Option vs Result when\n\nExample.`,
    ],
    [
      "Vec and iterators",
      "collections",
      "map filter",
      `Filter even numbers with iter filter collect.\n\n- Compare to for loop\n\nSnippets.`,
    ],
    [
      "Crates.io dependency",
      "cargo",
      "serde",
      `Add serde and serde_json to deserialize JSON string.\n\n- Cargo.toml [dependencies]\n\nTiny main.`,
    ],
    [
      "Clippy and fmt",
      "tooling",
      "cargo clippy",
      `Explain rustfmt and clippy for code quality.\n\n- cargo fmt, cargo clippy\n\nWhen to run in CI.`,
    ],
    [
      "Actix or Axum hello",
      "web",
      "async route",
      `Pick one Rust web framework and show GET /hello route hello world.\n\n- Mention async runtime tokio one line\n\nMinimal app skeleton.`,
    ],
    [
      "cargo test",
      "testing",
      "#[test]",
      `Write #[test] fn for add function.\n\n- cargo test output explain\n\nOne module.`,
    ],
    [
      "When to choose Rust",
      "guide",
      "use cases",
      `Objective list when Rust is worth learning vs staying on Go/Python.\n\n- Systems, WASM, performance critical\n- Steeper learning curve honest note\n\n5 bullets.`,
    ],
  ]),
  cat("kubernetes", "Kubernetes", "k8s", [
    [
      "Pods Deployments concepts",
      "concepts",
      "kubectl get",
      `Explain Pod vs Deployment vs Service for beginners using analogies.\n\n- Desired state idea\n- kubectl get pods\n\nNo cluster required for theory.`,
    ],
    [
      "Deployment nginx yaml",
      "yaml",
      "replicas 3",
      `Minimal Deployment and Service yaml for nginx.\n\n- replicas 3, selector labels app=nginx\n- Service type NodePort 30080\n\nApply order.`,
    ],
    [
      "ConfigMap and Secret",
      "config",
      "envFrom",
      `Mount ConfigMap as env vars in Pod spec.\n\n- Secret for password base64 note\n- Never commit real secrets\n\nYaml excerpts.`,
    ],
    [
      "Ingress HTTP routing",
      "ingress",
      "host rules",
      `Explain Ingress routing / to frontend and /api to backend service.\n\n- Needs ingress controller note\n\nDiagram text.`,
    ],
    [
      "kubectl logs debug",
      "debug",
      "logs describe",
      `Debug CrashLoopBackOff checklist.\n\n- kubectl logs, describe pod events\n- ImagePullBackOff causes\n\n7 steps.`,
    ],
    [
      "Helm chart overview",
      "helm",
      "package manager",
      `What Helm charts are vs raw yaml.\n\n- helm install bitnami example concept\n\nWhen teams adopt helm.`,
    ],
    [
      "Local cluster minikube",
      "local",
      "minikube start",
      `Steps minikube or kind for local learning on laptop.\n\n- Resource requirements RAM\n\nCompare minikube vs kind 3 bullets.`,
    ],
    [
      "Liveness readiness probes",
      "health",
      "httpGet /health",
      `Add livenessProbe and readinessProbe to deployment yaml.\n\n- Difference restart vs remove from service\n\nExample paths.`,
    ],
    [
      "Namespaces dev staging",
      "organize",
      "kubectl -n",
      `Organize environments with namespaces.\n\n- kubectl create namespace dev\n- Resource quotas mention only\n\nBest practice.`,
    ],
    [
      "K8s vs Docker Compose",
      "compare",
      "when which",
      `When beginners should use Compose vs Kubernetes.\n\n- Single machine dev vs scaled production\n\nHonest complexity warning.`,
    ],
  ]),
  cat("aws", "AWS / Cloud", "aws", [
    [
      "AWS account free tier",
      "basics",
      "billing alarm",
      `Safe start on AWS free tier for students.\n\n- Enable billing alarm, MFA on root avoid daily use\n- IAM user vs root\n\nSecurity first bullets.`,
    ],
    [
      "S3 static website",
      "s3",
      "bucket policy",
      `Host static HTML on S3 website hosting outline.\n\n- Public read bucket policy caution\n- CloudFront mention optional\n\nSteps high level.`,
    ],
    [
      "EC2 SSH deploy app",
      "ec2",
      "security group",
      `Launch t2.micro Ubuntu, SSH, install Node app with systemd.\n\n- Security group port 22 and 3000\n- Elastic IP note\n\nChecklist.`,
    ],
    [
      "IAM role for Lambda",
      "iam",
      "least privilege",
      `Explain IAM roles vs keys for Lambda accessing S3.\n\n- Principle of least privilege example policy skeleton\n\nNo real ARNs.`,
    ],
    [
      "Lambda hello function",
      "lambda",
      "event handler",
      `Create hello Lambda in console or SAM concept returning JSON.\n\n- Test event button\n- Cold start mention\n\nPython or Node runtime.`,
    ],
    [
      "RDS vs DynamoDB pick",
      "database",
      "managed",
      `When to choose RDS SQL vs DynamoDB vs running Postgres on EC2.\n\n- Beginner decision table\n\n3 rows.`,
    ],
    [
      "CloudWatch logs basics",
      "monitoring",
      "log groups",
      `View Lambda or EC2 logs in CloudWatch.\n\n- Alarms on errors concept\n\nShort guide.`,
    ],
    [
      "Terraform AWS intro",
      "iac",
      "provider aws",
      `Outline first Terraform aws provider s3 bucket resource.\n\n- terraform init plan apply\n- State file warning\n\nNot full production module.`,
    ],
    [
      "Azure/GCP compare one page",
      "cloud",
      "multi-cloud",
      `Map AWS services to Azure and GCP names (S3->Blob/Storage, EC2->VM).\n\n- Learning one cloud first advice\n\nTable format in text.`,
    ],
    [
      "Destroy resources cost",
      "billing",
      "cleanup",
      `Checklist tear down labs to avoid surprise bills.\n\n- Stop EC2, delete buckets, remove elastic IPs\n\nStudent habit.`,
    ],
  ]),
  cat("wordpress", "WordPress", "wp", [
    [
      "Local WordPress install",
      "setup",
      "Local WP",
      `Install WordPress locally with Local WP or Docker for development.\n\n- Admin login, change permalink structure\n\nSteps for Windows.`,
    ],
    [
      "Posts vs Pages",
      "content",
      "editor",
      `Explain difference posts blog vs static pages.\n\n- Create sample About page and Hello post\n\nBlock editor basics.`,
    ],
    [
      "Theme child customize",
      "themes",
      "child theme",
      `Why use child theme and create style.css with Template header.\n\n- Override one template safely\n\nHigh level.`,
    ],
    [
      "Plugin install Akismet",
      "plugins",
      "spam",
      `Install and configure a comment spam plugin conceptually.\n\n- Only install trusted plugins warning\n\nSecurity note.`,
    ],
    [
      "Custom post type",
      "development",
      "functions.php",
      `Register 'book' custom post type in theme functions.php snippet.\n\n- show_in_rest true for block editor\n\nCode in functions.php.`,
    ],
    [
      "WooCommerce store outline",
      "woocommerce",
      "products",
      `Outline steps to start small WooCommerce shop.\n\n- Products, payments plugin, shipping zones\n\nNot legal/tax advice.`,
    ],
    [
      "Backup and update",
      "maintenance",
      "updraft",
      `Backup before update plugins and core.\n\n- Staging site recommendation\n\nChecklist.`,
    ],
    [
      "Security hardening basics",
      "security",
      "wp-admin",
      `WordPress security for beginners: strong admin password, limit login attempts, hide wp-admin from bots concept.\n\n- Updates importance\n\n5 bullets.`,
    ],
    [
      "Migrate local to hosting",
      "deploy",
      "export",
      `Migrate local WordPress to shared hosting via export or Duplicator plugin overview.\n\n- Search-replace URLs issue\n\nSteps.`,
    ],
    [
      "Headless WordPress REST",
      "api",
      "wp-json",
      `Fetch posts from /wp-json/wp/v2/posts in Next.js fetch.\n\n- When headless makes sense\n\nExample fetch URL.`,
    ],
  ]),
  cat("data", "Data / Pandas", "data", [
    [
      "Pandas read CSV",
      "pandas",
      "read_csv",
      `Load CSV into DataFrame and show head, info, describe.\n\n- pip install pandas\n- Handle missing values dropna fillna intro\n\nJupyter optional.`,
    ],
    [
      "Select columns filter rows",
      "pandas",
      "boolean indexing",
      `Filter rows where age > 30 and select name email columns.\n\n- Syntax df[df.age>30][['name','email']]\n\nExplain boolean mask.`,
    ],
    [
      "groupby aggregate",
      "pandas",
      "groupby mean",
      `Group sales by region and sum amount.\n\n- reset_index\n\nSample DataFrame creation in script.`,
    ],
    [
      "Merge two DataFrames",
      "pandas",
      "merge join",
      `merge users and orders on user_id.\n\n- how=inner vs left explained\n\nSmall tables example.`,
    ],
    [
      "Matplotlib simple plot",
      "viz",
      "line chart",
      `Plot line chart from pandas Series dates and values.\n\n- plt.savefig\n\nOne script.`,
    ],
    [
      "Jupyter notebook workflow",
      "jupyter",
      "cells",
      `Explain Jupyter cells markdown and code for data exploration.\n\n- When notebook vs plain script\n\nInstall jupyter command.`,
    ],
    [
      "NumPy arrays basics",
      "numpy",
      "ndarray",
      `Intro NumPy array creation and vectorized math vs Python list.\n\n- shape, dtype\n\nBridge to pandas.`,
    ],
    [
      "Export to Excel CSV",
      "export",
      "to_csv",
      `Cleaned DataFrame to_csv and to_excel.\n\n- index=False\n\nAfter simple cleaning pipeline.`,
    ],
    [
      "Data cleaning checklist",
      "workflow",
      "EDA",
      `EDA checklist: dtypes, nulls, duplicates, outliers, value counts.\n\n- pandas functions for each step\n\nBullet workflow.`,
    ],
    [
      "Ethics data privacy",
      "ethics",
      "PII",
      `Reminder about PII, consent, and anonymization when analyzing user data.\n\n- GDPR mention one line\n\nNot legal advice — habits.`,
    ],
  ]),
  cat("security", "Security", "sec", [
    [
      "OWASP Top 10 overview",
      "owasp",
      "web risks",
      `Summarize OWASP Top 10 for a junior dev in plain language.\n\n- One example vulnerability each\n- Link learning to fixes\n\nNo scare tactics.`,
    ],
    [
      "SQL injection prevention",
      "injection",
      "parameterized",
      `Show vulnerable query string concat vs parameterized query in Python and JS.\n\n- ORM helps comment\n\nSide by side.`,
    ],
    [
      "XSS stored reflected",
      "xss",
      "escape output",
      `Explain XSS with examples and prevention escape encode CSP.\n\n- Never innerHTML with user data in JS\n\nReact escaping note.`,
    ],
    [
      "CSRF tokens web forms",
      "csrf",
      "SameSite",
      `How CSRF attacks work and token SameSite cookie defenses.\n\n- Django Flask framework support mention\n\nShort.`,
    ],
    [
      "Password hashing bcrypt",
      "auth",
      "never plain",
      `Demonstrate hashing passwords with bcrypt or argon2 concept.\n\n- Never store plaintext\n- Salt automatic\n\nPseudocode or library call.`,
    ],
    [
      "Secrets in env not git",
      "secrets",
      ".env gitignore",
      `Audit repo for leaked API keys checklist.\n\n- git history scan tools mention\n- rotate keys if leaked\n\nDeveloper habits.`,
    ],
    [
      "HTTPS TLS why",
      "transport",
      "certificates",
      `Why HTTPS matters man-in-the-middle simple explanation.\n\n- Let's Encrypt free certs\n\nFor beginners deploying first site.`,
    ],
    [
      "Dependency npm audit",
      "supply chain",
      "npm audit",
      `Run npm audit or pip audit and interpret severity.\n\n- Update transitive deps carefully\n\nWorkflow.`,
    ],
    [
      "Threat modeling STRIDE lite",
      "process",
      "diagram",
      `Lightweight threat model for a todo app: assets, trust boundaries, top 3 threats.\n\n- Mitigations per threat\n\nTable.`,
    ],
    [
      "Secure headers CSP HSTS",
      "headers",
      "helmet",
      `List security headers Content-Security-Policy, HSTS, X-Frame-Options.\n\n- Express helmet example one liner\n\nWhat each does.`,
    ],
  ]),
  cat("graphql", "GraphQL", "gql", [
    [
      "GraphQL vs REST",
      "concepts",
      "single endpoint",
      `Compare GraphQL and REST for beginners.\n\n- Over-fetching under-fetching\n- When GraphQL wins and when REST simpler\n\nNeutral.`,
    ],
    [
      "Schema type Query",
      "schema",
      "hello: String",
      `Write minimal schema Query { hello: String } and resolver.\n\n- Apollo Server or graphql-yoga setup outline\n\nNode example.`,
    ],
    [
      "Query fields arguments",
      "query",
      "user(id: ID!)",
      `Schema User type and query user(id) with resolver returning mock data.\n\n- GraphQL Playground test\n\nTypes non-null explained.`,
    ],
    [
      "Mutation create post",
      "mutation",
      "createPost",
      `Mutation createPost(input) returning Post.\n\n- Input type CreatePostInput\n\nContrast with POST REST.`,
    ],
    [
      "Nested types relations",
      "schema",
      "User posts",
      `User with posts field resolved via parent id.\n\n- N+1 problem mention and DataLoader idea\n\nConceptual.`,
    ],
    [
      "Client Apollo useQuery",
      "client",
      "React",
      `React Apollo Client useQuery example fetching hello.\n\n- Provider setup steps list\n\nTypeScript optional.`,
    ],
    [
      "Variables in queries",
      "query",
      "$id",
      `Query with variable $id and pass variables object in client.\n\n- Why variables beat string concat\n\nExample.`,
    ],
    [
      "Fragments reuse fields",
      "client",
      "fragment",
      `Define fragment UserFields on User and use in two queries.\n\n- Reduce duplication benefit\n\nSnippet.`,
    ],
    [
      "Errors and partial data",
      "errors",
      "errors array",
      `Explain errors array in GraphQL response with partial data example.\n\n- Client handling policy\n\nShort.`,
    ],
    [
      "Federation intro",
      "advanced",
      "subgraphs",
      `High level what Apollo Federation solves for microservices.\n\n- Not implementation — when to care later\n\n3 bullets.`,
    ],
  ]),
];

const all = [...catalog, ...catalog2];

for (const data of all) {
  if (data.prompts.length !== 10) {
    console.error(`Wrong count ${data.category}: ${data.prompts.length}`);
    process.exit(1);
  }
  const out = path.join(promptsDir, `${data.category}.json`);
  fs.writeFileSync(out, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log("wrote", out);
}

console.log("done", all.length, "categories");
