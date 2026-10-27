const slotItems = ["🍇", "🍉", "🍊", "🍎", "🍓", "🍒"];
const Discord = require('discord.js');
const ms = require("parse-ms");

const Schema = require("../../database/models/economy");

module.exports = async (client, interaction, args) => {
    let user = interaction.user;

    const data = await Schema.findOne({ Guild: interaction.guild.id, User: user.id });
    if (data) {
        let money = parseInt(interaction.options.getNumber('amount'));
            let win = false;

            if (!money) return client.errUsage({ usage: await client.t(interaction, 'commands.casino.slots.usage'), type: 'editreply' }, interaction);
            if (money > data.Money) return client.errNormal({ key: 'commands.casino.slots.insufficient', type: 'editreply' }, interaction);

            let number = []
            for (i = 0; i < 3; i++) { number[i] = Math.floor(Math.random() * slotItems.length); }

            if (number[0] == number[1] && number[1] == number[2]) {
                money *= 9
                win = true;
            } else if (number[0] == number[1] || number[0] == number[2] || number[1] == number[2]) {
                money *= 2
                win = true;
            }

            const row = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('slots_1')
                        .setLabel(`${slotItems[number[0]]}`)
                        .setStyle(Discord.ButtonStyle.Primary),

                    new Discord.ButtonBuilder()
                        .setCustomId('slots_2')
                        .setLabel(`${slotItems[number[1]]}`)
                        .setStyle(Discord.ButtonStyle.Primary),

                    new Discord.ButtonBuilder()
                        .setCustomId('slots_3')
                        .setLabel(`${slotItems[number[2]]}`)
                        .setStyle(Discord.ButtonStyle.Primary),
                );
            if (win) {

                client.embed({
                    titleKey: 'commands.casino.slots.title',
                    descKey: 'commands.casino.slots.win',
                    variables: { amount: `${client.emotes.economy.coins} $${money}` },
                    color: client.config.colors.succes, 
                    components: [row], 
                    type: 'editreply'
                }, interaction)

                await client.addMoney(interaction, user, money);
            } else {

                client.embed({
                    titleKey: 'commands.casino.slots.title',
                    descKey: 'commands.casino.slots.lose',
                    variables: { amount: `${client.emotes.economy.coins} $${money}` },
                    components: [row], 
                    color: client.config.colors.error, 
                    type: 'editreply'
                }, interaction)

                await client.removeMoney(interaction, user, money);
            }
    } else {
        return client.errNormal({ key: 'commands.casino.slots.empty', type: 'editreply' }, interaction);
    }
}
