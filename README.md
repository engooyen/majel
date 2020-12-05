# Majel

Discord bot for use with Star Trek Adventures role playing game. This will help resolve dice rolls and some reference sheets.

# Add Majel To Your Server

> Add this bot if you want the command prefixes to start with "!".

https://discordapp.com/api/oauth2/authorize?client_id=538555398521618432&permissions=51200&scope=bot

> Add this bot if you want the command prefixes to start with "/".

https://discordapp.com/api/oauth2/authorize?client_id=729181873024139294&permissions=51200&scope=bot

# Majel - Star Trek Adventures Bot Command List

> Note - "/" prefix Is also supported depending which bot is added to your server.

`!help` - Displays all possible commands Majel can understand.

`!addme` - Invite me to your game!

![d6 Rolls](https://i.imgur.com/DOaORZP.png "d6 Rolls")

`!d6` - Roll a challenge die.

`!Xd6` - Roll X challenge dice (e.g. Roll 5 d6 = !5d6). X can be left blank, defaults to 1.

![d20 Rolls](https://i.imgur.com/BliWREK.png "d20 Rolls")

`!d20` - Roll a d20.

`!Xd20` - Roll x d20s (e.g. Roll 2 d20 = !2d20). X can be left blank, defaults to 1.

`!Xd20` [Target] - Roll x d20s with a target number (e.g. Roll 2 d20 with target number of 15 = !2d20 15). X can be left blank, defaults to 1.

`!Xd20` [Target][crit range] - Roll x d20s with a target number and crit range (e.g. Roll 2 d20 with target number of 15 with crit range to 5 = !2d20 15 5). X can be left blank, defaults to 1.

`!Xd20` [Target][crit range] [Complication Range] - Roll x d20s with a target number, crit range, and complication range (e.g. Roll 2 d20 with target number of 15 with crit range to 5 and comp range to 17 = !2d20 15 5 17). X can be left blank, defaults to 1.

![Generate technobabble](https://i.imgur.com/ZjEKeUc.jpg "Generate technobabble")

`!babble` - Generate a random techno babble phrase and DMs the user.

![Generate a random support character](https://i.imgur.com/66gHBEU.png "Generate a random support character")

`!support` - Generate a random support character.

`!support list` - Lists all supported species.

![Generate a random alien](https://i.imgur.com/kuuDYnj.jpg "Generate a random alien")

`!alien` - Generate a random alien species.

**Reference for player characters (PC)**

`!pc actions` - The actions the PC can perform.

`!pc action minor actions` - The minor actions the PC can perform.

`!pc [action or minor action]` - Details of a PC action or minor action by name. See `!pc actions` or `!pc minor actions`.

`!pc attack properties` - Attack properties of a PC attack.

`!determination` - Determination spend table.

`!momentum` - Momentum spend table.

**Reference for ship characters**

`!ship actions` - Lists the stations and the name of the actions that can be performed at that station.

`!ship minor actions` - The minor actions the PC can perform.

`!ship [action or minor action or station]` - Details of a ship action by name. See `!ship actions` or `!ship minor actions` for possible actions.

`!ship attack properties` - Attack properties of a ship attack.

**Momemtum and Threat Pools**

`!pool` - Show the global pool and all channels' pool on server.

`!pool here` - Show the global pool and the current channel's pool.

`!pool reset` - Reset the global pool and delete all other pools on this server. This can only be triggered by admins.

`!pool reset here` - Delete this channe's pool. This can only be triggered by admins.

`!m or !t` - Show the global momentum or threat and the current channel's momentum or threat.

`!m or !t [add, sub, set][some value]` - Add, subtract, or set the momentum or threat to the global pool. This can only be triggered by admins.

`!m or !t [add, sub, set][some value] here` - Add, subtract, or set the momentum or threat to the current channel's pool. This can only be triggered by admins.

# Developer Setup

To install the required dependencies.

`npm install`

Ensure 'token' is set somewhere in your environment. Easiest option is to use a .env file with:

`token=ADD YOUR AUTH TOKEN HERE`

Start your bot.

`nodemon .`

# Hosting Options

On your computer, needs to be on at least during the game session if not all the time. I initially hosted Majel on a Raspberry PI.

You can also deploy to AWS free tier, which is my current solution.

# Contributers

**Developers**

- John Nguyen - john@engooyen.com

**Players**

Special thanks to my discord rp group.

- Michael D.
- Daniel Z.
- Danyal
- Euan
- Adam
- Simon B.
- Kyle
