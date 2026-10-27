const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {
    const list = await client.t(interaction, 'triggers.documentation');
    /*
    let legacyDocumentation = `
    Comment créer un trigger ?

    1. Le filtre Regex
    Le bot filtre chaque mots de chaque message dans un filtre regex avec ou sans flags définis\n
    \n
    Il est possible de filtrer n'importe quels mots ou portion de phrases dans n'importe quel contexte.\n
    Par exemple ceci est un regex \`\b(zizi|zizouille|pipou)\b\` et également ceci \`/\b(zizi|zizouille|pipou)\b/g\`\n
    Pour créer un regex, il existe plusieurs sites :\n
    https://chat.openai.com/chat pour expliquer son idée et avoir une base\n
    https://regexr.com/ ou https://regex101.com/ pour ensuite tester et comprendre le filtre créé\n
    \n
    Pour les arguments de la commande :\n
    **Alias** permet d'identifier le trigger, si la commande est refaites sur cette alias, cela écrase les précédents paramètres\n
    **isActive** permet d'activer ou désactiver le trigger.\n
    **Type** permet de choisir ce que le bot doit faire\n
    **Réponse** est ce que le bot va répondre au trigger\n
    **Mention** détermine si le bot ping quand il répond\n
    **Replied** détermine si le bot répond dans un message séparé ou un message suivi\n
    \n
    **Regex** et **RegexFlags** :\n
    Il y a 2 manière de le complèter.\n
    Si le filtre ressemble à ça \`\b(zizi|zizouille|pipou)\b\`, juste complèter Regex et laisser vide RegexFlags.\n
    Si le filtre ressemble à ça \`/\b(zizi|zizouille|pipou)\b/g\` avec un / au début.\n
    La partie après le premier / jusqu'au prochain / ira dans Regex (/ non inclus), ce qui vient après le 2e / ira dans RegexFlags (/ non inclus).\n
    \n\n
    `;
    */

    await client.embed({
        title: await client.t(interaction, 'triggers.documentationTitle'),
        desc: list,
        type: 'editreply'
    }, interaction)
}
