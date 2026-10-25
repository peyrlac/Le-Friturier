const Discord = require('discord.js');

const Schema = require("../../database/models/economy");

module.exports = async (client, interaction, args) => {

    let amount = interaction.options.getNumber('amount');
    let user = interaction.user;

    if (!amount) return client.errUsage({ usage: "withdraw [amount]", type: 'editreply' }, interaction);

    if (isNaN(amount)) return client.errNormal({ key: 'economy.withdraw.invalid', type: 'editreply' }, interaction);

    if (amount < 0) return client.errNormal({ key: 'economy.withdraw.negative', type: 'editreply' }, interaction);

    const data = await Schema.findOne({ Guild: interaction.guild.id, User: user.id });
    if (data) {
        if (data.Bank === 0) return client.errNormal({ key: 'economy.withdraw.emptyBank', type: 'editreply' }, interaction);

            let money = parseInt(amount);

            const updated = await Schema.findOneAndUpdate(
                { _id: data._id, Bank: { $gte: money } },
                { $inc: { Money: money, Bank: -money } },
                { new: true }
            );
            if (!updated) return client.errNormal({ key: 'economy.withdraw.emptyBank', type: 'editreply' }, interaction);

            client.succNormal({
                key: 'economy.withdraw.success',
                fields: [
                    {
                        name: `${client.emotes.economy.coins}・${await client.t(interaction, 'economy.withdraw.amount')}`,
                        value: `$${amount}`,
                        inline: true
                    }
                ],
                type: 'editreply'
            }, interaction);
    } else {
        return client.errNormal({ key: 'economy.withdraw.noAccount', type: 'editreply' }, interaction);
    }
}
