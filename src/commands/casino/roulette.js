const Discord = require('discord.js');

const Schema = require("../../database/models/economy");

module.exports = async (client, interaction, args) => {
    let user = interaction.user;

    const data = await Schema.findOne({ Guild: interaction.guild.id, User: user.id });
    if (data) {
        function isOdd(num) {
                if ((num % 2) == 0) return false;
                else if ((num % 2) == 1) return true;
            }

            let colour = interaction.options.getString('color');
            let money = parseInt(interaction.options.getNumber('amount'));

            let random = Math.floor(Math.random() * 37);

            if (!colour || !money) return client.errUsage({ usage: "roulette [color] [amount]", type: 'editreply' }, interaction);
            colour = colour.toLowerCase()
            if (money > data.Money) return client.errNormal({ error: `Vous pariez plus que vous ne l'avez fait!`, type: 'editreply' }, interaction);

            if (colour == "b" || colour.includes("black")) colour = 0;
            else if (colour == "r" || colour.includes("red")) colour = 1;
            else if (colour == "g" || colour.includes("green")) colour = 2;
            else return client.errNormal({ error: `Aucune couleur correcte spécifiée!`, type: 'editreply' }, interaction);

            if (random == 0 && colour == 2) { // Green
                money *= 15

                await client.addMoney(interaction, user, money);

                client.embed({ title: `🎰・Multiplicateur: 15x`, desc: `Tu as gagné **${client.emotes.economy.coins} $${money}**`, type: 'editreply' }, interaction);
            }

            else if (isOdd(random) && colour == 1) { // Red
                money = parseInt(money * 1.5)
                await client.addMoney(interaction, user, money);

                client.embed({ title: `🎰・Multiplicateur: 1.5x`, desc: `Tu as gagné **${client.emotes.economy.coins} $${money}**`, type: 'editreply' }, interaction);
            }

            else if (!isOdd(random) && colour == 0) { // Black
                money = parseInt(money * 2)
                await client.addMoney(interaction, user, money);

                client.embed({ title: `🎰・Multiplicateur: 2x`, desc: `Tu as gagné **${client.emotes.economy.coins} $${money}**`, type: 'editreply' }, interaction);
            }

            else { // Wrong
                await client.removeMoney(interaction, user, money);

                client.embed({ title: `🎰・Multiplicateur: 0x`, desc: `Tu as perdu **${client.emotes.economy.coins} $${money}**`, type: 'editreply' }, interaction);
            }

    } else {
        return client.errNormal({ error: `Tu n'as pas ${client.emotes.economy.coins}!`, type: 'editreply' }, interaction);
    }
}
