const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {
    const perms = await client.checkUserPerms({
        flags: [Discord.PermissionsBitField.Flags.Administrator],
        perms: [Discord.PermissionsBitField.Flags.Administrator]
    }, interaction)

    if (perms == false) return;

    const user = interaction.options.getUser('user');
    let amount = interaction.options.getNumber('amount');

    if (!user || !amount) return client.errUsage({ usage: "addmoney [user] [amount]", type: 'editreply' }, interaction);

    if (isNaN(amount)) return client.errNormal({ key: 'economy.removeMoney.invalid', type: 'editreply' }, interaction);

    if (user.bot) return client.errNormal({
        key: 'economy.removeMoney.bot',
        type: 'editreply'
    }, interaction);

    const updated = await client.removeMoney(interaction, user, parseInt(amount));
    if (updated) {

                client.succNormal({
                    key: 'economy.removeMoney.success',
                    variables: { amount },
                    fields: [
                        {
                            name: `👤┆User`,
                            value: `<@!${user.id}>`,
                            inline: true
                        },
                        {
                            name: `${client.emotes.economy.coins}┆Amount`,
                            value: `$${amount}`,
                            inline: true
                        }
                    ],
                    type: 'editreply'
                }, interaction);
    } else {
        return client.errNormal({ key: 'economy.removeMoney.insufficient', type: 'editreply' }, interaction);
    }
}
