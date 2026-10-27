const localizedRemove = require('./removeLocalized');

module.exports = async (client, interaction, args) => {
    return localizedRemove(client, interaction, args);
};
