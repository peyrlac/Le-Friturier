const Discord = require('discord.js');

const Schema = require("../../database/models/birthday");
const localizedCheck = require('./checkLocalized');

module.exports = async (client, interaction, args) => {
    return localizedCheck(client, interaction, args);
    Schema.findOne({ Guild: interaction.guild.id, User: interaction.user.id }, async (err, data) => {
        if (!data) return client.errNormal({ 
            error: "No birthday found!",
            type: 'editreply' 
        }, interaction);

        client.embed({ 
            title: `${client.emotes.normal.birthday}・Birthday check`, 
            desc: `${interaction.user.username} birthday is on ${data.Birthday}`,
            type: 'editreply'
        }, interaction)
    })
}

