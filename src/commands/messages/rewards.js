const localizedRewards = require('./rewardsLocalized');

module.exports = async (client, interaction, args) => {
    return localizedRewards(client, interaction, args);
};
