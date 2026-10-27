const Discord = require('discord.js');

const Schema = require("../../database/models/family");

module.exports = async (client, interaction, args) => {

    const row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId('family_delete')
                .setEmoji('✅')
                .setStyle(Discord.ButtonStyle.Success),

            new Discord.ButtonBuilder()
                .setCustomId('family_stop')
                .setEmoji('❌')
                .setStyle(Discord.ButtonStyle.Danger),
        );

    client.embed({
        title: await client.t(interaction, 'family.resetConfirmTitle'),
        desc: await client.t(interaction, 'family.resetConfirmDescription'),
        components: [row],
        type: 'editreply'
    }, interaction);

    const filter = i => i.user.id === interaction.user.id;

    interaction.channel.awaitMessageComponent({ filter, time: 60000 })
        .then(async i => {
            if (i.customId == "family_delete") {
                i.message.delete();
                
                var remove = await Schema.findOne({ Guild: interaction.guild.id, User: interaction.author.id });
                const parent = await Schema.findOne({ Guild: interaction.guild.id, Parent: interaction.author.id });
                const partner = await Schema.findOne({ Guild: interaction.guild.id, Partner: interaction.author.id });

                if (remove) {
                    remove.Parent = [];
                    remove.Children = [];
                    remove.Partner = null;
                    await remove.save();
                }

                if (parent) {
                    parent.Parent = " ";
                    await parent.save();
                }

                if (partner) {
                    partner.Partner = " ";
                    await partner.save();
                }

                client.succNormal({ key: 'family.resetSuccess', type: 'editreply' }, interaction);
            }

            if (i.customId == "family_stop") {
                i.message.delete();
            }
        })
        .catch((err) => {
            console.log(err);
            client.errNormal({ key: 'family.resetTimeout', type: 'editreply' }, interaction);
        });
};

 
