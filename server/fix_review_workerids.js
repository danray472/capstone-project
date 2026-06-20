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
    
    // Get all worker profiles to create userId -> profile._id mapping
    const profiles = await WorkerProfile.find({});
    const userIdToProfileId = {};
    profiles.forEach(profile => {
      userIdToProfileId[profile.userId] = profile._id.toString();
    });
    
    console.log('User ID to Profile ID mapping:');
    console.log(userIdToProfileId);
    
    // Get all reviews
    const reviews = await Review.find({});
    console.log(`\nFound ${reviews.length} reviews`);
    
    let updatedCount = 0;
    for (const review of reviews) {
      const currentWorkerId = review.workerId;
      
      // Check if the current workerId is actually a userId (not a profile._id)
      if (userIdToProfileId[currentWorkerId]) {
        const correctProfileId = userIdToProfileId[currentWorkerId];
        console.log(`\nReview ${review._id}:`);
        console.log(`  Current workerId (userId): ${currentWorkerId}`);
        console.log(`  Correct profile._id: ${correctProfileId}`);
        
        // Update the review to use the correct profile._id
        await Review.findByIdAndUpdate(review._id, { workerId: correctProfileId });
        updatedCount++;
        console.log(`  Updated!`);
      } else {
        console.log(`\nReview ${review._id}: workerId ${currentWorkerId} is already correct (no mapping found)`);
      }
    }
    
    console.log(`\n=== Updated ${updatedCount} reviews ===`);
    
    // Now recalculate ratings for all profiles
    console.log('\n=== RECALCULATING RATINGS ===');
    for (const profile of profiles) {
      const reviews = await Review.find({ workerId: profile._id.toString() });
      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;
      
      console.log(`\nProfile: ${profile._id}`);
      console.log(`Reviews found: ${totalReviews}`);
      console.log(`Calculated averageRating: ${averageRating.toFixed(1)}`);
      
      await WorkerProfile.findByIdAndUpdate(profile._id, {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
      });
      
      console.log(`Updated!`);
    }
    
    console.log('\n=== DONE ===');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
