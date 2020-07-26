const asyncRedis = require("async-redis")
const redis = asyncRedis.createClient(
  process.env.redis_port,
  process.env.redis_host,
  {
    no_ready_check: true,
  }
)

redis.on("error", (error) => {
  console.error("Redis error:", error)
})

redis.on("ready", () => {
  console.log("Redis client ready.")
})

module.exports = {
  async status(msg, option) {
    const guildId = msg.guild.id.toString()
    const channelId = msg.channel.id.toString()
    const isAdmin = msg.member.hasPermission("ADMINISTRATOR")
    console.warn(msg.author.username)
    console.warn("guild id", guildId)
    console.warn("channel id", channelId)

    let guildData = await redis.get(guildId)
    if (guildData) {
      guildData = JSON.parse(guildData)
    }

    console.warn("get redis", guildId, guildData)
    if (!guildData || !guildData.global) {
      console.warn("fixing guildData")
      guildData = {
        global: {
          momentum: 0,
          threat: 0,
        },
      }
    }

    const global = guildData.global
    // making sure global is always first to be displayed
    const embed = {
      title: "Momentum and Threat Pools",
      fields: [
        {
          name: "Global",
          value: `Momentum: ${global.momentum}. Threat: ${global.threat}`,
        },
      ],
    }

    let reset = false
    let thisChannelOnly = false
    const options = option.split(" ")
    console.warn("option", options)
    if (options.length > 1) {
      reset = options[0].toLowerCase() === "reset"
      thisChannelOnly = options[1].toLowerCase() === "here"
    } else if (options.length > 0) {
      const op = options[0].toLowerCase()
      reset = op === "reset"
      thisChannelOnly = op === "here"
    }

    if (reset && isAdmin) {
      for (let currentId in guildData) {
        console.warn("currentId", currentId)
        if (!thisChannelOnly && currentId === "global") {
          guildData.global.momentum = 0
          guildData.global.threat = 0
          continue
        }

        if (thisChannelOnly && currentId !== channelId) {
          continue
        }

        console.warn("deleting", currentId)
        delete guildData[currentId]
      }
    }

    for (let currentId in guildData) {
      console.warn("currentId", currentId)
      if (currentId === "global") {
        continue
      }

      if (!reset && thisChannelOnly && currentId !== channelId) {
        continue
      }

      const channel = guildData[currentId]
      console.warn("channel", channel)
      if (channel) {
        embed.fields.push({
          name: `#${channel.name}`,
          value: `Momentum: ${channel.momentum}. Threat: ${channel.threat}`,
        })
      }
    }

    if (reset && !isAdmin) {
      msg.channel.send(`${msg.author}, only admins can modify the pool.`)
    }

    console.warn("set redis", guildData)
    await redis.set(guildId, JSON.stringify(guildData))
    return embed
  },
  async adjustMomentum(msg, option) {
    const guildId = msg.guild.id.toString()
    const channelId = msg.channel.id.toString()
    const isAdmin = msg.member.hasPermission("ADMINISTRATOR")

    let guildData = await redis.get(guildId)
    if (guildData) {
      guildData = JSON.parse(guildData)
    }

    console.warn("get redis", guildId, guildData)
    if (!guildData || !guildData.global) {
      console.warn("fixing guildData")
      guildData = {
        global: {
          momentum: 0,
          threat: 0,
        },
      }
    }

    if (!guildData[channelId]) {
      guildData[channelId] = {
        momentum: 0,
        threat: 0,
        name: msg.channel.name,
      }
    }

    const options = option.split(" ")

    let op = ""
    if (options.length > 0) {
      op = options[0].toLowerCase()
      const amount = parseInt(options[1])
      const isChannelPool =
        options.length >= 3 && options[2].toLowerCase() === "here"

      let pool = "global"
      if (isChannelPool) {
        pool = channelId
      }

      if (isAdmin) {
        if (op === "add") {
          guildData[pool].momentum += amount
        } else if (op === "sub") {
          guildData[pool].momentum -= amount
        } else if (op === "set") {
          guildData[pool].momentum = amount
        }

        if (guildData.global.momentum > 6) {
          guildData.global.momentum = 6
        }

        if (guildData.global.momentum < 0) {
          guildData.global.momentum = 0
        }
      }
    }

    const embed = {
      title: "Momentum Pools",
      color: 3447003,
      fields: [
        {
          name: "Global",
          value: guildData.global.momentum,
          inline: true,
        },
        {
          name: `#${msg.channel.name}`,
          value: guildData[channelId].momentum,
          inline: true,
        },
      ],
    }

    if (!isAdmin && ["add", "sub", "set"].includes(op)) {
      msg.channel.send(`${msg.author}, only admins can modify the pool.`)
    }

    console.warn("redis set", guildId, guildData)
    await redis.set(guildId, JSON.stringify(guildData))
    return embed
  },
  async adjustThreat(msg, option) {
    const guildId = msg.guild.id.toString()
    const channelId = msg.channel.id.toString()
    const isAdmin = msg.member.hasPermission("ADMINISTRATOR")

    let guildData = await redis.get(guildId)
    if (guildData) {
      guildData = JSON.parse(guildData)
    }

    console.warn("get redis", guildId, guildData)
    if (!guildData || !guildData.global) {
      console.warn("fixing guildData")
      guildData = {
        global: {
          momentum: 0,
          threat: 0,
        },
      }
    }

    if (!guildData[channelId]) {
      guildData[channelId] = {
        momentum: 0,
        threat: 0,
        name: msg.channel.name,
      }
    }

    const options = option.split(" ")

    let op = ""
    if (options.length > 0) {
      op = options[0].toLowerCase()
      const amount = parseInt(options[1])
      const isChannelPool =
        options.length >= 3 && options[2].toLowerCase() === "here"

      let pool = "global"
      if (isChannelPool) {
        pool = channelId
      }

      if (isAdmin) {
        if (op === "add") {
          guildData[pool].threat += amount
        } else if (op === "sub") {
          guildData[pool].threat -= amount
        } else if (op === "set") {
          guildData[pool].threat = amount
        }

        if (guildData.global.threat > 20) {
          guildData.global.threat = 20
        }

        if (guildData.global.threat < 0) {
          guildData.global.threat = 0
        }
      }
    }

    const embed = {
      title: "Threat Pools",
      color: 15158332,
      fields: [
        {
          name: "Global",
          value: guildData.global.threat,
          inline: true,
        },
        {
          name: `#${msg.channel.name}`,
          value: guildData[channelId].threat,
          inline: true,
        },
      ],
    }

    if (!isAdmin && ["add", "sub", "set"].includes(op)) {
      msg.channel.send(`${msg.author}, only admins can modify the pool.`)
    }

    await redis.set(guildId, JSON.stringify(guildData))
    return embed
  },
}
