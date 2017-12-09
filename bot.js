const Discord = require("discord.js");
const client = new Discord.Client();

//trocar o token
client.login(process.env.BOT_TOKEN);

//versao 1.0
const message = new Discord.Message();
const Browser = require('zombie');
const creditos = "> criado por Reifel <", separador=" | ", quebraLinha="\r\n";

//tratando casos de erro
const errorNickNaoEncontrado="nick não encontrado", errorJsonCapture="iih... foi mal, nao consegui, tenta dnvo q vai",
errorNuncaGanhouSquad="nunca ganhou squad", errorFortnitetracker=", nick não encontrado, tente !alt nick"
;

const comandoErrado = "comando invalido";


var refreshAuto = [];
var refreshTamanho = 0;
var refreshRealizados=0;
var refreshRealizadosMAX = 4;
var refreshMAXSTACK=13;
var refreshTEMPO=1800000;//30min 1800000

var interval, refreshIsRunning=0;

const helpMessage = "comandos disponiveis:\r\n**!tracker nick** - (ou **!t nick**, consulta nick do fortnite de alguem)\r\n**!up seuNick** - (atualizar winrate do seu nick)\r\n**!auto seuNick** - (atualiza o seu winrate sozinho a cada 30 min, apos "+refreshRealizadosMAX+" atualizacoes todas as "+refreshMAXSTACK+" vagas ficam livres)\r\n**!alt seuNick** - (acessa tracker em site alternativo caso o fortnitetracker esteja bug ou off)";

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
		case "!t":
			comando = "!tracker";
		case "!tracker":
			if(nickLegivel === undefined) {print(message, errorNickNaoEncontrado); return;}
			
			site = "https://fortnitetracker.com/profile/pc/"+parametroUsado;
			//crawler
			Browser.visit(site, function (e, browser) {				
				try{
					var text = browser.html();
					msgPadraoBot( message, search(text,nickLegivel), site, creditos, nickLegivel );
				}catch(e){
					print(message, nickLegivel + errorFortnitetracker);
				}
			});	
		break;
		
		case "!up":		
			if(nickLegivel === undefined) {print(message, errorNickNaoEncontrado); return;}	
			
			switch(message.guild.id){		
				case "368240657816354836": //bro
					if(message.member.roles.find("name", "BRO Member")){
						TAG = "BRO";						
					}else{
						TAG = "";
					}
				break;
				
				case "373611766737010690": //PDX
					TAG = "PDX";
				break;
				
				default:
					TAG = "";
				break;
			}
			
			site = "https://fortnitetracker.com/profile/pc/"+parametroUsado;
			Browser.visit(site, function (e, browser) {
				try{					
					var text = browser.html();
					padraoAtualizarNome(message,nickLegivel,text,site);
				}catch(e){
					print(message, nickLegivel + errorFortnitetracker);
				}
			});	
		break;
		
		/*
		case "!mtracker": //atualiza sem por TAG	
			if(nickLegivel === undefined) {print(message, errorNickNaoEncontrado); return;}	
			TAG = "";
			site = "https://fortnitetracker.com/profile/pc/"+parametroUsado;
			Browser.visit(site, function (e, browser) {
				try{
					var text = browser.html();
					padraoAtualizarNome(message,nickLegivel,text,site);
				}catch(e){
					print(message, nickLegivel + errorFortnitetracker);
				}	
			});	
		break;
		*/
		
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
		
		case "!alt":
			var site = "https://www.stormshield.one/pvp/stats/"+parametroUsado;
			Browser.visit(site, function (e, browser) {
				var elem; 
				
				var wins,winP,kd,kills;	
			try{
				elem = browser.queryAll("body>div.container>div:nth-child(2)>div.col-12.col-md-8>div>div:nth-child(3)>div>div:nth-child(4)>div:nth-child(1)>div>a>div.stat__value");
				kills = elem[0].innerHTML;
				kills = kills.replace(/(\r\n|\n|\r)/gm,"");
				
				elem =  browser.queryAll("body>div.container>div:nth-child(2)>div.col-12.col-md-8>div>div:nth-child(3)>div>div:nth-child(3)>div:nth-child(2)>a>div.istat__value");
				wins = elem[0].innerHTML;
				wins = wins.replace(/(\r\n|\n|\r)/gm,"");
				
				elem = browser.queryAll("body>div.container>div:nth-child(2)>div.col-12.col-md-8>div>div:nth-child(3)>div>div:nth-child(4)>div:nth-child(2)>div>a>div.stat__value");
				kd = elem[0].innerHTML;
				kd = kd.replace(/(\r\n|\n|\r)/gm,"");
				
				elem = browser.queryAll("body>div.container>div:nth-child(2)>div.col-12.col-md-8>div>div:nth-child(3)>div>div:nth-child(4)>div:nth-child(6)>div>a>div.stat__value");
				winP = elem[0].innerHTML;
				winP = winP.replace(/(\r\n|\n|\r)/gm,"");
				winP = winP.slice(0, -1);//remover char porcentagem
			}catch(e){
				print(message,"comando alt esta instavel");
				return;
			}
				
				
				//console.log(wins+" "+kd+" "+winP+" "+kills);
				
				//var resultado = ">> "+nickLegivel+" Squad <<\r\nWins: "+ wins +separador+"Win %: "+ winP +separador+"Kills: "+ kills +separador+ "K/d: "+kd;
				var resultado = formatarMsg(winP,kd,wins,kills);
				msgPadraoBot(message, resultado, site, creditos, nickLegivel);
			});			
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
	//console.log(text+"\r\n\r\n");
	var jsonSquad;
	try{
		jsonSquad = getJsonSquad(text);		
	}catch(e){		
		console.log("error search");
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
	//else resultado = ">> "+nick+" Squad <<\r\nWins: "+jsonSquad[wins].value+separador+"Win %: "+jsonSquad[winP].value +separador+"Kills: "+jsonSquad[kills].value +separador+ "K/d: "+jsonSquad[kd].value;
	//else resultado = ">> "+nick+" Squad <<\r\nWins: "+jsonSquad[wins].value+separador+"Win %: "+jsonSquad[winP].value +separador+"Kills: "+jsonSquad[kills].value +separador+ "K/d: "+jsonSquad[kd].value;
	else resultado = formatarMsg(jsonSquad[winP].value,jsonSquad[kd].value,jsonSquad[wins].value,jsonSquad[kills].value);
		
	return resultado;
}

