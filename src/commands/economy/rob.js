const Schema = require('../../database/models/economy');
const Schema2 = require('../../database/models/economyTimeout');

module.exports = async (client, interaction) => {
    const target = interaction.options.getUser('user');
    if (!target) return client.errUsage({ usage: 'rob [mention user]', type: 'editreply' }, interaction);
    if (target.bot) return client.errNormal({ key: 'economy.rob.bot', type: 'editreply' }, interaction);

    const timeout = 600000;
    const now = Date.now();
    const cooldown = await Schema2.findOne({ Guild: interaction.guild.id, User: interaction.user.id });
    if (cooldown?.Rob && timeout - (now - cooldown.Rob) > 0) {
        return client.errWait({ time: (cooldown.Rob / 1000 + timeout / 1000).toFixed(0), type: 'editreply' }, interaction);
    }

    const thief = await Schema.findOne({ Guild: interaction.guild.id, User: interaction.user.id });
    if (!thief || thief.Money < 200) {
        return client.errNormal({ key: 'economy.rob.minimumWallet', type: 'editreply' }, interaction);
    }

    const targetData = await Schema.findOne({ Guild: interaction.guild.id, User: target.id });
    if (!targetData || targetData.Money <= 0) {
        return client.errNormal({ key: 'economy.rob.emptyTarget', variables: { user: target.username }, type: 'editreply' }, interaction);
    }

    const requested = Math.floor(Math.random() * 100) + 1;
    const amount = Math.min(requested, targetData.Money);
    const debited = await Schema.findOneAndUpdate(
        { _id: targetData._id, Money: { $gte: amount } },
        { $inc: { Money: -amount } },
        { new: true }
    );
    if (!debited) {
        return client.errNormal({ key: 'economy.rob.emptyTarget', variables: { user: target.username }, type: 'editreply' }, interaction);
    }

    await Schema.findOneAndUpdate(
        { _id: thief._id },
        { $inc: { Money: amount } },
        { new: true }
    );

    if (cooldown) {
        cooldown.Rob = now;
        await cooldown.save();
    } else {
        await new Schema2({ Guild: interaction.guild.id, User: interaction.user.id, Rob: now }).save();
    }

    return client.succNormal({
        key: 'economy.rob.success',
        variables: { user: String(target), amount },
        fields: [
            { name: await client.t(interaction, 'economy.rob.user'), value: String(target), inline: true },
            { name: `${client.emotes.economy.coins}・${await client.t(interaction, 'economy.rob.amount')}`, value: `$${amount}`, inline: true }
        ],
        type: 'editreply'
    }, interaction);
};
