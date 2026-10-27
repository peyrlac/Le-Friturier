
module.exports = async (client, interaction, args) => {
    var result = Math.ceil(Math.random() * 100);

    client.embed({
        titleKey: 'fun.gayRateTitle',
        descKey: 'fun.gayRate',
        variables: { result },
        type: 'editreply'
    }, interaction)
}


