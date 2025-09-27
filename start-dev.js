const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Echo Journal Development Environment...\n');

// Start backend server
console.log('📡 Starting backend server...');
const backend = spawn('node', ['server.js'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

// Start frontend server
console.log('🎨 Starting frontend server...');
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname),
  stdio: 'inherit',
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  backend.kill('SIGINT');
  frontend.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down servers...');
  backend.kill('SIGTERM');
  frontend.kill('SIGTERM');
  process.exit(0);
});

// Handle errors
backend.on('error', (err) => {
  console.error('❌ Backend error:', err);
});

frontend.on('error', (err) => {
  console.error('❌ Frontend error:', err);
});

console.log('✅ Both servers are starting...');
console.log('🌐 Frontend: http://localhost:3000');
console.log('📡 Backend: http://localhost:3001');
console.log('\nPress Ctrl+C to stop both servers\n');
