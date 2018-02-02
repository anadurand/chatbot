
var builder = require ('botbuilder')
var restify = require ('restify')

var server = restify.createServer()
server.listen (3978, function () {
    console.log ('%s escuchando en %s', server.name, server.url)
})

var connector = new builder.ChatConnector ({
    appId: '',
    appPassword: ''
})

server.post ('/api/messages', connector.listen())

var store = {
    name : '',
    option : '',
    where: '',
}

// This dialog help the user order dinner to be delivered to their hotel room.
var dinnerMenu = {
    'Arroz con pollo - $5.99': {
        Description: 'Arroz con pollo',
        Price: 5.99
    },
    'Lomo Saltado - $6.89': {
        Description: 'Lomo Saltado',
        Price: 6.89
    },
    'Ceviche - $6.50': {
        Description: 'Ceviche',
        Price: 6.50
    }
};

var bot = new builder.UniversalBot (connector, [
    function (session) {
        builder.Prompts.text(session, '¡Hola! Bienvenido a su servicio de comunal delivery... ¿Cómo te llamas?')
    },
    function (session, results) {
        store.name = results.response;
        session.send('Hola, %s', store.name)
        builder.Prompts.choice(session, '¿Para hoy nuestro menu del dia es?:', dinnerMenu, { listStyle: builder.ListStyle.button });
    },function(session, results) {
        store.option = results.response.entity;

        var order = dinnerMenu[store.option];
        var msg = `Tu ordenastes un ${order.Description} y tiene un costo de $${order.Price}.`;
        builder.Prompts.text(session, '¿Donde lo entrego?');
    }, function (session, results) {
        store.where = results.response;

        var msg = store.name +  ', tu pedido sera entregado en un una hora en: ' + store.where  + ' ... gracias por preferir nuestro servicio';
        session.send(msg)
        session.endDialog();
    }
    //las funciones se pueden poner como arrow functions
])