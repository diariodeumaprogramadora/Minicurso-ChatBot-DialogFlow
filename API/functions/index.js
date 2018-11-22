const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Olá mundo! Esse é o minicurso de chatbot da Janynne Gomes");
});

exports.chatbot = functions.https.onRequest((request, response) => {
    
    // Objeto contendo parametros vindos do DialogFlow
    let params = request.body.queryResult.parameters;
    
    // Ação identificada como intenção do usuário pelo DialogFlow
    let action = request.body.queryResult.action;

    switch(action)
    {
        case 'busca_livros':
        {
            // Implementar a lógica de leitura dos dados do Firestore
            response.send({
                fulfillmentText: `Ação detectada: Busca de livros.`
            })
            break;
        }
        case 'reserva_livro':{
            // Implementar a lógica de inserção de dados do Firestore
            response.send({
                fulfillmentText: `Ação detectada: Reserva de livro.`
            })
            break;
        }
        default:
            response.send({
                fulfillmentText: `Nenhuma ação prevista detectada.`
            })
    } 

   });   
