const Discord = require('discord.js');
const vm = require('node:vm');

const { inspect } = require('util');

module.exports = async (client, interaction, args) => {
    const webhookClientLogs = new Discord.WebhookClient({
        id: client.webhooks.evalLogs.id,
        token: client.webhooks.evalLogs.token,
    });

    let code = interaction.options.getString('code');
    if (code.includes('token') == true) return client.errNormal({ key: 'developers.tokenRefusal', type: 'editreply' }, interaction);

    code = code.replace(/[""]/g, '"').replace(/['']/g, "'");
    let evaled;

    try {
        const start = process.hrtime();
        // Execute developer snippets without exposing the bot process, require(),
        // or the global object. The timeout also prevents a synchronous loop
        // from blocking the command handler indefinitely.
        const sandbox = Object.create(null);
        evaled = new vm.Script(code).runInNewContext(sandbox, { timeout: 1000 });

        if (evaled instanceof Promise) {
            evaled = await evaled;
        }

        const stop = process.hrtime(start);
        const outputResponse = `\`\`\`${inspect(evaled, { depth: 0 })}\n\`\`\``;

        if (outputResponse.length <= 1024) {
            await client.embed({
                title: await client.t(interaction, 'developers.evalTitle'),
                fields: [
                    {
                        name: await client.t(interaction, 'developers.input'),
                        value: `\`\`\`${code}\`\`\``,
                        inline: false,
                    },
                    {
                        name: await client.t(interaction, 'developers.output'),
                        value: outputResponse.substr(0, 1024),
                        inline: false,
                    },
                ],
                type: 'editreply'
            }, interaction)

            const embed2 = new Discord.EmbedBuilder()
                .setTitle(`${interaction.user.tag} used eval command`)
                .addFields(
                    { name: await client.t(interaction, 'developers.input'), value: `\`\`\`${code}\`\`\``, inline: false },
                    { name: await client.t(interaction, 'developers.output'), value: outputResponse.substr(0, 1024), inline: false },
                )
                .setColor(client.config.colors.normal)
                .setTimestamp();
            webhookClientLogs.send({
                username: 'Bot Logs',
                embeds: [embed2],
            });
        }
        else {
            const output = new Discord.AttachmentBuilder(Buffer.from(outputResponse), { name: 'output.txt' });
            var embed2 = new Discord.EmbedBuilder()
                .setAuthor(client.user.username, client.user.avatarURL())
                .addFields(
                    { name: await client.t(interaction, 'developers.input'), value: `\`\`\`${code}\`\`\``, inline: false },
                )
                .setColor(client.config.colors.succes)
                .setFooter(client.config.discord.footer)
                .setTimestamp();
            await interaction.editReply({ embeds: [embed2] });
            await interaction.followUp({ files: [output] });
        }
    }
    catch (err) {

        return client.embed({
            title: await client.t(interaction, 'developers.evalTitle'),
            fields: [
                {
                    name: await client.t(interaction, 'developers.input'),
                    value: `\`\`\`${code}\`\`\``,
                    inline: false,
                },
                {
                    name: await client.t(interaction, 'developers.error'),
                    value: `\`\`\`${clean(err)}\`\`\``,
                    inline: false,
                },
            ],
            type: 'editreply'
        }, interaction)
    }
}

const clean = text => {
    if (typeof (text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}

 
