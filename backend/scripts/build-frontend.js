import spawn from 'cross-spawn'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ⚠️ Corrigé le chemin
const frontendDir = path.join(__dirname, '../../frontend')
const backendPublicDir = path.join(__dirname, '../public')

console.log('📦 Installing frontend dependencies...')
const install = spawn.sync('npm', ['install'], { cwd: frontendDir, stdio: 'inherit' })
if (install.status !== 0) process.exit(install.status)

console.log('🚀 Building React frontend...')
const build = spawn.sync('npm', ['run', 'build'], { cwd: frontendDir, stdio: 'inherit' })
if (build.status !== 0) process.exit(build.status)

let buildFolder = 'dist' // par défaut Vite
if (!fs.existsSync(path.join(frontendDir, 'dist'))) {
  buildFolder = 'build' // CRA fallback
}
const frontendBuildPath = path.join(frontendDir, buildFolder)

if (!fs.existsSync(frontendBuildPath)) {
  console.error(`❌ Build folder not found: ${frontendBuildPath}`)
  process.exit(1)
}

if (fs.existsSync(backendPublicDir)) {
  fs.rmSync(backendPublicDir, { recursive: true, force: true })
}

fs.cpSync(frontendBuildPath, backendPublicDir, { recursive: true })
console.log(`✅ Frontend copied to ${backendPublicDir}`)
