
module.exports = async (client, interaction, args) => {

    if (!interaction.member.voice.channel) return client.errNormal({ key: 'soundboard.notInVoice', type: 'editreply' }, interaction);

    if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) return client.errNormal({ key: 'soundboard.notSameVoice', type: 'editreply' }, interaction);

    client.soundboard(interaction.guild.id, interaction, "https://www.myinstants.com/media/sounds/y2mate-mp3cut_sRzY6rh.mp3");

    client.succNormal({ key: 'soundboard.started', variables: { sound: await client.t(interaction, 'soundboard.sounds.dancememe') }, type: 'editreply' }, interaction);
};
