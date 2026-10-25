const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {

    const question = interaction.options.getString('question');

    const answerKeys = [
        'games.eightBallYes',
        'games.eightBallUnfortunately',
        'games.eightBallRight',
        'games.eightBallNoSorry',
        'games.eightBallAgree',
        'games.eightBallNoIdea',
        'games.eightBallNotSmart',
        'games.eightBallSourcesNo',
        'games.eightBallCertain',
        'games.eightBallRely',
        'games.eightBallProbablyNo',
        'games.eightBallPointsNo',
        'games.eightBallNoDoubt',
        'games.eightBallAbsolutely',
        'games.eightBallDontKnow'
    ];
    const answerKey = answerKeys[Math.floor(Math.random() * answerKeys.length)];
    const answer = await client.t(interaction, answerKey);

    client.embed({
        titleKey: 'games.eightBallTitle',
        descKey: 'games.eightBallDescription',
        fields: [
            {
                name: await client.t(interaction, 'games.eightBallQuestion'),
                value: `\`\`\`${question}\`\`\``,
                inline: false
            },
            {
                name: await client.t(interaction, 'games.eightBallAnswer'),
                value: `\`\`\`${answer}\`\`\``,
                inline: false
            }
        ],
        type: 'editreply'
    }, interaction);
}


