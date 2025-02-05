// Require dependencies
const discord = require('discord.js');
const keepAlive = require("./server.js");
const dotenv = require('dotenv');
const axios = require('axios');

// Load enviroment variables
dotenv.config();

// Create a bot instance
const bot = new discord.Client();

// Log our bot in
bot.login(process.env.DISCORD_BOT_TOKEN);

// Log to console when the bot is ready
bot.on('ready', () => {
    console.log(`${bot.user.username} is up and running!`);
});

// Reply to user messages
bot.on('message', async (message) => {
    // Do not reply if message was sent by bot
    if (message.author.bot) return;
  
    // Reply to !ping
    if (message.content.startsWith('!ping')) {
      return message.reply('I am working!');
    }

    // Reply to $ETH
    if (message.content.startsWith('!gas')) {
        const [coin, vsCurrency] = ['ethereum','usd'];
        const [low, average, high] = ['SafeGasPrice', 'ProposeGasPrice', 'FastGasPrice'];
        try {
            const { data } = await axios.get(
                `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=${vsCurrency}`
            );

            const gas  = await axios.get(
                `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=5XGN9MSH3QK2AUGRVTZK1KQWHBKJUGFG4Q`
            );
            

            
            if (!data[coin][vsCurrency]) throw Error();
                    // inside a command, event listener, etc.
            const exampleEmbed = new discord.MessageEmbed()
            .setColor('#716b94')
            .setTitle('Ethereum Price')
            
            .setAuthor('Ethereum Info', 'https://aws1.discourse-cdn.com/business6/uploads/zeppelin/original/1X/fd253d25991a84311b698e5b3200939d0cdc2a00.png')
            .setDescription(`$${data[coin][vsCurrency]}`)
            
            .addFields(
                { name: 'Low:', value: `${gas.data.result[low]}`, inline: true },
                { name: 'Average:', value: `${gas.data.result[average]}`, inline: true },
                { name: 'High:', value: `${gas.data.result[high]}`, inline: true }
            );
            message.channel.send(exampleEmbed)
        }
        catch (err) {
            console.log(err);
            
            return message.reply(
                'Could not fetch ETH price...'

                
            );
        }
    }
    
    // reply to any crypto price
    else if (message.content.startsWith('$')){
        // Get the params
        
        const [command, ...args] = message.content.split(' ');
        
          const [coin, vsCurrency] = args;
          

          try {
            // Get crypto price from coingecko API
            const { data } = await axios.get(
              `https://api.nomics.com/v1/currencies/ticker?key=54f5618aea696b56c1be2e6277c4d634c9c8ab37=${coin}&interval=1d&convert=CAD&per-page=100&page=1`
            );

    
            // Check if data exists
            if (!data[coin][vsCurrency]) throw Error();

            const exampleEmbed = new discord.MessageEmbed()
            .setColor('#716b94')
            .setTitle(`${coin} Price`)
            
            .setDescription(`$${data[coin][vsCurrency]}`)
            
            message.channel.send(exampleEmbed)

          } catch (err) {
            return message.reply(
              'An Error has occured, try again'
            );
          
        }
      }
  })

  keepAlive();
