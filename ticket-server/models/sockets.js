const TicketList = require("./ticket-list");


class Sockets {

    constructor( io ) {

        this.io = io;

        
        // Crear la instancia de nuestrio TicketList;
        this.ticketList = new TicketList();
        
        this.socketEvents();


    }

    socketEvents() {
        // On connection
        this.io.on('connection', ( socket ) => {

            console.log('cliente conectado');

            socket.on('solicitar-ticket', (data, callback) => {
                const nuevoTicket = this.ticketList.crearTicket();
                callback(nuevoTicket);
            });


            socket.on('siguiente-ticket-trabajar', ({agente, escritorio}, callback) => {
                const suTicket = this.ticketList.asignarTicket( agente, escritorio );
                callback(suTicket);

                this.io.emit('ticket-asignado', this.ticketList.ultimos13);
            });

            // Escuchar evento: mensaje-to-server
            socket.on('mensaje-to-server', ( data ) => {
                console.log( data );
                
                this.io.emit('mensaje-from-server', data );
            });
            
        
        });
    }


}


module.exports = Sockets;