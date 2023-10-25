const fs = require('fs');

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

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
        available: {
            type: Boolean,
            default: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }
    });

const ServiceModel = mongoose.model('RankerServices', RankerServiceSchema);

const populate = async () => {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        const services = await ServiceModel.find({});

        if (services.length === 0) {
            const data = JSON.parse(fs.readFileSync('populate.json', 'utf8'));
            await ServiceModel.insertMany(data);

            return 'Données importées avec succès !';
        } else {
            return 'La base de données contient déjà des données.' + services.length;
        }
    } catch (error) {
        console.error(error);
    } finally {
        mongoose.connection.close();
    }
}

populate()
    .then(result => {
        console.log(result);
    })
    .catch(error => {
        console.error(error);
    });
