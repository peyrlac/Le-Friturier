const localizedAdd = require('./addLocalized');

module.exports = async (client, interaction, args) => {
    return localizedAdd(client, interaction, args);
};
