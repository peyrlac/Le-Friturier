const Schema = require('../../database/models/channelList');

module.exports = async (client, interaction) => {
    const type = interaction.options.getString('type');
    const channel = interaction.options.getChannel('channel');
    const data = await Schema.findOne({ Guild: interaction.guild.id });
    const channels = data && Array.isArray(data.Channels) ? data.Channels : [];

    if (type === 'add') {
        if (channels.includes(channel.id)) return client.errNormal({ key: 'automod.channelExists', variables: { channel }, type: 'editreply' }, interaction);
        if (data) {
            data.Channels = [...channels, channel.id];
            await data.save();
        } else {
            await new Schema({ Guild: interaction.guild.id, Channels: [channel.id] }).save();
        }
        return client.succNormal({ key: 'automod.channelAdded', variables: { channel }, fields: [{ name: await client.t(interaction, 'automod.channelField'), value: `${channel} (${channel.name})` }], type: 'editreply' }, interaction);
    }

    if (type === 'remove') {
        if (!channels.includes(channel.id)) return client.errNormal({ key: data ? 'automod.channelMissing' : 'automod.noData', variables: { channel }, type: 'editreply' }, interaction);
        data.Channels = channels.filter(target => target !== channel.id);
        await data.save();
        return client.succNormal({ key: 'automod.channelRemoved', variables: { channel }, fields: [{ name: await client.t(interaction, 'automod.channelField'), value: `${channel} (${channel.name})` }], type: 'editreply' }, interaction);
    }

    return client.errNormal({ key: 'errors.invalidArguments', type: 'editreply' }, interaction);
};
