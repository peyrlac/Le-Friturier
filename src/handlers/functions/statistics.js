const logger = require('../logger');

class StatisticsManager {
    constructor() {
        // Resolve API base URL from environment. In production you MUST set STATS_API_URL to
        // the public URL of the FriturierAPI (example: https://api.example.com/api).
        // If not provided we fall back to a sensible development default (localhost:3001).
        const envUrl = process.env.STATS_API_URL || process.env.STATS_API_BASE;

        if (!envUrl && process.env.NODE_ENV === 'production') {
            logger.error('STATISTICS', 'La variable STATS_API_URL est absente en production');
            logger.warn('STATISTICS', 'Configurez STATS_API_URL avec l’URL publique de l’API');
            logger.warn('STATISTICS', 'Fallback développement : http://localhost:3001/api');
        }

        const baseUrl = envUrl || 'http://localhost:3001/api';
        this.API_BASE_URL = baseUrl.startsWith('http://') || baseUrl.startsWith('https://')
            ? baseUrl
            : `http://${baseUrl}`;

        logger.info('STATISTICS', `API utilisée : ${this.API_BASE_URL}`);

        // Set up fetch
        this.fetch = global.fetch;
        try {
            this.fetch = require('node-fetch');
            logger.info('STATISTICS', 'Transport HTTP : node-fetch');
        } catch {
            logger.info('STATISTICS', 'Transport HTTP : fetch global');
        }

        // Error management
        this.lastErrorTime = 0;
        this.errorCount = 0;
        this.ERROR_THRESHOLD = 5; // Number of errors before reducing logging
        this.ERROR_TIMEOUT = 5 * 60 * 1000; // 5 minutes between full error logs
    }

    handleError(error, context) {
        const now = Date.now();
        this.errorCount++;

        // Si c'est la première erreur ou si on a dépassé le délai d'attente
        if (this.errorCount === 1 || (now - this.lastErrorTime) > this.ERROR_TIMEOUT) {
            this.lastErrorTime = now;
            
            // Format du message d'erreur selon le type
            let errorMessage = 'An error occurred';
            if (error.code === 'ECONNREFUSED') {
                errorMessage = `Cannot connect to statistics API at ${this.API_BASE_URL}. Is the server running?`;
            } else if (error.type === 'system') {
                errorMessage = `System error: ${error.message}`;
            } else {
                errorMessage = error.message || 'Unknown error';
            }

            logger.error('STATISTICS', errorMessage,
                this.errorCount > this.ERROR_THRESHOLD ? '(Les erreurs suivantes seront limitées)' : '');
            
            if (this.errorCount === 1) {
                logger.warn('STATISTICS', 'Vérifiez que le serveur de statistiques fonctionne et que l’URL .env est correcte');
            }
        }
    }

    async trackAllVoiceActivity(client) {
        if (this.errorCount === 0) {
            // Verbose invocation log to confirm the scheduler is running
            //console.log(chalk.blue(chalk.bold('Statistics')), chalk.white('>>'), chalk.green('trackAllVoiceActivity invoked'));
        }

        let processedGuilds = 0;
        for (const [guildId, guild] of client.guilds.cache) {
            const voiceChannels = guild.channels.cache.filter(
                channel => channel.type === 2 && channel.members.size > 0 // 2 is GUILD_VOICE
            );

            // Préparer les données pour tous les canaux vocaux du serveur
            const channels = [];
            
            for (const [channelId, channel] of voiceChannels) {
                const members = channel.members.map(member => ({
                    memberId: member.id,
                    username: member.user.username
                }));

                channels.push({
                    channelId: channelId,
                    channelName: channel.name,
                    members: members
                });
            }

            // Envoyer toutes les données des canaux vocaux du serveur en une seule requête
            if (channels.length > 0) {
                processedGuilds++;
                // Log the outgoing attempt for visibility in runtime logs
                try {
                    //console.log(chalk.blue(chalk.bold('Statistics')), chalk.white('>>'), chalk.green(`Sending ${channels.length} channel(s) for guild:`), chalk.yellow(guild.name || guildId), chalk.green(`(${guildId})`));
                } catch (e) {
                    // Fallback logging if guild.name access fails
                    //console.log(chalk.blue(chalk.bold('Statistics')), chalk.white('>>'), chalk.green(`Sending ${channels.length} channel(s) for guild id:`), chalk.yellow(guildId));
                }
                try {
                    const response = await this.fetch(`${this.API_BASE_URL}/voice/${guildId}`, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'x-api-key': process.env.STATS_API_KEY
                        },
                        body: JSON.stringify({ channels })
                    });

                    // Log non-2xx responses to help debug why data isn't persisted
                    if (!response.ok) {
                        let text = '';
                        try { text = await response.text(); } catch (e) { text = '<no body>'; }
                        logger.error('STATISTICS', `API ${response.status} ${response.statusText} pour /voice/${guildId}: ${text}`);
                    }
                    
                    if (this.errorCount > 0) {
                        // Si on réussit après des erreurs, on réinitialise les compteurs
                        this.errorCount = 0;
                        this.lastErrorTime = 0;
                        //console.log(chalk.blue(chalk.bold('Statistics')), chalk.white('>>'), 
                            //chalk.green('Connection restored to statistics API'));
                    }

                    if (this.errorCount === 0) {
                        const totalMembers = channels.reduce((total, channel) => total + channel.members.length, 0);
                        //console.log(chalk.blue(chalk.bold('Statistics')), chalk.white('>>'), 
                            //chalk.green('Tracked voice activity for'), chalk.red(guild.name), 
                            //chalk.green('with'), chalk.red(channels.length), chalk.green('channels and'), 
                            //chalk.red(totalMembers), chalk.green('total members'));
                    }
                } catch (error) {
                    this.handleError(error, 'voice activity');
                }
            }
        }

        // Summary log to show how many guilds triggered POSTs this run
        if (this.errorCount === 0) {
            //console.log(chalk.blue(chalk.bold('Statistics')), chalk.white('>>'), chalk.green(`trackAllVoiceActivity completed — POSTed for ${processedGuilds} guild(s)`));
        }
    }
}

// Create the manager instance and prepare exports
let manager = new StatisticsManager();

function handlerExport(client) {
    client.statistics = manager;
    return {
        trackAllVoiceActivity: () => manager.trackAllVoiceActivity(client)
    };
}

// Set up all exports
handlerExport.StatisticsManager = StatisticsManager;
handlerExport.createManager = () => new StatisticsManager();

// Export the handler function
module.exports = handlerExport;
