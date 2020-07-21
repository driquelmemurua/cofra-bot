require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;

bot.login(TOKEN);
const botId = "734974308530520105";
bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

const ACTIONS = {
  COFRA: {
    CMD: '$cofra',
    MSG: 'No entender bip bop. Para pedir ayuda usa el comando $cofra ayuda'
  },
  HELP: {
    CMD: '$cofra ayuda',
    MSG:
    `Comandos:
    $cofra ayuda: :thinking:
    $cofra scotch: Muestra el status de la mesa
    $cofra scotch arreglar: Arregla el scotch de la mesa
    $cofra scotch romper: Rompe el scotch de la mesa`
  },
  SCOTCH: {
    CMD: '$cofra scotch'
  },
  SCOTCH_FIX: {
    CMD: '$cofra scotch arreglar'
  },
  SCOTCH_DESTROY: {
    CMD: '$cofra scotch romper'
  }
}

let table = {
  state: false,
  author: null,
  date: null
};
bot.on('message', msg => {
  switch(msg.content) {
    case ACTIONS.HELP.CMD:
      return msg.reply(ACTIONS.HELP.MSG);
    case ACTIONS.SCOTCH.CMD:
      const dateObj = new Date();
      const tableTimeObj = table.date ? new Date(table.date) : dateObj;
      const elapsedHours = dateObj.getHours() - tableTimeObj.getHours();
      const elapsedMinutes = (dateObj.getMinutes() - tableTimeObj.getMinutes())%60;
      return msg.channel.send([
        ( 
          table.state ? 
          `La mesa está con scotch :triumph:` :
          `La mesa está sin scotch :pensive:` 
        ),( 
          table.author && `Gracias a ${table.author}`
        ),(
          elapsedMinutes > 0 ? (
            'Por aproximadamente ' + 
            elapsedHours > 0 ? 'hora' : null + 
            elapsedHours > 1 ? 's' : null + 
            elapsedHours > 0 ? ', ' : null + 
            elapsedMinutes.toString() + 
            'minuto' + 
            elapsedMinutes > 1 ? 's' : null
          ) : null
        )
      ]);
    case ACTIONS.SCOTCH_FIX.CMD:
      if(table.state)
        return msg.channel.send(`La mesa ya tiene scotch :triumph:`)
      table = {
        state: true,
        author: msg.author.username,
        date: new Date()
      };
      return msg.channel.send(`${msg.author.username} acaba de arreglar el scotch!! :triumph:`);
    case ACTIONS.SCOTCH_DESTROY.CMD:
      if(!table.state)
        return msg.channel.send(`La mesa ya está sin scotch :rage:`)
      table = {
        state: false,
        author: msg.author.username,
        date: new Date()
      };
        return msg.channel.send(`${msg.author.username} acaba de pitearse el scotch :skull:`);
    default:
      if(msg.content.includes(ACTIONS.COFRA.CMD) && msg.author.id !== botId)
        return msg.reply(ACTIONS.COFRA.MSG);
  }
});