const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

const { Schema } = mongoose;


const RankerServiceSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  rankerInfos: {
    type: Object,
    default: []
  },
  serviceImage: {
    type: String,
    default:'needoon'
  },
  serviceName: {
    type: String,
    default : 'Moche',
  },
  serviceData: {
    type: Object,
    required: true,
  },
  serviceOptions: {
    type: Object,
    required: false,
  },
  serviceCookies: {
    type: Object,
    required: false,
  },
  available: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const RankerServices = mongoose.models.RankerServices || mongoose.model('RankerServices', RankerServiceSchema);

module.exports = RankerServices;
