module.exports = (client) => {
    client.createChannelSetup = async function (Schema, channel, interaction) {
        const data = await Schema.findOne({ Guild: interaction.guild.id });
        if (data) {
            data.Channel = channel.id;
            await data.save();
        } else {
            await new Schema({ Guild: interaction.guild.id, Channel: channel.id }).save();
        }

        return client.succNormal({
            key: 'setup.channelSuccess',
            fields: [
                {
                    name: `📘┆Channel`,
                    value: `${channel} (${channel.id})`
                }
            ],
            type: 'editreply'
        }, interaction);
    }

    client.createRoleSetup = async function (Schema, role, interaction) {
        const data = await Schema.findOne({ Guild: interaction.guild.id });
        if (data) {
            data.Role = role.id;
            await data.save();
        } else {
            await new Schema({ Guild: interaction.guild.id, Role: role.id }).save();
        }

        return client.succNormal({
            key: 'setup.roleSuccess',
            fields: [
                {
                    name: `📘┆Role`,
                    value: `${role} (${role.id})`
                }
            ],
            type: 'editreply'
        }, interaction);
    }
}
