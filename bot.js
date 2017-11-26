const Discord = require("discord.js");
const client = new Discord.Client();

//trocar o token
client.login(process.env.BOT_TOKEN);

//versao 1.0
const message = new Discord.Message();
const Browser = require('zombie');
const creditos = "--- Powered by Reifel ---", separador=" | ", quebraLinha="\r\n";

//tratando casos de erro
const errorNickNaoEncontrado="nick não encontrado",
errorNuncaGanhouSquad="nunca ganhou squad";

client.on('message', message => {
	
	//dividindo cada palavra da mensagem em um array de palavras
	var args = message.content.slice(0).trim().split(/ +/g);
	//console.log(args);
	var comando = args[0];
	
	//se tiver espaco no nick
	var parametroUsado = "", nickLegivel="";	
	if(args.length>2){ 
		for (i = 1; i < args.length; i++) { 
			parametroUsado += args[i] + "%20";
			nickLegivel += args[i] + " ";
		}
		parametroUsado = parametroUsado.slice(0, -3); //remover o ultimo %20 q sobra	
	}else{		
		nickLegivel=parametroUsado = args[1];	
	}
	
	switch(comando){
		case "!tracker":
		var site = "";	
		//console.log("parametroUsado " + parametroUsado);
		site = "https://fortnitetracker.com/profile/pc/"+parametroUsado;
		//crawler
		Browser.visit(site, function (e, browser) {
			//console.log(browser.location.href);
			var text = browser.html();
			//console.log(text);
			//console.log("nickLegivel: "+nickLegivel);
			
			message.channel.send({embed: {
			  color: 3447003,
				  description: search(text,nickLegivel,site)
				}
			});
		});	
		break;
		
		case "!nick":
			message.member.setNickname(nickLegivel).then(user => message.reply(`seu nome foi modificado com sucesso`)).catch(console.error);
		break;
	}
});

//codigo criacao de reifel
var buscas= [
'var playerData',
'</script>',
'"p9"'
];
function search(text,nick,site){
	var temp = text.substring(text.indexOf(buscas[0])+16);
	temp = temp.substr( 0,temp.indexOf(buscas[1]) );
	temp = temp.substring(temp.indexOf(buscas[2]));
	temp = temp.substring(5,temp.indexOf("]")+1);
	
	var jsonSquad;
	//temp == squad json
	try{
		jsonSquad = JSON.parse(temp);
	}catch(e){
		return errorNickNaoEncontrado;
	}
	//jsonSquad[0] wins
	//jsonSquad[8] win porcentagem
	if(jsonSquad[0].value==0) //console.log("nunca ganhou squad")
		return errorNuncaGanhouSquad;
	else{
		var resultado = ">> "+nick+" Squad <<\r\nWins: "+jsonSquad[0].value+separador+"Win %: "+jsonSquad[8].value +separador+"Kills: "+jsonSquad[10].value +separador+ "K/d: "+jsonSquad[7].value +quebraLinha+ site +quebraLinha+ creditos;
		//console.log(resultado);	
		return resultado;		
	}
}
