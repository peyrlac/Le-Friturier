const Discord = require('discord.js');

const store = require("../../database/models/economyStore");

module.exports = async (client, interaction, args) => {
    const perms = await client.checkUserPerms({
        flags: [Discord.PermissionsBitField.Flags.ManageMessages],
        perms: [Discord.PermissionsBitField.Flags.ManageMessages]
    }, interaction)

    if (perms == false) return;

    const role = interaction.options.getRole('role');
    let amount = interaction.options.getNumber('amount');

    if (!role || !amount) return client.errUsage({ usage: "additem [role] [amount]", type: 'editreply' }, interaction);

    if (isNaN(amount)) return client.errNormal({ key: 'economy.addItem.invalid', type: 'editreply' }, interaction);

    if(role == interaction.guild.roles.everyone) return client.errNormal({ key: 'economy.addItem.everyone', type: 'editreply' }, interaction);

    const storeData = await store.findOne({ Guild: interaction.guild.id, Role: role.id });
    if (storeData) {
        return client.errNormal({ key: 'economy.addItem.alreadyExists', type: 'editreply' }, interaction);
    }

    await new store({
        Guild: interaction.guild.id,
        Role: role.id,
        Amount: amount
    }).save();

    client.succNormal({
                key: 'economy.addItem.success',
                variables: { amount },
                fields: [
                    {
                        name: `${await client.t(interaction, 'economy.addItem.role')}`,
                        value: `<@&${role.id}>`,
                        inline: true
                    },
                    {
                        name: `${client.emotes.economy.coins}┆${await client.t(interaction, 'economy.addItem.amount')}`,
                        value: `$${amount}`,
                        inline: true
                    }
                ],
                type: 'editreply'
    }, interaction);
}
