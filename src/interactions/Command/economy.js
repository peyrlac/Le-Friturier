const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    localizationKey: 'commandMetadata.economy',
    data: new SlashCommandBuilder()
        .setName(getCommandMetadata('commandMetadata.economy.name'))
        .setDescription(getCommandMetadata('commandMetadata.economy.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription(getCommandMetadata('commandMetadata.economy.subcommands.help.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('additem')
                .setDescription(getCommandMetadata('commandMetadata.economy.subcommands.additem.description'))
                .addRoleOption(option => option.setName('role').setDescription(getCommandMetadata('commandMetadata.economy.subcommands.additem.options.role.description')).setRequired(true))
                .addNumberOption(option => option.setName('amount').setDescription(getCommandMetadata('commandMetadata.economy.subcommands.additem.options.amount.description')).setMinValue(1).setMaxValue(1000000000).setRequired(true))

        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('addmoney')
                .setDescription(getCommandMetadata('commandMetadata.economy.subcommands.addmoney.description'))
                .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.economy.subcommands.addmoney.options.user.description')).setRequired(true))
                .addNumberOption(option => option.setName('amount').setDescription(getCommandMetadata('commandMetadata.economy.subcommands.addmoney.options.amount.description')).setMinValue(1).setMaxValue(1000000000).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('balance')
                .setDescription(getCommandMetadata('commandMetadata.economy.subcommands.balance.description'))
                .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.economy.subcommands.balance.options.user.description')).setRequired(false))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('beg')
                .setDescription(getCommandMetadata('commandMetadata.economy.subcommands.beg.description'))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('buy')
                .setDescription(getCommandMetadata('commandMetadata.economy.subcommands.buy.description'))

        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('clear')
                .setDescription(getCommandMetadata('commandMetadata.economy.subcommands.clear.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('crime')
                .setDescription(getCommandMetadata('commandMetadata.economy.subcommands.crime.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('daily')
                .setDescription(getCommandMetadata('commandMetadata.economy.subcommands.daily.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('deleteitem')
                .setDescription(getCommandMetadata('commandMetadata.economy.subcommands.deleteitem.description'))
                .addRoleOption(option => option.setName('role').setDescription(getCommandMetadata('commandMetadata.economy.subcommands.deleteitem.options.role.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('deposit')
                .setDescription(getCommandMetadata('commandMetadata.economy.subcommands.deposit.description'))
                .addNumberOption(option => option.setName('amount').setDescription(getCommandMetadata('commandMetadata.economy.subcommands.deposit.options.amount.description')).setMinValue(1).setMaxValue(1000000000).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('fish')
                .setDescription(getCommandMetadata('commandMetadata.economy.subcommands.fish.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('hourly')
                .setDescription(getCommandMetadata('commandMetadata.economy.subcommands.hourly.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('hunt')
                .setDescription(getCommandMetadata('commandMetadata.economy.subcommands.hunt.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('monthly')
                .setDescription(getCommandMetadata('commandMetadata.economy.subcommands.monthly.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('pay')
                .setDescription(getCommandMetadata('commandMetadata.economy.subcommands.pay.description'))
                .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.economy.subcommands.pay.options.user.description')).setRequired(true))
                .addNumberOption(option => option.setName('amount').setDescription(getCommandMetadata('commandMetadata.economy.subcommands.pay.options.amount.description')).setMinValue(1).setMaxValue(1000000000).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('present')
                .setDescription(getCommandMetadata('commandMetadata.economy.subcommands.present.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('removemoney')
                .setDescription(getCommandMetadata('commandMetadata.economy.subcommands.removemoney.description'))
                .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.economy.subcommands.removemoney.options.user.description')).setRequired(true))
                .addNumberOption(option => option.setName('amount').setDescription(getCommandMetadata('commandMetadata.economy.subcommands.removemoney.options.amount.description')).setMinValue(1).setMaxValue(1000000000).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('rob')
                .setDescription(getCommandMetadata('commandMetadata.economy.subcommands.rob.description'))
                .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.economy.subcommands.rob.options.user.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('store')
                .setDescription(getCommandMetadata('commandMetadata.economy.subcommands.store.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('weekly')
                .setDescription(getCommandMetadata('commandMetadata.economy.subcommands.weekly.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('withdraw')
                .setDescription(getCommandMetadata('commandMetadata.economy.subcommands.withdraw.description'))
                .addNumberOption(option => option.setName('amount').setDescription(getCommandMetadata('commandMetadata.economy.subcommands.withdraw.options.amount.description')).setMinValue(1).setMaxValue(1000000000).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('work')
                .setDescription(getCommandMetadata('commandMetadata.economy.subcommands.work.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('yearly')
                .setDescription(getCommandMetadata('commandMetadata.economy.subcommands.yearly.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('leaderboard')
                .setDescription(getCommandMetadata('commandMetadata.economy.subcommands.leaderboard.description'))
                .addStringOption(option =>
                    option.setName('type')
                        .setDescription(getCommandMetadata('commandMetadata.economy.subcommands.leaderboard.options.type.description'))
                        .setRequired(true)
                        .addChoices(
                            { name: getCommandMetadata('commandMetadata.economy.subcommands.leaderboard.options.type.choices.money.name'), value: 'money' },
                            { name: getCommandMetadata('commandMetadata.economy.subcommands.leaderboard.options.type.choices.bank.name'), value: 'bank' }
                        )
                )
        )
    ,
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

 
