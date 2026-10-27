const Discord = require('discord.js');
const weather = require('weather-js');

module.exports = async (client, interaction, args) => {
    const country = interaction.options.getString('location');

    weather.find({ search: country, degreeType: 'C' }, async function (error, result) {
        if (result === undefined || result.length === 0) return client.errNormal({
            key: 'search.invalidLocation',
            type: 'editreply'
        }, interaction);

        var current = result[0].current;
        var location = result[0].location;

        client.embed({
            title: await client.t(interaction, 'search.weatherTitle', { skytext: current.skytext }),
            desc: await client.t(interaction, 'search.weatherDescription', { location: current.observationpoint }),
            thumbnail: current.imageUrl,
            fields: [
                {
                    name: await client.t(interaction, 'search.weather.timezone'),
                    value: `UTC${location.timezone}`,
                    inline: true,
                },
                {
                    name: await client.t(interaction, 'search.weather.degreeType'),
                    value: await client.t(interaction, 'search.weather.celsius'),
                    inline: true,
                },
                {
                    name: await client.t(interaction, 'search.weather.temperature'),
                    value: `${current.temperature}°`,
                    inline: true,
                },
                {
                    name: await client.t(interaction, 'search.weather.wind'),
                    value: `${current.winddisplay}`,
                    inline: true,
                },
                {
                    name: await client.t(interaction, 'search.weather.feelsLike'),
                    value: `${current.feelslike}°`,
                    inline: true,
                },
                {
                    name: await client.t(interaction, 'search.weather.humidity'),
                    value: `${current.humidity}%`,
                    inline: true,
                }
            ],
            type: 'editreply'
        }, interaction)
    })
}


