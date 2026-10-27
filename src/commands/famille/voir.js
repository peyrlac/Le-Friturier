const Discord = require('discord.js');

const Schema = require("../../database/models/family");

module.exports = async (client, interaction, args) => {

    const target = interaction.options.getUser('membre') || interaction.user;

    const data = await Schema.findOne({ Guild: interaction.guild.id, User: target.id });

    let temp = [];
    if (data && data.Parent.length > 0) {
        for (let i = 0; i < data.Parent.length; i++) {
            temp.push("<@!" + data.Parent[i] + ">");
        }
    }
    let temp2 = [];
    if (data && data.Children.length > 0) {

        for (let i = 0; i < data.Children.length; i++) {
            temp2.push("<@!" + data.Children[i] + ">");
        }
    }
    
    let fields = [{
                name: await client.t(interaction, 'family.partner'),
                value: `${data && data.Partner ? `<@!${data.Partner}>` : await client.t(interaction, 'family.noPartner')}`
            },
            {
                name: await client.t(interaction, 'family.parents'),
                value: `${data && data.Parent.length > 0 ? `${temp.join(", ")}` : await client.t(interaction, 'family.noParents')}`
            }
        ];

        // Check siblings
        let temp3 = await client.t(interaction, 'family.noSiblings');
        if (data && data.Parent.length > 0) {
            let temp3 = new Set();
            const parentPromises = data.Parent.map(async parent => {
                const dataParent = await Schema.findOne({ Guild: interaction.guild.id, User: parent });
                if (dataParent && dataParent.Children.length > 0) {
                    for (let i = 0; i < dataParent.Children.length; i++) {
                        if (target.id !== dataParent.Children[i]) temp3.add("<@!" + dataParent.Children[i] + ">");
                    }
                }
            });
            await Promise.all(parentPromises);
            if(data.Parent.length > 1) {
                temp3.add("\n");
            } 
            temp3 = [...temp3].join(", ");
            
        }
    
        fields.push({
            name: await client.t(interaction, 'family.siblings'),
            value: temp3
        });
        fields.push({
            name: await client.t(interaction, 'family.children'),
            value: `${data && data.Children.length > 0 ? `${temp2.join(", ")}` : await client.t(interaction, 'family.noChildren')}`
        });
    client.embed({
        title: await client.t(interaction, 'family.viewTitle', { user: target.username }),
        thumbnail: target.avatarURL({ size: 1024 }),
        fields: fields,
        type: 'editreply'
    }, interaction, false)
}

