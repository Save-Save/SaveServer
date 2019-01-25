const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');//개행문자를 위한 npm
const Delimiter = require('@serialport/parser-delimiter');
const Usage = require('./usage');

module.exports = {
//resolve는 왜 파서.on 밖에 나가면 적용이 안될까?
//resolve를 안에 넣으면 딱 한 개에 대해서만 적용가능...end를 이용하면 될거 같은데..
    serial : async ()=>{
        return new Promise(resolve=>{
            let parser = new Readline({ delimiter: '\r\n' });
            let tempArr = new Array();
            let result;
            let serialPort = new SerialPort('/dev/tty.usbmodem141101');
            serialPort.on('open',function(){

            console.log('port open. Data rate: ');
            serialPort.pipe(parser)});
            parser.on('data', function(data){
                //tempArr.push(data);
                resolve(data);
                });
            //parser.on('end',function(){
            //    resolve(tempArr);
            //});
                
            });
        }
    }