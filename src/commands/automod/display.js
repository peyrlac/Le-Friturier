const Discord = require('discord.js');

const Schema = require("../../database/models/blacklist");
const localizedDisplay = require('./displayLocalized');

module.exports = async (client, interaction, args) => {
    return localizedDisplay(client, interaction, args);
    Schema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
        if (data && data.Words.length > 0) {
            client.embed({
                title: "🤬・Mots sur liste noire",
                desc: data.Words.join(", "),
                type: 'editreply'
            }, interaction)
        }
        else {
            client.errNormal({
                error: `Ce serveur n'a pas de données!`,
                type: 'editreply'
            }, interaction);
        }
    })
}

