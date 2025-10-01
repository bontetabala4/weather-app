// scripts/build-frontend.js
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const frontendDir = path.join(__dirname, '../frontend')
const backendPublicDir = path.join(__dirname, '../public')

// 1️⃣ Build React
console.log('📦 Building React frontend...')
execSync('npm install', { cwd: frontendDir, stdio: 'inherit' })
execSync('npm run build', { cwd: frontendDir, stdio: 'inherit' })

// 2️⃣ Déterminer le dossier build
let buildFolder = 'dist' // par défaut Vite
if (!fs.existsSync(path.join(frontendDir, 'dist'))) {
  buildFolder = 'build' // CRA fallback
}
const frontendBuildPath = path.join(frontendDir, buildFolder)

// 3️⃣ Supprimer ancien public
if (fs.existsSync(backendPublicDir)) {
  fs.rmSync(backendPublicDir, { recursive: true, force: true })
}

// 4️⃣ Copier le build dans public
fs.cpSync(frontendBuildPath, backendPublicDir, { recursive: true })
console.log(`✅ Frontend copied to ${backendPublicDir}`)
