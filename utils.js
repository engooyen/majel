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
var species = fs.readFileSync('./data/species.json', {encoding: 'utf8'})

module.exports = {
    /**
    * Shuffles elements of an array and returns the shuffled array.
    * @param a The array to shuffle.
    * @return The shuffled array.
    */
    shuffle: function (a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }

        return a;
    },
    
    /**
    * Finds the attribute in a map and returns the modifier value. If the
    * attribute doesn't exist, 0 is returned.
    * @param name The name of the attribute.
    * @param attributes The key value map of attributes to modifier value.
    * @return The attribute modifier.
    */
    findAttribute: function(name, attributes) {
        return attributes[name] || 0;
    },

    /**
    * Generates a random support character.
    * @return The generated support character as a string.
    */
    generateSupportCharacter: function() {
        species = shuffle(species);
        let race = species[0];
        let gender = shuffle(['Female', 'Male'])[0];
        let firstName = shuffle(race[gender])[0];
        let lastName = shuffle(race['Family'])[0];

        let attributePool = shuffle([10, 10, 9, 9, 8, 7]);
        let attributes = [
            'Control (' + (attributePool[0] + findAttribute('Control', race.AttributeBonus)) + ')',
            'Fitness (' + (attributePool[1] + findAttribute('Fitness', race.AttributeBonus)) + ')',
            'Presence (' + (attributePool[2] + findAttribute('Presence', race.AttributeBonus)) + ')',
            'Daring (' + (attributePool[3] + findAttribute('Daring', race.AttributeBonus)) + ')',
            'Insight (' + (attributePool[4] + findAttribute('Insight', race.AttributeBonus)) + ')',
            'Reason (' + (attributePool[5] + findAttribute('Reason', race.AttributeBonus)) + ')'
        ];

        let disciplinePool = shuffle([4, 3, 2, 2, 1, 1]);
        let disciplines = [
            'Command (' + disciplinePool[0] + ')',
            'Conn (' + disciplinePool[1] + ')',
            'Security (' + disciplinePool[2] + ')',
            'Engineering (' + disciplinePool[3] + ')',
            'Science (' + disciplinePool[4] + ')',
            'Medicine (' + disciplinePool[5] + ')'
        ]

        let talent = shuffle(race.Talents)[0];

        return  'Name: ' + firstName + ' ' + lastName + '\n'
            + 'Race: ' + race.Name + ' ' + gender + '\n'
            + 'Attributes: ' + attributes.join(', ') + '\n'
            + 'Disciplines: ' + disciplines.join(', ') + '\n'
            + 'Talents: ' + talent;
    },

    enumerateDictionary: function(d, delimiter) {
        let str = ''
        for (let key in d) {
            if (str) {
                str += delimiter
            }
    
            str += '**' + key + '**: ' + d[key]
        }
    
        return str
    }
}