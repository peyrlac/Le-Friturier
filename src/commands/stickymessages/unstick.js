const Discord = require('discord.js');

const Schema = require("../../database/models/stickymessages");

module.exports = async (client, interaction, args) => {
    const channel = interaction.options.getChannel('channel');

    const data = await Schema.findOne({ Guild: interaction.guild.id, Channel: channel.id });
    if (data) {
        await Schema.findOneAndDelete({ Guild: interaction.guild.id, Channel: channel.id });
        return client.succNormal({
            key: 'stickymessages.deleted',
            fields: [
                {
                    name: `📘┆Channel`,
                    value: `${channel}`
                }
            ],
            type: 'editreply'
        }, interaction);
    }

    return client.errNormal({
        key: 'stickymessages.notFound',
        type: 'editreply'
    }, interaction)
}


