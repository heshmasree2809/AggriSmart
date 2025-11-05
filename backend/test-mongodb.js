require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

console.log('==============================================');
console.log('    MongoDB Connection Test');
console.log('==============================================\n');

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI is not defined in .env file');
  process.exit(1);
}

// Mask password in the URI for display
const maskedUri = MONGODB_URI.replace(/:([^:@]+)@/, ':****@');
console.log('📍 Connection string:', maskedUri);
console.log('\n🔄 Attempting to connect to MongoDB...\n');

// Connection options
const options = {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 5,
  retryWrites: true,
  w: 'majority'
};

// Connect to MongoDB
mongoose.connect(MONGODB_URI, options)
  .then(async () => {
    console.log('✅ MongoDB connected successfully!');
    console.log('==============================================');
    console.log('📊 Connection Details:');
    console.log('   - Connection State:', mongoose.connection.readyState === 1 ? '✓ Connected' : '✗ Disconnected');
    console.log('   - Database Name:', mongoose.connection.db.databaseName);
    console.log('   - Host:', mongoose.connection.host);
    console.log('==============================================\n');

    // Test database operations
    console.log('🧪 Testing database operations...\n');
    
    try {
      // List all collections
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log(`📂 Collections in database (${collections.length}):`);
      if (collections.length === 0) {
        console.log('   - No collections yet (database is empty)');
        console.log('   - Run "npm run seed" to populate the database\n');
      } else {
        collections.forEach(col => {
          console.log(`   - ${col.name}`);
        });
        console.log('');
        
        // Get document counts
        for (const col of collections) {
          const count = await mongoose.connection.db.collection(col.name).countDocuments();
          console.log(`   📄 ${col.name}: ${count} documents`);
        }
      }
      
      console.log('\n==============================================');
      console.log('✅ All tests passed! Connection is working perfectly.');
      console.log('==============================================\n');
      
      console.log('💡 Next steps:');
      console.log('   1. Run "npm run seed" to populate the database with sample data');
      console.log('   2. Run "npm start" to start the backend server');
      console.log('   3. Test API endpoints at http://localhost:9653\n');
      
    } catch (err) {
      console.error('❌ Error during database operations test:', err.message);
    }
    
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Connection closed.\n');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed!\n');
    console.error('==============================================');
    console.error('📋 Error Details:');
    console.error('   - Error Type:', err.name);
    console.error('   - Error Message:', err.message);
    console.error('==============================================\n');
    
    // Provide specific troubleshooting based on error type
    if (err.message.includes('authentication failed') || err.message.includes('bad auth')) {
      console.error('🔐 Authentication Error:');
      console.error('   - Username or password is incorrect');
      console.error('   - Verify database user exists in MongoDB Atlas');
      console.error('   - Check user permissions in MongoDB Atlas\n');
    } else if (err.message.includes('querySrv') || err.message.includes('ENOTFOUND') || err.message.includes('EBADNAME')) {
      console.error('🌐 DNS/Network Error:');
      console.error('   - Cluster URL might be incorrect');
      console.error('   - Check internet connection');
      console.error('   - Verify cluster is running in MongoDB Atlas\n');
    } else if (err.message.includes('IP') || err.message.includes('whitelist')) {
      console.error('🚫 IP Whitelist Error:');
      console.error('   - Your IP address is not whitelisted');
      console.error('   - Go to: MongoDB Atlas → Network Access → Add IP Address');
      console.error('   - Add 0.0.0.0/0 for all IPs (development only)\n');
    } else if (err.message.includes('timeout')) {
      console.error('⏱️  Timeout Error:');
      console.error('   - Connection timed out');
      console.error('   - Check firewall/antivirus settings');
      console.error('   - Verify network connectivity\n');
    }
    
    console.error('💡 Troubleshooting Steps:');
    console.error('   1. Verify connection string in .env file');
    console.error('   2. Check Network Access in MongoDB Atlas dashboard');
    console.error('   3. Ensure cluster is running (not paused)');
    console.error('   4. Verify username and password are correct');
    console.error('   5. Check if special characters in password are URL-encoded\n');
    
    process.exit(1);
  });
