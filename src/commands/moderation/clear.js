const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {
    const perms = await client.checkPerms({
        flags: [Discord.PermissionsBitField.Flags.ManageMessages],
        perms: [Discord.PermissionsBitField.Flags.ManageMessages]
    }, interaction);

    if (perms == false) return;

    const amount = interaction.options.getNumber('amount');

    if (amount > 100) return client.errNormal({
        key: "errors.moderation.clearTooMany",
        type: 'editreply'
    }, interaction);

    if (amount < 1) return client.errNormal({
        key: "errors.moderation.clearTooFew",
        type: 'editreply'
    }, interaction);

    interaction.channel.bulkDelete(amount).then(() => {
        client.succNormal({
            key: "common.success",
            fields: [
                {
                    name: "💬┆Amount",
                    value: `${amount}`,
                    inline: true
                }
            ],
            type: 'ephemeraledit'
        }, interaction)
    }).catch(err => {
        client.errNormal({
            key: "errors.moderation.clearFailed",
            type: 'editreply'
        }, interaction);
    });
}

 
