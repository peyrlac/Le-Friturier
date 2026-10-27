const Discord = require('discord.js');

const Schema = require("../../database/models/economy");

module.exports = async (client, interaction, args) => {

    let amount = interaction.options.getNumber('amount');
    let user = interaction.user;

    if (!amount) return client.errUsage({ usage: await client.t(interaction, 'commands.economy.deposit.usage'), type: 'editreply' }, interaction);

    if (isNaN(amount)) return client.errNormal({ key: 'commands.economy.deposit.invalid', type: 'editreply' }, interaction);

    if (amount < 0) return client.errNormal({ key: 'commands.economy.deposit.negative', type: 'editreply' }, interaction);

    const data = await Schema.findOne({ Guild: interaction.guild.id, User: user.id });
    if (data) {
        if (data.Money < parseInt(amount)) return client.errNormal({ key: 'commands.economy.deposit.insufficient', type: 'editreply' }, interaction);

            let money = parseInt(amount);

            const updated = await Schema.findOneAndUpdate(
                { _id: data._id, Money: { $gte: money } },
                { $inc: { Money: -money, Bank: money } },
                { new: true }
            );
            if (!updated) return client.errNormal({ key: 'commands.economy.deposit.insufficient', type: 'editreply' }, interaction);

            client.succNormal({
                key: 'commands.economy.deposit.success',
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
 
