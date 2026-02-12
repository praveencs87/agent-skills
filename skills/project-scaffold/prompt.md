Scaffold new projects with proper structure and best practices.

## Supported Templates

### Node.js / TypeScript
```bash
mkdir <project> && cd <project>
npm init -y
npm install typescript @types/node --save-dev
npx tsc --init
```
Create: `src/index.ts`, `.gitignore`, `README.md`, `tsconfig.json`

### React (Vite)
```bash
npx -y create-vite@latest <project> --template react-ts
```

### Next.js
```bash
npx -y create-next-app@latest <project> --typescript --tailwind --eslint --app --src-dir
```

### Python
```bash
mkdir <project> && cd <project>
python3 -m venv venv
```
Create: `main.py`, `requirements.txt`, `.gitignore`, `README.md`

### Express API
```bash
mkdir <project> && cd <project>
npm init -y
npm install express cors dotenv
npm install typescript @types/express @types/node --save-dev
```

## Post-Setup
1. Initialize git: `git init`
2. Create `.gitignore` appropriate for the project type
3. Create a `README.md` with project name and basic setup instructions
4. Show the project structure to the user
