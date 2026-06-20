const mongoose = require('mongoose');
const Review = require('./models/Review');
const WorkerProfile = require('./models/WorkerProfile');

mongoose.connect('mongodb+srv://danray472:danray472@dseproject.csx9lbj.mongodb.net/?appName=DseProject')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Get all reviews
    const reviews = await Review.find({});
    console.log('\n=== REVIEWS ===');
    reviews.forEach(review => {
      console.log(`Review ID: ${review._id}`);
      console.log(`Worker ID: ${review.workerId}`);
      console.log(`Client ID: ${review.clientId}`);
      console.log(`Rating: ${review.rating}`);
      console.log('---');
    });
    
    // Get all worker profiles
    const profiles = await WorkerProfile.find({});
    console.log('\n=== WORKER PROFILES ===');
    profiles.forEach(profile => {
      console.log(`Profile ID: ${profile._id}`);
      console.log(`User ID: ${profile.userId}`);
      console.log(`Average Rating: ${profile.averageRating}`);
      console.log(`Total Reviews: ${profile.totalReviews}`);
      console.log('---');
    });
    
    // Check which reviews match which profiles
    console.log('\n=== MATCHING REVIEWS TO PROFILES ===');
    profiles.forEach(profile => {
      const matchingReviews = reviews.filter(r => r.workerId === profile._id.toString());
      console.log(`Profile ${profile._id}: ${matchingReviews.length} matching reviews`);
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
