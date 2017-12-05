const Discord = require("discord.js");
const client = new Discord.Client();

//trocar o token
client.login(process.env.BOT_TOKEN);

//versao 1.0
const message = new Discord.Message();
const Browser = require('zombie');
const creditos = "--- criado por Reifel ---", separador=" | ", quebraLinha="\r\n";

//tratando casos de erro
const errorNickNaoEncontrado="nick não encontrado", errorJsonCapture="iih... foi mal, nao consegui, tenta dnvo q vai",
errorNuncaGanhouSquad="nunca ganhou squad", errorFortnitetracker=" esta certo seu nick? acho q fortnitetracker nao esta pegando, ve ai: ";

const comandoErrado = "comando invalido";


var refreshAuto = [];
var refreshTamanho = 0;
var refreshRealizados=0;
var refreshRealizadosMAX = 4;
var refreshMAXSTACK=13;
var refreshTEMPO=1800000;//30min 1800000

var interval, refreshIsRunning=0;

const helpMessage = "comandos disponiveis:\r\n**!tracker nick** - (consulta nick do fortnite de alguem)\r\n**!up seuNick** - (atualizar winrate do seu nick com TAG)\r\n**!mtracker seuNick** - (atualizar winrate do seu nick sem TAG)\r\n**!auto seuNick** - (atualiza o seu winrate sozinho a cada 30 min, apos "+refreshRealizadosMAX+" atualizacoes todas as "+refreshMAXSTACK+" vagas ficam livres)";

const errorUsuarioRegistrado = "usuario ja esta registrado", errorRefreshLotado="fila atualizacao lotada", 
sucessoRegistro=" conseguiu se registrar", chamadaFilaLIVRE=">> a fila de atualizar win % automatica esta LIVRE <<", sucessoWinRateAtualizado="atualizei os win % de vcs";

client.on('ready', () => {
	client.user.username="reifelTracker";
	client.user.setUsername("reifelTracker");
});
var TAG = "";
client.on('message', message => {
	if(message.author.bot) return; //ignora poupar processamento bot
	
	if(message.content.indexOf("!") !== 0) return; //se nao for comando ignora
	
	switch(message.guild.id){
		/* case 368240657816354836: //bro
			TAG = "BRO";
		break; */
		
		case "368240657816354836": //bro
			TAG = "BRO";
		break;
		
		/* case 373611766737010690: //PDX
			TAG = "PDX";
		break; */
		
		case "373611766737010690": //PDX
			TAG = "PDX";
		break;
		
		default:
			TAG = "";
		break;
	}
	
	//dividindo cada palavra da mensagem em um array de palavras
	var args = message.content.slice(0).trim().split(/ +/g);
	//console.log(args);
	var comando = args[0];
	
	//se tiver espaco no nick
	var parametroUsado = "", nickLegivel="", site="";	
	if(args.length>2){ 
		for (i = 1; i < args.length; i++) { 
			parametroUsado += args[i] + "%20";
			nickLegivel += args[i] + " ";
		}
		parametroUsado = parametroUsado.slice(0, -3); //remover o ultimo %20 q sobra	
	}else{		
		nickLegivel=parametroUsado = args[1];	
	}
		
	switch(comando.toLowerCase()){
		case "!tracker":
			if(nickLegivel === undefined) {print(message, errorNickNaoEncontrado); return;}
			
			site = "https://fortnitetracker.com/profile/pc/"+parametroUsado;
			//crawler
			Browser.visit(site, function (e, browser) {				
				try{
					msgPadraoBot( message, search(browser.html(),nickLegivel), site, creditos, nickLegivel );
				}catch(e){
					print(message, nickLegivel + errorFortnitetracker + site);
				}
			});	
		break;
		
		case "!up":			
			site = "https://fortnitetracker.com/profile/pc/"+parametroUsado;
			Browser.visit(site, function (e, browser) {
				try{
					padraoAtualizarNome(browser.html());
				}catch(e){
					print(message, nickLegivel + errorFortnitetracker + site);
				}
			});	
		break;
		
		case "!mtracker": //atualiza sem por TAG	
			TAG = "";
			site = "https://fortnitetracker.com/profile/pc/"+parametroUsado;
			Browser.visit(site, function (e, browser) {
				try{
					padraoAtualizarNome(browser.html());
				}catch(e){
					print(message, nickLegivel + errorFortnitetracker + site);
				}	
			});	
		break;
		
		case "!auto":
			
			if(refreshIsRunning===0){
				refreshIsRunning=1;
				runAutoUpdateWinRate(message);
			}
			
			for( i=0; i<refreshTamanho; i++){
				if(parametroUsado === refreshAuto[i].parametroUsado) {
						print(message, errorUsuarioRegistrado); //error user existente
						return;
				}
				
			}
			if(refreshTamanho < refreshMAXSTACK){
				usuarioParametroNickTrio = {};
				//console.log(message.member);
				//console.log(message.member.id);
				usuarioParametroNickTrio["member"] = message.member.id;
				usuarioParametroNickTrio["parametroUsado"] = parametroUsado;
				usuarioParametroNickTrio["nickLegivel"] = nickLegivel;
				
				refreshAuto.push(usuarioParametroNickTrio);
				refreshTamanho++;
				print(message, nickLegivel+sucessoRegistro+" "+refreshTamanho+"/"+refreshMAXSTACK);
				//print(message, refreshAuto.length);				
			}else{
				print(message, errorRefreshLotado); //error stack lotado
			}
		break;
		
		case "!debug":
			console.log(message);
		break;
		
		case "!help":
			print(message, helpMessage);
		break;
		default:
			print( message, comandoErrado);
		break;
	}
});

//codigo criacao de reifel
var buscas= [
'var playerData',
'</script>',
'"p9"'
];

