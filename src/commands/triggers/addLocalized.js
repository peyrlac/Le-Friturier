const Discord = require('discord.js');
const Schema = require('../../database/models/triggers');

module.exports = async (client, interaction) => {
    const alias = interaction.options.getString('alias').toLowerCase();
    const type = Number(interaction.options.getString('type'));
    const regex = interaction.options.getString('regex') || '';
    const regexFlags = interaction.options.getString('regexflags') || '';
    const response = type === 1 || type === 2 ? interaction.options.getString('response') || '' : '';
    const isActive = interaction.options.getString('isactive') ?? true;
    const mention = interaction.options.getString('mention') ?? true;
    const replied = interaction.options.getString('replied') ?? true;
    const emotes = interaction.options.getString('emotes');
    let parsedEmoji;

    if (type === 4) {
        parsedEmoji = Discord.parseEmoji(emotes);
        if (!parsedEmoji) return client.errNormal({ key: 'triggers.invalidEmoji', type: 'editreply' }, interaction);
    }

    const trigger = {
        isActive,
        alias,
        type,
        regex,
        regexFlags,
        response,
        mention,
        replied,
        emotes: type === 4 ? { id: parsedEmoji.id, raw: emotes } : emotes || ''
    };
    const data = await Schema.findOne({ Guild: interaction.guild.id });
    if (data) {
        if (!Array.isArray(data.Triggers)) data.Triggers = [];
        const index = data.Triggers.findIndex(item => item.alias === alias);
        if (index >= 0) data.Triggers[index] = trigger;
        else data.Triggers.push(trigger);
        await data.save();
    } else {
        await new Schema({ Guild: interaction.guild.id, Triggers: [trigger] }).save();
    }

    return client.succNormal({
        key: 'triggers.saved',
        variables: { alias },
        fields: [{ name: await client.t(interaction, 'triggers.alias'), value: `**${alias}**` }],
        type: 'editreply'
    }, interaction);
};
