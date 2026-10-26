const Schema = require("../../database/models/reactionRoles");

module.exports = async (client, interaction, args) => {
    const category = interaction.options.getString('category');
    const channel = interaction.options.getChannel('channel') || interaction.channel;

    const lower = category.toLowerCase();
    const upper = lower.charAt(0).toUpperCase() + lower.substring(1);

    const data = await Schema.findOne({ Guild: interaction.guild.id, Category: category });
    if (!data) return client.errNormal({
        key: 'reactionroles.noData',
        type: 'editreply'
    }, interaction);

        const mapped = Object.keys(data.Roles)
            .map((value, index) => {
                const role = interaction.guild.roles.cache.get(data.Roles[value][0]);

                return `${data.Roles[value][1].raw} | ${role}`;
            }).join("\n");

        const reactions = Object.values(data.Roles).map((val) => val[1].raw);
        var sendComponents = await client.buttonReactions("id", reactions)

    const msg = await client.embed({
        titleKey: 'reactionroles.panelTitle',
        descKey: 'reactionroles.panelDescription',
        variables: { category: upper, roles: mapped },
        title: `${upper}・Roles`,
        desc: `_____ \n\nChoose your roles by pressing the button! \n\n${mapped}`,
        components: sendComponents
    }, channel);
    data.Message = msg.id;
    await data.save();

    return client.succNormal({
        key: 'reactionroles.panelCreated',
        type: 'ephemeraledit'
    }, interaction);
}