function search(text,nick){	
	console.log(text+"\r\n\r\n");
	var jsonSquad;
	try{
		jsonSquad = getJsonSquad(text);		
	}catch(e){
		throw false;
	}
	
	var resultado="";
	var wins = 2
	,winP = 9
	,kd = 11
	,kills = 8
	;		
	
	if(jsonSquad[wins].label === 'Wins' && jsonSquad[winP].label === 'Win %' && jsonSquad[kd].label === 'Kills' && jsonSquad[kills].value === 'K/d')
	{}	
	else{			
			var n=0;
			for( i=0; i < jsonSquad.length; i++ ){
				//console.log(jsonSquad[i].label);
				switch(jsonSquad[i].label){
					case "Wins":
						wins = n;
					break;
					
					case "Win %":
						winP = n;
					break;
						
					case "Kills":
						kills = n;
					break;
					
					case "K/d":
						kd = n;
					break;
					
				}
				n++;
			}
	}
	
	if(jsonSquad[wins].value===0) resultado= errorNuncaGanhouSquad;
	//resultado = ">> "+nick+" Squad <<\r\nWins: "+jsonSquad[wins].value+separador+"Win %: "+jsonSquad[winP].value +separador+"Kills: "+jsonSquad[kills].value +separador+ "K/d: "+jsonSquad[kd].value +quebraLinha+ site +quebraLinha+ creditos;
	else resultado = ">> "+nick+" Squad <<\r\nWins: "+jsonSquad[wins].value+separador+"Win %: "+jsonSquad[winP].value +separador+"Kills: "+jsonSquad[kills].value +separador+ "K/d: "+jsonSquad[kd].value;
	
	//console.log(resultado);	
	return resultado;
}

function up(text){	
	var jsonSquad;
	try{
		jsonSquad = getJsonSquad(text);		
	}catch(e){
		throw false;		
	}
	
	var winP = 9;		
	
	if(jsonSquad[winP].label !== 'Win %'){			
			var n=0;
			for( i=0; i < jsonSquad.length; i++ ){
				//console.log(jsonSquad[i].label);
				switch(jsonSquad[i].label){						
					case "Win %":
						winP = n;
					break;
				}
				n++;
			}
	}	
	return jsonSquad[winP].value;
	
}

function msgPadraoBot(message, text, site, rodape, nick){
		message.channel.send({embed: {
			  color: 3447003,
				description: text,
				title: "stats de "+nick,
				url:site,
				footer: {text:rodape}
			}
		});	
}

function print(message, text){
		message.channel.send({embed: {
			  color: 3447003,
				description: text
			}
		});	
}

function updateWinRateStack(message){
	forRecusivo(message,0);
}
//"=☂ "+winRate+"%= "+refreshAuto[i].nickLegivel
function atualizarWinRateNick(message, winRate, i){
	message.guild.members.get(refreshAuto[i].member).setNickname( padraoNick(winRate, refreshAuto[i].nickLegivel) ).then( forRecusivo(message, i+1) ).catch(console.error);
}

function forRecusivo(message, i){
	if(i<refreshTamanho){
		console.log(i+" update "+refreshAuto[i].nickLegivel);
		var site = "https://fortnitetracker.com/profile/pc/"+refreshAuto[i].parametroUsado;
		
		setWinRateNick(message, site, i);
		
	}
}

function setWinRateNick(message, site, i){
	Browser.visit(site, function (e, browser) {
		text = browser.html();			
		winRate = up(text);		
		
		if(winRate === -1) refreshAuto = refreshAuto.splice(i, 1);//nick errado remove do array
		else{
			atualizarWinRateNick(message, winRate, i);
		}
		
	});
}

function runAutoUpdateWinRate(message){
	//console.log("fui iniciado");
	interval = setInterval (function (){
			//console.log("vivo");
			if(refreshTamanho==0){
				//console.log("parando autoupdate 1");
				clearInterval(interval);
				refreshIsRunning = 0;
				return;//zero stack faz nada
			} 
				
			if(refreshRealizados == refreshRealizadosMAX){ //terminou refresh
				refreshAuto = refreshAuto.splice(0,refreshTamanho); //zera o stack, 
				refreshTamanho = 0;
				refreshRealizados=0;
				print(message,chamadaFilaLIVRE);
			}else{ //atualiza stack
				updateWinRateStack(message);
				refreshRealizados++;
				print(message,sucessoWinRateAtualizado+" "+refreshRealizados+"/"+refreshRealizadosMAX);
				
			}
      }, refreshTEMPO);
}
//"☂ "
function padraoNick(winrate, nick){
	return winrate+"% ☂ "+TAG+" "+nick;
}

function getJsonSquad(text){	
	var temp = text.substring(text.indexOf(buscas[0])+16);
	temp = temp.substr( 0,temp.indexOf(buscas[1]) );
	temp = temp.substring(temp.indexOf(buscas[2]));
	temp = temp.substring(5,temp.indexOf("]")+1);
	
	console.log(temp);
	var jsonSquad;
	//temp == squad json
	try{
		jsonSquad = JSON.parse(temp);
	}catch(e){
		//console.log(e.message, e.name);
		throw false;
	}
	
	return jsonSquad;
}

function padraoAtualizarNome(nickLegivel,text,site){	
	try{
		var winRate = up(text);		
	}catch(e){
		throw false;
	}

	if(winRate === -1) {
		print(message, errorNickNaoEncontrado);
	}
	else{
		//if(message.member.hasPermission("MANAGE_NICKNAMES"))
		message.member.setNickname( padraoNick(winRate,nickLegivel) ).then(user => message.reply(`terminei, atualizei o winrate \:umbrella2:`)).catch(console.error);	
		//else print(message, "ainda nao tenho permissao pra mudar seu nick :(");
	}
}