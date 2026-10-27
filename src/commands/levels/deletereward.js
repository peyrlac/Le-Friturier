const Discord = require('discord.js');

const Schema = require("../../database/models/levelRewards");

module.exports = async (client, interaction, args) => {
    let level = interaction.options.getNumber('level');

    const perms = await client.checkUserPerms({
        flags: [Discord.PermissionsBitField.Flags.ManageMessages],
        perms: [Discord.PermissionsBitField.Flags.ManageMessages]
    }, interaction)

    if (perms == false) return;
    
    const data = await Schema.findOne({ Guild: interaction.guild.id, Level: level });
    if (data) {
            await Schema.findOneAndDelete({ Guild: interaction.guild.id, Level: level });
                return client.succNormal({
                    key: 'config.levels.rewardRemoved',
                    variables: { level },
                    fields: [
                        {
                            name: "🆙┆Level",
                            value: `${level}`,
                            inline: true,
                        }
                    ],
                    type: 'editreply'
                }, interaction);
    }
    return client.errNormal({ key: 'config.levels.rewardNotFound', variables: { level }, type: 'editreply' }, interaction);
}

