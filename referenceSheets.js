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

var fs = require('fs')

// babble
var actions = [];
var descriptors = [];
var sources = [];
var effects = [];
var devices = [];

module.exports = {
    loadReferenceSheets: function() {
        // babble
        var fileContent = fs.readFileSync('./data/babble.csv', {encoding: 'utf8'});
        var rows = fileContent.split('\r\n');
        for (let i = 0; i < rows.length; ++i) {
            let columns = rows[i].split(', ');
            actions[actions.length] = columns[0];
            descriptors[descriptors.length] = columns[1];
            sources[sources.length] = columns[2];
            effects[effects.length] = columns[3];
            devices[devices.length] = columns[4];
        }

        this.pcMinorActions = JSON.parse(fs.readFileSync('./data/pcMinorActions.json', {encoding: 'utf8'}));
        this.pcActions = JSON.parse(fs.readFileSync('./data/pcActions.json', {encoding: 'utf8'}));
        this.pcAttackProperties = fs.readFileSync('./data/pcAttackProperties.txt', {encoding: 'utf8'});

        this.pcMinorActionsAll = '**PC MINOR ACTIONS**'
        for (let key in this.pcMinorActions) {
            this.pcMinorActionsAll += '\n**' + key + '** - ' + this.pcMinorActions[key]
        }

        this.pcActionsAll = '**PC ACTIONS**'
        for (let key in this.pcActions) {
            this.pcActionsAll += '\n**' + key + '** - ' + this.pcActions[key]
        }

        this.determination = JSON.parse(fs.readFileSync('./data/determination.json', {encoding: 'utf8'}));
        this.determinationAll = '**DETERMINATION SPENDS**';
        for (let key in this.determination) {
            this.determinationAll += '\n**' + key + '** - ' + this.determination[key];
        }

        this.shipMinorActions = JSON.parse(fs.readFileSync('./data/shipMinorActions.json', {encoding: 'utf8'}));
        this.shipActions = JSON.parse(fs.readFileSync('./data/shipActions.json', {encoding: 'utf8'}));
        this.shipActionsAll = fs.readFileSync('./data/shipActions.txt', {encoding: 'utf8'});
        this.shipAttackProperties = fs.readFileSync('./data/shipAttackProperties.txt', {encoding: 'utf8'});

        this.shipMinorActionsAll = '**SHIP MINOR ACTIONS**';
        for (let key in this.shipMinorActions) {
            this.shipMinorActionsAll += '\n**' + key + '** - ' + this.shipMinorActions[key];
        }
    },

    generateTechnobabble: function() {
        let action = actions[Math.floor(Math.random() * actions.length)];
        let descriptor = descriptors[Math.floor(Math.random() * descriptors.length)];
        let source = sources[Math.floor(Math.random() * sources.length)];
        let effect = effects[Math.floor(Math.random() * effects.length)];
        let device = devices[Math.floor(Math.random() * devices.length)];

        return 'Babble: [Action] [Descriptor] [Source] [Effect] [Device]\n'
            + action + ' ' + descriptor + ' ' + source + ' ' + effect + ' ' + device
    }
}
