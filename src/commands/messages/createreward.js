const localizedCreateReward = require('./createrewardLocalized');

module.exports = async (client, interaction, args) => {
    return localizedCreateReward(client, interaction, args);
}

