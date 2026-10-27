const Discord = require('discord.js');

const Schema = require("../../database/models/economy");

module.exports = async (client, interaction, args) => {

    const user = interaction.options.getUser('user') || interaction.user;

    if (user.bot) return client.errNormal({
        key: "commands.economy.balance.bot",
        type: 'editreply'
    }, interaction);

    const data = await Schema.findOne({ Guild: interaction.guild.id, User: user.id });
    if (data) {

            let total = data.Money + data.Bank;

            client.embed({
                title: `${client.emotes.economy.coins}・Balance`,
                fields: [
                    {
                        name: `${client.emotes.economy.pocket}┆${await client.t(interaction, 'commands.economy.balance.wallet')}`,
                        value: `$${data.Money}`,
                        inline: true
                    },
                    {
                        name: `${client.emotes.economy.bank}┆${await client.t(interaction, 'commands.economy.balance.bank')}`,
                        value: `$${data.Bank}`,
                        inline: true
                    },
                    {
                        name: `💰┆${await client.t(interaction, 'commands.economy.balance.total')}`,
                        value: `$${total}`,
                        inline: true
                    }
                ],
                descKey: 'commands.economy.balance.description',
                variables: { user: user.tag },
                type: 'editreply'
            }, interaction);
        }
        else {
            client.errNormal({
                key: 'commands.economy.balance.empty', type: 'editreply'
            }, interaction);
        }
}
