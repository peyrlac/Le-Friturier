const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {
    const option = interaction.options.getString("option");

    let options = ["rock", "paper", "scissors"];
    const result = options[Math.floor(Math.random() * options.length)];

    switch (option) {
        case "rock":
            if (result == "paper") return client.embed({
                titleKey: 'games.rpsTitle',
                descKey: 'games.rpsLose',
                variables: { result },
                type: 'editreply'
            }, interaction);

            if (result == "scissors") return client.embed({
                titleKey: 'games.rpsTitle',
                descKey: 'games.rpsWin',
                variables: { result },
                type: 'editreply'
            }, interaction);

            if (result == "rock") return client.embed({
                titleKey: 'games.rpsTitle',
                descKey: 'games.rpsDraw',
                variables: { result },
                type: 'editreply'
            }, interaction);
            break;

        case "paper":
            if (result == "paper") return client.embed({
                titleKey: 'games.rpsTitle',
                descKey: 'games.rpsDraw',
                variables: { result },
                type: 'editreply'
            }, interaction);

            if (result == "scissors") return client.embed({
                titleKey: 'games.rpsTitle',
                descKey: 'games.rpsLose',
                variables: { result },
                type: 'editreply'
            }, interaction);

            if (result == "rock") return client.embed({
                titleKey: 'games.rpsTitle',
                descKey: 'games.rpsWin',
                variables: { result },
                type: 'editreply'
            }, interaction);
            break;

        case "scissors":
            if (result == "paper") return client.embed({
                titleKey: 'games.rpsTitle',
                descKey: 'games.rpsWin',
                variables: { result },
                type: 'editreply'
            }, interaction);

            if (result == "scissors") return client.embed({
                titleKey: 'games.rpsTitle',
                descKey: 'games.rpsDraw',
                variables: { result },
                type: 'editreply'
            }, interaction);

            if (result == "rock") return client.embed({
                titleKey: 'games.rpsTitle',
                descKey: 'games.rpsLose',
                variables: { result },
                type: 'editreply'
            }, interaction);
            break;
    }
}


