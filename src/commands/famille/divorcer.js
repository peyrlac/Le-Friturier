const Discord = require('discord.js');

const Schema = require("../../database/models/family");

module.exports = async (client, interaction, args) => {

    const target = interaction.options.getUser('membre');
    const author = interaction.user;

    if (author.id == target.id) return client.errNormal({
        key: 'family.selfDivorce',
        type: 'editreply'
    }, interaction);

    if (target.bot) return client.errNormal({
        key: 'family.botDivorce',
        type: 'editreply'
    }, interaction);

    const data = await Schema.findOne({ Guild: interaction.guild.id, User: author.id, Partner: target.id });
    if (data) {
        const data2 = await Schema.findOne({ Guild: interaction.guild.id, User: target.id });
        if (data2) {
            data2.Partner = null;
            data2.save();
        }

        data.Partner = null;
        data.save();

        client.embed({ 
            title: await client.t(interaction, 'family.divorceTitle'),
            desc: await client.t(interaction, 'family.divorceDescription', { author, target }),
            type: 'editreply' 
        }, interaction);

    }
    else {
        client.errNormal({ 
            key: 'family.notMarried',
            type: 'editreply' 
        }, interaction);
    }
}


