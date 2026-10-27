const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription(getCommandMetadata('commandMetadata.report.description'))
        .addStringOption(option =>
            option.setName('type')
                .setDescription(getCommandMetadata('commandMetadata.report.options.type.description'))
                .setRequired(true)
                .addChoices(
                    { name: getCommandMetadata('commandMetadata.report.options.type.choices.bug.name'), value: 'bug' },
                    { name: getCommandMetadata('commandMetadata.report.options.type.choices.user.name'), value: 'user' }
                )
        )
        .addStringOption(option =>
            option.setName('description')
                .setDescription(getCommandMetadata('commandMetadata.report.options.description.description'))
                .setRequired(true)
        )
    ,

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    localizationKey: 'commandMetadata.report',

    run: async (client, interaction, args) => {
        await interaction.deferReply();
        const webhookClient = new Discord.WebhookClient({
            id: client.webhooks.bugReportLogs.id,
            token: client.webhooks.bugReportLogs.token
        });

        const type = interaction.options.getString('type');
        const desc = interaction.options.getString('description');

        if (type == "bug") {
            const embed = new Discord.EmbedBuilder()
                .setTitle(`📣・New bug report!`)
                .addFields(
                    { name: "Report category", value: "Bug", inline: true },
                    { name: "Submitted by", value: `${interaction.user.tag}`, inline: true },
                )
                .setDescription(`${desc}`)
                .setColor(client.config.colors.normal)
            webhookClient.send({
                username: 'Bot Reports',
                embeds: [embed],
            });

            client.succNormal({
                key: 'report.bugSent',
                type: 'ephemeraledit'
            }, interaction);
        }
        else if (type == "user") {
            const embed = new Discord.EmbedBuilder()
                .setTitle(`📣・New user report!`)
                .addFields(
                    { name: "Report category", value: "User", inline: true },
                    { name: "Submitted by", value: `${interaction.user.tag}`, inline: true },
                )
                .setDescription(`${desc}`)
                .setColor(client.config.colors.normal)
            webhookClient.send({
                username: 'Bot Reports',
                embeds: [embed],
            });

            client.succNormal({
                key: 'report.userSent',
                type: 'ephemeraledit'
            }, interaction);
        }
    },
};

 
