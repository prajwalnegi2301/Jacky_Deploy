
import { consumer, producer } from "../config/kafka.js"

export const produceMessage = async(topic, message)=>{
    await producer.send({
        topic,
        messages: [{value:JSON.stringify(message)}],
    })
}


export const consumeMessages = async(topic, message)=>{
    await consumer.connect()
    await consumer.subscribe({topic: topic})

    await consumer.run({
        eachMessage: async ({topic, partition, message}) => {
            const data = JSON.parse(message.value.toString())
            console.log(data);
        }
    })
}