const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    localizationKey: 'commandMetadata.activities',
    data: new SlashCommandBuilder()
        .setName(getCommandMetadata('commandMetadata.activities.name'))
        .setDescription(getCommandMetadata('commandMetadata.activities.description'))
        .addStringOption(option =>
            option.setName('activity')
                .setDescription(getCommandMetadata('commandMetadata.activities.options.activity.description'))
                .setRequired(true)
                .addChoices(
                    { name: getCommandMetadata('commandMetadata.activities.options.activity.choices.betrayal.name'), value: 'betrayal' },
                    { name: getCommandMetadata('commandMetadata.activities.options.activity.choices.checkers.name'), value: 'checkers' },
                    { name: getCommandMetadata('commandMetadata.activities.options.activity.choices.chess.name'), value: 'chess' },
                    { name: getCommandMetadata('commandMetadata.activities.options.activity.choices.doodlecrew.name'), value: 'doodlecrew' },
                    { name: getCommandMetadata('commandMetadata.activities.options.activity.choices.fishington.name'), value: 'fishington' },
                    { name: getCommandMetadata('commandMetadata.activities.options.activity.choices.letterleague.name'), value: 'letterleague' },
                    { name: getCommandMetadata('commandMetadata.activities.options.activity.choices.ocho.name'), value: 'ocho' },
                    { name: getCommandMetadata('commandMetadata.activities.options.activity.choices.poker.name'), value: 'poker' },
                    { name: getCommandMetadata('commandMetadata.activities.options.activity.choices.sketchheads.name'), value: 'sketchheads' },
                    { name: getCommandMetadata('commandMetadata.activities.options.activity.choices.spellcast.name'), value: 'spellcast' },
                    { name: getCommandMetadata('commandMetadata.activities.options.activity.choices.wordsnacks.name'), value: 'wordsnacks' },
                    { name: getCommandMetadata('commandMetadata.activities.options.activity.choices.watchtogether.name'), value: 'watchtogether' }
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
        const activity = interaction.options.getString('activity');

        const channel = interaction.member.voice.channel;
        if (!channel) return client.errNormal({
            key: 'activities.notInVoice',
            type: 'editreply' 
        }, interaction);

        if (activity == "betrayal") {
            client.generateActivity("773336526917861400", "Betrayal.io", channel, interaction)
        }
        else if (activity == "checkers") {
            client.generateActivity("832013003968348200", "Checkers in the Park", channel, interaction)
        }
        else if (activity == "chess") {
            client.generateActivity("832012586023256104", "Chess in the Park", channel, interaction)
        }
        else if (activity == "doodlecrew") {
            client.generateActivity("878067389634314250", "Doodle Crew", channel, interaction)
        }
        else if (activity == "fishington") {
            client.generateActivity("814288819477020702", "Fishington.io", channel, interaction)
        }
        else if (activity == "lettertile") {
            client.generateActivity("879863686565621790", "Letter Tile", channel, interaction)
        }
        else if (activity == "poker") {
            client.generateActivity("755827207812677713", "Poker Night", channel, interaction)
        }
        else if (activity == "spellcast") {
            client.generateActivity("852509694341283871", "Spell Cast", channel, interaction)
        }
        else if (activity == "wordsnacks") {
            client.generateActivity("879863976006127627", "Word Snacks", channel, interaction)
        }
        else if (activity == "watchtogether") {
            client.generateActivity("880218394199220334", "Watch Together", channel, interaction)
        }
        else if (activity == "ocho") {
            client.generateActivity("832025144389533716", "Ocho", channel, interaction)
        }
        else if (activity == "sketchheads") {
            client.generateActivity("902271654783242291", "Sketch Heads", channel, interaction)
        }
        else if (activity == "letterleague") {
            client.generateActivity("879863686565621790", "Letter League", channel, interaction)
        }
    },
};

 
