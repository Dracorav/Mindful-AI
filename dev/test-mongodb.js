#!/usr/bin/env node

/**
 * MongoDB Connection Test (moved to dev/)
 * Tests connectivity to MongoDB Atlas cluster
 */

const mongoose = require('mongoose');
require('dotenv').config();

console.log('\n' + '='.repeat(60));
console.log('🔗 MONGODB CONNECTION TEST (dev)');
console.log('='.repeat(60) + '\n');

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('❌ MONGODB_URI not found in .env');
  process.exit(1);
}

console.log('📍 Connection Details:');
console.log(`   URI: ${mongoUri.substring(0, 40)}...`);

const clusterMatch = mongoUri.match(/@(.*?)\//);
const cluster = clusterMatch ? clusterMatch[1] : 'unknown';
console.log(`   Cluster: ${cluster}`);
console.log('\n⏳ Attempting connection...\n');

mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 5000,
})
  .then(() => {
    console.log('✅ CONNECTION SUCCESSFUL!\n');
    console.log('Database Status:');
    console.log(`   Connected: Yes`);
    console.log(`   Host: ${cluster}`);
    console.log(`   Database: ${mongoose.connection.name}`);
    console.log(`   State: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Error'}`);
    
    mongoose.connection.db.listCollections().toArray((err, collections) => {
      if (!err) {
        console.log(`\n   Collections (${collections.length}):`);
        collections.forEach(col => {
          console.log(`     - ${col.name}`);
        });
      }
      
      mongoose.connection.close();
      console.log('\n' + '='.repeat(60));
      console.log('✨ MongoDB Atlas is accessible and working!');
      console.log('='.repeat(60) + '\n');
      process.exit(0);
    });
  })
  .catch((err) => {
    console.error('❌ CONNECTION FAILED!\n');
    console.error('Error Details:');
    console.error(`   Message: ${err.message}`);
    
    if (err.message.includes('getaddrinfo')) {
      console.error('\n⚠️  DNS Resolution Error');
    }
    
    console.error('\n📋 Solution Steps:');
    console.error('   1. Go to: https://cloud.mongodb.com/v2');
    console.error('   2. Select your cluster');
    console.error('   3. Go to "Security" → "Network Access"');
    console.error('   4. Click "Add IP Address"');
    console.error('   5. Select "Allow access from anywhere" (0.0.0.0/0) or add your IP');
    console.error('\n');
    
    console.log('='.repeat(60) + '\n');
    process.exit(1);
  });
