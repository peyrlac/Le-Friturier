const Discord = require('discord.js');
const Schema = require("../../database/models/channelActivity");

module.exports = async (client, interaction, args) => {
    const category = interaction.options.getChannel('category');
    const mode = interaction.options.getString('mode') || 'automatic';
    const pinnedOrder = interaction.options.getString('pinned-order') || 'first';
    
    if (category.type !== Discord.ChannelType.GuildCategory) {
        return client.errNormal({
            error: "The selected channel must be a category!",
            type: 'editreply'
        }, interaction);
    }

    // Sauvegarder la configuration dans la base de données
    await Schema.findOneAndUpdate(
        { Guild: interaction.guild.id, Category: category.id },
        {
            Guild: interaction.guild.id,
            Category: category.id,
            Mode: mode,
            PinnedOrder: pinnedOrder,
            IsActive: true
        },
        { upsert: true }
    );

    client.succNormal({
        text: `Channel sorting has been successfully configured!`,
        fields: [
            {
                name: `📘┆Category`,
                value: `${category.name}`
            },
            {
                name: `⚙️┆Mode`,
                value: mode
            },
            {
                name: `📌┆Pinned order`,
                value: pinnedOrder
            }
        ],
        type: 'editreply'
    }, interaction);
}
