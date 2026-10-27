const Schema = require('../../database/models/blacklist');

module.exports = async (client, interaction) => {
    const word = interaction.options.getString('word');
    const data = await Schema.findOne({ Guild: interaction.guild.id });
    const words = data && Array.isArray(data.Words) ? data.Words : [];
    if (!words.includes(word)) return client.errNormal({ key: data ? 'automod.wordMissing' : 'automod.noData', variables: { word }, type: 'editreply' }, interaction);

    data.Words = words.filter(target => target !== word);
    await data.save();
    const field = await client.t(interaction, 'automod.wordField');
    return client.succNormal({ key: 'automod.wordRemoved', variables: { word }, fields: [{ name: field, value: word }], type: 'editreply' }, interaction);
};
