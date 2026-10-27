
module.exports = async (client, interaction, args) => {
    var result = Math.ceil(Math.random() * 100);

    client.embed({
        titleKey: 'fun.epicGamerRateTitle',
        descKey: 'fun.epicGamerRate',
        variables: { result },
        type: 'editreply'
    }, interaction)
}


