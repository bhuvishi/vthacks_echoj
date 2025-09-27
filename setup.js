const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up Echo Journal Development Environment...\n');

// Check if backend directory exists
const backendDir = path.join(__dirname, 'backend');
if (!fs.existsSync(backendDir)) {
  console.error('❌ Backend directory not found!');
  process.exit(1);
}

try {
  // Install backend dependencies
  console.log('📦 Installing backend dependencies...');
  execSync('npm install', { 
    cwd: backendDir, 
    stdio: 'inherit' 
  });
  console.log('✅ Backend dependencies installed\n');

  // Create .env file if it doesn't exist
  const envPath = path.join(backendDir, '.env');
  const envExamplePath = path.join(backendDir, 'env.example');
  
  if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
    console.log('📝 Creating .env file...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created\n');
  }

  // Install frontend dependencies if needed
  console.log('📦 Checking frontend dependencies...');
  if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
    console.log('📦 Installing frontend dependencies...');
    execSync('npm install', { 
      cwd: __dirname, 
      stdio: 'inherit' 
    });
    console.log('✅ Frontend dependencies installed\n');
  } else {
    console.log('✅ Frontend dependencies already installed\n');
  }

  console.log('🎉 Setup complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Run: npm run dev:full (starts both frontend and backend)');
  console.log('2. Or run separately:');
  console.log('   - Frontend: npm run dev');
  console.log('   - Backend: npm run backend');
  console.log('\n🌐 Frontend will be available at: http://localhost:3000');
  console.log('📡 Backend will be available at: http://localhost:3001');
  console.log('\n✨ Happy coding!');

} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}
