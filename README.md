# Majel

Discord bot for use with Star Trek Adventures role playing game. This will help resolve dice rolls and some reference sheets.

# Add Majel To Your Server

https://discordapp.com/api/oauth2/authorize?client_id=538555398521618432&permissions=51200&scope=bot

> Note: If your bot isn't working with the "/" command, you may have a version of Majel that is no longer supported. Try kicking that bot and adding Majel with this link.

# Community & Support

Support this project: https://www.patreon.com/majeldiscordbot
All updates will be posted on patreon and then shared to the other social media accounts.

Twitter: https://twitter.com/majeldiscordbot

Facebook: https://www.facebook.com/majeldiscordbot

Majel Beta and Support Server: https://discord.gg/VbWfJ3M5T5

2d20 Beta and Support Server: https://discord.gg/WecBWtjV2n

# Majel - Star Trek Adventures Bot Command List

`/help` - List all available commands for this bot.

`/addme` - Invite me to your game.

`/about` - Information on development and source code.

`/d6 [x: required]` - Roll X challenge dice. Minimum 1. Maximum 36.

![d6 Rolls](https://i.imgur.com/9DrLkjB.png "d6 Rolls")

`/d20 [target: required] [difficulty: default 0, optional] [crit range: default 1, optional] [complication range: default 20, optional] [dice: default 2, optional]` - Perform d20 roll(s) with the target range to meet.

`/r [params]` - Replicating the old !Xd20 command behavior. 'params' is a text field where the roll parameters are entered with a space between each value. The parameters are entered in this order: [target] [dice] [difficulty] [crit] [comp]. [target] is the only required parameter. [dice, 2] [difficulty, 0] [crit, 1] [comp, 20] are optional, but have default values. 

![d20 Rolls](https://i.imgur.com/8xcZ9F7.png "d20 Rolls")

![Generate technobabble](https://i.imgur.com/ZjEKeUc.jpg "Generate technobabble")

`/babble` - Generate a random techno babble phrase and DM the user.

`/medbabble` - Generate a random medical babble phrase and DM the user.

![Generate a random support character](https://i.imgur.com/66gHBEU.png "Generate a random support character")

`/support` - Generate a random support character. Use `/support help`for more details.

![Generate a random alien](https://i.imgur.com/kuuDYnj.jpg "Generate a random alien")

`/alien` - Generate a random alien species.

`/computer [prompt]` - Ask the computer anything.

**Reference for player characters (PC)**

`/pc list` - List pc rules lookup sub-commands.

`/pc actions [action]` - Get description of an action.

`/pc minor-action [action]` - Get description of a minor action.

`/pc attack-property [property]`. Get description of a pc attack property.

`/determination` - Determination spend table.

`/momentum` - Momentum spend table.

**Reference for ship characters**

`/ship list` - List ship rules lookup sub-commands.

`/ship overview` - Get an overview of what ship actions belongs to which deparment.

`/ship actions-page-1 [action]` - Get description of an action (page 1).

`/ship actions-page-2 [action]` - Get description of an action (page 2).

`/ship actions-page-3 [action]` - Get description of an action (page 3).

`/ship minor-actions [action]` - The minor actions the PC can perform.

`/ship attack-properties [property]` - Attack properties of a ship attack.

**Momemtum and Threat Pools**

`/m or /t get [global or here]` - Get the current value of a specified pool's location.

`/m or /t set [global or here] [amount]` - Directly set the amount to the momemtum or threat pool.

**Traits**

`/trait get [container]` - List all containers if container is left blank otherwise show the traits and values for a specific container.

`/trait set [container] [trait] [value]` - Set a value to a trait within a container.

`/trait del [container] [trait]` - Delete a trait within a container.

`/trait del [container]` - Delete a container.


# Developer Setup

## NPM
This section assumes that you're familiar with javascript and node.js. Ensure you have npm installed on your workstation by following the steps outlined here:

https://www.npmjs.com/get-npm

To install the required dependencies, go to this repository's folder (majel by default), and type this command.

```
npm install
```

Make sure `nodemon` is installed:

https://www.npmjs.com/package/nodemon

## Redis Cache
Redis cache needs to be up and running before starting the bot server. Ensure redis is installed and the server running:

Windows: https://github.com/microsoftarchive/redis/releases/tag/win-3.0.504

Mac: https://gist.github.com/tomysmile/1b8a321e7c58499ef9f9441b2faa0aa8

Linux: https://redis.io/download

For your own development purposes, you will need to create your own bot, and invite it to your own server. Use the steps outlined here:

https://www.writebots.com/discord-bot-token/

There's a section mentioning how to generate the bot's auth token. That token is needed to run the bot server and allow clients to connect to it. Ensure 'token' is set somewhere in your environment. Easiest option is to create a .env file in the respository's folder. Copy and paste the following environment variables into your .env file.

```
token=[ADD YOUR AUTH TOKEN HERE]
client_id=[BOT'S CLIENT ID]
port=8080 # will differ depending on your server's deployment requirements
bot_name='Majel'
redis_host=127.0.0.1
redis_port=6379
redis_password=[REDIS SERVER PASSWORD]
feature_sta=true # if using STA features
feature_2d20=true # if using 2d20 features
```
Copy the auth token as mentioned in the tutorial and replace [ADD YOUR AUTH TOKEN HERE]

## Invite the bot to your server

The writebots.com link above also contains a section on how to generate the invite link for the bot. Follow the instructions.
When you get to the point where you need to specify the permissions for the bot in the Discord developer interface, check

* Send Messages
* Embed Links
* Attach Files

This should give a permissions mask of 51200, which will be part of the generated URL in the `permissions` parameter.

## Start your bot

```
nodemon .
```

(If you have a non-global installation of `nodemon`, the command to start `nodemon` may look differently. Refer to the `nodemon`  installation instructions above.)

Your terminal should look something like this:
```
[nodemon] 2.0.6
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node .`
Redis client ready.
{"message":"Connected","level":"info","service":"user-service"}
{"message":"Logged in as: ","level":"info","service":"user-service"}
{"message":"Majel-Local - (12345678901234567890)","level":"info","service":"user-service"}
```

The bot is now running. If you have invited it to your server as above, it is now functional.

# Hosting Options

On your computer, needs to be on at least during the game session if not all the time. I initially hosted Majel on a Raspberry PI.

I'm currently using Microsoft Azure to host my servers and connected to github to perform automatic deployments.

# Contributors

**Developers**

- John Nguyen - john@engooyen.com
- Konstantin Kotenko

**Players**

Special thanks to my discord rp group.

- Michael D.
- Daniel Z.
- Danyal
- Euan
- Adam
- Simon B.
- Kyle
