const { CommandInteraction, Client } = require('discord.js');
const { ContextMenuCommandBuilder } = require('discord.js');
const Discord = require('discord.js');

const Schema = require("../../database/models/warnings");
const Case = require("../../database/models/warnCase");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Warn')
        .setType(2),

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const perms = await client.checkPerms({
            flags: [Discord.PermissionsBitField.Flags.ManageMessages],
            perms: [Discord.PermissionsBitField.Flags.ManageMessages]
        }, interaction)
        if (perms === false) {
            client.errNormal({
                key: 'errors.noPermission',
                type: 'ephemeral'
            }, interaction);
            return;
        }
        // Create modal to give a reason
        const modal = new Discord.ModalBuilder()
            .setTitle(await client.t(interaction, 'moderation.warnTitle'))
            .setCustomId('warn')
            .addComponents(
                new Discord.ActionRowBuilder().addComponents(
                    new Discord.TextInputBuilder()
                        .setCustomId('reason')
                        .setPlaceholder(await client.t(interaction, 'moderation.reason'))
                        .setLabel(await client.t(interaction, 'moderation.reason'))
                        .setMinLength(1)
                        .setStyle(Discord.TextInputStyle.Short)
                        .setMaxLength(100)),
            );
        await interaction.showModal(modal);

        const submitted = await interaction.awaitModalSubmit({
            time: 60000,
            filter: i => i.user.id === interaction.user.id,
        }).catch(() => { });

        if (!submitted) {
            return;
        }

        const member = interaction.guild.members.cache.get(interaction.targetId);
        var caseNumber; 
        const caseData = await Case.findOne({ Guild: interaction.guild.id });
        if (!caseData) {
            await new Case({
                Guild: interaction.guild.id,
                Case: 1
            }).save();
            caseNumber = 1;
        }
        else {
            caseData.Case += 1;
            await caseData.save();
            caseNumber = caseData.Case;
        }

        const data = await Schema.findOne({ Guild: interaction.guild.id, User: member.id });
        if (data) {
                data.Warnings.push({
                    Moderator: interaction.user.id,
                    Reason: submitted.fields.getTextInputValue("reason"),
                    Date: Date.now(),
                    Case: caseNumber
                });
                await data.save();
            }
            else {
                await new Schema({
                    Guild: interaction.guild.id,
                    User: member.id,
                    Warnings: [{
                        Moderator: interaction.user.id,
                        Reason: submitted.fields.getTextInputValue("reason"),
                        Date: Date.now(),
                        Case: caseNumber
                    }]
                }).save();
            }

        client.embed({
            title: await client.t(interaction, 'moderation.warnTitle'),
            desc: await client.t(interaction, 'moderation.warnDescription', { guild: interaction.guild.name }),
            fields: [
                {
                    name: await client.t(interaction, 'moderation.moderator'),
                    value: interaction.user.tag,
                    inline: true
                },
                {
                    name: await client.t(interaction, 'moderation.reason'),
                    value: submitted.fields.getTextInputValue("reason"),
                    inline: true
                }
            ]
        }, member).catch(() => { })

        client.emit('warnAdd', member, interaction.user, submitted.fields.getTextInputValue("reason"));
        client.succNormal({
            key: 'errors.moderation.warnSuccess',
            fields: [
                {
                    name: await client.t(submitted, 'moderation.user'),
                    value: `${member}`,
                    inline: true
                },
                {
                    name: await client.t(submitted, 'moderation.moderator'),
                    value: `${interaction.user}`,
                    inline: true
                },
                {
                    name: await client.t(submitted, 'moderation.reason'),
                    value: submitted.fields.getTextInputValue("reason"),
                    inline: false
                }
            ],
            type: 'ephemeral'
        }, submitted);
    },
};

