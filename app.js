var amqp = require('amqplib/callback_api');
const mqtt = require("mqtt");
var myEvents = require('events');
const Schema = require('./dataATG_pb');

var eventsEmitter = new myEvents.EventEmitter();

//#region MQTT setting and function
var mqttSetting ={
    mqttServerUrl: "dev.seltec.io",
    port: 1889,
    topic : "v1/devices/me/telemetry",
};
var mqttOptions = {
    clientId: "mqttjs01",
    username: "accessTokenDevice",
    password:"",
    clean: true,
};

var options = {
  retain: true,
  qos: 1
};

//Access Token:
var accessTokenArray = {
  xe51G08469: "DV-01", xe51H19523: "DV-02",
  xe51G08786: "DV-03", xe61C20308: "DV-04",
  xe61B02367: "DV-05", xe61C35326: "DV-06",
  xe86c03087: "DV-07", xe86c03222: "DV-08",
  xe86c02954: "DV-09", xe86c03484: "DV-10",
  xe51B24193: "DV-11", xe51B22792: "DV-12",
};

//#endregion

var previousTime51G08469;
var previousTime51H19523;
var previousTime51G08786;
var previousTime61C20308;
var previousTime61B02367;
var previousTime61C35326;
var previousTime86c03087;
var previousTime86c03222;
var previousTime86c02954;
var previousTime86c03484;
var previousTime51B24193;
var previousTime51B22792;

//#region  VARIABLES
var triggerMqtt = true;
var dataObject = { 
    id: "NaN-",
    vehicleNumberPlate: null, 
    latitude: null, longitude: null, 
    coordinate: "",
    speed: null,
    driver: "",
    altitude: null,
    heading: null,
    ignition: null,
    door: null,
    aircon: null,
    maxValidSpeed: 40.3,
    vss: 15.5,
    location: "",
    timestamp: "",
    brokerRecieveTime: null,

};
//#endregion

//#region  DEFINE FUNCTIONS
function mqttABC(interval){
    if(dataObject.id == "51G08469"){
      mqttOptions.username = accessTokenArray["xe51G08469"];
    }
    else if(dataObject.id == "51H19523"){
      mqttOptions.username = accessTokenArray.xe51H19523;
    }
    else if(dataObject.id == "51G08786"){
      mqttOptions.username = accessTokenArray.xe51G08786;
    }
    else if(dataObject.id == "61C20308"){
      mqttOptions.username = accessTokenArray.xe61C20308;
    }
    else if(dataObject.id == "61B02367"){
      mqttOptions.username = accessTokenArray.xe61B02367;
    }
    else if(dataObject.id == "61C35326"){
      mqttOptions.username = accessTokenArray.xe61C35326;
    }
    else if(dataObject.id == "86c03087"){
      mqttOptions.username = accessTokenArray.xe86c03087;
    }
    else if(dataObject.id == "86c03222"){
      mqttOptions.username = accessTokenArray.xe86c03222;
    }
    else if(dataObject.id == "86c02954"){
      mqttOptions.username = accessTokenArray.xe86c02954;
    }
    else if(dataObject.id == "86c03484"){
      mqttOptions.username = accessTokenArray.xe86c03484;
    }
    else if(dataObject.id == "51B24193"){
      mqttOptions.username = accessTokenArray.xe51B24193;
    }
    else if(dataObject.id == "51B22792"){
      mqttOptions.username = accessTokenArray.xe51B22792;
    }
    var mqttClient = mqtt.connect("mqtt://" + mqttSetting.mqttServerUrl + ":" + mqttSetting["port"], mqttOptions );
    mqttClient.on('connect', function () {

      var mssg = JSON.stringify(dataObject);
      mqttClient.publish(mqttSetting.topic, mssg, options);

      mqttClient.end(); //Disconnect MQTT
      // if(mqttClient.disconnected == true){
      //   console.log('MQTT disconnected!'); //If MQTT disconnect => Notice to console
      // }
      clearInterval(interval);
  });


  }
  function assignData(id){
    dataObject["id"] = id;
    dataObject = {
      vehicleNumberPlate: (decodeData.array[99][0] == null) || (decodeData.array[99][0] == NaN)? "NaN-": Number(decodeData.array[99][0]),
      latitude: (decodeData.array[99][5] == null) || (decodeData.array[99][5] == NaN)? "NaN-": Number(decodeData.array[99][5]),
      longitude: (decodeData.array[99][4] == null) || (decodeData.array[99][4] == NaN)? "NaN-":Number(decodeData.array[99][4]),
      coordinate: `[${decodeData.array[99][4]},${decodeData.array[99][5]}]`,
      speed: (decodeData.array[99][2] == null) || (decodeData.array[99][2] == NaN)? "NaN-": Number(decodeData.array[99][2]),
      driver: (decodeData.array[99][1] == null) || (decodeData.array[99][1] == NaN)? "NaN-": Number(decodeData.array[99][1]),
      altitude: (decodeData.array[99][6] == null) || (decodeData.array[99][6] == NaN)? "NaN-": Number(decodeData.array[99][6]),
      heading: (decodeData.array[99][7] == null) || (decodeData.array[99][7] == NaN)? "NaN-": Number(decodeData.array[99][7]),
      ignition: (decodeData.array[99][8] == null) || (decodeData.array[99][8] == NaN)? "NaN-": Boolean(decodeData.array[99][8]),
      door: (decodeData.array[99][9] == null) || (decodeData.array[99][9] == NaN)? "NaN-": Boolean(decodeData.array[99][9]),
      aircon: (decodeData.array[99][10] == null) || (decodeData.array[99][10] == NaN)? "NaN-": Boolean(decodeData.array[99][10]),
      maxValidSpeed: (decodeData.array[99][11] == null) || (decodeData.array[99][11] == NaN)? "NaN-": Number(decodeData.array[99][11]),
      vss: (decodeData.array[99][12] == null) || (decodeData.array[99][12] == NaN)? "NaN-": Number(decodeData.array[99][12]),
      location: (decodeData.array[99][13] == null) || (decodeData.array[99][13] == NaN)|| (decodeData.array[99][13] == "")? "NaN-": decodeData.array[99][13],
      timestamp: Number(decodeData.array[99][3]),
  }
  }

  //Convert timestamp to date
    //Convert timestamp
    function convertTimestampToDatetime(timestamp){
      var dateT = new Date(timestamp);
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var year = dateT.getFullYear();
      var month = months[dateT.getMonth()];
      var date = dateT.getDate();
      var hour = dateT.getHours();
      var min = dateT.getMinutes();
      var sec = dateT.getSeconds();
      var milisec = dateT.getMilliseconds();
      var time = date + '/' + month + '/' + year + ' ' + hour + ':' + min + ':' + sec + ':' + milisec ;
      return time;
  }
  

