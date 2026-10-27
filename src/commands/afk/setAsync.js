const Schema = require('../../database/models/afk');

module.exports = async (client, interaction, args) => {
    const reason = interaction.options.getString('reason') || await client.t(interaction, 'common.notSpecified');
    const data = await Schema.findOne({ Guild: interaction.guild.id, User: interaction.user.id });
    if (data) {
        return client.errNormal({ key: 'afk.already', type: 'editreply' }, interaction);
    }

    await new Schema({
        Guild: interaction.guild.id,
        User: interaction.user.id,
        Message: reason
    }).save();

    if (!interaction.member.displayName.includes('[AFK] ')) {
        await interaction.member.setNickname(`[AFK] ${interaction.member.displayName}`);
    }

    await client.succNormal({ key: 'afk.setSuccess', type: 'ephemeraledit' }, interaction);
    return client.embed({
        desc: await client.t(interaction, 'afk.nowAfk', { user: interaction.user, reason })
    }, interaction.channel);
};
