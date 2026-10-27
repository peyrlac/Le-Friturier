const Discord = require('discord.js');

const Schema = require("../../database/models/stats");

module.exports = async (client, interaction, args) => {
    const perms = await client.checkUserPerms({
        flags: [Discord.PermissionsBitField.Flags.ManageChannels],
        perms: [Discord.PermissionsBitField.Flags.ManageChannels]
    }, interaction)

    if (perms == false) return;

    const name = interaction.options.getString('name');

    if (name.toUpperCase() == "HELP") {
        return client.embed({
            title: `ℹ️・Options de nom de canal`,
            desc: `Ce sont les options de nom de canal: \n
            \`{emoji}\` - Emoji de canal
            \`{name}\` - Nom du canal`,
            type: 'editreply'
        }, interaction)
    }

    const data = await Schema.findOne({ Guild: interaction.guild.id });
    if (data) {
        data.ChannelTemplate = name;
        await data.save();
    } else {
        await new Schema({ Guild: interaction.guild.id, ChannelTemplate: name }).save();
    }

        return client.succNormal({
            key: 'commands.config.setchannelname.success',
            fields: [
                {
                    name: `💬┆Nom`,
                    value: `${name}`,
                    inline: true
                },
            ],
            type: 'editreply'
        }, interaction)
}