//Create two async function proccess get and push data from Rabbit to Things
async function pushToThingsTask(condition) {
    return await new Promise(resolve => {
      const interval = setInterval(() => {
        if (condition) {
          clearInterval(interval);
          resolve('fooo');
        };
        triggerMqtt = true; 
        //console.log(`Trigger MQTT: ${triggerMqtt}`);
        mqttABC(interval);
      }, 500);
      resolve('Have been resolve!');
    });
  }
//Function connect and read message from QUEUE
async function getFromRabbitTask(condition) {
    return await new Promise(resolve => {
      const interval = setInterval(() => {
        if (condition) {
          resolve('foo');
          clearInterval(interval);
        };
        try{
          amqp.connect('amqp://demoATGuser:Blackberry@clouddev.seltec.io:5672//vhost',(connectError, connection)=>{
            if(connectError)
            {   
                throw connectError;
            }
            connection.createChannel(function(errorChannel, channel){
                if(errorChannel)
                {
                  throw errorChannel;
                }
                var queue = "vhostTempHumiqueue";
                channel.assertQueue(queue,{durable: true});
                channel.prefetch(10);

                //Read MESSAGE FROM QUEUE-------------------------------------------------
                //#region READ MESSAGE FROM QUEUE

                //Set up a consumer with a callback to be invoked with each message.
                channel.consume(queue,(msg)=>{

                    //Decode Data
                    var buffer = msg.content;
                    var byteToDecode = new Uint8Array(buffer);
                    var decodeData = Schema.BaseMessage.deserializeBinary(byteToDecode);
                    console.log(decodeData.array[99][0]);
                    if(decodeData.array[99][0] == "51G08469"){
                        dataObject = {
                          id: "51G08469",
                          vehicleNumberPlate: (decodeData.array[99][0] == null) || (decodeData.array[99][0] == NaN)? "NaN-": Number(decodeData.array[99][0]),
                          driver: (decodeData.array[99][1] == null) || (decodeData.array[99][1] == NaN)? "NaN-": Number(decodeData.array[99][1]),
                          speed: (decodeData.array[99][2] == null) || (decodeData.array[99][2] == NaN)? "NaN-": Number(decodeData.array[99][2]),
                          timestamp: decodeData.array[99][3],
                          longitude: (decodeData.array[99][4] == null) || (decodeData.array[99][4] == NaN)? "NaN-":Number(decodeData.array[99][4]),
                          latitude: (decodeData.array[99][5] == null) || (decodeData.array[99][5] == NaN)? "NaN-": Number(decodeData.array[99][5]),
                          altitude: (decodeData.array[99][6] == null) || (decodeData.array[99][6] == NaN)? "NaN-": Number(decodeData.array[99][6]),
                          heading: (decodeData.array[99][7] == null) || (decodeData.array[99][7] == NaN)? "NaN-": Number(decodeData.array[99][7]),
                          ignition: (decodeData.array[99][8] == null) || (decodeData.array[99][8] == NaN)? "NaN-": Boolean(decodeData.array[99][8]),
                          door: (decodeData.array[99][9] == null) || (decodeData.array[99][9] == NaN)? "NaN-": Boolean(decodeData.array[99][9]),
                          aircon: (decodeData.array[99][10] == null) || (decodeData.array[99][10] == NaN)? "NaN-": Boolean(decodeData.array[99][10]),
                          maxValidSpeed: (decodeData.array[99][11] == null) || (decodeData.array[99][11] == NaN)? "NaN-": Number(decodeData.array[99][11]),
                          vss: (decodeData.array[99][12] == null) || (decodeData.array[99][12] == NaN)? "NaN-": Number(decodeData.array[99][12]),
                          location: (decodeData.array[99][13] == null) || (decodeData.array[99][13] == NaN)|| (decodeData.array[99][13] == "")? "NaN-": decodeData.array[99][13],
                          coordinate: `[${decodeData.array[99][4]},${decodeData.array[99][5]}]`,
                          brokerRecieveTime: Date.now(),
                      }
                        if(previousTime51G08469 != decodeData.array[99][3])
                        {
                            var sendTime = (decodeData.array[99][3])*1000;
                            var receiveTime = dataObject.brokerRecieveTime;
                            triggerMqtt = false; //
                            eventsEmitter.emit('mqttEvent');
                            
                            console.log("RECEIVE MESSAGE: " + convertTimestampToDatetime(sendTime) +" ; " + convertTimestampToDatetime(receiveTime) +" ; " + Math.abs((receiveTime - sendTime)).toString()   + " ; " + "["+ decodeData.array[99] + "]");
                        }
                        previousTime51G08469 = decodeData.array[99][3];
                    }
                    else if(decodeData.array[99][0] == "51H19523")
                    {
                        dataObject = {
                          id: "51H19523",
                          vehicleNumberPlate: (decodeData.array[99][0] == null) || (decodeData.array[99][0] == NaN)? "NaN-": Number(decodeData.array[99][0]),
                          driver: (decodeData.array[99][1] == null) || (decodeData.array[99][1] == NaN)? "NaN-": Number(decodeData.array[99][1]),
                          speed: (decodeData.array[99][2] == null) || (decodeData.array[99][2] == NaN)? "NaN-": Number(decodeData.array[99][2]),
                          timestamp: decodeData.array[99][3],
                          longitude: (decodeData.array[99][4] == null) || (decodeData.array[99][4] == NaN)? "NaN-":Number(decodeData.array[99][4]),
                          latitude: (decodeData.array[99][5] == null) || (decodeData.array[99][5] == NaN)? "NaN-": Number(decodeData.array[99][5]),
                          altitude: (decodeData.array[99][6] == null) || (decodeData.array[99][6] == NaN)? "NaN-": Number(decodeData.array[99][6]),
                          heading: (decodeData.array[99][7] == null) || (decodeData.array[99][7] == NaN)? "NaN-": Number(decodeData.array[99][7]),
                          ignition: (decodeData.array[99][8] == null) || (decodeData.array[99][8] == NaN)? "NaN-": Boolean(decodeData.array[99][8]),
                          door: (decodeData.array[99][9] == null) || (decodeData.array[99][9] == NaN)? "NaN-": Boolean(decodeData.array[99][9]),
                          aircon: (decodeData.array[99][10] == null) || (decodeData.array[99][10] == NaN)? "NaN-": Boolean(decodeData.array[99][10]),
                          maxValidSpeed: (decodeData.array[99][11] == null) || (decodeData.array[99][11] == NaN)? "NaN-": Number(decodeData.array[99][11]),
                          vss: (decodeData.array[99][12] == null) || (decodeData.array[99][12] == NaN)? "NaN-": Number(decodeData.array[99][12]),
                          location: (decodeData.array[99][13] == null) || (decodeData.array[99][13] == NaN)|| (decodeData.array[99][13] == "")? "NaN-": decodeData.array[99][13],
                          coordinate: `[${decodeData.array[99][4]},${decodeData.array[99][5]}]`,
                          brokerRecieveTime: Date.now(),
                      }
                        if(previousTime51H19523 != decodeData.array[99][3])
                        {
                            var sendTime = (decodeData.array[99][3])*1000;
                            var receiveTime = dataObject.brokerRecieveTime;
                            dataObject.brokerRecieveTime = receiveTime;//Add time to data that rabbitqm broker recieve message from sender
                            triggerMqtt = false; //
                            eventsEmitter.emit('mqttEvent');
                            
                            console.log("RECEIVE MESSAGE: " + convertTimestampToDatetime(sendTime) +" ; " + convertTimestampToDatetime(receiveTime) +" ; " + Math.abs((receiveTime - sendTime)).toString()   + " ; " + "["+ decodeData.array[99] + "]");
                        }
                        previousTime51H19523 = decodeData.array[99][3];
                    }
                    else if(decodeData.array[99][0] == "51G08786"){
                      
                        dataObject = {
                          id: "51G08786",
                          vehicleNumberPlate: (decodeData.array[99][0] == null) || (decodeData.array[99][0] == NaN)? "NaN-": Number(decodeData.array[99][0]),
                          driver: (decodeData.array[99][1] == null) || (decodeData.array[99][1] == NaN)? "NaN-": Number(decodeData.array[99][1]),
                          speed: (decodeData.array[99][2] == null) || (decodeData.array[99][2] == NaN)? "NaN-": Number(decodeData.array[99][2]),
                          timestamp: decodeData.array[99][3],
                          longitude: (decodeData.array[99][4] == null) || (decodeData.array[99][4] == NaN)? "NaN-":Number(decodeData.array[99][4]),
                          latitude: (decodeData.array[99][5] == null) || (decodeData.array[99][5] == NaN)? "NaN-": Number(decodeData.array[99][5]),
                          altitude: (decodeData.array[99][6] == null) || (decodeData.array[99][6] == NaN)? "NaN-": Number(decodeData.array[99][6]),
                          heading: (decodeData.array[99][7] == null) || (decodeData.array[99][7] == NaN)? "NaN-": Number(decodeData.array[99][7]),
                          ignition: (decodeData.array[99][8] == null) || (decodeData.array[99][8] == NaN)? "NaN-": Boolean(decodeData.array[99][8]),
                          door: (decodeData.array[99][9] == null) || (decodeData.array[99][9] == NaN)? "NaN-": Boolean(decodeData.array[99][9]),
                          aircon: (decodeData.array[99][10] == null) || (decodeData.array[99][10] == NaN)? "NaN-": Boolean(decodeData.array[99][10]),
                          maxValidSpeed: (decodeData.array[99][11] == null) || (decodeData.array[99][11] == NaN)? "NaN-": Number(decodeData.array[99][11]),
                          vss: (decodeData.array[99][12] == null) || (decodeData.array[99][12] == NaN)? "NaN-": Number(decodeData.array[99][12]),
                          location: (decodeData.array[99][13] == null) || (decodeData.array[99][13] == NaN)|| (decodeData.array[99][13] == "")? "NaN-": decodeData.array[99][13],
                          coordinate: `[${decodeData.array[99][4]},${decodeData.array[99][5]}]`,
                          brokerRecieveTime: Date.now(),
                      }
                        if(previousTime51G08786 != decodeData.array[99][3])
                        {
                            var sendTime = (decodeData.array[99][3])*1000;
                            var receiveTime = dataObject.brokerRecieveTime;
                            dataObject.brokerRecieveTime = receiveTime;//Add time to data that rabbitqm broker recieve message from sender
                            triggerMqtt = false; //
                            eventsEmitter.emit('mqttEvent');
                            
                            console.log("RECEIVE MESSAGE: " + convertTimestampToDatetime(sendTime) +" ; " + convertTimestampToDatetime(receiveTime) +" ; " + Math.abs((receiveTime - sendTime)).toString()   + " ; " + "["+ decodeData.array[99] + "]");
                        }
                        previousTime51G08786 = decodeData.array[99][3];
                        
                    }
                    else if(decodeData.array[99][0] == "61C20308"){
                      
                        dataObject = {
                          id: "61C20308",
                          vehicleNumberPlate: (decodeData.array[99][0] == null) || (decodeData.array[99][0] == NaN)? "NaN-": Number(decodeData.array[99][0]),
                          driver: (decodeData.array[99][1] == null) || (decodeData.array[99][1] == NaN)? "NaN-": Number(decodeData.array[99][1]),
                          speed: (decodeData.array[99][2] == null) || (decodeData.array[99][2] == NaN)? "NaN-": Number(decodeData.array[99][2]),
                          timestamp: decodeData.array[99][3],
                          longitude: (decodeData.array[99][4] == null) || (decodeData.array[99][4] == NaN)? "NaN-":Number(decodeData.array[99][4]),
                          latitude: (decodeData.array[99][5] == null) || (decodeData.array[99][5] == NaN)? "NaN-": Number(decodeData.array[99][5]),
                          altitude: (decodeData.array[99][6] == null) || (decodeData.array[99][6] == NaN)? "NaN-": Number(decodeData.array[99][6]),
                          heading: (decodeData.array[99][7] == null) || (decodeData.array[99][7] == NaN)? "NaN-": Number(decodeData.array[99][7]),
                          ignition: (decodeData.array[99][8] == null) || (decodeData.array[99][8] == NaN)? "NaN-": Boolean(decodeData.array[99][8]),
                          door: (decodeData.array[99][9] == null) || (decodeData.array[99][9] == NaN)? "NaN-": Boolean(decodeData.array[99][9]),
                          aircon: (decodeData.array[99][10] == null) || (decodeData.array[99][10] == NaN)? "NaN-": Boolean(decodeData.array[99][10]),
                          maxValidSpeed: (decodeData.array[99][11] == null) || (decodeData.array[99][11] == NaN)? "NaN-": Number(decodeData.array[99][11]),
                          vss: (decodeData.array[99][12] == null) || (decodeData.array[99][12] == NaN)? "NaN-": Number(decodeData.array[99][12]),
                          location: (decodeData.array[99][13] == null) || (decodeData.array[99][13] == NaN)|| (decodeData.array[99][13] == "")? "NaN-": decodeData.array[99][13],
                          coordinate: `[${decodeData.array[99][4]},${decodeData.array[99][5]}]`,
                          brokerRecieveTime: Date.now(),
                      }
                        if(previousTime61C20308 != decodeData.array[99][3])
                        {
                            var sendTime = (decodeData.array[99][3])*1000;
                            var receiveTime = dataObject.brokerRecieveTime;
                            dataObject.brokerRecieveTime = receiveTime;//Add time to data that rabbitqm broker recieve message from sender
                            triggerMqtt = false; //
                            eventsEmitter.emit('mqttEvent');
                            
                            console.log("RECEIVE MESSAGE: " + convertTimestampToDatetime(sendTime) +" ; " + convertTimestampToDatetime(receiveTime) +" ; " + Math.abs((receiveTime - sendTime)).toString()   + " ; " + "["+ decodeData.array[99] + "]");
                        }
                        previousTime61C20308 = decodeData.array[99][3];
                      
                    }
                    else if(decodeData.array[99][0] == "61B02367"){
                      
                      dataObject = {
                        id: "61B02367",
                        vehicleNumberPlate: (decodeData.array[99][0] == null) || (decodeData.array[99][0] == NaN)? "NaN-": Number(decodeData.array[99][0]),
                        driver: (decodeData.array[99][1] == null) || (decodeData.array[99][1] == NaN)? "NaN-": Number(decodeData.array[99][1]),
                        speed: (decodeData.array[99][2] == null) || (decodeData.array[99][2] == NaN)? "NaN-": Number(decodeData.array[99][2]),
                        timestamp: decodeData.array[99][3],
                        longitude: (decodeData.array[99][4] == null) || (decodeData.array[99][4] == NaN)? "NaN-":Number(decodeData.array[99][4]),
                        latitude: (decodeData.array[99][5] == null) || (decodeData.array[99][5] == NaN)? "NaN-": Number(decodeData.array[99][5]),
                        altitude: (decodeData.array[99][6] == null) || (decodeData.array[99][6] == NaN)? "NaN-": Number(decodeData.array[99][6]),
                        heading: (decodeData.array[99][7] == null) || (decodeData.array[99][7] == NaN)? "NaN-": Number(decodeData.array[99][7]),
                        ignition: (decodeData.array[99][8] == null) || (decodeData.array[99][8] == NaN)? "NaN-": Boolean(decodeData.array[99][8]),
                        door: (decodeData.array[99][9] == null) || (decodeData.array[99][9] == NaN)? "NaN-": Boolean(decodeData.array[99][9]),
                        aircon: (decodeData.array[99][10] == null) || (decodeData.array[99][10] == NaN)? "NaN-": Boolean(decodeData.array[99][10]),
                        maxValidSpeed: (decodeData.array[99][11] == null) || (decodeData.array[99][11] == NaN)? "NaN-": Number(decodeData.array[99][11]),
                        vss: (decodeData.array[99][12] == null) || (decodeData.array[99][12] == NaN)? "NaN-": Number(decodeData.array[99][12]),
                        location: (decodeData.array[99][13] == null) || (decodeData.array[99][13] == NaN)|| (decodeData.array[99][13] == "")? "NaN-": decodeData.array[99][13],
                        coordinate: `[${decodeData.array[99][4]},${decodeData.array[99][5]}]`,
                        brokerRecieveTime: Date.now(),
                    }
                      if(previousTime61B02367 != decodeData.array[99][3])
                      {
                          var sendTime = (decodeData.array[99][3])*1000;
                          var receiveTime = dataObject.brokerRecieveTime;
                          dataObject.brokerRecieveTime = receiveTime;//Add time to data that rabbitqm broker recieve message from sender
                          triggerMqtt = false; //
                          eventsEmitter.emit('mqttEvent');
                          
                          console.log("RECEIVE MESSAGE: " + convertTimestampToDatetime(sendTime) +" ; " + convertTimestampToDatetime(receiveTime) +" ; " + Math.abs((receiveTime - sendTime)).toString()   + " ; " + "["+ decodeData.array[99] + "]");
                      }
                      previousTime61B02367 = decodeData.array[99][3];
                    }
                    else if(decodeData.array[99][0] == "61C35326"){
                      
                      dataObject = {
                        id: "61C35326",
                        vehicleNumberPlate: (decodeData.array[99][0] == null) || (decodeData.array[99][0] == NaN)? "NaN-": Number(decodeData.array[99][0]),
                        driver: (decodeData.array[99][1] == null) || (decodeData.array[99][1] == NaN)? "NaN-": Number(decodeData.array[99][1]),
                        speed: (decodeData.array[99][2] == null) || (decodeData.array[99][2] == NaN)? "NaN-": Number(decodeData.array[99][2]),
                        timestamp: decodeData.array[99][3],
                        longitude: (decodeData.array[99][4] == null) || (decodeData.array[99][4] == NaN)? "NaN-":Number(decodeData.array[99][4]),
                        latitude: (decodeData.array[99][5] == null) || (decodeData.array[99][5] == NaN)? "NaN-": Number(decodeData.array[99][5]),
                        altitude: (decodeData.array[99][6] == null) || (decodeData.array[99][6] == NaN)? "NaN-": Number(decodeData.array[99][6]),
                        heading: (decodeData.array[99][7] == null) || (decodeData.array[99][7] == NaN)? "NaN-": Number(decodeData.array[99][7]),
                        ignition: (decodeData.array[99][8] == null) || (decodeData.array[99][8] == NaN)? "NaN-": Boolean(decodeData.array[99][8]),
                        door: (decodeData.array[99][9] == null) || (decodeData.array[99][9] == NaN)? "NaN-": Boolean(decodeData.array[99][9]),
                        aircon: (decodeData.array[99][10] == null) || (decodeData.array[99][10] == NaN)? "NaN-": Boolean(decodeData.array[99][10]),
                        maxValidSpeed: (decodeData.array[99][11] == null) || (decodeData.array[99][11] == NaN)? "NaN-": Number(decodeData.array[99][11]),
                        vss: (decodeData.array[99][12] == null) || (decodeData.array[99][12] == NaN)? "NaN-": Number(decodeData.array[99][12]),
                        location: (decodeData.array[99][13] == null) || (decodeData.array[99][13] == NaN)|| (decodeData.array[99][13] == "")? "NaN-": decodeData.array[99][13],
                        coordinate: `[${decodeData.array[99][4]},${decodeData.array[99][5]}]`,
                        brokerRecieveTime: Date.now(),
                    }
                      if(previousTime61C35326 != decodeData.array[99][3])
                      {
                          var sendTime = (decodeData.array[99][3])*1000;
                          var receiveTime = dataObject.brokerRecieveTime;
                          dataObject.brokerRecieveTime = receiveTime;//Add time to data that rabbitqm broker recieve message from sender
                          triggerMqtt = false; //
                          eventsEmitter.emit('mqttEvent');
                          
                          console.log("RECEIVE MESSAGE: " + convertTimestampToDatetime(sendTime) +" ; " + convertTimestampToDatetime(receiveTime) +" ; " + Math.abs((receiveTime - sendTime)).toString()   + " ; " + "["+ decodeData.array[99] + "]");
                      }
                      previousTime61C35326 = decodeData.array[99][3];
                    }
                    else if(decodeData.array[99][0] == "86c03087"){
                      
                        dataObject = {
                          id: "86c03087",
                          vehicleNumberPlate: (decodeData.array[99][0] == null) || (decodeData.array[99][0] == NaN)? "NaN-": Number(decodeData.array[99][0]),
                          driver: (decodeData.array[99][1] == null) || (decodeData.array[99][1] == NaN)? "NaN-": Number(decodeData.array[99][1]),
                          speed: (decodeData.array[99][2] == null) || (decodeData.array[99][2] == NaN)? "NaN-": Number(decodeData.array[99][2]),
                          timestamp: decodeData.array[99][3],
                          longitude: (decodeData.array[99][4] == null) || (decodeData.array[99][4] == NaN)? "NaN-":Number(decodeData.array[99][4]),
                          latitude: (decodeData.array[99][5] == null) || (decodeData.array[99][5] == NaN)? "NaN-": Number(decodeData.array[99][5]),
                          altitude: (decodeData.array[99][6] == null) || (decodeData.array[99][6] == NaN)? "NaN-": Number(decodeData.array[99][6]),
                          heading: (decodeData.array[99][7] == null) || (decodeData.array[99][7] == NaN)? "NaN-": Number(decodeData.array[99][7]),
                          ignition: (decodeData.array[99][8] == null) || (decodeData.array[99][8] == NaN)? "NaN-": Boolean(decodeData.array[99][8]),
                          door: (decodeData.array[99][9] == null) || (decodeData.array[99][9] == NaN)? "NaN-": Boolean(decodeData.array[99][9]),
                          aircon: (decodeData.array[99][10] == null) || (decodeData.array[99][10] == NaN)? "NaN-": Boolean(decodeData.array[99][10]),
                          maxValidSpeed: (decodeData.array[99][11] == null) || (decodeData.array[99][11] == NaN)? "NaN-": Number(decodeData.array[99][11]),
                          vss: (decodeData.array[99][12] == null) || (decodeData.array[99][12] == NaN)? "NaN-": Number(decodeData.array[99][12]),
                          location: (decodeData.array[99][13] == null) || (decodeData.array[99][13] == NaN)|| (decodeData.array[99][13] == "")? "NaN-": decodeData.array[99][13],
                          coordinate: `[${decodeData.array[99][4]},${decodeData.array[99][5]}]`,
                          brokerRecieveTime: Date.now(),
                      }
                        if(previousTime86c03087 != decodeData.array[99][3])
                        {
                            var sendTime = (decodeData.array[99][3])*1000;
                            var receiveTime = dataObject.brokerRecieveTime;
                            dataObject.brokerRecieveTime = receiveTime;//Add time to data that rabbitqm broker recieve message from sender
                            triggerMqtt = false; //
                            eventsEmitter.emit('mqttEvent');
                            
                            console.log("RECEIVE MESSAGE: " + convertTimestampToDatetime(sendTime) +" ; " + convertTimestampToDatetime(receiveTime) +" ; " + Math.abs((receiveTime - sendTime)).toString()   + " ; " + "["+ decodeData.array[99] + "]");
                        }
                        previousTime86c03087 = decodeData.array[99][3];
                      
                    }
                    else if(decodeData.array[99][0] == "86c03222"){
                      
                      dataObject = {
                        id: "86c03222",
                        vehicleNumberPlate: (decodeData.array[99][0] == null) || (decodeData.array[99][0] == NaN)? "NaN-": Number(decodeData.array[99][0]),
                        driver: (decodeData.array[99][1] == null) || (decodeData.array[99][1] == NaN)? "NaN-": Number(decodeData.array[99][1]),
                        speed: (decodeData.array[99][2] == null) || (decodeData.array[99][2] == NaN)? "NaN-": Number(decodeData.array[99][2]),
                        timestamp: decodeData.array[99][3],
                        longitude: (decodeData.array[99][4] == null) || (decodeData.array[99][4] == NaN)? "NaN-":Number(decodeData.array[99][4]),
                        latitude: (decodeData.array[99][5] == null) || (decodeData.array[99][5] == NaN)? "NaN-": Number(decodeData.array[99][5]),
                        altitude: (decodeData.array[99][6] == null) || (decodeData.array[99][6] == NaN)? "NaN-": Number(decodeData.array[99][6]),
                        heading: (decodeData.array[99][7] == null) || (decodeData.array[99][7] == NaN)? "NaN-": Number(decodeData.array[99][7]),
                        ignition: (decodeData.array[99][8] == null) || (decodeData.array[99][8] == NaN)? "NaN-": Boolean(decodeData.array[99][8]),
                        door: (decodeData.array[99][9] == null) || (decodeData.array[99][9] == NaN)? "NaN-": Boolean(decodeData.array[99][9]),
                        aircon: (decodeData.array[99][10] == null) || (decodeData.array[99][10] == NaN)? "NaN-": Boolean(decodeData.array[99][10]),
                        maxValidSpeed: (decodeData.array[99][11] == null) || (decodeData.array[99][11] == NaN)? "NaN-": Number(decodeData.array[99][11]),
                        vss: (decodeData.array[99][12] == null) || (decodeData.array[99][12] == NaN)? "NaN-": Number(decodeData.array[99][12]),
                        location: (decodeData.array[99][13] == null) || (decodeData.array[99][13] == NaN)|| (decodeData.array[99][13] == "")? "NaN-": decodeData.array[99][13],
                        coordinate: `[${decodeData.array[99][4]},${decodeData.array[99][5]}]`,
                        brokerRecieveTime: Date.now(),
                    }
                      if(previousTime86c03222 != decodeData.array[99][3])
                      {
                          var sendTime = (decodeData.array[99][3])*1000;
                          var receiveTime = dataObject.brokerRecieveTime;
                          dataObject.brokerRecieveTime = receiveTime;//Add time to data that rabbitqm broker recieve message from sender
                          triggerMqtt = false; //
                          eventsEmitter.emit('mqttEvent');
                          
                          console.log("RECEIVE MESSAGE: " + convertTimestampToDatetime(sendTime) +" ; " + convertTimestampToDatetime(receiveTime) +" ; " + Math.abs((receiveTime - sendTime)).toString()   + " ; " + "["+ decodeData.array[99] + "]");
                      }
                      previousTime86c03222 = decodeData.array[99][3];
                    }
                    else if(decodeData.array[99][0] == "86c02954"){
                      
                        dataObject = {
                          id: "86c02954",
                          vehicleNumberPlate: (decodeData.array[99][0] == null) || (decodeData.array[99][0] == NaN)? "NaN-": Number(decodeData.array[99][0]),
                          driver: (decodeData.array[99][1] == null) || (decodeData.array[99][1] == NaN)? "NaN-": Number(decodeData.array[99][1]),
                          speed: (decodeData.array[99][2] == null) || (decodeData.array[99][2] == NaN)? "NaN-": Number(decodeData.array[99][2]),
                          timestamp: decodeData.array[99][3],
                          longitude: (decodeData.array[99][4] == null) || (decodeData.array[99][4] == NaN)? "NaN-":Number(decodeData.array[99][4]),
                          latitude: (decodeData.array[99][5] == null) || (decodeData.array[99][5] == NaN)? "NaN-": Number(decodeData.array[99][5]),
                          altitude: (decodeData.array[99][6] == null) || (decodeData.array[99][6] == NaN)? "NaN-": Number(decodeData.array[99][6]),
                          heading: (decodeData.array[99][7] == null) || (decodeData.array[99][7] == NaN)? "NaN-": Number(decodeData.array[99][7]),
                          ignition: (decodeData.array[99][8] == null) || (decodeData.array[99][8] == NaN)? "NaN-": Boolean(decodeData.array[99][8]),
                          door: (decodeData.array[99][9] == null) || (decodeData.array[99][9] == NaN)? "NaN-": Boolean(decodeData.array[99][9]),
                          aircon: (decodeData.array[99][10] == null) || (decodeData.array[99][10] == NaN)? "NaN-": Boolean(decodeData.array[99][10]),
                          maxValidSpeed: (decodeData.array[99][11] == null) || (decodeData.array[99][11] == NaN)? "NaN-": Number(decodeData.array[99][11]),
                          vss: (decodeData.array[99][12] == null) || (decodeData.array[99][12] == NaN)? "NaN-": Number(decodeData.array[99][12]),
                          location: (decodeData.array[99][13] == null) || (decodeData.array[99][13] == NaN)|| (decodeData.array[99][13] == "")? "NaN-": decodeData.array[99][13],
                          coordinate: `[${decodeData.array[99][4]},${decodeData.array[99][5]}]`,
                          brokerRecieveTime: Date.now(),
                      }
                        if(previousTime86c02954 != decodeData.array[99][3])
                        {
                            var sendTime = (decodeData.array[99][3])*1000;
                            var receiveTime = dataObject.brokerRecieveTime;
                            dataObject.brokerRecieveTime = receiveTime;//Add time to data that rabbitqm broker recieve message from sender
                            triggerMqtt = false; //
                            eventsEmitter.emit('mqttEvent');
                            
                            console.log("RECEIVE MESSAGE: " + convertTimestampToDatetime(sendTime) +" ; " + convertTimestampToDatetime(receiveTime) +" ; " + Math.abs((receiveTime - sendTime)).toString()   + " ; " + "["+ decodeData.array[99] + "]");
                        }
                        previousTime86c02954 = decodeData.array[99][3];
                    }
                    else if(decodeData.array[99][0] == "86c03484"){
                     
                      dataObject = {
                        id: "86c03484",
                        vehicleNumberPlate: (decodeData.array[99][0] == null) || (decodeData.array[99][0] == NaN)? "NaN-": Number(decodeData.array[99][0]),
                        driver: (decodeData.array[99][1] == null) || (decodeData.array[99][1] == NaN)? "NaN-": Number(decodeData.array[99][1]),
                        speed: (decodeData.array[99][2] == null) || (decodeData.array[99][2] == NaN)? "NaN-": Number(decodeData.array[99][2]),
                        timestamp: decodeData.array[99][3],
                        longitude: (decodeData.array[99][4] == null) || (decodeData.array[99][4] == NaN)? "NaN-":Number(decodeData.array[99][4]),
                        latitude: (decodeData.array[99][5] == null) || (decodeData.array[99][5] == NaN)? "NaN-": Number(decodeData.array[99][5]),
                        altitude: (decodeData.array[99][6] == null) || (decodeData.array[99][6] == NaN)? "NaN-": Number(decodeData.array[99][6]),
                        heading: (decodeData.array[99][7] == null) || (decodeData.array[99][7] == NaN)? "NaN-": Number(decodeData.array[99][7]),
                        ignition: (decodeData.array[99][8] == null) || (decodeData.array[99][8] == NaN)? "NaN-": Boolean(decodeData.array[99][8]),
                        door: (decodeData.array[99][9] == null) || (decodeData.array[99][9] == NaN)? "NaN-": Boolean(decodeData.array[99][9]),
                        aircon: (decodeData.array[99][10] == null) || (decodeData.array[99][10] == NaN)? "NaN-": Boolean(decodeData.array[99][10]),
                        maxValidSpeed: (decodeData.array[99][11] == null) || (decodeData.array[99][11] == NaN)? "NaN-": Number(decodeData.array[99][11]),
                        vss: (decodeData.array[99][12] == null) || (decodeData.array[99][12] == NaN)? "NaN-": Number(decodeData.array[99][12]),
                        location: (decodeData.array[99][13] == null) || (decodeData.array[99][13] == NaN)|| (decodeData.array[99][13] == "")? "NaN-": decodeData.array[99][13],
                        coordinate: `[${decodeData.array[99][4]},${decodeData.array[99][5]}]`,
                        brokerRecieveTime: Date.now(),
                    }
                      if(previousTime86c03484 != decodeData.array[99][3])
                      {
                          var sendTime = (decodeData.array[99][3])*1000;
                          var receiveTime = dataObject.brokerRecieveTime;
                          dataObject.brokerRecieveTime = receiveTime;//Add time to data that rabbitqm broker recieve message from sender
                          triggerMqtt = false; //
                          eventsEmitter.emit('mqttEvent');
                          
                          console.log("RECEIVE MESSAGE: " + convertTimestampToDatetime(sendTime) +" ; " + convertTimestampToDatetime(receiveTime) +" ; " + Math.abs((receiveTime - sendTime)).toString()   + " ; " + "["+ decodeData.array[99] + "]");
                      }
                      previousTime86c03484 = decodeData.array[99][3];
                    }
                    else if(decodeData.array[99][0] == "51B24193"){
                     
                      dataObject = {
                        id: "51B24193",
                        vehicleNumberPlate: (decodeData.array[99][0] == null) || (decodeData.array[99][0] == NaN)? "NaN-": Number(decodeData.array[99][0]),
                        driver: (decodeData.array[99][1] == null) || (decodeData.array[99][1] == NaN)? "NaN-": Number(decodeData.array[99][1]),
                        speed: (decodeData.array[99][2] == null) || (decodeData.array[99][2] == NaN)? "NaN-": Number(decodeData.array[99][2]),
                        timestamp: decodeData.array[99][3],
                        longitude: (decodeData.array[99][4] == null) || (decodeData.array[99][4] == NaN)? "NaN-":Number(decodeData.array[99][4]),
                        latitude: (decodeData.array[99][5] == null) || (decodeData.array[99][5] == NaN)? "NaN-": Number(decodeData.array[99][5]),
                        altitude: (decodeData.array[99][6] == null) || (decodeData.array[99][6] == NaN)? "NaN-": Number(decodeData.array[99][6]),
                        heading: (decodeData.array[99][7] == null) || (decodeData.array[99][7] == NaN)? "NaN-": Number(decodeData.array[99][7]),
                        ignition: (decodeData.array[99][8] == null) || (decodeData.array[99][8] == NaN)? "NaN-": Boolean(decodeData.array[99][8]),
                        door: (decodeData.array[99][9] == null) || (decodeData.array[99][9] == NaN)? "NaN-": Boolean(decodeData.array[99][9]),
                        aircon: (decodeData.array[99][10] == null) || (decodeData.array[99][10] == NaN)? "NaN-": Boolean(decodeData.array[99][10]),
                        maxValidSpeed: (decodeData.array[99][11] == null) || (decodeData.array[99][11] == NaN)? "NaN-": Number(decodeData.array[99][11]),
                        vss: (decodeData.array[99][12] == null) || (decodeData.array[99][12] == NaN)? "NaN-": Number(decodeData.array[99][12]),
                        location: (decodeData.array[99][13] == null) || (decodeData.array[99][13] == NaN)|| (decodeData.array[99][13] == "")? "NaN-": decodeData.array[99][13],
                        coordinate: `[${decodeData.array[99][4]},${decodeData.array[99][5]}]`,
                        brokerRecieveTime: Date.now(),
                    }
                      if(previousTime51B24193 != decodeData.array[99][3])
                      {
                          var sendTime = (decodeData.array[99][3])*1000;
                          var receiveTime = dataObject.brokerRecieveTime;
                          dataObject.brokerRecieveTime = receiveTime;//Add time to data that rabbitqm broker recieve message from sender
                          triggerMqtt = false; //
                          eventsEmitter.emit('mqttEvent');
                          
                          console.log("RECEIVE MESSAGE: " + convertTimestampToDatetime(sendTime) +" ; " + convertTimestampToDatetime(receiveTime) +" ; " + Math.abs((receiveTime - sendTime)).toString()   + " ; " + "["+ decodeData.array[99] + "]");
                      }
                      previousTime51B24193 = decodeData.array[99][3];
                    }
                    else if(decodeData.array[99][0] == "51B22792"){
                     
                      dataObject = {
                        id: "51B22792",
                        vehicleNumberPlate: (decodeData.array[99][0] == null) || (decodeData.array[99][0] == NaN)? "NaN-": Number(decodeData.array[99][0]),
                        driver: (decodeData.array[99][1] == null) || (decodeData.array[99][1] == NaN)? "NaN-": Number(decodeData.array[99][1]),
                        speed: (decodeData.array[99][2] == null) || (decodeData.array[99][2] == NaN)? "NaN-": Number(decodeData.array[99][2]),
                        timestamp: decodeData.array[99][3],
                        longitude: (decodeData.array[99][4] == null) || (decodeData.array[99][4] == NaN)? "NaN-":Number(decodeData.array[99][4]),
                        latitude: (decodeData.array[99][5] == null) || (decodeData.array[99][5] == NaN)? "NaN-": Number(decodeData.array[99][5]),
                        altitude: (decodeData.array[99][6] == null) || (decodeData.array[99][6] == NaN)? "NaN-": Number(decodeData.array[99][6]),
                        heading: (decodeData.array[99][7] == null) || (decodeData.array[99][7] == NaN)? "NaN-": Number(decodeData.array[99][7]),
                        ignition: (decodeData.array[99][8] == null) || (decodeData.array[99][8] == NaN)? "NaN-": Boolean(decodeData.array[99][8]),
                        door: (decodeData.array[99][9] == null) || (decodeData.array[99][9] == NaN)? "NaN-": Boolean(decodeData.array[99][9]),
                        aircon: (decodeData.array[99][10] == null) || (decodeData.array[99][10] == NaN)? "NaN-": Boolean(decodeData.array[99][10]),
                        maxValidSpeed: (decodeData.array[99][11] == null) || (decodeData.array[99][11] == NaN)? "NaN-": Number(decodeData.array[99][11]),
                        vss: (decodeData.array[99][12] == null) || (decodeData.array[99][12] == NaN)? "NaN-": Number(decodeData.array[99][12]),
                        location: (decodeData.array[99][13] == null) || (decodeData.array[99][13] == NaN)|| (decodeData.array[99][13] == "")? "NaN-": decodeData.array[99][13],
                        coordinate: `[${decodeData.array[99][4]},${decodeData.array[99][5]}]`,
                        brokerRecieveTime: Date.now(),
                    }
                      if(previousTime51B22792 != decodeData.array[99][3])
                      {
                          var sendTime = (decodeData.array[99][3])*1000;
                          var receiveTime = dataObject.brokerRecieveTime;
                          dataObject.brokerRecieveTime = receiveTime;//Add time to data that rabbitqm broker recieve message from sender
                          triggerMqtt = false; //
                          eventsEmitter.emit('mqttEvent');
                          
                          console.log("RECEIVE MESSAGE: " + convertTimestampToDatetime(sendTime) +" ; " + convertTimestampToDatetime(receiveTime) +" ; " + Math.abs((receiveTime - sendTime)).toString()   + " ; " + "["+ decodeData.array[99] + "]");
                      }
                      previousTime51B22792 = decodeData.array[99][3];
                    }
                    channel.ack(msg);
                    channel.cancel(msg.fields.consumerTag);//Tell server stop sending message to consumer and message callback no longer invoked
                    //console.log("-------------------------------------------------------------------");

                    },
                    { noAck: false});
                //#endregion
            });
        });

        }
        catch(ex){
          getFromRabbitTask(false);
        }

      }, 500);
    });
  }
//#endregion

//#region MAIN PROGRAMM---------------------------------------------------------------------------
//------------------Program Main(){---------------------------------
getFromRabbitTask(false);
eventsEmitter.on('mqttEvent',function(triggerMqtt){
    pushToThingsTask(triggerMqtt);
});

//  }---------------------------------------------------------------

//#endregion --------------------------------------------------------------------------------------
