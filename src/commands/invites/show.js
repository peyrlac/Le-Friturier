const showLocalized = require('./showLocalized');

module.exports = async (client, interaction, args) => {
    return showLocalized(client, interaction, args);
};
