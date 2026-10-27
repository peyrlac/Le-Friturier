const Discord = require('discord.js');
const Schema = require('../../database/models/reactionRoles');

module.exports = async (client, interaction) => {
    const category = interaction.options.getString('category');
    const channel = interaction.options.getChannel('channel') || interaction.channel;
    const data = await Schema.findOne({ Guild: interaction.guild.id, Category: category });
    if (!data) return client.errNormal({ key: 'reactionroles.noData', type: 'editreply' }, interaction);

    const roles = data.Roles || {};
    const lines = Object.keys(roles).map(emoji => {
        const role = interaction.guild.roles.cache.get(roles[emoji][0]);
        return role ? `${roles[emoji][1].raw} | ${role}` : null;
    }).filter(Boolean).join('\n');
    const labels = Object.keys(roles).map(emoji => {
        const role = interaction.guild.roles.cache.get(roles[emoji][0]);
        if (!role) return null;
        return { label: role.name, description: `${role.name}`, emoji: roles[emoji][1].raw, value: roles[emoji][1].raw };
    }).filter(Boolean);
    if (!labels.length) return client.errNormal({ key: 'reactionroles.noRoles', type: 'editreply' }, interaction);

    const menu = new Discord.StringSelectMenuBuilder()
        .setCustomId('reaction_select')
        .setPlaceholder(await client.t(interaction, 'reactionroles.selectPlaceholder'))
        .setMinValues(1)
        .addOptions(labels);
    const row = new Discord.ActionRowBuilder().addComponents(menu);
    const lower = category.toLowerCase();
    const upper = lower.charAt(0).toUpperCase() + lower.substring(1);
    const [title, description] = await Promise.all([
        client.t(interaction, 'reactionroles.panelTitle', { category: upper }),
        client.t(interaction, 'reactionroles.panelDescription', { roles: lines })
    ]);
    const message = await client.embed({ title, desc: description, components: [row] }, channel);
    if (!message) return client.errNormal({ key: 'reactionroles.sendError', type: 'editreply' }, interaction);
    data.Message = message.id;
    await data.save();
    return client.succNormal({ key: 'reactionroles.panelCreated', type: 'ephemeraledit' }, interaction);
};
