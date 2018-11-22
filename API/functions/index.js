const functions = require('firebase-functions');

// Serviço de banco de dados - BANCO DE DADOS
var admin = require("firebase-admin"); 
admin.initializeApp(functions.config().firebase);

// Objeto de acesso ao banco de dados
var firestore = admin.firestore();

/******************************************************/
// Instância das coleções(tabelas) na base de dados
var Livros = firestore.collection('livros');
var Reservas = firestore.collection('reservas');



/******************************************************/

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
            // Identificar a categoria
            if(params.categoria)
            {
                var contResult = 0;

                // Implementar a lógica de leitura dos dados do Firestore
                // Obtém todos os registros da coleção 'livros' (análogo ao select * from dos bancos de dados relacionais)
                // DOC: https://firebase.google.com/docs/firestore/query-data/get-data?hl=pt-br 
                
                Livros.where("Categoria", "==", params.categoria)
                .get().then(function(resultado) {                        
                   
                    var resposta = '';

                    // Percorre a lista de livros encontrados
                    resultado.forEach(function(livro) {    
                        contResult++;                        
                        // Monta o texto linha a linha da conversa com informações dos livros
                        resposta += `- Nº ${contResult} é ${livro.data().Titulo} escrito por ${livro.data().Autor}. \n \n`;                         
                    });

                    if(contResult < 1){
                        response.send({
                            fulfillmentText: `Infelizmente não possuímos livros de  ${params.categoria}. Você pode tentar buscar outra categoria similar.`
                        })
                    } 

                    // Introduz a resposta, preparando para a lista de informações que vem a seguir
                    resposta = 
                        `Entendido! Procurei aqui e encontrei ${contResult} livro(s) de ${params.categoria}. Veja só: \n \n`+
                        `**************************** \n \n`+
                        resposta+
                        `**************************** \n \n`;

                    // Encerra o diálogo pedindo que o usuário tome uma decisão
                    resposta += `\n Você gostaria de reservar qual deles? Preciso que me diga o número do livro.`;

                    // Envia a resposta dentro do formato reconhecido pelo DialogFlow
                    response.send({
                        fulfillmentText: resposta
                    })  
                })
                .catch(function(erro) {
                    response.send({
                        fulfillmentText: erro
                    })  
                });;             
            }
            else{
                response.send({
                    fulfillmentText: `Ação detectada: Busca de livros.`
                })  
            }
           
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
  


//*********************************************************|
//             CRUD do Livro    - PARA APLICAÇÃO           |
//*********************************************************|

exports.ListarLivros = functions.https.onRequest((request, response) =>    {

        // Objeto contendo parametros vindos do DialogFlow
        let categoria = request.body.categoria;

        response.send({resposta:request.body.categoria});

        var list = [];

        var _resposta =  Livros.where("Categoria", "==", "programação").get();

        _resposta.then(function(resultado) { 
            resultado.forEach(function(livro) {                   
                console.log(livro.id, " => ", livro.data());
                list.push({id: livro.id, dados: livro.data()});                   
            });

            response.send({resultado:list});
        })
        .catch((e=>{
            response.send("erro");
        })); 
    
  
});

exports.ModificarLivro = functions.https.onRequest((request, response) =>    {
    response.send("Update");
});

exports.ExcluirLivro = functions.https.onRequest((request, response) =>    {
    response.send("Delete");
});

exports.InserirLivro = functions.https.onRequest((request, response) =>    {
    response.send("Insert");
});

//*********************************************************|
//             CRUD da Reserva    - PARA APLICAÇÃO           |
//*********************************************************|

exports.ListarReservas = functions.https.onRequest((request, response) =>    {

      var list = [];

        var _resposta =  Reservas.get();

        _resposta.then(function(resultado) { 
            resultado.forEach(function(reserva) {                   
                console.log(reserva.id, " => ", reserva.data());
                list.push({id: reserva.id, dados: reserva.data()});                   
            });

            response.send({resultado:list});
        })
        .catch((e=>{
            response.send("erro");
        })); 
    
   
});

exports.CancelarReserva = functions.https.onRequest((request, response) =>    {
    response.send("Update");
});

exports.AdicionarReserva = functions.https.onRequest((request, response) =>    {
    response.send("Insert");
});
 