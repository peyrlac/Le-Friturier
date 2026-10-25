const Discord = require('discord.js');

const Schema = require("../../database/models/economy");

module.exports = async (client, interaction, args) => {

    const user = await interaction.guild.members.fetch(interaction.options.getUser('user'));
    let amount = interaction.options.getNumber('amount');

    if (amount < 0) return client.errNormal({ key: 'economy.pay.negative', type: 'editreply' }, interaction);

    if (user.id == interaction.user.id) {
        return client.errNormal({
            key: 'economy.pay.self',
            type: 'editreply'
        }, interaction)
    }

    const data = await Schema.findOne({ Guild: interaction.guild.id, User: interaction.user.id });
    if (data) {
        if (data.Money < parseInt(amount)) return client.errNormal({ key: 'economy.pay.insufficient', type: 'editreply' }, interaction);

            let money = parseInt(amount);

            const updated = await Schema.findOneAndUpdate(
                { _id: data._id, Money: { $gte: money } },
                { $inc: { Money: -money } },
                { new: true }
            );
            if (!updated) return client.errNormal({ key: 'economy.pay.insufficient', type: 'editreply' }, interaction);

            await client.addMoney(interaction, user, money);

            client.succNormal({
                key: 'economy.pay.success',
                variables: { user: String(user), amount },
                fields: [
                    {
                        name: await client.t(interaction, 'economy.pay.user'),
                        value: `$${user}`,
                        inline: true
                    },
                    {
                        name: `${client.emotes.economy.coins}ãƒ»${await client.t(interaction, 'economy.pay.amount')}`,
                        value: `$${amount}`,
                        inline: true
                    }
                ],
                type: 'editreply'
            }, interaction);
    } else {
        return client.errNormal({ key: 'economy.pay.empty', type: 'editreply' }, interaction);
    }
}


