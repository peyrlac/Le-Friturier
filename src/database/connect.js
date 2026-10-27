const mongoose = require('mongoose');
const logger = require('../handlers/logger');
const dns = require('node:dns');

async function connect() {
    mongoose.set('strictQuery', false);
    try {
        const dnsServers = (process.env.MONGO_DNS_SERVERS || '')
            .split(',')
            .map(server => server.trim())
            .filter(Boolean);

        if (dnsServers.length) dns.setServers(dnsServers);

        logger.info('DATABASE', 'Connexion à MongoDB');
        await mongoose.connect(process.env.MONGO_TOKEN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (err) {
        logger.error('DATABASE', 'Échec de connexion à MongoDB', err);
        logger.warn('DATABASE', 'Arrêt du processus');
        process.exit(1)
    }


    mongoose.connection.once("open", () => {
        logger.success('DATABASE', 'MongoDB prêt');
    });

    mongoose.connection.on("error", (err) => {
        logger.error('DATABASE', 'Erreur MongoDB', err);
        logger.warn('DATABASE', 'Arrêt du processus');
        process.exit(1)
    });
    return;
}

module.exports = connect
