const mqtt = require('async-mqtt');

module.exports = {
    mqttFun : async()=>{
        return new Promise(resolve=>{
            let client  = mqtt.connect('http://broker.mqtt-dashboard.com/');
            
            client.on('connect', function () {
            client.subscribe('FA-0/Water', function (err) {
            if (!err) {
                client.publish('FA-0/Water', 'Hello mqtt')
                    }
            })
        })
            client.on('message', function (topic, message,packet) {
            // message is Buffer
            //console.log(message.toString());
            resolve(message.toString());
        })
        //resolve();


    });
}}