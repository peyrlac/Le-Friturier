const Discord = require('discord.js');
const Schema = require("../../database/models/triggers");
const localizedAdd = require('./addLocalized');

module.exports = async (client, interaction, args) => {
    return localizedAdd(client, interaction, args);
    var isActive = interaction.options.getString('isactive');
    if (isActive == null) {
        isActive = true;
    }
    var alias = interaction.options.getString('alias').toLowerCase();
    var type = interaction.options.getString('type');
    var typeString = ["✖️","Répond","Répond puis supprime","Supprime","Ajoute une réaction"];
    var regex = interaction.options.getString('regex');
    if (regexFlags == null) {
        var regexFlags = interaction.options.getString('regexflags');
    } else {
        var regexFlags = "";
    }
    if (type == 1 || type == 2) {
        var response = interaction.options.getString('response');
    } else {
        var response = "Pas utilisé";
    }
    var mention = interaction.options.getString('mention');
    if (mention == null) {
        mention = true;
    }
    var replied = interaction.options.getString('replied');
    if (replied == null) {
        replied = true;
    }
    if (type == 4) {
        var emotes = interaction.options.getString('emotes');
        const parsedEmoji = Discord.parseEmoji(emotes);
        if (!parsedEmoji) return client.errNormal({
            error: `Emoji introuvable dans ce serveur!`,
            type: 'editreply'
        }, interaction)
    } else {
        var emotes = "Pas utilisé"
    };
    var timeDeletion = interaction.options.getString('timedeletion')
    if (timeDeletion == null) {
        timeDeletion = 1000;
    };
    var previousTriggers = [{
        isActive: "✖️",
        alias: "✖️",
        type: 0,
        regex: "✖️",
        regexFlags: "✖️",
        response: "✖️",
        mention: "✖️",
        replied: "✖️",
        emotes: "✖️"
      }];

    Schema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
        if (data) {
            const existingTriggerIndex = data.Triggers.findIndex(trigger => trigger.alias === alias);
            /*previousTriggers[0].isActive = data.Triggers[existingTriggerIndex].isActive;
            previousTriggers[0].alias = data.Triggers[existingTriggerIndex].alias;
            previousTriggers[0].type = data.Triggers[existingTriggerIndex].type;
            previousTriggers[0].regex = data.Triggers[existingTriggerIndex].regex;
            previousTriggers[0].regexFlags = data.Triggers[existingTriggerIndex].regexFlags;
            previousTriggers[0].response = data.Triggers[existingTriggerIndex].response;
            previousTriggers[0].mention = data.Triggers[existingTriggerIndex].mention;
            previousTriggers[0].replied = data.Triggers[existingTriggerIndex].replied;
            previousTriggers[0].emotes = data.Triggers[existingTriggerIndex].emotes;*/

            if (existingTriggerIndex >= 0) {
                data.Triggers[existingTriggerIndex] = {
                    isActive: isActive,
                    alias: alias,
                    type: type,
                    regex: regex,
                    regexFlags: regexFlags,
                    response: response,
                    mention: mention,
                    replied: replied,
                    emotes: type === 4 ? {
                        id: parsedEmoji.id,
                        raw: emotes
                    } : emotes
                };
            } else {
                data.Triggers.push({
                    isActive: isActive,
                    alias: alias,
                    type: type,
                    regex: regex,
                    regexFlags: regexFlags,
                    response: response,
                    mention: mention,
                    replied: replied,
                    emotes: type === 4 ? {
                        id: parsedEmoji.id,
                        raw: emotes
                    } : emotes
                });
            }
            data.save();
        } else {
            const temp = type === 4 ? {
                id: parsedEmoji.id,
                raw: emotes
            } : emotes;
            new Schema({
                Guild: interaction.guild.id,
                Triggers: [
                    {
                        isActive: isActive,
                        alias: alias,
                        type: type,
                        regex: regex,
                        regexFlags: regexFlags,
                        response: response,
                        mention: mention,
                        replied: replied,
                        emotes: temp
                    }
                ]
            }).save();
        }
    });

    client.succNormal({
        text: `Le mot est ajouté à la liste des trigger!`,
        fields: [
            {
                name: `💬┆ Trigger`,
                value: `**${alias}**`
            },{
                name: `💬┆ Paramètres précédents`,
                value: ` `
            },
            {
                name: `Alias`,
                value: `\`${previousTriggers[0].alias}\``
            },
            {
                name: `Type`,
                value: `\`${typeString[previousTriggers[0].type]}\``
            },
            {
                name: `Regex & flags`,
                value: `🎫\`${previousTriggers[0].regex}\` 🎌\`${previousTriggers[0].regexFlags}\``
            },
            {
                name: `Réponse`,
                value: `\`${previousTriggers[0].response}\``
            },
            {
                name: `Emotes`,
                value: `\`${previousTriggers[0].emotes}\``
            },
            {
                name: `Additionnels`,
                value: `Mentionne : \`${previousTriggers[0].mention}\` ` + `Message suivi : \`${previousTriggers[0].replied}\``
            },
            {
                name: `💬┆ Nouveaux paramètres`,
                value: ` `
            },
            {
                name: `Alias`,
                value: `\`${alias}\``
            },
            {
                name: `Type`,
                value: `\`${typeString[type]}\``
            },
            {
                name: `Regex & flags`,
                value: `🎫\`${regex}\` 🎌\`${regexFlags}\``
            },
            {
                name: `Réponse`,
                value: `\`${response}\``
            },
            {
                name: `Emotes`,
                value: `\`${emotes}\``
            },
            {
                name: `Additionnels`,
                value: `Mentionne : \`${mention}\` ` + `Message suivi : \`${replied}\``
            }
        ],
        type: 'editreply'
    }, interaction);
}
/*const Discord = require('discord.js');

const Schema = require("../../database/models/triggers");

module.exports = async (client, interaction, args) => {
    var isActive = interaction.options.getString('isactive');
    var alias = interaction.options.getString('alias').toLowerCase();
    var type = interaction.options.getString('type');
    var typeString = ["blank","Répond","Répond puis supprime","Supprime","Ajoute une réaction"];
    var regex = interaction.options.getString('regex');
    if (regexFlags == null) {
        var regexFlags = interaction.options.getString('regexflags');
    } else {
        var regexFlags = "";
    }
    if (type == 1 || type == 2) {
        var response = interaction.options.getString('response');
    } else {
        var response = "Pas utilisé";
    }
    var mention = interaction.options.getString('mention');
    var replied = interaction.options.getString('replied');
    if (type == 4) {
        var emotes = interaction.options.getString('emotes');
        const parsedEmoji = Discord.parseEmoji(emotes);
        if (!parsedEmoji) return client.errNormal({
            error: `Emoji introuvable dans ce serveur!`,
            type: 'editreply'
        }, interaction)
    } else {
        var emotes = "Pas utilisé"
    };

    Schema.findOne({ Guild: interaction.guild.id, 'Triggers.alias': alias  }, async (err, data) => {
        if (data) {
            if (data.Triggers.alias.match(alias)) {
                return new Discord.EmbedBuilder()
                .setDescription("Ce trigger existe déjà et a été mis à jour avec les nouveaux paramètres !")
                .addFields({
                    name: `💬┆ Paramètres précédents`,
                    value: ` `
                },
                {
                    name: `💬┆ Alias`,
                    value: `${data.Triggers.alias}`
                },
                {
                    name: `💬┆ Type`,
                    value: `${typeString[data.Triggers.type]}`
                },
                {
                    name: `💬┆ Regex & flags`,
                    value: `${data.Triggers.regex} ${data.Triggers.regexFlags}`
                },
                {
                    name: `💬┆ Réponse`,
                    value: `${data.Triggers.response}`
                },
                {
                    name: `💬┆ Emotes`,
                    value: `${data.Triggers.emotes}`
                },
                {
                    name: `💬┆ Additionnels`,
                    value: `Mentionne : ${data.Triggers.mention}` + `Message suivi : ${data.Triggers.replied}`
                },
                {
                    name: `💬┆ Nouveaux paramètres`,
                    value: ` `
                },
                {
                    name: `💬┆ Alias`,
                    value: `${alias}`
                },
                {
                    name: `💬┆ Type`,
                    value: `${typeString[type]}`
                },
                {
                    name: `💬┆ Regex & flags`,
                    value: `${regex} ${regexFlags}`
                },
                {
                    name: `💬┆ Réponse`,
                    value: `${response}`
                },
                {
                    name: `💬┆ Emotes`,
                    value: `${emotes}`
                },
                {
                    name: `💬┆ Additionnels`,
                    value: `Mentionne : ${mention}` + `Message suivi : ${replied}`
                })
                .setAuthor({
                    name: client.user.username,
                    iconURL: client.user.avatarURL({ size: 1024 })
                })
                .setColor(client.config.colors.normal)
                .setFooter({
                    text: client.config.discord.footer,
                    iconURL: client.user.avatarURL({ size: 1024 })
                })
                .setTimestamp();
            }
            if(!data.Triggers[0].alias)
            data.Triggers[0].isActive = isActive;
            data.Triggers[0].alias = alias;
            data.Triggers[0].type = type;
            data.Triggers[0].regex = regex;
            data.Triggers[0].regexFlags = regexFlags;
            data.Triggers[0].response = response;
            data.Triggers[0].mention = mention;
            data.Triggers[0].replied = replied;
            if (type == 4) {
                data.Triggers.emotes = {
                        id: parsedEmoji.id,
                        raw: emoji
                    };
            } else {
                data.Triggers.emotes = emotes;
            }
            data.save();
        }
        else {
            if (type == 4) {
                var temp = {
                    id: parsedEmoji.id,
                    raw: emoji
                }
            } else {
                var temp = emotes;
            }
            new Schema({
                Guild: interaction.guild.id,
                Triggers: {
                    isActive: isActive,
                    alias: alias,
                    type: type,
                    regex: regex,
                    regexFlags: regexFlags,
                    response: response,
                    mention: mention,
                    replied: replied,
                    emotes: temp
                }
            }).save();
        }
    })

    client.succNormal({
        text: `Le mot est ajouté à la liste des trigger!`,
        fields: [
            {
                name: `💬┆ Trigger`,
                value: `${alias}`
            }
        ],
        type: 'editreply'
    }, interaction);
}
*/
