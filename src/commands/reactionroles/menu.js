const localizedMenu = require('./menuLocalized');

module.exports = async (client, interaction, args) => {
    return localizedMenu(client, interaction, args);
};
