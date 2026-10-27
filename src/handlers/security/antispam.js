const localizedAntispam = require('./antispamLocalized');

module.exports = async (client) => {
    return localizedAntispam(client);
};
