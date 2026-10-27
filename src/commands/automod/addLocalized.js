const Schema = require('../../database/models/blacklist');

module.exports = async (client, interaction) => {
    const word = interaction.options.getString('word');
    const data = await Schema.findOne({ Guild: interaction.guild.id });
    if (data) {
        const words = Array.isArray(data.Words) ? data.Words : [];
        if (words.includes(word)) return client.errNormal({ key: 'automod.wordExists', variables: { word }, type: 'editreply' }, interaction);
        data.Words = [...words, word];
        await data.save();
    } else {
        await new Schema({ Guild: interaction.guild.id, Words: [word] }).save();
    }

    const field = await client.t(interaction, 'automod.wordField');
    return client.succNormal({ key: 'automod.wordAdded', variables: { word }, fields: [{ name: field, value: word }], type: 'editreply' }, interaction);
};
