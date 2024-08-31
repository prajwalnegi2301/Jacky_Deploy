import {Kafka, logLevel} from 'kafkajs'

export const kafka = new Kafka({
    // brokers: [process.env.KAFKA_BROKER ],
    // ssl:true,
    // sasl:{
    //     mechanism: 'schram-sha-256',
    // username: process.env.KAFKA_USERNAME,
    // password: process.env.KAFKA_PASSWORD,
    // }, 
    // logLevel: logLevel.ERROR,



    brokers: ['relative-monkey-9880-eu1-kafka.upstash.io:9092'],
    ssl: true,
    sasl: {
        mechanism: 'scram-sha-256',
        username: 'cmVsYXRpdmUtbW9ua2V5LTk4ODAkhrIDVDRvb_bIQwqA-cBsKPZ9vhxMy9gCyQo',
        password: 'NjMxMWRiMTMtZmFkNi00NDAzLWEwMDUtNGExMThhOGQ4OGEw'
    },
    logLevel: logLevel.ERROR,
})

export const producer = kafka.producer();
export const consumer = kafka.consumer({groupId:'chats'});

export const connectKafkaProducer = async()=>{
    await producer.connect()
    console.log('Connected to Kafka Producer')
};

