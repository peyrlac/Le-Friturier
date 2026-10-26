const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {
    const message = interaction.options.getString('message');

    client.succNormal({
        key: 'developers.args.sent',
        type: 'ephemeraledit'
    }, interaction);

    if (message == "information") {
        client.simpleEmbed({
            image: `https://cdn.discordapp.com/attachments/843487478881976381/874742689017520128/Bot_banner_information.jpg`
        }, interaction.channel).then(async () => {
            client.embed({
                title: await client.t(interaction, 'developers.args.information.title'),
                thumbnail: client.user.avatarURL({ size: 1024 }),
                desc: await client.t(interaction, 'developers.args.information.description'),
                fields: [
                    {
                        name: await client.t(interaction, 'developers.args.information.welcomeTitle', { guild: interaction.guild.name }),
                        value: await client.t(interaction, 'developers.args.information.welcome'),
                    },
                    {
                        name: await client.t(interaction, 'developers.args.information.whatTitle'),
                        value: await client.t(interaction, 'developers.args.information.what'),
                    },
                    {
                        name: await client.t(interaction, 'developers.args.information.helpTitle'),
                        value: await client.t(interaction, 'developers.args.information.help'),
                    },
                    {
                        name: await client.t(interaction, 'developers.args.information.helpUsTitle'),
                        value: await client.t(interaction, 'developers.args.information.helpUs'),
                    }
                ]
            }, interaction.channel)
        })
    }

    if (message == "rules") {
        client.simpleEmbed({
            image: `https://cdn.discordapp.com/attachments/843487478881976381/874742702393131038/Bot_banner_rules.jpg`
        }, interaction.channel).then(async () => {
            await client.embed({
                title: await client.t(interaction, 'developers.args.rules.title'),
                thumbnail: client.user.avatarURL({ size: 1024 }),
                desc: await client.t(interaction, 'developers.args.rules.description'),
            }, interaction.channel)

            await client.embed({
                title: await client.t(interaction, 'developers.args.rules.rule1Title'),
                desc: await client.t(interaction, 'developers.args.rules.rule1Description'),
            }, interaction.channel)

            await client.embed({
                title: await client.t(interaction, 'developers.args.rules.rule2Title'),
                desc: await client.t(interaction, 'developers.args.rules.rule2Description'),
            }, interaction.channel)

            await client.embed({
                title: await client.t(interaction, 'developers.args.rules.rule3Title'),
                desc: await client.t(interaction, 'developers.args.rules.rule3Description'),
            }, interaction.channel)

            await client.embed({
                title: await client.t(interaction, 'developers.args.rules.rule4Title'),
                desc: await client.t(interaction, 'developers.args.rules.rule4Description'),
            }, interaction.channel)

            await client.embed({
                title: await client.t(interaction, 'developers.args.rules.rule5Title'),
                desc: await client.t(interaction, 'developers.args.rules.rule5Description'),
            }, interaction.channel)

            await client.embed({
                title: await client.t(interaction, 'developers.args.rules.rule6Title'),
                desc: await client.t(interaction, 'developers.args.rules.rule6Description'),
            }, interaction.channel)

            await client.embed({
                title: await client.t(interaction, 'developers.args.rules.rule7Title'),
                desc: await client.t(interaction, 'developers.args.rules.rule7Description'),
            }, interaction.channel)

            await client.embed({
                title: await client.t(interaction, 'developers.args.rules.rule8Title'),
                desc: await client.t(interaction, 'developers.args.rules.rule8Description'),
            }, interaction.channel)

            await client.embed({
                title: await client.t(interaction, 'developers.args.rules.rule9Title'),
                desc: await client.t(interaction, 'developers.args.rules.rule9Description'),
            }, interaction.channel)

            await client.embed({
                title: await client.t(interaction, 'developers.args.rules.rule10Title'),
                desc: await client.t(interaction, 'developers.args.rules.rule10Description'),
            }, interaction.channel)
        })
    }

    if (message == "applications") {
        client.simpleEmbed({
            image: `https://cdn.discordapp.com/attachments/843487478881976381/874742737415581786/Bot_banner_applications.jpg`
        }, interaction.channel).then(async () => {
            client.embed({
                title: await client.t(interaction, 'developers.args.applications.title'),
                thumbnail: client.user.avatarURL({ size: 1024 }),
                desc: await client.t(interaction, 'developers.args.applications.description'),
                fields: [
                    {
                        name: await client.t(interaction, 'developers.args.applications.field1Title'),
                        value: await client.t(interaction, 'developers.args.applications.field1'),
                    },
                    {
                        name: await client.t(interaction, 'developers.args.applications.field2Title'),
                        value: await client.t(interaction, 'developers.args.applications.field2'),
                    },
                    {
                        name: await client.t(interaction, 'developers.args.applications.field3Title'),
                        value: await client.t(interaction, 'developers.args.applications.field3'),
                    },
                    {
                        name: await client.t(interaction, 'developers.args.applications.field4Title'),
                        value: await client.t(interaction, 'developers.args.applications.field4'),
                    },
                    {
                        name: await client.t(interaction, 'developers.args.applications.field5Title'),
                        value: await client.t(interaction, 'developers.args.applications.field5'),
                    },
                    {
                        name: await client.t(interaction, 'developers.args.applications.field6Title'),
                        value: await client.t(interaction, 'developers.args.applications.field6'),
                    }
                ]
            }, interaction.channel)
        })
    }

    if (message == "boosterperks") {
        client.simpleEmbed({
            image: `https://media.discordapp.net/attachments/843487478881976381/881396544195149874/Bot_banner_boosters.jpg`
        }, interaction.channel).then(async () => {
            client.embed({
                title: await client.t(interaction, 'developers.args.boosterperks.title'),
                thumbnail: client.user.avatarURL({ size: 1024 }),
                desc: await client.t(interaction, 'developers.args.boosterperks.description'),
                fields: [
                    {
                        name: await client.t(interaction, 'developers.args.boosterperks.field1Title'),
                        value: await client.t(interaction, 'developers.args.boosterperks.field1'),
                    },
                    {
                        name: await client.t(interaction, 'developers.args.boosterperks.field2Title'),
                        value: await client.t(interaction, 'developers.args.boosterperks.field2'),
                    },
                    {
                        name: await client.t(interaction, 'developers.args.boosterperks.field3Title'),
                        value: await client.t(interaction, 'developers.args.boosterperks.field3'),
                    },
                    {
                        name: await client.t(interaction, 'developers.args.boosterperks.field4Title'),
                        value: await client.t(interaction, 'developers.args.boosterperks.field4'),
                    },
                    {
                        name: await client.t(interaction, 'developers.args.boosterperks.field5Title'),
                        value: await client.t(interaction, 'developers.args.boosterperks.field5'),
                    },
                    {
                        name: await client.t(interaction, 'developers.args.boosterperks.field6Title'),
                        value: await client.t(interaction, 'developers.args.boosterperks.field6'),
                    },
                    {
                        name: await client.t(interaction, 'developers.args.boosterperks.field7Title'),
                        value: await client.t(interaction, 'developers.args.boosterperks.field7'),
                    },
                    {
                        name: await client.t(interaction, 'developers.args.boosterperks.field8Title'),
                        value: await client.t(interaction, 'developers.args.boosterperks.field8'),
                    },
                    {
                        name: await client.t(interaction, 'developers.args.boosterperks.field9Title'),
                        value: await client.t(interaction, 'developers.args.boosterperks.field9'),
                    },
                    {
                        name: await client.t(interaction, 'developers.args.boosterperks.field10Title'),
                        value: await client.t(interaction, 'developers.args.boosterperks.field10'),
                    },
                    {
                        name: await client.t(interaction, 'developers.args.boosterperks.field11Title'),
                        value: await client.t(interaction, 'developers.args.boosterperks.field11'),
                    }
                ]
            }, interaction.channel)
        })
    }

    if (message == "links") {
        client.simpleEmbed({
            image: `https://media.discordapp.net/attachments/843487478881976381/881396544195149874/Bot_banner_boosters.jpg`
        }, interaction.channel).then(() => {
            client.embed({
                title: `🔗・Links`,
                thumbnail: client.user.avatarURL({ size: 1024 }),
                desc: `_____ \n\nSee all the links from Bot Network!`,
                fields: [
                    {
                        name: `▬▬│Servers│▬▬`,
                        value: ``,
                    }
                ]
            }, interaction.channel)
        })
    }

    if (message == "rewards") {
        client.embed({
            title: `😜・Role Rewards`,
            thumbnail: client.user.avatarURL({ size: 1024 }),
            desc: `_____ \n\nDo you want some extras in the server? Or do you want to stand out more in the server? Look below for the rewards`,
            fields: [
                {
                    name: `🏆┆Levels`,
                    value: `- Level 5   | <@&833307296699908097>\n- Level 10  | <@&833307450437664838>\n- Level 15  | <@&833307452279226379>\n- Level 30 | <@&915290300757458964>\n- Level 40 | <@&915290324480430080>`,
                },
                {
                    name: `🥳┆Special`,
                    value: `- 1 server vote | <@&833959913742794772>\n- 1 boost | <@&744208324022501447>\n- 1 donate | <@&849554599371210793>`,
                },
                {
                    name: `💰┆Economy`,
                    value: `- $10.000 | <@&890720270086733854>\n- $15.000 | <@&833936202725720084>\n- $20.000 | <@&833936185167839232> \n- $25.000 | <@&928236333309255711> \n- $30.000 | <@&928235747100733450>`,
                }
            ]
        }, interaction.channel)
    }

    if (message == "ourbots") {
        client.simpleEmbed({
            image: `https://cdn.discordapp.com/attachments/843487478881976381/874742741224022016/Bot_banner_bot_info.jpg`
        }, interaction.channel).then(() => {
            client.embed({
                title: `🤖・Our bots`,
                thumbnail: client.user.avatarURL({ size: 1024 }),
                desc: `_____ \n\nOutside of a community we also maintain 2 public bots. These bots are all made to make your server better!`,
                fields: [
                    {
                        name: `📘┆What is Bot?`,
                        value: `Bot is a bot with which you can run your entire server! With no less than 400+ commands, we have a large bot with many options to improve your server! You know what else is beautiful? All of this is **FREE** to use!`,
                    },
                    {
                        name: `🎶┆What is Bot 2?`,
                        value: `Bot 2 was created for additional music. This way you never get in each other's way when someone is already listening to music. Furthermore, this bot contains a soundboard and a radio system`,
                    },
                    {
                        name: `📨┆How do I invite the bots?`,
                        value: `You can invite the bots by doing \`/invite\` or by clicking on the links below \n\n**Bot** - [Invite here](${client.config.discord.botInvite})`,
                    },
                    {
                        name: `🎫┆How do I get help when needed?`,
                        value: `You can make a ticket in <#820308164322656327>! We are happy to help you with your questions here and offer support in your server!`,
                    }
                ]
            }, interaction.channel)
        })
    }
}

