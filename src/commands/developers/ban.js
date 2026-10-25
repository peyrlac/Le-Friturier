const Discord = require('discord.js');

const Schema = require('../../database/models/userBans');

const webhookClientLogs = new Discord.WebhookClient({
  id: "",
  token: "",
});

module.exports = async (client, interaction, args) => {
    const boolean = interaction.options.getBoolean('new');
    const member = interaction.options.getUser('user');

    if (boolean == true) {
        if (member.id === interaction.user.id) { // add the check here
            return client.errNormal({
                error: `You cannot ban yourself from the bot`,
                type: `editreply`
            }, interaction);
        }

        const data = await Schema.findOne({ User: member.id });
        if (data) {
            return client.errNormal({
                error: `<@!${member.id}> (${member.id}) a déjà été banni du bot`,
                type: `editreply`
            }, interaction);
        }

        await new Schema({
            User: member.id
        }).save();

        await client.succNormal({
            text: `<@!${member.id}> (${member.id}) Interdiction du bot`,
            type: 'editreply'
        }, interaction)

        let embedLogs = new Discord.EmbedBuilder()
            .setTitle(`🔨・Ban added`)
            .setDescription(`<@!${member.id}> (${member.id}) banned from the bot`)
            .addFields(
                { name: "👤┆Banned By", value: `${interaction.user} (${interaction.user.tag})`, inline: true },
            )
            .setColor(client.config.colors.normal)
            .setFooter({ text: client.config.discord.footer })
            .setTimestamp();
        await webhookClientLogs.send({
            username: 'Interdictions de bot',
            embeds: [embedLogs],
        });
    }
    else if (boolean == false) {
        const data = await Schema.findOne({ User: member.id });
        if (!data) {
            return client.errNormal({
                error: `<@!${member.id}> (${member.id}) has not been banned from the bot`,
                type: `editreply`
            }, interaction);
        }

        await Schema.findOneAndDelete({ User: member.id });
        await client.succNormal({
            text: `<@!${member.id}> (${member.id}) UNCANNÉ DU BOT`,
            type: 'editreply'
        }, interaction)

        let embedLogs = new Discord.EmbedBuilder()
            .setTitle(`🔨・Ban removed`)
            .setDescription(`<@!${member.id}> (${member.id}) unbanned from the bot`)
            .addFields(
                { name: "👤┆Unbanned By", value: `${interaction.user} (${interaction.user.tag})`, inline: true },
            )
            .setColor(client.config.colors.normal)
            .setFooter({ text: client.config.discord.footer })
            .setTimestamp();
        await webhookClientLogs.send({
            username: 'Interdictions de bot',
            embeds: [embedLogs],
        });
    }
}

