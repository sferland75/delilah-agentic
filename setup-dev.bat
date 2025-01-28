@echo off
echo Setting up development environment...
echo.

echo Installing Vite and React...
call npm install vite@latest @vitejs/plugin-react --save-dev

echo Installing React...
call npm install react react-dom @types/react @types/react-dom

echo Installing TypeScript...
call npm install typescript @types/node --save-dev

echo Creating Vite config...
echo "import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});" > vite.config.ts

echo Verifying package.json...
echo {
  "name": "delilah-agentic",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
} > package.json.tmp

move /y package.json.tmp package.json

echo Running npm install...
call npm install

echo Starting development server...
call npm run dev

pause