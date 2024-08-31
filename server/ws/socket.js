// Initialising socket
import { Server, Socket } from 'socket.io'
import { produceMessage } from '../helper/helper.js'


export function setupSocket(io) {

    io.use((socket, next) => {
        const room = socket.handshake.auth.room
        if (!room) {
            return next(new Error('Invalid room'))
        }

        socket.room = room
        next()
    })



    io.on('connection', (socket) => {

        // Join Room
        socket.join(socket.room)
        console.log('Client connected', socket.id)

        socket.on('message', async(data) => {

            // socket.broadcast.emit("message", data)
            await produceMessage(process.env.KAFKA_TOPIC, data)
            socket.to(socket.room).emit("message", data);
        })

        socket.on('disconnect', () => {
            console.log('a client disconnected', socket.id)
        })
    })
} 