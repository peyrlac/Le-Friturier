const Discord = require('discord.js');

const Schema = require("../../database/models/economy");

module.exports = async (client, interaction, args) => {
    const perms = await client.checkUserPerms({
        flags: [Discord.PermissionsBitField.Flags.Administrator],
        perms: [Discord.PermissionsBitField.Flags.Administrator]
    }, interaction)

    if (perms == false) return;

    const user = interaction.options.getUser('user');
    let amount = interaction.options.getNumber('amount');

    if (!user || !amount) return client.errUsage({ usage: "addmoney [user] [amount]", type: 'editreply' }, interaction);

    if (isNaN(amount)) return client.errNormal({ key: 'economy.addMoney.invalid', type: 'editreply' }, interaction);

    if (user.bot) return client.errNormal({
        key: 'economy.addMoney.bot',
        type: 'editreply'
    }, interaction);

    client.addMoney(interaction, user, parseInt(amount));

    const data = await Schema.findOne({ Guild: interaction.guild.id, User: user.id });
    if (data) {
                return client.succNormal({
                    key: 'economy.addMoney.success',
                    fields: [
                        {
                            name: await client.t(interaction, 'economy.addMoney.user'),
                            value: `<@!${user.id}>`,
                            inline: true
                        },
                        {
                            name: `${client.emotes.economy.coins}┆${await client.t(interaction, 'economy.addMoney.amount')}`,
                            value: `$${amount}`,
                            inline: true
                        }
                    ],
                    type: 'editreply'
                }, interaction);
    }
    return client.errNormal({ key: 'economy.addMoney.noMoney', type: 'editreply' }, interaction);
}
 
