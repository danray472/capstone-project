const mongoose = require('mongoose');
const Review = require('./models/Review');
const WorkerProfile = require('./models/WorkerProfile');
const dns = require('dns');

// Set Google's DNS servers to resolve MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');

mongoose.connect('mongodb+srv://danray472:danray472@dseproject.csx9lbj.mongodb.net/?appName=DseProject')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Get all worker profiles
    const profiles = await WorkerProfile.find({});
    console.log(`Found ${profiles.length} worker profiles`);
    
    // First, show all reviews with their workerId values
    const allReviews = await Review.find({});
    console.log('\n=== ALL REVIEWS ===');
    allReviews.forEach(review => {
      console.log(`Review ID: ${review._id}`);
      console.log(`Worker ID in review: ${review.workerId}`);
      console.log(`Rating: ${review.rating}`);
      console.log('---');
    });
    
    console.log('\n=== PROFILE IDs ===');
    profiles.forEach(profile => {
      console.log(`Profile ID: ${profile._id}`);
      console.log(`User ID: ${profile.userId}`);
      console.log('---');
    });
    
    for (const profile of profiles) {
      // Find all reviews for this worker profile
      const reviews = await Review.find({ workerId: profile._id.toString() });
      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;
      
      console.log(`\nProfile: ${profile._id}`);
      console.log(`User ID: ${profile.userId}`);
      console.log(`Current averageRating: ${profile.averageRating}`);
      console.log(`Current totalReviews: ${profile.totalReviews}`);
      console.log(`Reviews found: ${totalReviews}`);
      console.log(`Calculated averageRating: ${averageRating.toFixed(1)}`);
      
      // Update the profile
      await WorkerProfile.findByIdAndUpdate(profile._id, {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
      });
      
      console.log(`Updated profile ${profile._id}`);
    }
    
    console.log('\n=== DONE ===');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
