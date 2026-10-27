module.exports = async (client, interaction, args) => {
    return require('./createAsync')(client, interaction, args);
};