function rightJustify(str, length, char ) {
    var fill = [];
    while ( fill.length + str.length -2 < length ) {
      fill[fill.length] = char;
    }
    return fill.join('');
}

function formatarMsg(winP, kd, wins, kills){
	var p1 = "Win %: **"+winP+"** / K/d: **"+kd+"**";
	var p2 = "Wins: "+wins+" / Kills: "+kills;
	var p3 = "Wins: "+wins+rightJustify(p2,p1.length-7,' ')+" / Kills: "+kills;
	return p1+quebraLinha+p3;
}

function up(text){	
	var jsonSquad;
	try{
		jsonSquad = getJsonSquad(text);
	}catch(e){			
		console.log("error up");
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
				title: "site: stats de "+nick,
				url:site,
				footer: {text:rodape+" +info: !help"}
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
		//console.log(i+" update "+refreshAuto[i].nickLegivel);
		var site = "https://fortnitetracker.com/profile/pc/"+refreshAuto[i].parametroUsado;
		
		setWinRateNick(message, site, i);
		
	}
}

function setWinRateNick(message, site, i){
	Browser.visit(site, function (e, browser) {
		var text = browser.html();	
		try{
			winRate = up(text);	
			atualizarWinRateNick(message, winRate, i);
		}catch(e){
			refreshAuto = refreshAuto.splice(i, 1);//nick errado remove do array
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
				print(message,sucessoWinRateAtualizado+" "+refreshRealizados+"ª das "+refreshRealizadosMAX);
				
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
	
	//console.log(temp);
	var jsonSquad;
	//temp == squad json
	try{
		jsonSquad = JSON.parse(temp);
	}catch(e){		
		console.log("erro getJsonSquad");
		throw false;
	}
	
	return jsonSquad;
}

function padraoAtualizarNome(message,nickLegivel,text,site){
	try{
		var winRate = up(text);
	}catch(e){
		console.log("erro padraoAtualizarNome");
		throw false;
	}
	//if(message.member.hasPermission("MANAGE_NICKNAMES"))
	message.member.setNickname( padraoNick(winRate,nickLegivel) ).then(user => message.reply(`atualizei winrate \:umbrella2:`)).catch(console.error);	
	//else print(message, "ainda nao tenho permissao pra mudar seu nick :(");
}