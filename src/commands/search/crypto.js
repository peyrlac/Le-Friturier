const { getJson } = require('../../handlers/http');

module.exports = async (client, interaction, args) => {

    let coin = interaction.options.getString('coin');
    let currency = interaction.options.getString('currency');

    try {
        const data = await getJson(
            `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(coin)}&vs_currencies=${encodeURIComponent(currency)}`
        );

        if (!data[coin]?.[currency]) return;

        client.embed({ 
            title: `💹・Crypto stats`, 
            desc: `The current price of **1 ${coin}** = **${data[coin][currency]} ${currency}**`, 
            type: 'editreply' 
        }, interaction);
    }
    catch {
        client.errNormal({ 
            error: "Please check your inputs!", 
            type: 'editreply' 
        }, interaction);
    }
}

 
