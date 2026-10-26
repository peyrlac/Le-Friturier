const localizedLeaderboard = require('./leaderboardLocalized');

module.exports = async (client, interaction, args) => {
    return localizedLeaderboard(client, interaction, args);
};
