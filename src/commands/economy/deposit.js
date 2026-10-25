const Discord = require('discord.js');

const Schema = require("../../database/models/economy");

module.exports = async (client, interaction, args) => {

    let amount = interaction.options.getNumber('amount');
    let user = interaction.user;

    if (!amount) return client.errUsage({ usage: "deposit [amount]", type: 'editreply' }, interaction);

    if (isNaN(amount)) return client.errNormal({ error: "Enter a valid number!", type: 'editreply' }, interaction);

    if (amount < 0) return client.errNormal({ error: `You can't deposit negative money!`, type: 'editreply' }, interaction);

    const data = await Schema.findOne({ Guild: interaction.guild.id, User: user.id });
    if (data) {
        if (data.Money < parseInt(amount)) return client.errNormal({ error: `You don't have that much money!`, type: 'editreply' }, interaction);

            let money = parseInt(amount);

            const updated = await Schema.findOneAndUpdate(
                { _id: data._id, Money: { $gte: money } },
                { $inc: { Money: -money, Bank: money } },
                { new: true }
            );
            if (!updated) return client.errNormal({ error: `You don't have that much money!`, type: 'editreply' }, interaction);

            client.succNormal({
                text: `You've have deposited some money into your bank!`,
                fields: [
                    {
                        name: `${client.emotes.economy.coins}┆Amount`,
                        value: `$${amount}`,
                        inline: true
                    }
                ],
                type: 'editreply'
            }, interaction);
    } else {
        return client.errNormal({ text: `You don't have any money to deposit!`, type: 'editreply' }, interaction);
    }
}
 
