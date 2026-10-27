const Discord = require('discord.js');

const Schema = require("../../database/models/functions");

module.exports = async (client, interaction, args) => {
    const perms = await client.checkUserPerms({
        flags: [Discord.PermissionsBitField.Flags.Administrator],
        perms: [Discord.PermissionsBitField.Flags.Administrator]
    }, interaction)

    if (perms == false) return;

    const rawColor = interaction.options.getString('color');
    let color = "";

    if (rawColor.toUpperCase() == "DEFAULT") {
        color = client.config.colors.normal.replace("#", "");
    }
    else {
        color = rawColor
    }

    if (!isHexColor(color)) return client.errNormal({
        key: 'commands.config.setcolor.invalid',
        type: 'editreply'
    }, interaction)

    const data = await Schema.findOne({ Guild: interaction.guild.id });
    if (data) {
        data.Color = `#${color}`;
        await data.save();
    } else {
        await new Schema({ Guild: interaction.guild.id, Color: `#${color}` }).save();
    }

    return client.succNormal({
        key: 'commands.config.setcolor.success',
        fields: [
            {
                name: `🎨┆New color`,
                value: `#${color}`,
                inline: true
            },
        ],
        type: 'editreply'
    }, interaction)
}

function isHexColor(hex) {
    return typeof hex === 'string'
        && hex.length === 6
        && !isNaN(Number('0x' + hex))
}

