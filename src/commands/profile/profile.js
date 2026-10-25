const localizedProfile = require('./profileLocalized');

module.exports = async (client, interaction, args) => {
    return localizedProfile(client, interaction, args);
};
