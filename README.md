# Majel

Discord bot for use with Star Trek Adventures role playing game. This will help resolve dice rolls and some reference sheets.

# Setup

To install the required dependencies.

`npm install`

Ensure 'token' is set somewhere in your environment. Easiest option is to use a .env file with:

`token=ADD YOUR AUTH TOKEN HERE`

Start your bot.

`node app.js`

# Hosting Options

On your computer, needs to be on at least during the game session if not all the time. I initially hosted Majel on a Raspberry PI.

You can also deploy to AWS free tier, which is my current solution.

# Commands

**General**

`!help` - Displays all possible commands Majel can understand.

`!d6` - Roll a challenge die.

`!Xd6` - Roll X challenge dice (e.g. Roll 5 d6 = !5d6). X can be left blank, defaults to 1.

`!d20` - Roll a d20.

`!Xd20` - Roll x d20s (e.g. Roll 2 d20 = !2d20). X can be left blank, defaults to 1.

`!Xd20` [Target] - Roll x d20s with a target number (e.g. Roll 2 d20 with target number of 15 = !2d20 15). X can be left blank, defaults to 1.

`!Xd20` [Target][crit range] - Roll x d20s with a target number and crit range (e.g. Roll 2 d20 with target number of 15 with crit range to 5 = !2d20 15 5). X can be left blank, defaults to 1.

`!Xd20` [Target][crit range] [Complication Range] - Roll x d20s with a target number, crit range, and complication range (e.g. Roll 2 d20 with target number of 15 with crit range to 5 and comp range to 17 = !2d20 15 5 17). X can be left blank, defaults to 1.

`!babble` - Generate a random techno babble phrase and DMs the user.

`!support` - Generate a random support character (In development).

`!alien` - Generate a random alien species.

`!refresh` - Refreshes the character sheets.

**Reference for player characters (PC).**

`!pc minor actions` - The minor actions the PC can perform.

`!pc actions` - The actions the PC can perform.

`!pc attack properties` - Attack properties of a PC attack.

`!determination` - Determination spend table.

**Reference for ship characters.**

`!ship minor actions` - The minor actions the PC can perform.

`!ship actions` - Lists the stations and the name of the actions that can be performed at that station.

`!ship [action]` - Details of a ship action. See `!ship actions` for possible actions.

`!ship attack properties` - Attack properties of a ship attack.

**Character Sheets**

`!traits` - Displays players available.

`!traits [player]` - Displays character traits. Player can be listed with above command. Partial name is ok.

`!stats` - Displays players available.

`!stats [player]` - Displays players attributes/disciplines or systems/departments. Player can be listed with above command. Partial name is ok.

`!disciplines` - Displays players available.

`!disciplines [player]` - Displays players disciplines. Player can be listed with above command. Partial name is ok.

`!values` - Displays players available.

`!values [player]` - Displays players values. Player can be listed with above command. Partial name is ok.

`!talents` - Displays players available.

`!talents [player]` - Displays players talents. Player can be listed with above command. Partial name is ok.

`!all` - Displays players available.

`!all [player]` - Displays full character sheet. Player can be listed with above command. Partial name is ok.

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
