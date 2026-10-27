const Discord = require('discord.js');

const Schema = require("../../database/models/ticketMessage");

module.exports = async (client, interaction, args) => {
    const perms = await client.checkUserPerms({
        flags: [Discord.PermissionsBitField.Flags.ManageMessages],
        perms: [Discord.PermissionsBitField.Flags.ManageMessages]
    }, interaction)

    if (perms == false) return;

    const type = interaction.options.getString('type');
    const message = interaction.options.getString('message');

    if (type == "open") {
        if (message.toUpperCase() == "DEFAULT") {
            const data = await Schema.findOne({ Guild: interaction.guild.id })

            if (data) {
                data.openTicket = "Merci d'avoir créé un billet!\ nsupport sera avec vous sous peu \n\n🔒 - Ticket \ n✋ - réclamer le ticket \ n📝 - Enregistrer la transcription \ n🔔 - Envoyer une notification";
                data.save();

                client.succNormal({
                    key: 'tickets.messageSet',
                    fields: [
                        {
                            name: await client.t(interaction, 'tickets.messageType'),
                            value: `${type}`,
                            inline: true
                        },
                        {
                            name: await client.t(interaction, 'tickets.message'),
                            value: `${data.openTicket}`,
                            inline: true
                        },
                    ],
                    type: 'editreply'
                }, interaction)
            }
            else {
                client.errNormal({
                    key: 'tickets.messageDataMissing',
                    type: 'editreply'
                }, interaction)
            }

            return;
        }

        const data = await Schema.findOne({ Guild: interaction.guild.id });
        if (data) {
            data.openTicket = message;
            await data.save();
        }
        else {
            await new Schema({
                Guild: interaction.guild.id,
                openTicket: message
            }).save();
        }

        client.succNormal({
            key: 'tickets.messageSet',
            fields: [
                {
                    name: await client.t(interaction, 'tickets.messageType'),
                    value: `${type}`,
                    inline: true
                },
                {
                    name: await client.t(interaction, 'tickets.message'),
                    value: `${message}`,
                    inline: true
                },
            ],
            type: 'editreply'
        }, interaction)
    }
    else if (type == "close") {
        if (message.toUpperCase() == "DEFAULT") {
            const data = await Schema.findOne({ Guild: interaction.guild.id })

            if (data) {
                data.dmMessage = "Voici la transcription de votre billet, veuillez garder ceci si vous souhaitez vous y référer!";
                data.save();

                client.succNormal({
                    key: 'tickets.messageSet',
                    fields: [
                        {
                            name: await client.t(interaction, 'tickets.messageType'),
                            value: `${type}`,
                            inline: true
                        },
                        {
                            name: await client.t(interaction, 'tickets.message'),
                            value: `${data.dmMessage}`,
                            inline: true
                        },
                    ],
                    type: 'editreply'
                }, interaction)
            }
            else {
                client.errNormal({
                    key: 'tickets.messageDataMissing',
                    type: 'editreply'
                }, interaction)
            }

            return;
        }

        const data = await Schema.findOne({ Guild: interaction.guild.id });
        if (data) {
            data.dmMessage = message;
            await data.save();
        }
        else {
            await new Schema({
                Guild: interaction.guild.id,
                dmMessage: message
            }).save();
        }

        client.succNormal({
            key: 'tickets.messageSet',
            fields: [
                {
                    name: await client.t(interaction, 'tickets.messageType'),
                    value: `${type}`,
                    inline: true
                },
                {
                    name: await client.t(interaction, 'tickets.message'),
                    value: `${message}`,
                    inline: true
                },
            ],
            type: 'editreply'
        }, interaction)
    }
}
