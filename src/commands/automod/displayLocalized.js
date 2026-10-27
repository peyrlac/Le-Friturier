const Schema = require('../../database/models/blacklist');

module.exports = async (client, interaction) => {
    const data = await Schema.findOne({ Guild: interaction.guild.id });
    if (!data || !Array.isArray(data.Words) || !data.Words.length) return client.errNormal({ key: 'automod.noData', type: 'editreply' }, interaction);
    const [title, words] = await Promise.all([
        client.t(interaction, 'automod.title'),
        client.t(interaction, 'automod.words', { words: data.Words.join(', ') })
    ]);
    return client.embed({ title, desc: words, type: 'editreply' }, interaction);
};
