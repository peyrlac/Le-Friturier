const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    localizationKey: 'commandMetadata.triggers',
    data: new SlashCommandBuilder()
        .setName('triggers')
        .setDescription(getCommandMetadata('commandMetadata.triggers.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription(getCommandMetadata('commandMetadata.triggers.subcommands.add.description'))
                .addStringOption(option => option.setName('alias').setDescription(getCommandMetadata('commandMetadata.triggers.subcommands.add.options.alias.description')).setRequired(true))
                .addStringOption(option => 
                    option.setName('type')
                        .setDescription(getCommandMetadata('commandMetadata.triggers.subcommands.add.options.type.description'))
                        .setRequired(true)
                        .addChoices(
                            { name: 'Répond', value: '1' },
                            { name: 'Répond puis supprime', value: '2' },
                            { name: 'Supprime', value: '3' },
                            { name: 'Ajoute une réaction', value: '4' }
                        )
                )
                .addStringOption(option => option.setName('regex').setDescription(getCommandMetadata('commandMetadata.triggers.subcommands.add.options.regex.description')).setRequired(true))
                .addStringOption(option => option.setName('regexflags').setDescription(getCommandMetadata('commandMetadata.triggers.subcommands.add.options.regexflags.description')).setRequired(true))
                .addStringOption(option => option.setName('response').setDescription(getCommandMetadata('commandMetadata.triggers.subcommands.add.options.response.description')).setRequired(false))
                .addStringOption(option => 
                    option.setName('isactive')
                        .setDescription(getCommandMetadata('commandMetadata.triggers.subcommands.add.options.isactive.description'))
                        .setRequired(false)
                        .addChoices(
                            { name: 'Activé (par défaut)', value: "true" },
                            { name: 'Désactivé', value: "false" }
                        )
                )
                .addStringOption(option => 
                    option.setName('mention')
                        .setDescription(getCommandMetadata('commandMetadata.triggers.subcommands.add.options.mention.description'))
                        .setRequired(false)
                        .addChoices(
                            { name: 'Mentionne (par défaut)', value: "true" },
                            { name: 'Ne mentionne pas', value: "false" }
                        )
                )
                .addStringOption(option => 
                    option.setName('replied')
                        .setDescription(getCommandMetadata('commandMetadata.triggers.subcommands.add.options.replied.description'))
                        .setRequired(false)
                        .addChoices(
                            { name: 'Message suivi (par défaut)', value: "true" },
                            { name: 'Message seul', value: "false" }
                        )
                )
                .addStringOption(option => option.setName('emotes').setDescription(getCommandMetadata('commandMetadata.triggers.subcommands.add.options.emotes.description')).setRequired(false))
                .addNumberOption(option => option.setName('timedeletion').setDescription(getCommandMetadata('commandMetadata.triggers.subcommands.add.options.timedeletion.description')).setMinValue(0).setMaxValue(604800000).setRequired(false))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription(getCommandMetadata('commandMetadata.triggers.subcommands.remove.description'))
                .addStringOption(option => option.setName('alias').setDescription(getCommandMetadata('commandMetadata.triggers.subcommands.remove.options.alias.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription(getCommandMetadata('commandMetadata.triggers.subcommands.list.description'))
        ).addSubcommand(subcommand =>
            subcommand
                .setName('documentation')
                .setDescription(getCommandMetadata('commandMetadata.triggers.subcommands.documentation.description'))
        ),

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {
        await interaction.deferReply();
        const perms = await client.checkUserPerms({
            flags: [Discord.PermissionsBitField.Flags.ManageMessages],
            perms: [Discord.PermissionsBitField.Flags.ManageMessages]
        }, interaction)

        if (perms == false) return;

        client.loadSubcommands(client, interaction, args);
    },
};

 
