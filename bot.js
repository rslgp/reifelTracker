const Discord = require("discord.js");
const client = new Discord.Client();

//CALABOCA VUE -- comentar em caso de debug, se precisar
console.log = function log()
{
  
} 
//FIM-CALABOCA*/

//trocar o token
client.login(process.env.BOT_TOKEN);

//versao 1.0
const message = new Discord.Message();
const Browser = require('zombie');
const creditos = "> criado por Reifel <", /*separador=" | ",*/ quebraLinha="\r\n";

//tratando casos de erro
const errorNickNaoEncontrado="nick não encontrado",
errorNuncaGanhouSquad="nunca ganhou squad", errorFortnitetracker=", nick não encontrado, tente !alt nick"
;

const siteFortniteTracker = "https://fortnitetracker.com/profile/pc/", siteStormShield = "https://www.stormshield.one/pvp/stats/";

const winsStormShieldPath="body>div.container>div:nth-child(2)>div.col-12.col-md-8>div>div:nth-child(3)>div>div:nth-child(3)>div:nth-child(2)>a>div.istat__value";

const comandoErrado = "comando invalido";


var refreshAuto = [];
var refreshTamanho = 0;
var refreshRealizados=0;
var refreshRealizadosMAX = 4;
var refreshMAXSTACK=13;
var refreshTEMPO=1800000;//30min 1800000

var interval, refreshIsRunning=0;
//var readySimultaneoContador;

const helpMessage = "comandos disponiveis:\r\n**!tracker nick** - (ou **!t nick**, consulta nick do fortnite de alguem)\r\n**!up seuNick** - (atualizar winrate do seu nick)\r\n**!auto seuNick** - (atualiza o seu winrate sozinho a cada 30 min, apos "+refreshRealizadosMAX+" atualizacoes todas as "+refreshMAXSTACK+" vagas ficam livres)\r\n**!alt seuNick** - (acessa tracker em site alternativo caso o fortnitetracker esteja bug ou off)\r\n**!rank** - sobe de patente caso atingiu win% e kd";

const errorUsuarioRegistrado = "usuario ja esta registrado", errorRefreshLotado="fila atualizacao lotada", 
sucessoRegistro=" conseguiu se registrar", chamadaFilaLIVRE=">> a fila de atualizar win % automatica esta LIVRE <<", sucessoWinRateAtualizado="atualizei os win % de vcs";

client.on('ready', () => {
	client.user.username="reifelTracker";
	client.user.setUsername("reifelTracker");
});

var TAG = "";
var cooldownUser = [];

