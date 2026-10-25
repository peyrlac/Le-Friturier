const localizedShow = require('./showLocalized');

module.exports = async (client, interaction, args) => {
    return localizedShow(client, interaction, args);
}

