/**
 * Copyright 2019 John H. Nguyen
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

var Discord = require('discord.io')
var winston = require('winston')
var fs = require('fs')
var dice = require('./dice')
var utils = require('./utils')
var referenceSheets = require('./referenceSheets')
var alienGenerator = require('./alienGenerator')
require('dotenv').config()

//Configure logger settings
var logger = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    defaultMeta: {
        service: 'user-service'
    },
    transports: [
        new winston.transports.Console()
    ]
});

// Initialize Discord Bot
var bot = new Discord.Client({
    token: process.env.token,
    autorun: true
});

referenceSheets.loadReferenceSheets()

// help content
var help1 = fs.readFileSync('./data/help1.txt', {encoding: 'utf8'});
var help2 = fs.readFileSync('./data/help2.txt', {encoding: 'utf8'});

var players = [];

function getPlayerSheets() {
    players = []
    for (let k in bot.channels) {
        if (bot.channels[k].name.toLowerCase() === 'player-sheets') {
            bot.getMessages({limit: 50, channelID: bot.channels[k].id}, function (a, b) {
            try {
                b = b.reverse();
                for (let k = 0; k < b.length; ++k) {
                    let player = {}
                    let playerData = b[k].content.split('\n')
                    let collectTalents = false;
                    for (let i = 0; i < playerData.length; ++i) {
                        if (playerData[i].indexOf('Talents') > -1) {
                            collectTalents = true
                            player['Talents'] = {}
                            continue;
                        }
    
                        let kvp = playerData[i].split(': ');
                        if (!collectTalents) {
                            if (kvp[0] === 'Attributes') {
                                let attributes = kvp[1].split(' ')
                                player[kvp[0]] =  {
                                    Control: attributes[0],
                                    Daring: attributes[1],
                                    Fitness: attributes[2],
                                    Insight: attributes[3],
                                    Presence: attributes[4],
                                    Reason: attributes[5]
                                }
                            } else if (kvp[0] === 'Disciplines') {
                                let disciplines = kvp[1].split(' ')
                                player[kvp[0]] = {
                                    Command: disciplines[0],
                                    Conn: disciplines[1],
                                    Security: disciplines[2],
                                    Engineering: disciplines[3],
                                    Science: disciplines[4],
                                    Medicine: disciplines[5]
                                }
                            } else if (kvp[0] === 'Systems') {
                                let systems = kvp[1].split(' ')
                                player[kvp[0]] = {
                                    Engines: systems[0],
                                    Computers: systems[1],
                                    Weapons: systems[2],
                                    Structure: systems[3],
                                    Sensors: systems[4],
                                    Communications: systems[5]
                                }
                            } else if (kvp[0] === 'Departments') {
                                let departments = kvp[1].split(' ')
                                player[kvp[0]] = {
                                    Command: departments[0],
                                    Security: departments[1],
                                    Science: departments[2],
                                    Conn: departments[3],
                                    Engineering: departments[4],
                                    Medicine: departments[5]
                                }
                            } else {
                                player[kvp[0]] = kvp[1]
                            }
                        } else {
                            player['Talents'][kvp[0]] = kvp[1]
                        }
                    }
    
                    players[players.length] = player
                }
            } catch (error) {
                console.warn(error)
            }
        });
        return;
    }
}

    console.warn('player-sheets channel not found on this server!')
}

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
    getPlayerSheets();
});

bot.on('message', function (user, userID, channelID, message, evt) {
    try {
        // Our bot needs to know if it will execute a command
        // It will listen for messages that will start with `!`
        var msg = '';
        if (message.substring(0, 1) == '!') {
            var args = message.substring(1).split(' ');
            var cmd = args[0];

            args = args.splice(1);
            var isD6 = cmd.indexOf('d6')> -1;
            var isD20 = cmd.indexOf('d20')> -1;

            if (isD6) {
                let numDice = cmd.replace('d6', '');
                if (numDice === '') {
                    numDice = '1';
                }
                numDice = parseInt(numDice);

                bot.sendMessage({
                    to: channelID,
                    message: dice.rollD6(numDice, userID)
                });
                return;
            } else if (isD20) {
                let numDice = cmd.replace('d20', '');
                if (numDice === '') {
                    numDice = '1';
                }
                numDice = parseInt(numDice);

                bot.sendMessage({
                    to: channelID,
                    message: dice.rollD20(numDice, args, userID)
                });
                return;
            }

            let option = args.length > 0 ? args.join(' ').toLowerCase() : ''
            switch(cmd) {
                case 'help':
                    bot.sendMessage({
                        to: channelID,
                        message: help1
                    });
                    bot.sendMessage({
                        to: channelID,
                        message: help2
                    });
                    break;
                case 'support':
                    msg = utils.generateSupportCharacter();
                    break;
                // !babble
                case 'babble':
                    msg = '<@' + userID + '> Technobabble generated. Check your DM.'
                    bot.sendMessage({
                        to: userID,
                        message: referenceSheets.generateTechnobabble()
                    });
                break;
                case 'comp':
                    if (args.length> 0) {
                        dice.globalComplication = parseInt(args[0]);
                    }

                    msg = 'Current Global Complication Range: ' + dice.globalComplication
                break;
                case 'pc':
                    if (option === 'minor actions') {
                        msg = referenceSheets.pcMinorActionsAll
                    } else if (option == 'actions') {
                        msg = referenceSheets.pcActionsAll
                    } else if (option === 'attack properties') {
                        msg = referenceSheets.pcAttackProperties;
                    } else {
                        msg = '**' + option.toUpperCase() + '**: '
                        msg +=  referenceSheets.pcMinorActions[option.toUpperCase()]
                            || referenceSheets.pcActions[option.toUpperCase()]
                    }
                break;
                case 'ship':
                    if (option === 'minor actions') {
                        msg = referenceSheets.shipMinorActionsAll
                    } else if (option == 'actions') {
                        msg = referenceSheets.shipActionsAll
                    } else if (option === 'attack properties') {
                        msg = referenceSheets.shipAttackProperties;
                    } else {
                        msg = '**' + option.toUpperCase() + '**: '
                        msg += referenceSheets.shipMinorActions[option.toUpperCase()]
                            || referenceSheets.shipActions[option.toUpperCase()]
                    }
                break;
                case 'determination':
                    if (!option) {
                        msg = referenceSheets.determinationAll
                    } else {
                        msg = '**' + option.toUpperCase() + '**: '
                        msg +=  determination[option.toUpperCase()]
                    }
                break;
                case 'all':
                case 'focuses':
                case 'stats':
                case 'talents':
                case 'traits':
                case 'values':
                    if (!option) {
                        msg = '**SHIP AND CREW**\n';
                        for (let i = 0; i < players.length; ++i) {
                            if (i > 0) {
                                msg += ', '
                            }

                            msg += players[i].Name
                        }
                    } else {
                        for (let i = 0; i < players.length; ++i) {
                            let player = players[i]
                            if (player.Name.toLowerCase().indexOf(option.toLowerCase()) > -1) {
                                msg = '**' + player.Name + '**'

                                if (cmd === 'all' || cmd === 'traits') {
                                    if (player.Traits) {
                                        msg += '\n**Traits**: ' + player.Traits
                                    }
                                }

                                if (cmd === 'all' || cmd === 'stats') {
                                    if (player.Attributes) {
                                        msg += '\n**Attributes**: ' + utils.enumerateDictionary(player.Attributes, ', ')
                                    }
    
                                    if (player.Disciplines) {
                                        msg += '\n**Disciplines**: ' + utils.enumerateDictionary(player.Disciplines, ', ')
                                    }
    
                                    if (player.Systems) {
                                        msg += '\n**Systems**: ' + utils.enumerateDictionary(player.Systems, ', ')
                                    }
    
                                    if (player.Departments) {
                                        msg += '\n**Departments**: ' + utils.enumerateDictionary(player.Departments, ', ')
                                    }
                                }

                                if (cmd === 'all' || cmd === 'focuses') {
                                    if (player.Focuses) {
                                        msg += '\n**Focuses**: ' + player.Focuses
                                    }
                                }

                                if (cmd === 'all' || cmd === 'values') {
                                    if (player.Values) {
                                        msg += '\n**Values**: ' + player.Values
                                    }
                                }

                                if (cmd === 'all' || cmd === 'talents') {
                                    if (player.Talents) {
                                        msg += '\n**Talents**\n' + utils.enumerateDictionary(player.Talents, '\n')
                                    }
                                }

                                break;
                            }
                        }
                    }
                break;
                case 'alien':
                    let alien = alienGenerator.alien()
                    msg = '**GENERATED ALIEN**'
                    for (let key in alien) {
                        msg += '\n**' + key + '**: ' + alien[key]
                    }
                break;
                case 'refresh':
                    getPlayerSheets();
                break;
                case 'reset-stats':
                for (let k in bot.channels) {
                    if (bot.channels[k].name.toLowerCase() === 'current-stats') {
                        bot.getMessages({limit: 50, channelID: bot.channels[k].id}, function (a, b) {
                            for (let i = 0; i < b.length; ++i) {
                                let currentMsg = b[i]
                                if (currentMsg.author.username.indexOf('Majel') > -1) {
                                    bot.editMessage({
                                        channelID: bot.channels[k].id,
                                        messageID: b[0].id,
                                        message: '{}'
                                    })
    
                                    return;
                                }
                            }
                        })
                    }
                }
                break;
                case 'var':
                    for (let k in bot.channels) {
                        if (bot.channels[k].name.toLowerCase() === 'current-stats') {
                            bot.getMessages({limit: 50, channelID: bot.channels[k].id}, function (a, b) {
                                console.warn(b)
                                let stats = {}

                                if (args.length == 0) {
                                    bot.sendMessage({
                                        to: channelID,
                                        message: '**' + Error + '**: var requires 1 argument to view and 2 to set'
                                    });

                                    return;
                                }

                                for (let i = 0; i < b.length; ++i) {
                                    let currentMsg = b[i]
                                    if (currentMsg.author.username.indexOf('Majel') > -1) {
                                        stats = JSON.parse(currentMsg.content)

                                        let key = args[0]

                                        if (key === 'all') {
                                            msg = '**All Variables**'

                                            for (let vk in stats) {
                                                msg += '\n**' + vk + '**: ' + stats[vk]
                                            }

                                            bot.sendMessage({
                                                to: channelID,
                                                message: msg
                                            });

                                            return;
                                        }
        
                                        if (!stats[key]) {
                                            stats[key] = ''
                                        }
        
                                        args.splice(0, 1)
        
                                        if (args.length > 0) {
                                            stats[key] = args.join(' ')
                                        }
        
                                        bot.sendMessage({
                                            to: channelID,
                                            message: '**' + key + '**: ' + stats[key]
                                        });
        
                                        // 'store' the data in the message
                                        bot.editMessage({
                                            channelID: bot.channels[k].id,
                                            messageID: b[0].id,
                                            message: JSON.stringify(stats)
                                        })

                                        return;
                                    }
                                }
                            })
                        }
                    }
                break;
            }
        }

        bot.sendMessage({
            to: channelID,
            message: msg
        });
    } catch (error) {
        bot.sendMessage({
            to: channelID,
            message: "Error trying to handle: " + message + '\n' + error
        });
    }
});
