const Discord = require('discord.js');

/** 
 * Easy to send errors because im lazy to do the same things :p
 * @param {String} text - Message which is need to send
 * @param {TextChannel} channel - A Channel to send error
 */

const Schema = require("../../database/models/functions");

async function translate(client, interaction, key, variables, fallback) {
    if (key && client.t) return client.t(interaction, key, variables);
    return fallback;
}

module.exports = (client) => {
    client.templateEmbed = function () {
        return new Discord.EmbedBuilder()
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

    //----------------------------------------------------------------//
    //                        ERROR MESSAGES                          //
    //----------------------------------------------------------------//

    // Normal error 
    client.errNormal = async function ({
        embed: embed = client.templateEmbed(),
        error: error,
        key: key,
        variables: variables = {},
        descriptionKey: descriptionKey = 'errors.generic',
        type: type,
        content: content,
        components: components
    }, interaction) {
        embed.setTitle(`${client.emotes.normal.error}・Erreur !`)
        embed.setDescription(await translate(client, interaction, descriptionKey, variables, 'Une erreur est survenue !'))
        const translatedError = await translate(client, interaction, key, variables, error);
        error = translatedError;
        embed.addFields( 
            { name: "💬┆Error comment", value: `\`\`\`${error}\`\`\``},
        )
        embed.setColor(client.config.colors.error)

        return client.sendEmbed({
            embeds: [embed],
            content: content,
            components: components,
            type: type
        }, interaction)
    }

    // Missing args
    client.errUsage = async function ({
        embed: embed = client.templateEmbed(),
        usage: usage,
        descriptionKey: descriptionKey = 'errors.invalidArguments',
        type: type,
        content: content,
        components: components
    }, interaction) {
        embed.setTitle(`${client.emotes.normal.error}・Erreur !`)
        embed.setDescription(await translate(client, interaction, descriptionKey, {}, 'Les arguments fournis sont incorrects'))
        embed.addFields(
            { name: "💬┆Required arguments", value: `\`\`\`${usage}\`\`\``},    
        )
        embed.setColor(client.config.colors.error)

        return client.sendEmbed({
            embeds: [embed],
            content: content,
            components: components,
            type: type
        }, interaction)
    }

    // Missing perms

    client.errMissingPerms = async function ({
        embed: embed = client.templateEmbed(),
        perms: perms,
        descriptionKey: descriptionKey = 'errors.noPermission',
        type: type,
        content: content,
        components: components
    }, interaction) {
        embed.setTitle(`${client.emotes.normal.error}・Erreur !`)
        embed.setDescription(await translate(client, interaction, descriptionKey, {}, "Vous n'avez pas les permissions requises"))
        embed.addFields(
            { name: await translate(client, interaction, 'common.requiredPermission', {}, 'Permission requise'), value: `\`\`\`${perms}\`\`\``},
        )
        embed.setColor(client.config.colors.error)

        return client.sendEmbed({
            embeds: [embed],
            content: content,
            components: components,
            type: type
        }, interaction)
    }

    // No bot perms

    client.errNoPerms = async function ({
        embed: embed = client.templateEmbed(),
        perms: perms,
        descriptionKey: descriptionKey = 'errors.botNoPermission',
        type: type,
        content: content,
        components: components
    }, interaction) {
        embed.setTitle(`${client.emotes.normal.error}・Erreur !`)
        embed.setDescription(await translate(client, interaction, descriptionKey, {}, "Le bot n'a pas les permissions requises"))
        embed.addFields(
            { name: await translate(client, interaction, 'common.requiredPermission', {}, 'Permission requise'), value: `\`\`\`${perms}\`\`\``},
        )
        embed.setColor(client.config.colors.error)

        return client.sendEmbed({
            embeds: [embed],
            content: content,
            components: components,
            type: type
        }, interaction)
    }

    // Wait error

    client.errWait = async function ({
        embed: embed = client.templateEmbed(),
        time: time,
        descriptionKey: descriptionKey = 'errors.alreadyPerformed',
        type: type,
        content: content,
        components: components
    }, interaction) {
        embed.setTitle(`${client.emotes.normal.error}・Erreur !`)
        embed.setDescription(await translate(client, interaction, descriptionKey, {}, 'Vous avez déjà effectué cette action'))
        embed.addFields(
            { name: "⏰┆Try again on", value: `<t:${time}:f>`},
        )
        embed.setColor(client.config.colors.error)

        return client.sendEmbed({
            embeds: [embed],
            content: content,
            components: components,
            type: type
        }, interaction)
    }

    //----------------------------------------------------------------//
    //                        SUCCES MESSAGES                         //
    //----------------------------------------------------------------//

    // Normal succes
    client.succNormal = async function ({
        embed: embed = client.templateEmbed(),
        text: text,
        key: key,
        variables: variables = {},
        titleKey: titleKey = 'common.successTitle',
        fields: fields,
        type: type,
        content: content,
        components: components
    }, interaction) {
        embed.setTitle(`${client.emotes.normal.check}・${await translate(client, interaction, titleKey, variables, 'Succes !')}`)
        const translatedText = await translate(client, interaction, key, variables, text);
        embed.setDescription(`${translatedText}`)
        embed.setColor(client.config.colors.succes)

        if (fields) embed.addFields(fields);

        return client.sendEmbed({
            embeds: [embed],
            content: content,
            components: components,
            type: type
        }, interaction)
    }

    //----------------------------------------------------------------//
    //                        BASIC MESSAGES                          //
    //----------------------------------------------------------------//

    // Default
    client.embed = async function ({
        embed: embed = client.templateEmbed(),
        title: title,
        desc: desc,
        titleKey: titleKey,
        descKey: descKey,
        variables: variables = {},
        color: color,
        image: image,
        author: author,
        url: url,
        footer: footer,
        thumbnail: thumbnail,
        fields: fields,
        content: content,
        components: components,
        type: type
    }, interaction) {
        if (interaction.guild == undefined) interaction.guild = { id: "0" };
        const functiondata = await Schema.findOne({ Guild: interaction.guild.id })

        const translatedTitle = await translate(client, interaction, titleKey, variables, title);
        const translatedDesc = await translate(client, interaction, descKey, variables, desc);
        if (translatedTitle) embed.setTitle(translatedTitle);
        if (translatedDesc && translatedDesc.length >= 2048) embed.setDescription(translatedDesc.substr(0, 2044) + "...");
        else if (translatedDesc) embed.setDescription(translatedDesc);
        if (image) embed.setImage(image);
        if (thumbnail) embed.setThumbnail(thumbnail);
        if (fields) embed.addFields(fields);
        if (author) embed.setAuthor(author);
        if (url) embed.setURL(url);
        if (footer) embed.setFooter({ text: footer });
        if (color) embed.setColor(color);
        if (functiondata && functiondata.Color && !color) embed.setColor(functiondata.Color)
        return client.sendEmbed({
            embeds: [embed],
            content: content,
            components: components,
            type: type
        }, interaction)
    }

    client.simpleEmbed = async function ({
        title: title,
        desc: desc,
        titleKey: titleKey,
        descKey: descKey,
        variables: variables = {},
        color: color,
        image: image,
        author: author,
        thumbnail: thumbnail,
        fields: fields,
        url: url,
        content: content,
        components: components,
        type: type
    }, interaction) {
        const functiondata = await Schema.findOne({ Guild: interaction.guild.id })

        let embed = new Discord.EmbedBuilder()
            .setColor(client.config.colors.normal)

        const translatedTitle = await translate(client, interaction, titleKey, variables, title);
        const translatedDesc = await translate(client, interaction, descKey, variables, desc);
        if (translatedTitle) embed.setTitle(translatedTitle);
        if (translatedDesc && translatedDesc.length >= 2048) embed.setDescription(translatedDesc.substr(0, 2044) + "...");
        else if (translatedDesc) embed.setDescription(translatedDesc);
        if (image) embed.setImage(image);
        if (thumbnail) embed.setThumbnail(thumbnail);
        if (fields) embed.addFields(fields);
        if (author) embed.setAuthor(author[0], author[1]);
        if (url) embed.setURL(url);
        if (color) embed.setColor(color);
        if (functiondata && functiondata.Color && !color) embed.setColor(functiondata.Color)

        return client.sendEmbed({
            embeds: [embed],
            content: content,
            components: components,
            type: type
        }, interaction)
    }

    client.sendEmbed = async function ({
        embeds: embeds,
        content: content,
        components: components,
        type: type
    }, interaction) {
        if (type && type.toLowerCase() == "edit") {
            return await interaction.edit({
                embeds: embeds,
                content: content,
                components: components,
                withResponse: true
            }).catch(e => { });
        }
        else if (type && type.toLowerCase() == "editreply") {
            return await interaction.editReply({
                embeds: embeds,
                content: content,
                components: components,
                withResponse: true
            }).catch(e => { });
        }
        else if (type && type.toLowerCase() == "reply") {
            return await interaction.reply({
                embeds: embeds,
                content: content,
                components: components,
                withResponse: true
            }).catch(e => { });
        }
        else if (type && type.toLowerCase() == "update") {
            return await interaction.update({
                embeds: embeds,
                content: content,
                components: components,
                withResponse: true
            }).catch(e => { });
        }
        else if (type && type.toLowerCase() == "ephemeraledit") {
            return await interaction.editReply({
                embeds: embeds,
                content: content,
                components: components,
                withResponse: true,
                flags: Discord.MessageFlags.Ephemeral
            }).catch(e => { });
        }
        else if (type && type.toLowerCase() == "ephemeral") {
            return await interaction.reply({
                embeds: embeds,
                content: content,
                components: components,
                withResponse: true,
                flags: Discord.MessageFlags.Ephemeral
            }).catch(e => { });
        }
        else {
            return await interaction.send({
                embeds: embeds,
                content: content,
                components: components,
                withResponse: true
            }).catch(e => { });
        }
    }
}

 
