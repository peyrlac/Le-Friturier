const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Create a profile for the server')
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription('Get information about the profile category commands')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Create your profile')
        ).addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Delete your profile')
        ).
        addSubcommand(subcommand =>
            subcommand
                .setName('profile')
                .setDescription('See your profile')
                .addUserOption((option) =>
                    option.setName('user').setDescription('The user you want the profile from').setRequired(false),
                )
        ).
        addSubcommand(subcommand =>
            subcommand
                .setName('aboutme')
                .setDescription('Set your about me')
                .addStringOption(option => option.setName('text').setDescription('Enter a about me').setRequired(true))
        ).
        addSubcommand(subcommand =>
            subcommand
                .setName('age')
                .setDescription('Set your age')
                .addNumberOption(option => option.setName('number').setDescription('Enter a number').setMinValue(13).setMaxValue(120).setRequired(true))
        ).
        addSubcommand(subcommand =>
            subcommand
                .setName('bday')
                .setDescription('Set your bday')
                .addStringOption(option => option.setName('bday').setDescription('Enter a bday').setRequired(true))
        )

        .addSubcommandGroup((group) =>
            group
                .setName('actor')
                .setDescription('Set your favorite actor')
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('addactor')
                        .setDescription('The actor you want to add')
                        .addStringOption(option => option.setName('actor').setDescription('The actor you want to add').setRequired(true)),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('delactor')
                        .setDescription("The actor you want te remove")
                        .addStringOption(option => option.setName('actor').setDescription('The actor you want to remove').setRequired(true)),
                )
        ).
        addSubcommandGroup((group) =>
            group
                .setName('artist')
                .setDescription('Set your favorite artist')
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('addartist')
                        .setDescription('The artist you want to add')
                        .addStringOption(option => option.setName('artist').setDescription('The artist you want to add').setRequired(true)),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('delartist')
                        .setDescription("The artist you want te remove")
                        .addStringOption(option => option.setName('artist').setDescription('The artist you want to remove').setRequired(true)),
                )
        ).
        addSubcommand(subcommand =>
            subcommand
                .setName('color')
                .setDescription('Set your favorite color')
                .addStringOption(option => option.setName('color').setDescription('The color you want to set').setRequired(true)),

        ).addSubcommandGroup((group) =>
            group
                .setName('food')
                .setDescription('Set your favorite food')
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('addfood')
                        .setDescription('The food you want to add')
                        .addStringOption(option => option.setName('food').setDescription('The food you want to add').setRequired(true)),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('delfood')
                        .setDescription("The food you want te remove")
                        .addStringOption(option => option.setName('food').setDescription('The food you want to remove').setRequired(true)),
                )
        ).addSubcommandGroup((group) =>
            group
                .setName('movie')
                .setDescription('Set your favorite movie')
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('addmovie')
                        .setDescription('The movie you want to add')
                        .addStringOption(option => option.setName('movie').setDescription('The movie you want to add').setRequired(true)),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('delmovie')
                        .setDescription("The movie you want te remove")
                        .addStringOption(option => option.setName('movie').setDescription('The movie you want to remove').setRequired(true)),
                )
        ).addSubcommandGroup((group) =>
            group
                .setName('pet')
                .setDescription('Set your favorite pet')
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('addpet')
                        .setDescription('The pet you want to add')
                        .addStringOption(option => option.setName('pet').setDescription('The pet you want to add').setRequired(true)),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('delpet')
                        .setDescription("The pet you want te remove")
                        .addStringOption(option => option.setName('pet').setDescription('The pet you want to remove').setRequired(true)),
                )
        ).addSubcommandGroup((group) =>
            group
                .setName('song')
                .setDescription('Set your favorite song')
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('addsong')
                        .setDescription('The song you want to add')
                        .addStringOption(option => option.setName('song').setDescription('The song you want to add').setRequired(true)),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('delsong')
                        .setDescription("The song you want te remove")
                        .addStringOption(option => option.setName('song').setDescription('The song you want to remove').setRequired(true)),
                )
        ).
        addSubcommand(subcommand =>
            subcommand
                .setName('gender')
                .setDescription('Set your gender')

        ).addSubcommandGroup((group) =>
            group
                .setName('hobbies')
                .setDescription('Set your favorite hobby')
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('addhobby')
                        .setDescription('The song you want to add')
                        .addStringOption(option => option.setName('hobby').setDescription('The hobby you want to add').setRequired(true)),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('delhobby')
                        .setDescription("The hobby you want te remove")
                        .addStringOption(option => option.setName('hobby').setDescription('The hobby you want to remove').setRequired(true)),
                )
        ).
        addSubcommand(subcommand =>
            subcommand
                .setName('origin')
                .setDescription('Set your origin')
                .addStringOption(option => option.setName('country').setDescription('Enter a country').setRequired(true))
        ).
        addSubcommand(subcommand =>
            subcommand
                .setName('status')
                .setDescription('Set your status')
                .addStringOption(option => option.setName('text').setDescription('Enter a status').setRequired(true))
        ),

    localizations: {
        name: { fr: 'profil', en: 'profile' },
        description: {
            fr: 'Créer et gérer votre profil',
            en: 'Create and manage your profile'
        },
        subcommands: {
            help: { description: { fr: 'Voir les commandes de profil disponibles', en: 'Get information about the profile category commands' } },
            create: { description: { fr: 'Créer votre profil', en: 'Create your profile' } },
            delete: { description: { fr: 'Supprimer votre profil', en: 'Delete your profile' } },
            profile: {
                description: { fr: 'Voir votre profil', en: 'See your profile' },
                options: { user: { description: { fr: 'Utilisateur dont vous voulez voir le profil', en: 'The user you want the profile from' } } }
            },
            aboutme: {
                description: { fr: 'Définir votre présentation', en: 'Set your about me' },
                options: { text: { description: { fr: 'Saisissez votre présentation', en: 'Enter a about me' } } }
            },
            age: {
                description: { fr: 'Définir votre âge', en: 'Set your age' },
                options: { number: { description: { fr: 'Saisissez un nombre', en: 'Enter a number' } } }
            },
            bday: {
                description: { fr: 'Définir votre anniversaire', en: 'Set your bday' },
                options: { bday: { description: { fr: 'Saisissez votre anniversaire', en: 'Enter a bday' } } }
            },
            color: {
                description: { fr: 'Définir votre couleur préférée', en: 'Set your favorite color' },
                options: { color: { description: { fr: 'Saisissez la couleur à définir', en: 'The color you want to set' } } }
            },
            gender: { description: { fr: 'Définir votre genre', en: 'Set your gender' } },
            origin: {
                description: { fr: 'Définir votre origine', en: 'Set your origin' },
                options: { country: { description: { fr: 'Saisissez un pays', en: 'Enter a country' } } }
            },
            status: {
                description: { fr: 'Définir votre statut', en: 'Set your status' },
                options: { text: { description: { fr: 'Saisissez un statut', en: 'Enter a status' } } }
            }
        },
        subcommandGroups: {
            actor: {
                description: { fr: 'Gérer votre acteur préféré', en: 'Set your favorite actor' },
                subcommands: {
                    addactor: { description: { fr: 'Ajouter un acteur', en: 'The actor you want to add' }, options: { actor: { description: { fr: 'Acteur à ajouter', en: 'The actor you want to add' } } } },
                    delactor: { description: { fr: 'Supprimer un acteur', en: 'The actor you want to remove' }, options: { actor: { description: { fr: 'Acteur à supprimer', en: 'The actor you want to remove' } } } }
                }
            },
            artist: {
                description: { fr: 'Gérer votre artiste préféré', en: 'Set your favorite artist' },
                subcommands: {
                    addartist: { description: { fr: 'Ajouter un artiste', en: 'The artist you want to add' }, options: { artist: { description: { fr: 'Artiste à ajouter', en: 'The artist you want to add' } } } },
                    delartist: { description: { fr: 'Supprimer un artiste', en: 'The artist you want to remove' }, options: { artist: { description: { fr: 'Artiste à supprimer', en: 'The artist you want to remove' } } } }
                }
            },
            food: {
                description: { fr: 'Gérer votre nourriture préférée', en: 'Set your favorite food' },
                subcommands: {
                    addfood: { description: { fr: 'Ajouter un aliment', en: 'The food you want to add' }, options: { food: { description: { fr: 'Aliment à ajouter', en: 'The food you want to add' } } } },
                    delfood: { description: { fr: 'Supprimer un aliment', en: 'The food you want to remove' }, options: { food: { description: { fr: 'Aliment à supprimer', en: 'The food you want to remove' } } } }
                }
            },
            movie: {
                description: { fr: 'Gérer votre film préféré', en: 'Set your favorite movie' },
                subcommands: {
                    addmovie: { description: { fr: 'Ajouter un film', en: 'The movie you want to add' }, options: { movie: { description: { fr: 'Film à ajouter', en: 'The movie you want to add' } } } },
                    delmovie: { description: { fr: 'Supprimer un film', en: 'The movie you want to remove' }, options: { movie: { description: { fr: 'Film à supprimer', en: 'The movie you want to remove' } } } }
                }
            },
            pet: {
                description: { fr: 'Gérer votre animal préféré', en: 'Set your favorite pet' },
                subcommands: {
                    addpet: { description: { fr: 'Ajouter un animal', en: 'The pet you want to add' }, options: { pet: { description: { fr: 'Animal à ajouter', en: 'The pet you want to add' } } } },
                    delpet: { description: { fr: 'Supprimer un animal', en: 'The pet you want to remove' }, options: { pet: { description: { fr: 'Animal à supprimer', en: 'The pet you want to remove' } } } }
                }
            },
            song: {
                description: { fr: 'Gérer votre chanson préférée', en: 'Set your favorite song' },
                subcommands: {
                    addsong: { description: { fr: 'Ajouter une chanson', en: 'The song you want to add' }, options: { song: { description: { fr: 'Chanson à ajouter', en: 'The song you want to add' } } } },
                    delsong: { description: { fr: 'Supprimer une chanson', en: 'The song you want to remove' }, options: { song: { description: { fr: 'Chanson à supprimer', en: 'The song you want to remove' } } } }
                }
            },
            hobbies: {
                description: { fr: 'Gérer vos loisirs préférés', en: 'Set your favorite hobby' },
                subcommands: {
                    addhobby: { description: { fr: 'Ajouter un loisir', en: 'The hobby you want to add' }, options: { hobby: { description: { fr: 'Loisir à ajouter', en: 'The hobby you want to add' } } } },
                    delhobby: { description: { fr: 'Supprimer un loisir', en: 'The hobby you want to remove' }, options: { hobby: { description: { fr: 'Loisir à supprimer', en: 'The hobby you want to remove' } } } }
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
        client.loadSubcommands(client, interaction, args);
    },
};

 
