@echo off
npx tsc
node --experimental-json-modules dist/test-report.js