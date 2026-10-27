const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const { ChannelType } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('automod')
        .setDescription('Gérer le mod automatique')
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription('Obtenez des informations sur les commandes de configuration automatique')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('antiinvite')
                .setDescription('Activer / désactiver l\'anti invite')
                .addBooleanOption(option => option.setName('active').setDescription('Select a boolean').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('antilinks')
                .setDescription('Activer / désactiver l\'anti liens')
                .addBooleanOption(option => option.setName('active').setDescription('Select a boolean').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('antispam')
                .setDescription('Activer / désactiver l\'antispam')
                .addBooleanOption(option => option.setName('active').setDescription('Select a boolean').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('linkschannel')
                .setDescription('Ajouter un canal autorisé à envoyer des liens')
                .addStringOption(option =>
                    option.setName('type')
                        .setDescription('Que voulez-vous faire avec la chaîne?')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Add', value: 'add' },
                            { name: 'Remove', value: 'remove' }
                        )
                )
                .addChannelOption(option => option.setName('channel').setDescription('Select a channel').setRequired(true).addChannelTypes(ChannelType.GuildText))
        )
        .addSubcommandGroup(group =>
            group
                .setName('blacklist')
                .setDescription('Gérer la liste noire')
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('display')
                        .setDescription('Montrer toute la liste noire')
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('add')
                        .setDescription('Ajoutez un mot à la liste noire')
                        .addStringOption(option => option.setName('word').setDescription('Le mot pour la liste noire').setRequired(true))
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('remove')
                        .setDescription('Supprimer un mot de la liste noire')
                        .addStringOption(option => option.setName('word').setDescription('Le mot pour la liste noire').setRequired(true))
                )
        )
    ,

    localizations: {
        name: { fr: 'automod', en: 'automod' },
        description: { fr: 'Gérer la modération automatique', en: 'Manage automatic moderation' },
        subcommands: {
            help: { description: { fr: 'Voir l’aide de la modération automatique', en: 'View automatic moderation help' } },
            antiinvite: {
                description: { fr: 'Activer ou désactiver l’anti-invitation', en: 'Enable or disable anti-invite protection' },
                options: { active: { description: { fr: 'Activer la protection', en: 'Enable protection' } } }
            },
            antilinks: {
                description: { fr: 'Activer ou désactiver l’anti-liens', en: 'Enable or disable anti-links protection' },
                options: { active: { description: { fr: 'Activer la protection', en: 'Enable protection' } } }
            },
            antispam: {
                description: { fr: 'Activer ou désactiver l’anti-spam', en: 'Enable or disable anti-spam protection' },
                options: { active: { description: { fr: 'Activer la protection', en: 'Enable protection' } } }
            },
            linkschannel: {
                description: { fr: 'Gérer les salons autorisés pour les liens', en: 'Manage channels allowed to contain links' },
                options: {
                    type: { description: { fr: 'Action à effectuer', en: 'Action to perform' } },
                    channel: { description: { fr: 'Salon concerné', en: 'Target channel' } }
                }
            }
        },
        subcommandGroups: {
            blacklist: {
                description: { fr: 'Gérer la liste noire', en: 'Manage the blacklist' },
                subcommands: {
                    display: { description: { fr: 'Afficher la liste noire', en: 'Display the blacklist' } },
                    add: {
                        description: { fr: 'Ajouter un mot à la liste noire', en: 'Add a word to the blacklist' },
                        options: { word: { description: { fr: 'Mot à ajouter', en: 'Word to add' } } }
                    },
                    remove: {
                        description: { fr: 'Supprimer un mot de la liste noire', en: 'Remove a word from the blacklist' },
                        options: { word: { description: { fr: 'Mot à supprimer', en: 'Word to remove' } } }
                    }
                }
            }
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

 
