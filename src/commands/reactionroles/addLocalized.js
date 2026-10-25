const Discord = require('discord.js');
const Schema = require('../../database/models/reactionRoles');

module.exports = async (client, interaction) => {
    const category = interaction.options.getString('category');
    const role = interaction.options.getRole('role');
    const emoji = interaction.options.getString('emoji');
    const parsedEmoji = Discord.parseEmoji(emoji);
    if (!parsedEmoji) return client.errNormal({ key: 'reactionroles.emojiNotFound', type: 'editreply' }, interaction);

    const data = await Schema.findOne({ Guild: interaction.guild.id, Category: category });
    const entry = [role.id, { id: parsedEmoji.id, raw: emoji }];
    if (data) {
        data.Roles = data.Roles || {};
        data.Roles[emoji] = entry;
        await data.save();
    } else {
        await new Schema({ Guild: interaction.guild.id, Message: 0, Category: category, Roles: { [emoji]: entry } }).save();
    }

    return client.succNormal({
        key: 'reactionroles.created',
        fields: [
            { name: await client.t(interaction, 'reactionroles.menuPanel'), value: '`/reactionroles menu [category name]`', inline: true },
            { name: await client.t(interaction, 'reactionroles.buttonPanel'), value: '`/reactionroles button [category name]`', inline: true }
        ],
        type: 'editreply'
    }, interaction);
};
