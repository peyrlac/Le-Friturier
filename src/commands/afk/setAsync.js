const Schema = require('../../database/models/afk');

module.exports = async (client, interaction, args) => {
    const reason = interaction.options.getString('reason') || 'Not specified';
    const data = await Schema.findOne({ Guild: interaction.guild.id, User: interaction.user.id });
    if (data) {
        return client.errNormal({ error: 'Tu es déjà AFK!', type: 'editreply' }, interaction);
    }

    await new Schema({
        Guild: interaction.guild.id,
        User: interaction.user.id,
        Message: reason
    }).save();

    if (!interaction.member.displayName.includes('[AFK] ')) {
        await interaction.member.setNickname(`[AFK] ${interaction.member.displayName}`);
    }

    await client.succNormal({ text: 'Your AFK has been set up successfully', type: 'ephemeraledit' }, interaction);
    return client.embed({
        desc: `${interaction.user} est maintenant afk! **Raison:** ${reason}`
    }, interaction.channel);
};
