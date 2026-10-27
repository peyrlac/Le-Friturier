const Discord = require('discord.js');

const store = require("../../database/models/economyStore");

module.exports = async (client, interaction, args) => {
    const perms = await client.checkUserPerms({
        flags: [Discord.PermissionsBitField.Flags.ManageMessages],
        perms: [Discord.PermissionsBitField.Flags.ManageMessages]
    }, interaction)

    if (perms == false) return;

    const role = interaction.options.getRole('role');

    if (!role) return client.errUsage({ usage: "deleteitem [role]", type: 'editreply' }, interaction);

    const storeData = await store.findOne({ Guild: interaction.guild.id, Role: role.id });
    if (storeData) {

        await store.deleteOne({ Guild: interaction.guild.id, Role: role.id });

        client.succNormal({
                key: 'economy.deleteItem.success',
                fields: [
                    {
                        name: await client.t(interaction, 'economy.deleteItem.role'),
                        value: `${role}`
                    }
                ],
                type: 'editreply'
        }, interaction);
    } else {

        client.errNormal({ key: 'economy.deleteItem.notFound', type: 'editreply' }, interaction);
    }
}
