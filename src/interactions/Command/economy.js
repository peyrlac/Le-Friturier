const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('economy')
        .setDescription('Play the economy game in your server')
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription('Get information about the economy category commands')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('additem')
                .setDescription('Add a role item to the economy store')
                .addRoleOption(option => option.setName('role').setDescription('Select a role').setRequired(true))
                .addNumberOption(option => option.setName('amount').setDescription('Enter a amount').setMinValue(1).setMaxValue(1000000000).setRequired(true))

        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('addmoney')
                .setDescription('Add money to a user')
                .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
                .addNumberOption(option => option.setName('amount').setDescription('Enter a amount').setMinValue(1).setMaxValue(1000000000).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('balance')
                .setDescription('See your balance')
                .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(false))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('beg')
                .setDescription('Beg for money')
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('buy')
                .setDescription('Buy items in the Bot store')

        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('clear')
                .setDescription('Clear the economy')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('crime')
                .setDescription('Commit a crime')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('daily')
                .setDescription('Claim your daily money')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('deleteitem')
                .setDescription('Delete a role item from the economy store')
                .addRoleOption(option => option.setName('role').setDescription('Select a role').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('deposit')
                .setDescription('Deposit money to the bank')
                .addNumberOption(option => option.setName('amount').setDescription('Enter a amount').setMinValue(1).setMaxValue(1000000000).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('fish')
                .setDescription('Fish some fish')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('hourly')
                .setDescription('Claim your hourly money')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('hunt')
                .setDescription('Hunt some animals')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('monthly')
                .setDescription('Claim your monthly money')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('pay')
                .setDescription('Pay a user')
                .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
                .addNumberOption(option => option.setName('amount').setDescription('Enter a amount').setMinValue(1).setMaxValue(1000000000).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('present')
                .setDescription('Get a weekly present')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('removemoney')
                .setDescription('Remove money from a user')
                .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
                .addNumberOption(option => option.setName('amount').setDescription('Enter a amount').setMinValue(1).setMaxValue(1000000000).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('rob')
                .setDescription('Rob a user')
                .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('store')
                .setDescription('Show the store of this guild')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('weekly')
                .setDescription('Claim your weekly money')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('withdraw')
                .setDescription('Withdraw your money')
                .addNumberOption(option => option.setName('amount').setDescription('Enter a amount').setMinValue(1).setMaxValue(1000000000).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('work')
                .setDescription('Go to work')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('yearly')
                .setDescription('Claim your yearly money')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('leaderboard')
                .setDescription('See the economy leaderboard')
                .addStringOption(option =>
                    option.setName('type')
                        .setDescription('The leaderboard type that you want')
                        .setRequired(true)
                        .addChoices(
                            {name: 'Money', value: 'money'},
                            {name: 'Bank', value: 'bank'}
                        )
                )
        )
    ,
    localizations: {
        name: { fr: 'économie', en: 'economy' },
        description: { fr: 'Jouer au jeu économique du serveur', en: 'Play the economy game in your server' },
        subcommands: {
            help: { description: { fr: 'Voir les commandes économiques disponibles', en: 'Get information about the economy category commands' } },
            additem: { description: { fr: 'Ajouter un rôle à la boutique', en: 'Add a role item to the economy store' }, options: { role: { description: { fr: 'Sélectionnez un rôle', en: 'Select a role' } }, amount: { description: { fr: 'Entrez un montant', en: 'Enter an amount' } } } },
            addmoney: { description: { fr: 'Ajouter de l’argent à un utilisateur', en: 'Add money to a user' }, options: { user: { description: { fr: 'Sélectionnez un utilisateur', en: 'Select a user' } }, amount: { description: { fr: 'Entrez un montant', en: 'Enter an amount' } } } },
            balance: { description: { fr: 'Voir votre solde', en: 'See your balance' }, options: { user: { description: { fr: 'Utilisateur dont voir le solde', en: 'The user whose balance you want to see' } } } },
            beg: { description: { fr: 'Mendier de l’argent', en: 'Beg for money' } },
            buy: { description: { fr: 'Acheter des articles dans la boutique', en: 'Buy items in the bot store' } },
            clear: { description: { fr: 'Réinitialiser l’économie', en: 'Clear the economy' } },
            crime: { description: { fr: 'Commettre un crime', en: 'Commit a crime' } },
            daily: { description: { fr: 'Récupérer votre récompense quotidienne', en: 'Claim your daily money' } },
            deleteitem: { description: { fr: 'Supprimer un rôle de la boutique', en: 'Delete a role item from the economy store' }, options: { role: { description: { fr: 'Sélectionnez un rôle', en: 'Select a role' } } } },
            deposit: { description: { fr: 'Déposer de l’argent à la banque', en: 'Deposit money to the bank' }, options: { amount: { description: { fr: 'Entrez un montant', en: 'Enter an amount' } } } },
            fish: { description: { fr: 'Pêcher', en: 'Fish some fish' } },
            hourly: { description: { fr: 'Récupérer votre récompense horaire', en: 'Claim your hourly money' } },
            hunt: { description: { fr: 'Chasser des animaux', en: 'Hunt some animals' } },
            monthly: { description: { fr: 'Récupérer votre récompense mensuelle', en: 'Claim your monthly money' } },
            pay: { description: { fr: 'Payer un utilisateur', en: 'Pay a user' }, options: { user: { description: { fr: 'Sélectionnez un utilisateur', en: 'Select a user' } }, amount: { description: { fr: 'Entrez un montant', en: 'Enter an amount' } } } },
            present: { description: { fr: 'Récupérer un cadeau hebdomadaire', en: 'Get a weekly present' } },
            removemoney: { description: { fr: 'Retirer de l’argent à un utilisateur', en: 'Remove money from a user' }, options: { user: { description: { fr: 'Sélectionnez un utilisateur', en: 'Select a user' } }, amount: { description: { fr: 'Entrez un montant', en: 'Enter an amount' } } } },
            rob: { description: { fr: 'Voler un utilisateur', en: 'Rob a user' }, options: { user: { description: { fr: 'Sélectionnez un utilisateur', en: 'Select a user' } } } },
            store: { description: { fr: 'Voir la boutique du serveur', en: 'Show the store of this guild' } },
            weekly: { description: { fr: 'Récupérer votre récompense hebdomadaire', en: 'Claim your weekly money' } },
            withdraw: { description: { fr: 'Retirer votre argent', en: 'Withdraw your money' }, options: { amount: { description: { fr: 'Entrez un montant', en: 'Enter an amount' } } } },
            work: { description: { fr: 'Aller travailler', en: 'Go to work' } },
            yearly: { description: { fr: 'Récupérer votre récompense annuelle', en: 'Claim your yearly money' } },
            leaderboard: { description: { fr: 'Voir le classement économique', en: 'See the economy leaderboard' }, options: { type: { description: { fr: 'Type de classement souhaité', en: 'The leaderboard type that you want' } } } }
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

 