client.on('message', message => {
	if(message.author.bot) return; //ignora poupar processamento bot
	
	switch(message.guild.id){//se nao for server autorizado, o bot sai
		case "368240657816354836": //bro
			if(message.channel.id!=387003077695373315) return; //se nao for no bot-spam ignora a msg (poupa processamento)
		break;
		
		//case "373611766737010690": //PDX
		//break;
		
		case "363610360688672778": //privado fortnite-reifel
		break;
		
		//case "397143937057554433": //fps
		//break;
		
		default:
			message.guild.leave(); console.log("sai"); return;
		break;
			
	}
	
	
	if(message.content[0] === "!") {
		//print(message,"Opaa...\r\na v2 do reifelTracker agora inicia o comando com **.** \r\nexemplos: .t .up .help"); 
		message.content[0]=".";
	}
	else{
		if(message.content[0] !== ".") return; //se nao for comando ignora
	}
	
	//anti-spam
	if(cooldownUser.indexOf(message.member.id) !== -1 ){print(message,message.member.nickname+" você está em cooldown");return;}
	else{
		cooldownUser.push(message.member.id);
		setTimeout(
		function remove() {
			const index = cooldownUser.indexOf(message.member.id);
			
			if (index !== -1) {
				cooldownUser.splice(index, 1);
			}
		}, 3000);
	}
	//fim anti
		
	//dividindo cada palavra da mensagem em um array de palavras
	var args = message.content.slice(1).trim().split(/ +/g);
	//console.log(args);
	var comando = args[0];
	comando = comando.toLowerCase()
	switch(comando){ //so responder a nossos comandos, poupar cpu
		case "t":
		case "tracker":
		case "alt":
		case "up":
		case "auto":
		case "help":
		case "rank":
		break;
		default:
			return;
		break;
	}	
	
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


		
	switch(comando){
		case "t":
			comando = "tracker";
		case "tracker":
			if(nickLegivel === undefined){
				try{
					nickLegivel=parametroUsado = getNickConhecido(message);
					parametroUsado=encodeURI(parametroUsado);
				}catch(e){
					print(message, errorNickNaoEncontrado); return;
				}
			}
			//if(nickLegivel === undefined) {print(message, errorNickNaoEncontrado); return;}
			
			site = siteFortniteTracker+parametroUsado;
			//crawler
			Browser.visit(site, function (e, browser) {				
				try{
					var text = browser.html();
					
					var jsonSquad;
					try{
						jsonSquad = getJsonSquad(text);
						text=null;
					}catch(e){		
						console.log("error search");
						throw false;
					}
					
					var d7Texto="";
					try{
					//day7
					var d7WinRate, d7kd;
					var day7elem;
					
					/* //versao antiga, bug as vezes
					day7elem = browser.queryAll("body>div.container.content-container>div>div#profile>div.trn-profile.dtr-profile>div>div.content>div:nth-child(1)>div.dtr-stats-card.last7>div.trn-stats>div:nth-child(7)>div.value");
					d7kd = day7elem[0].innerHTML;

					day7elem = browser.queryAll("body>div.container.content-container>div>div#profile>div.trn-profile.dtr-profile>div>div.content>div:nth-child(1)>div.dtr-stats-card.last7>div.trn-stats>div:nth-child(8)>div.value");
					d7WinRate = day7elem[0].innerHTML;

					d7Texto="\r\n7dias>> win%: **"+d7WinRate.slice(0, -1)+"** kd: **"+d7kd+"**";
					*/
					//fim day7	
					
					//pelo array Last7
					day7elem = browser.queryAll("body>div.container.content-container>div:nth-child(1)>script:nth-child(10)");
					
					var j7 = day7elem[0].textContent;
					day7elem=null;
					var j8 = j7.split("}");
					d7kd = j8[15].split(":")[2].replace(/(\r\n|\n|\r|\"| )/gm,"");
					d7WinRate = j8[17].split(":")[2].replace(/(\r\n|\n|\r|\"| )/gm,"");
					d7WinRate = d7WinRate.slice(0,-1);
					
					d7Texto="\r\n7dias>> win%: **"+d7WinRate+"** kd: **"+d7kd+"**";

					}catch(e){
						print(message,  "sem 7dias de "+nickLegivel+"dessa vez :(");
					}

					msgPadraoBot( message, search(jsonSquad,nickLegivel)+d7Texto, site, creditos, nickLegivel );
				}catch(e){
					print(message, nickLegivel + errorFortnitetracker);
				}
			});	
		break;
		
		case "up":			
			try{
				nickLegivel=parametroUsado = getNickConhecido(message);
				parametroUsado=encodeURI(parametroUsado);
				if(args[1] !== undefined) print(message,"ei! eu sei qm é vc \:thinking:, da proxima nao escreve o nick, escreve o comando up sem dizer o nick");
			}catch(e){
				//caso nao tenha guarda chuva, mantem o nick como arg
			}
			//console.log(parametroUsado+" "+nickLegivel);
			//if(nickLegivel === undefined) {nickLegivel=parametroUsado=getNickConhecido(message);}	
			
			/*
			switch(message.guild.id){		
				case "368240657816354836": //bro
					if(message.member.roles.find("name", "BRO Member")){
						TAG = " BRO";						
					}else{
						TAG = "";
					}
				break;
				
				case "373611766737010690": //PDX
					TAG = " PDX";
				break;
				
				default:
					TAG = "";
				break;
			}
			*/
			
			site = siteFortniteTracker+parametroUsado;
			Browser.visit(site, function (e, browser) {
				try{					
					var text = browser.html();
					padraoAtualizarNome(message,nickLegivel,text,site);
				}catch(e){
					try{ //tentar atualizar usando outro site
						var site = siteStormShield+parametroUsado;
						Browser.visit(site, function (e, browser) {					
							var winP;	
							try{							
								winP = padraoAlt(browser,6);
								winP = winP.slice(0, -1);//remover char porcentagem
							}catch(e){
								print(message,errorNickNaoEncontrado);
								return;
							}			
							message.member.setNickname( padraoNick(winP,nickLegivel) ).then(user => message.reply(`atualizei winrate \:umbrella2:`)).catch(console.error);	
						});
					}catch(e){
						print(message, nickLegivel + errorFortnitetracker);						
					}
				}
			});	
		break;
		
		/*
		case ".mtracker": //atualiza sem por TAG	
			if(nickLegivel === undefined) {print(message, errorNickNaoEncontrado); return;}	
			TAG = "";
			site = siteFortniteTracker+parametroUsado;
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
		
		case "auto":
			
			if(refreshIsRunning===0){
				refreshIsRunning=1;
				runAutoUpdateWinRate(message);
			}
			nickLegivel = parametroUsado = getNickConhecido(message);
			parametroUsado = encodeURI(parametroUsado);
			
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
		
		case "alt":
			site = siteStormShield+parametroUsado;
			Browser.visit(site, function (e, browser) {				
				var wins,winP,kd,kills;	
				try{				
					kills = padraoAlt(browser,1);				
					wins = padraoAlt(browser,0);
					kd = padraoAlt(browser,2);

					winP = padraoAlt(browser,6);
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
		
		case "rank":
			
			try{
				nickLegivel=parametroUsado = getNickConhecido(message);
				parametroUsado=encodeURI(parametroUsado);
				if(args[1] !== undefined) print(message,"ei! eu sei qm é vc \:thinking:, da proxima nao escreve o nick, escreve o comando up sem dizer o nick");
			}catch(e){
				//caso nao tenha guarda chuva, mantem o nick como arg
			}
			
		site = siteFortniteTracker+parametroUsado;
		Browser.visit(site, function (e, browser){
			try{					
				var text = browser.html();
				var jsonSquad;
				try{
					jsonSquad = getJsonSquad(text);
				}catch(e){			
					console.log("error rank");
					throw false;		
				}
				var winrKD = up(jsonSquad);
				
				//se n tiver o minimo de wins ignora
				if(jsonSquad[10].value > 250 || winrKD[0] < 20){}else{return;}
				/*
				MITICO		- Win % 45 - K/d 6.7
				GODLIKE		- Win % 30 - K/d 4.3
				LEGENDARY	- Win % 25 - K/d 3.5
				EPIC		- Win % 20 - K/d 2.7
				RARE		- Win % 15  - K/d 1.9
				INCOMUM		- Win % 10 - K/d 1.1
				*/
				try{
					if(		winrKD[0]>=45 && winrKD[1]>=6.7){//mitico
						if(message.member.roles.has('393260318434000907')) return;
						changeRole(message.member, '376840180688224257', '393260318434000907');	
						print(message,message.member.nickname+" Parabéns! Você agora é <@&393260318434000907> \:trophy: \:ok_hand:");
					}else if(winrKD[0]>=30 && winrKD[1]>=4.3){//godlike
						if(message.member.roles.has('376840180688224257')) return;
						changeRole(message.member, '373639920591306753', '376840180688224257');	
						print(message,message.member.nickname+" Parabéns! Você agora é <@&376840180688224257> \:trophy: \:ok_hand:");						
					}else if(winrKD[0]>=25 && winrKD[1]>=3.5){//lendario
						if(message.member.roles.has('373639920591306753')) return;
						changeRole(message.member, '373640006314754057', '373639920591306753');
						print(message,message.member.nickname+" Parabéns! Você agora é <@&373639920591306753> \:trophy: \:ok_hand:");		
					}else if(winrKD[0]>=20 && winrKD[1]>=2.7){//epic
						if(message.member.roles.has('373640006314754057')) return;
						changeRole(message.member, '373640089986924554', '373640006314754057');
						print(message,message.member.nickname+" Parabéns! Você agora é <@&373640006314754057> \:trophy: \:ok_hand:");		
					}else if(winrKD[0]>=15 && winrKD[1]>=1.9){//rare
						if(message.member.roles.has('373640089986924554')) return;
						changeRole(message.member, '373640161290092544', '373640089986924554');		
						print(message,message.member.nickname+" Parabéns! Você agora é <@&373640089986924554> \:trophy: \:ok_hand:");							
					}else if(winrKD[0]>=10 && winrKD[1]>=1.1){//incomum
						if(message.member.roles.has('373640161290092544')) return;
						changeRole(message.member, '387071306451124224', '373640161290092544');		
						print(message,message.member.nickname+" Parabéns! Você agora é <@&373640161290092544> \:trophy: \:ok_hand:");							
					}else {
						//um dia talvez sera aqui q serao kickados e mandando msg q qnd atingir 10% e 1.1 kd podem voltar
						//aprendiz
						member.addRole('376134044439805952');
						print(message,"patente cadastrada");
					}
					message.member.removeRole('387071306451124224').then(message.member.setNickname( padraoNick(winrKD[0],nickLegivel))).then(user => message.reply("kd: **"+winrKD[1]+`**, atualizei winrate \:umbrella2:`)).catch(console.error);
				}catch(e){
					
				}
			}catch(e){					
				console.log("error rank2");
			}
		});		
		break;
		
		case "debug":
			//console.log(message);
			var indice = message.member.nickname.indexOf("☂")+2;
			console.log(message.member.nickname.substring(indice));
		break;
		
		case "help":
			print(message, helpMessage);
		break;
				
		//case ".ready":
		//	readySimultaneo(message);
		//break;
		
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

function search(jsonSquad,nick){	
	//console.log(text+"\r\n\r\n");
	
	var resultado="";
	var wins = 2
	,winP = 9
	,kd = 8
	,kills = 11
	;		
	
	if(jsonSquad[wins].label === 'Wins' && jsonSquad[winP].label === 'Win %' && jsonSquad[kills].label === 'Kills' && jsonSquad[kd].value === 'K/d')
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
	jsonSquad=null;	
	
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

function up(jsonSquad){	
	
	var winP = 9, matches = 10, kd = 8;	
	var retorno = [];
	
	if(jsonSquad[winP].label !== 'Win %' || jsonSquad[matches].label !== 'Matches' || jsonSquad[kd].value !== 'K/d'){			
			var n=0;
			for( i=0; i < jsonSquad.length; i++ ){
				//console.log(jsonSquad[i].label);
				switch(jsonSquad[i].label){						
					case "Win %":
						winP = n;
					break;		
					
					case "Matches":
						matches = n;
					break;
					
					case "K/d":
						kd = n;
					break;
				}
				n++;
			}
	}
	try{
		//cap new accounts
		if(jsonSquad[matches].value < 36){ //no data to build trusty sample
			retorno[0] = (jsonSquad[winP].ValueDec * 0.2).toFixed(2)+"*";
		}
		//old accounts or ok winrate
		if(jsonSquad[matches].value > 250 || jsonSquad[winP].value < 20){ //pessoas de conta antiga ou pessoas q sao novas e tem winrate aceitavel
			retorno[0] = jsonSquad[winP].value;
		}else{			
			retorno[0] = (jsonSquad[winP].ValueDec * 0.57).toFixed(2)+"*";		
		}
		
	}catch(e){
		console.log("erro no cap");
	}
	
	retorno[1]=jsonSquad[kd].value;
	
	return retorno;
	
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

//inicio ForRecursivo - stack update
function updateWinRateStack(message){
	forRecusivo(message,0);
}
//"=☂ "+winRate+"%= "+refreshAuto[i].nickLegivel
function forRecusivo(message, i){
	if(i<refreshTamanho){
		//console.log(i+" update "+refreshAuto[i].nickLegivel);
		var site = siteFortniteTracker+refreshAuto[i].parametroUsado;
		
		setWinRateNick(message, site, i);
		
	}
}

function atualizarWinRateNick(message, winRate, i){
	message.guild.members.get(refreshAuto[i].member).setNickname( padraoNick(winRate, refreshAuto[i].nickLegivel) ).then( forRecusivo(message, i+1) ).catch(console.error);
}
//fim ForRecursivo - stack update

function setWinRateNick(message, site, i){
	Browser.visit(site, function (e, browser) {
		var text = browser.html();	
		try{
			var jsonSquad;
			try{
				jsonSquad = getJsonSquad(text);
				text=null;
			}catch(e){			
				console.log("error up");
				throw false;		
			}
			
			var winrKD = up(jsonSquad);	
			atualizarWinRateNick(message, winrKD[0], i);
		}catch(e){
			refreshAuto = refreshAuto.splice(i, 1);//nick errado remove do array
		}		
	});
}

function runAutoUpdateWinRate(message){
	//console.log("fui iniciado");
	interval = setInterval (function (){
			//console.log("vivo");
			if(refreshTamanho===0){
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
	return winrate+"% ☂"+TAG+" "+nick;
}

function getJsonSquad(text){
	/*
	//old
	var temp = text.substring(text.indexOf(buscas[0])+16);
	
	temp = temp.substr( 0,temp.indexOf(buscas[1]) );
	temp = temp.substring(temp.indexOf(buscas[2]));
	temp = temp.substring(5,temp.indexOf("]")+1);*/
	
	
	//super otimizacao de processamento e memoria, usar o startOf do indexOf
	var inicio = ( text.indexOf( buscas[2], ( text.indexOf(buscas[0])+16 ) )+5 );
	var temp = text.substring( inicio, ( text.indexOf("]", inicio)+1 ) );
	
	//console.log(temp);
	var jsonSquad;
	//temp == squad json
	try{
		jsonSquad = JSON.parse(temp);
	}catch(e){		
		console.log("erro getJsonSquad");
		throw false;
	}
	text=null;
	return jsonSquad;
}

function padraoAtualizarNome(message,nickLegivel,text,site){
	try{
		var jsonSquad;
		try{
			jsonSquad = getJsonSquad(text);
		}catch(e){			
			console.log("error up");
			throw false;		
		}
		var winrKD = up(jsonSquad);
	}catch(e){
		console.log("erro padraoAtualizarNome");
		throw false;
	}
	//if(message.member.hasPermission("MANAGE_NICKNAMES"))
	message.member.setNickname( padraoNick(winrKD[0],nickLegivel) ).then(user => message.reply("kd: **"+winrKD[1]+`**, atualizei winrate \:umbrella2:`)).catch(console.error);	
	//else print(message, "ainda nao tenho permissao pra mudar seu nick :(");
}

/*
function readySimultaneo(message){
	var qtd=3;
	readySimultaneoContador = setInterval (function (){				
			if(qtd == 0){ //terminou refresh
				//print(message,"ready!");
				message.channel.send("3. ... iiii. ... 2. ... iiii. ... 1. ... iiii ... vai", {
				 tts: true
				});
				clearInterval(readySimultaneoContador);
			}else{ //atualiza stack
				qtd--;
				print(message,qtd+1);				
			}
      }, 1400);
}
*/

function padraoAlt(browser,id) {
	var elem;
	if(id===0){
		elem = browser.queryAll(winsStormShieldPath);		
	}else{
		elem = browser.queryAll("body>div.container>div:nth-child(2)>div.col-12.col-md-8>div>div:nth-child(3)>div>div:nth-child(4)>div:nth-child("+id+")>div>a>div.stat__value");
	}
	var retorno = elem[0].innerHTML;
	return retorno.replace(/(\r\n|\n|\r)/gm,"");
}

function getNickConhecido(message){
	var posicaoGuardaChuva = -1;
	try{
		posicaoGuardaChuva = message.member.nickname.indexOf("☂");		
	}catch(e){
		
	}
	if(posicaoGuardaChuva !== -1){
		posicaoGuardaChuva += 1;
		/*
		//temporario limpar tags		
			switch(message.guild.id){		
				case "368240657816354836": //bro
					if(message.member.roles.find("name", "BRO Member")){
						TAG = " BRO";						
					}else{
						TAG = "";
					}
				break;
				
				case "373611766737010690": //PDX
					TAG = " PDX";
				break;
				
				default:
					TAG = "";
				break;
			}
		var retorno = message.member.nickname.substring(posicaoGuardaChuva).replace(TAG,"");
		retorno = retorno.substring(1);
		TAG = "";
		*/
		var retorno = message.member.nickname.substring(posicaoGuardaChuva);
		retorno = retorno.substring(1);
		return retorno;
	}else{
		throw false;
	}
}

function changeRole(member,oldRole, newRole){			
	try{
		member.addRole(newRole);		
	}catch(e){};
	
	try{
	member.removeRole(oldRole);	
	}catch(e){};
}