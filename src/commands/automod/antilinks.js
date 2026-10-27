const Discord = require('discord.js');

const Schema = require('../../database/models/functions');

module.exports = async (client, interaction, args) => {
    const boolean = interaction.options.getBoolean('active');

    const data = await Schema.findOne({ Guild: interaction.guild.id });
    if (data) {
        data.AntiLinks = boolean;
        data.save();
    }
    else {
        new Schema({
            Guild: interaction.guild.id,
            AntiLinks: boolean,
        }).save();
    }

    const feature = await client.t(interaction, 'automod.antiLinks');
    return client.succNormal({
        key: boolean ? 'automod.protectionEnabled' : 'automod.protectionDisabled',
        variables: { feature },
        type: 'editreply'
    }, interaction);
}


