@echo off
npm install
npm install -D typescript @types/node @types/node-fetch
npx tsc --init
npm install dotenv node-fetch