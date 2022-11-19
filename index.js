const Discord = require('discord.js-v11-stable');
var configs = require('./configs.json')

console.log(process.env.DISCORD)

if (process.env.DISCORD != null) {
    const env_discord = process.env.DISCORD
    configs = JSON.parse(env_discord)
}

console.log(configs)

return 

let defaultMsg = configs.msg


function sleep(ms) {
    console.log('等待:',ms)

    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function runBot(name, token) {
    return new Promise((resolve, reject) => {
      const client = new Discord.Client();
      client.on('ready', async () => {
          console.log(name, 'is ready!')
          resolve(client)
      })
      client.login(token)
    })
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    const random = Math.floor(Math.random() * (max - min + 1)) + min;
    return random;
}

async function sendMsg(client, msg, channelId) {
    try {
      console.log(channelId, msg)
      var channel = client.channels.get(channelId)
      await channel.send(msg.content)
    } catch (error) {
      console.log(error)
    }
}

async function loop(user) {
    const token = user.token
    const msg = user.msg
    const channel = user.channel
    
    // 用户登录
    console.log('\n\n开始:',token)
    var chatbot = await runBot('chatbot',token)

    // 获取用户信息
    var userInfo = chatbot.user
    console.log('用户:', userInfo.username,' | ',userInfo.id)
    
    // 发送消息
    var msgBody = {}
    msgBody.authorId = userInfo.id
    msgBody.authorUsername = userInfo.username
    msgBody.content = msg == null ? defaultMsg : msg

    await sendMsg(chatbot,msgBody,channel)
    await sleep(getRandomInt(5, 15) * 1000) 
}

async function app() {
    let users = configs.users

    for (let index = 0; index < users.length; index++) {
        const user = users[index]
        try {
            await loop(user)    
        } catch (error) {
            console.log(error)
        }
    }
    console.log('任务完成')
    process.exit(0)
}

app()


