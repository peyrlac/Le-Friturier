
module.exports = async (client, interaction, args) => {

    if (!interaction.member.voice.channel) return client.errNormal({ key: 'soundboard.notInVoice', type: 'editreply' }, interaction);

    if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) return client.errNormal({ key: 'soundboard.notSameVoice', type: 'editreply' }, interaction);

    client.soundboard(interaction.guild.id, interaction, "https://www.myinstants.com/media/sounds/shotdown.mp3");

    client.succNormal({ key: 'soundboard.started', variables: { sound: "shotdown" }, type: 'editreply' }, interaction);
};
