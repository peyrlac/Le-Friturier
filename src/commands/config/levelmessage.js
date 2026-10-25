const localizedLevelMessage = require('./levelmessageLocalized');

module.exports = async (client, interaction, args) => {
    return localizedLevelMessage(client, interaction, args);
}

