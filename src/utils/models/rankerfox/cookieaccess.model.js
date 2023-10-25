 const mongoose = require('mongoose');

 mongoose.set('strictQuery', true);

 const { Schema } = mongoose;

 const RankerAccessCookieSchema = new Schema({
   cookies: {
     type: Array,
     required: true,
   },
   createdAt: {
     type: Date,
     default: Date.now,
   }
 });

 const RankerAccessCookie = mongoose.models.RankerAccessCookie || mongoose.model('RankerAccessCookie', RankerAccessCookieSchema);

 module.exports = RankerAccessCookie;
