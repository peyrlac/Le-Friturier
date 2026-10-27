const localizedWelcomeMessage = require('./welcomemessageLocalized');

module.exports = async (client, interaction, args) => {
    return localizedWelcomeMessage(client, interaction, args);
}

