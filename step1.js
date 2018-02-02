var res = require ("restify");
var builder = require("botbuilder");

var server = res.createServer();
server.listen(3978, function(){
    console.log("server:", server.url)
});
var connector = new builder.ChatConnector({
    appId: "",
    appPassword: ""
})
server.post("/api/messages/", connector.listen())

var bot = new builder.UniversalBot(connector, [
    function (session) {
        //la pregunta
        builder.Prompts.text(session, "Cual es tu nombre...");
    },
    function (session, result) {
        //la respuesta
        var msg = "hola  " + "  "+ result.response;
        //session.endDialog(msg);
        session.send(msg);
        builder.Prompts.text(session, "de que signo eres..")
    },
    
    //si queremos más mensages aumentamos el par d epreguntas respuestas
    //si espero respuesta uso Prompts.texty sesion send
    //si queremos lanzar actualizacion paro el proceso y lo vuelvo a correr  node archivo
    function (session, results) {
        var msg = "eres del signo " + results.response;
        session.endDialog(msg)
    }
]);