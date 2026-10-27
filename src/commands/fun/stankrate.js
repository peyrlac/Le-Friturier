
module.exports = async (client, interaction, args) => {
    var result = Math.ceil(Math.random() * 100);

    client.embed({
        titleKey: 'fun.stankRateTitle',
        descKey: 'fun.stankRate',
        variables: { result },
        type: 'editreply'
    }, interaction)
}


