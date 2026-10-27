const Discord = require('discord.js');

const Schema = require('../../database/models/functions');

module.exports = async (client, interaction, args) => {
    const boolean = interaction.options.getBoolean('active');

    const data = await Schema.findOne({ Guild: interaction.guild.id });
    if (data) {
        data.AntiSpam = boolean;
        data.save();
    }
    else {
        new Schema({
            Guild: interaction.guild.id,
            AntiSpam: boolean,
        }).save();
    }

    const feature = await client.t(interaction, 'automod.antiSpam');
    return client.succNormal({
        key: boolean ? 'automod.protectionEnabled' : 'automod.protectionDisabled',
        variables: { feature },
        type: 'editreply'
    }, interaction);
}


