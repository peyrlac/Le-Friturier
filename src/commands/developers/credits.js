const Discord = require('discord.js');

const Schema = require('../../database/models/votecredits');

const webhookClientLogs = new Discord.WebhookClient({
    id: "",
    token: "",
});

module.exports = async (client, interaction, args) => {
    const type = interaction.options.getString('type');
    const user = interaction.options.getUser('user');
    const amount = interaction.options.getNumber('amount');

    if (type == "add") {
        await Schema.findOneAndUpdate(
            { User: user.id },
            { $inc: { Credits: amount } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        await client.succNormal({
            key: 'developerCredits.added',
            variables: { amount, user },
            type: 'editreply'
        }, interaction);

        let embedLogs = new Discord.EmbedBuilder()
            .setTitle(`🪙・Credits added`)
            .setDescription(`Added credits to ${user} (${user.id})`)
            .addFields(
                { name: "👤┆Added By", value: `${interaction.user} (${interaction.user.tag})`, inline: true },
                { name: "🔢┆Amount", value: `${amount}`, inline: true },
            )
            .setColor(client.config.colors.normal)
            .setTimestamp();
        await webhookClientLogs.send({
            username: 'Crédits de bot',
            embeds: [embedLogs],
        });
    }
    else if (type == "remove") {
        const data = await Schema.findOne({ User: user.id });
        if (data) {
            data.Credits -= amount;
            await data.save();
        }

        await client.succNormal({
            key: 'developerCredits.removed',
            variables: { amount, user },
            type: 'editreply'
        }, interaction);

        let embedLogs = new Discord.EmbedBuilder()
            .setTitle(`🪙・Credits removed`)
            .setDescription(`Removed credits from ${user} (${user.id})`)
            .addFields(
                { name: "👤┆Removed By", value: `${interaction.user} (${interaction.user.tag})`, inline: true },
                { name: "🔢┆Amount", value: `${amount}`, inline: true },
            )
            .setColor(client.config.colors.normal)
            .setTimestamp();
        await webhookClientLogs.send({
            username: 'Crédits de bot',
            embeds: [embedLogs],
        });
    }
}


