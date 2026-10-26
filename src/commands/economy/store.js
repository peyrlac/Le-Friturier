const Discord = require('discord.js');

const store = require("../../database/models/economyStore");

module.exports = async (client, interaction, args, message) => {
    const storeData = await store.find({ Guild: interaction.guild.id });
    if (storeData && storeData.length > 0) {
            const lb = await Promise.all(storeData.map(async e => client.t(interaction, 'economy.store.entry', { role: e.Role, amount: `${client.emotes.economy.coins} $${e.Amount}` })));

            await client.createLeaderboard(await client.t(interaction, 'economy.store.title', { guild: interaction.guild.name }), lb, interaction);
            client.embed({ 
                title: await client.t(interaction, 'economy.store.defaultTitle'),
                desc: await client.t(interaction, 'economy.store.defaultDescription'),
            }, interaction.channel);
    }
    else {
            client.errNormal({ 
                key: 'economy.store.notFound',
                type: 'editreply' 
            }, interaction);
    }

}


