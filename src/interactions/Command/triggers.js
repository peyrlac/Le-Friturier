const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('triggers')
        .setDescription('Déclenche une réponse à certains mots')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Ajouter un trigger')
                .addStringOption(option => option.setName('alias').setDescription('Alias du trigger').setRequired(true))
                .addStringOption(option => 
                    option.setName('type')
                        .setDescription('Type de réponse')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Répond', value: '1' },
                            { name: 'Répond puis supprime', value: '2' },
                            { name: 'Supprime', value: '3' },
                            { name: 'Ajoute une réaction', value: '4' }
                        )
                )
                .addStringOption(option => option.setName('regex').setDescription('Filtre regex').setRequired(true))
                .addStringOption(option => option.setName('regexflags').setDescription('Flags regex additionnels').setRequired(true))
                .addStringOption(option => option.setName('response').setDescription('Message de réponse du bot').setRequired(false))
                .addStringOption(option => 
                    option.setName('isactive')
                        .setDescription('Status du trigger')
                        .setRequired(false)
                        .addChoices(
                            { name: 'Activé (par défaut)', value: "true" },
                            { name: 'Désactivé', value: "false" }
                        )
                )
                .addStringOption(option => 
                    option.setName('mention')
                        .setDescription('Mentionne lors de la réponse')
                        .setRequired(false)
                        .addChoices(
                            { name: 'Mentionne (par défaut)', value: "true" },
                            { name: 'Ne mentionne pas', value: "false" }
                        )
                )
                .addStringOption(option => 
                    option.setName('replied')
                        .setDescription('Manière dont est affiché la réponse')
                        .setRequired(false)
                        .addChoices(
                            { name: 'Message suivi (par défaut)', value: "true" },
                            { name: 'Message seul', value: "false" }
                        )
                )
                .addStringOption(option => option.setName('emotes').setDescription('Emotes ajoutées lors de la réaction').setRequired(false))
                .addNumberOption(option => option.setName('timedeletion').setDescription('Temps avant suppression (par défaut 1000ms si option active').setMinValue(0).setMaxValue(604800000).setRequired(false))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Retirer un trigger')
                .addStringOption(option => option.setName('alias').setDescription('Alias du trigger').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('Voir tous les triggers')
        ).addSubcommand(subcommand =>
            subcommand
                .setName('documentation')
                .setDescription('Documentation sur comment faire un triggers')
        ),

    localizations: {
        name: { fr: 'triggers', en: 'triggers' },
        description: { fr: 'Déclencher des réponses sur certains mots', en: 'Trigger responses to matching messages' },
        subcommands: {
            add: {
                description: { fr: 'Ajouter un trigger', en: 'Add a trigger' },
                options: {
                    alias: { description: { fr: 'Alias du trigger', en: 'Trigger alias' } },
                    type: { description: { fr: 'Type de réponse', en: 'Response type' } },
                    regex: { description: { fr: 'Filtre regex', en: 'Regex filter' } },
                    regexflags: { description: { fr: 'Flags regex additionnels', en: 'Additional regex flags' } },
                    response: { description: { fr: 'Réponse du bot', en: 'Bot response' } },
                    isactive: { description: { fr: 'Statut du trigger', en: 'Trigger status' } },
                    mention: { description: { fr: 'Mentionner lors de la réponse', en: 'Mention when responding' } },
                    replied: { description: { fr: 'Format de la réponse', en: 'Response format' } },
                    emotes: { description: { fr: 'Emotes ajoutées lors de la réaction', en: 'Emotes added to the reaction' } },
                    timedeletion: { description: { fr: 'Délai avant suppression', en: 'Delay before deletion' } }
                }
            },
            remove: {
                description: { fr: 'Retirer un trigger', en: 'Remove a trigger' },
                options: { alias: { description: { fr: 'Alias du trigger', en: 'Trigger alias' } } }
            },
            list: { description: { fr: 'Voir tous les triggers', en: 'List all triggers' } },
            documentation: { description: { fr: 'Consulter la documentation des triggers', en: 'View trigger documentation' } }
        }
    },

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

 
