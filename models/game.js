var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
    identity: 'game',
    connection: 'disk',
    attributes: {
        date: {
            type: 'date',
            defaultsTo: function () { return new Date(); }
        },
        rsidewin:{
            type: 'boolean',
            defaultsTo: 'true'
        },
        
        redTeam:{
          type: 'string'
        },
        blueTeam:{
          type: 'string'
        },
        
        blue1:{
            type: 'string'
        },
        blue2:{
            type: 'string'
        },
        blue3:{
            type: 'string'
        },
        blue4:{
            type: 'string'
        },
        blue5:{
            type: 'string'
        },
        
        red1:{
            type: 'string'
        },
        red2:{
            type: 'string'
        },
        red3:{
            type: 'string'
        },
        red4:{
            type: 'string'
        },
        red5:{
            type: 'string'
        },
        
        rside: 'string',
        bside: 'string',
        
        user: {
            model: 'user'
        }
    }
});