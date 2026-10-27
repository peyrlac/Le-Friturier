const Discord = require('discord.js');
const { REST } = require('discord.js');
const { Routes } = require('discord.js');
const fs = require('fs');
const { applyCommandLocalizations } = require('../i18n');
const logger = require('../logger');

async function clearGuildCommands(rest, applicationId, logger = console) {
    const startedAt = Date.now();
    const guilds = await rest.get(Routes.userGuilds());

    await Promise.all(guilds.map(guild => rest.put(
        Routes.applicationGuildCommands(applicationId, guild.id),
        { body: [] },
    )));

    if (typeof logger.success === 'function') {
        logger.success('COMMANDS', `Nettoyage terminé en ${Date.now() - startedAt} ms`, {
            guildsProcessed: guilds.length,
            registrationsCleared: guilds.length,
            guilds: guilds.map(guild => ({
                id: guild.id,
                name: guild.name || 'Serveur sans nom',
            })),
        });
    } else {
        logger.log(`Cleared guild command registrations for ${guilds.length} guild(s).`);
    }
    return guilds.length;
}

const loadCommands = (client) => {
    const interactionLogs = new Discord.WebhookClient({
        id: client.webhooks.interactionLogs.id,
        token: client.webhooks.interactionLogs.token,
    });

    const commands = [];

    if (client.shard.ids[0] === 0) logger.info('COMMANDS', 'Chargement des commandes');

    fs.readdirSync('./src/interactions').forEach(dirs => {
        const commandFiles = fs.readdirSync(`./src/interactions/${dirs}`).filter(files => files.endsWith('.js'));

        if (client.shard.ids[0] === 0) logger.success('COMMANDS', `${commandFiles.length} commande(s) chargée(s) depuis ${dirs}`);

        for (const file of commandFiles) {
            const command = applyCommandLocalizations(require(`${process.cwd()}/src/interactions/${dirs}/${file}`));
            client.commands.set(command.data.name, command);
            commands.push(command.data);
        };
    });

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    const shouldCleanGuildCommands = process.env.DISCORD_CLEANUP_GUILD_COMMANDS !== 'false';

    (async () => {
        try {
            const embed = new Discord.EmbedBuilder()
                .setDescription(`Started refreshing application (/) commands.`)
                .setColor(client.config.colors.normal)
            interactionLogs.send({
                username: 'Bot Logs',
                embeds: [embed]
            });

            await rest.put(
                Routes.applicationCommands(client.config.discord.id),
                { body: commands },
            )

            if (shouldCleanGuildCommands && client.shard.ids[0] === 0) {
                await clearGuildCommands(rest, client.config.discord.id, logger);
            }

            const embedFinal = new Discord.EmbedBuilder()
                .setDescription(`Successfully reloaded ${commands.length} application (/) commands.`)
                .setColor(client.config.colors.normal)
            interactionLogs.send({
                username: 'Bot Logs',
                embeds: [embedFinal]
            });

        } catch (error) {
            console.log(error);
        }
    })();
}

module.exports = loadCommands;
module.exports.clearGuildCommands = clearGuildCommands;

 
module.exports.clearGuildCommands = clearGuildCommands;
