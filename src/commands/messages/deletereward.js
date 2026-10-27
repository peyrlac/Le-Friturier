const localizedDeleteReward = require('./deleterewardLocalized');

module.exports = async (client, interaction, args) => {
    return localizedDeleteReward(client, interaction, args);
}

