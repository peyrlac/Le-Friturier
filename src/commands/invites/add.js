const Discord = require('discord.js');

const Schema = require("../../database/models/invites");

module.exports = async (client, interaction, args) => {
    let user = interaction.options.getUser('user');
    let amount = interaction.options.getNumber('amount');

    const perms = await client.checkUserPerms({
        flags: [Discord.PermissionsBitField.Flags.ManageMessages],
        perms: [Discord.PermissionsBitField.Flags.ManageMessages]
    }, interaction)

    if (perms == false) return;

    let data = await Schema.findOne({ Guild: interaction.guild.id, User: user.id });
    if (data) {
        data.Invites += amount;
        data.Total += amount;
        await data.save();
    }
    else {
        const created = new Schema({
            Guild: interaction.guild.id,
            User: user.id,
            Invites: amount,
            Total: amount,
            Left: 0
        });
        await created.save();
        data = created;
    }

    return client.succNormal({
        key: 'invites.added',
        variables: { amount, user },
        fields: [
            {
                name: "📨┆Total invites",
                value: `${data.Invites}`,
                inline: true,
            }
        ],
        type: 'editreply'
    }, interaction);
}

