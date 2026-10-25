const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {
    const perms = await client.checkPerms({
        flags: [Discord.PermissionsBitField.Flags.ManageMessages],
        perms: [Discord.PermissionsBitField.Flags.ManageMessages]
    }, interaction);

    if (perms == false) return;

    const member = interaction.options.getUser('user');

    try {
        const messages = await interaction.channel.messages.fetch({ limit: 100 });
        const userMessages = messages.filter(message => message.author.id === member.id);

        if (!userMessages.size) {
            return client.errNormal({
                key: 'errors.moderation.clearUserNone',
                type: 'editreply'
            }, interaction);
        }

        await interaction.channel.bulkDelete(userMessages, true);
        return client.succNormal({
            key: 'errors.moderation.clearUserSuccess',
            fields: [
                {
                    name: await client.t(interaction, 'commands.messages.userField'),
                    value: `${member} (${member.tag})`,
                    inline: true
                }
            ],
            type: 'editreply'
        }, interaction);
    }
    catch (error) {
        return client.errNormal({
            key: 'errors.moderation.clearFailed',
            type: 'editreply'
        }, interaction);
    }
}

 
