const Discord = require("discord.js");
const client = new Discord.Client();
const message = new Discord.Message();

const JSONbig = require('json-bigint');

//trocar o token
client.login(process.env.BOT_TOKEN);

//CALABOCA VUE -- comentar em caso de debug, se precisar
console.log = function log(){}

//versao 1.2
const tabelaPreco = '**Mensalidade do bot ReifelTracker**\r\nDepende da quantidade de membros do servidor no discord\r\n\r\nExperimente por 7 dias e só paga se quiser continuar\r\nMensalidade:\r\nmembros -------- reais por mês\r\n1 a 85            -------- R$ 8\r\n86 a 250        -------- R$ 15\r\n251 a 650       -------- R$ 18\r\nmaior que 650      -------- R$ 22\r\n\r\n**Forma de pagamento**: boleto, transferência bancária (banco do brasil), depósito, paypal (+12% do preço pela taxa do paypal)\r\n**Dá direito a** 3 cargos (nomes customizáveis: Lendário, Épico, Raro)(representando fortnite:kd,winrate, apex:level,elo), instalação grátis e só paga quando estiver funcionando, os preços são para usar o bot do jeito que ele é na última atualização dele, com no máximo pequenas adaptações. Se não quiser mais, o bot é desinstalado e tem opção de remover as modificações feitas pelo bot (voltar ao que era antes).\r\n\r\n**Jogos suportados**: Fornite, Apex\r\n\r\n**PACOTES paga uma vez pelo pacote:**\r\n(válido enquanto o tamanho do servidor condiz com o plano contratado)\r\n(parcelado em até 3 vezes)\r\npacote de 4 meses com 8% de desconto\r\npacote de 8 meses com 20% de desconto\r\npacote de 1 ano com 30% de desconto\r\n\r\nexemplos 4|8|12 meses:\r\nmenor que 85: 30 | 50 | 65\r\nmaior que 650: 80 | 140 | 185\r\nesses valores podem ser parcelados em até 3 vezes sem juros\r\n\r\n**TRATAR COM:** @Reifel#5047 <@195731919424585728>\r\nhttps://discordapp.com/users/195731919424585728\r\nNão envie mensagem por aqui, envie para reifel';

const apoio = "", txt1MudarNick='winrate: **', txt2MudarNick='kd: **',txt3MudarNick='**, ', trackerTag="☂", espaco=" ", ftParam="?old=1", pfxCom1='!', pfxCom2='.', pfxCom3='c', reactEmoji='✔', reactEmojiX='❌';

var usersPremium;

//var voiceChannel;
//var ytdl = require('ytdl-core');

//img r
const request = require('request');
var options =  { 
    apikey: '16c04b131188957',
    language: 'eng', // Português
    imageFormat: 'image/jpg', // Image Type (Only png ou gif is acceptable at the moment i wrote this)
  };

//"\r\n\r\ndá like pro fix da epic na escada q gira sozinha -> [clique aqui](https://accounts.epicgames.com/login/customized?regSubheading=Register&productCss=https%3A%2F%2Fwww.epicgames.com%2Ffortnite%2FssoAsset%2Ffortnite-custom.css&response_type=code&state=https%3A%2F%2Fwww.epicgames.com%2Ffortnite%2Fforums%2Fbugs-issues%2Fbug-reports%2F191591-stair-rotates-randomicaly-priorize-to-front-camera-and-only-rotate-if-pressed-r&client_id=52b63176173444eb8291b0dd60586e04&productName=fortnite&loginSubheading=Sign+In)";


var aprendizadoPausado=true;

var top10ELO, topEloDesatualizado=[true,true];
var debug;

var msgCatarseEnviada = false;

const menuComandos =["1 de 2 Apex Legends - Comandos\n\n.lvl nick - registra e atualiza o lvl\n.elo - atualiza o tier\n.ranked - atualiza o rank\n.mudei nick - atualiza para novo nick\n.dk nick - checa kills e dano por foto\n.ondevou - mostra onde cair\n\n>> [Premium](https://catarse.me/reifeltracker)\n.lendas nick - lista por ordem de kill as lendas\n.ce nick - confere o tier de outra pessoa", "2 de 2 Admin e Fortnite - Comandos\n\nAdmin:\ncriar varias salas, renomear membro, ler de imagem,\ncargo Bloqueado, gerenciar cargos, scrims\n\n\nFortnite:\n.t - para kd ou lvl\n.up - atualizar\n.solo\n.troquei"];

/*
//setting up twitch
const twitch = require("tmi.js");
const twiconf = {
	identity: {
		username: "reifel",
		password: process.env.TWITCH_TOKEN
	},
	channels: ["reifel"]
};
const clientTwitch = new twitch.client(twiconf);
clientTwitch.connect();
//fim twitch
*/

//security approach num1
eval = function(args){
	return;
}
//fim security

const Browser = require('zombie');
Browser.silent = true;
Browser.waitDuration='6s'; //cloudflare
Browser.headers = {"Authorization":"1bx8rK3kQ_RAlyUv0jKN4NA3cEv7nAeQmDr5htoHDxg", "TRN-Api-Key":"994198ca-b8a3-47d3-8f71-1ca1f66eaaf6"}; //ativar backup 3

var Jimp = require("jimp");
//[apoia.se/reifel](https://apoia.se/reifel) - (*boleto | cartão de crédito - qlqr valor*)
const rodape = "preço:R$8~22 dono:Reifel#5047 !comandos| !queroessebot", /*separador=" | ",*/ quebraLinha="\r\n", doacao=": use em outro !discord"+apoio;

//tratando casos de erro
const errorNickNaoEncontrado="nick não encontrado",
errorNuncaGanhouSquad="nunca ganhou squad", errorFortnitetracker=", --ERRO--, (mudou de nick? .troquei novoNick). Possíveis causas: escreveu o nick errado, jogador não joga no PC, o site fortnitetracker está caindo ou com problemas", errorNaoUsarProprioNick="ei! eu sei qm é vc \:thinking:, da próxima usa o comando sem nick";
;

const siteFortniteTracker = "https://fortnitetracker.com/profile/pc/", siteStormShield = "https://www.stormshield.one/pvp/stats/", siteFortniteStatsCOM="https://fortnitestats.com/stats/", siteFortniteScout="https://www.fortnitescout.com/pc/";

const winsStormShieldPath="body > div.container.pvp > div:nth-child(3) > div.col-12.col-lg-8 > div:nth-child(1) > div:nth-child(4) > div > div.post > div:nth-child(2) > div:nth-child(2) > a > div.istat__value";

const comandoErrado = "comando inválido";
//const AnunciarNovosPlanos="\r\n```md\r\n\r\n#22/05 agr +barato e para discord menores\r\n```";
//const AnunciarNovosPlanos="\r\n```fix\r\n\r\n!semana grátis do bot\r\n```";
const AnunciarNovosPlanos="\r\n**[Convite](https://discordapp.com/oauth2/authorize?client_id=373443049818161153&scope=bot&permissions=469830656)** pro bot(val:2019)";

const atividade = "catarse.me/reifeltracker credite | se estourar 💢 todas as bombas 💣 para de funcionar, credite e evite";

var refreshAuto = [];
var refreshTamanho = 0;
var refreshRealizados=0;
var refreshRealizadosMAX = 4;
var refreshMAXSTACK=13;
var refreshTEMPO=1800000;//30min 1800000

var interval, refreshIsRunning=0;
//var readySimultaneoContador;

//const helpMessage = "comandos disponiveis (inicie com ! ou .):\r\n**!queroessebot** - envia uma mensagem privada com a tabela de preço para rodar esse bot no seu servidor\r\n**!t nick** - (consulta nick do fortnite de alguem)\r\n**!up seuNick** - (atualizar winrate do seu nick)\r\n(desativado)**!auto seuNick** - (atualiza o seu winrate sozinho a cada 30 min, apos "+refreshRealizadosMAX+" atualizacoes todas as "+refreshMAXSTACK+" vagas ficam livres)\r\n**!alt seuNick** - (acessa tracker em site alternativo caso o fortnitetracker esteja bug ou off)\r\n**!rank** - sobe de patente caso atingiu win% e kd\r\n**!arma nomeArma** - registra a sua arma principal de preferência\r\n**!ideia msg** - envia uma ideia nova pro bot ou sugestao de melhoria do que já existe\r\n**!novavotacao @mencionar** - comando para inserir novo player a votacao\r\n**!apostar @mencionar , @mencionar, ...** - iniciar aposta nos player citados\r\n**.troquei NovoNick** - se trocou de nick na epic use esse comando\r\n**.vs playerA x playerB** - exclusivo para usuario premium reifeltracker, compara dois players";
const helpMessage = "comandos disponíveis (inicie com ! ou .) - comandos sem nick usam o seu nick:\r\n**!discord** - recebe mensagem privada com preços (R$ 5 ou+) do bot pro seu discord ou de amigo\r\n**!t nick** - consulta histórico squad\r\n**!ti nick** - consulta com imagem\r\n**!up seuNick** - atualizar seu winrate/kd\r\n**!rank** - sobe de patente caso atingiu win% ou kd\r\n**.troquei NovoNick** - se trocou de nick na epic use esse comando\r\n**!solo nick** - consulta histórico solo\r\n**!modificar @menção=Nick** - se for admin, altera o usuario mencionado com os stats de Nick, coloque kd antes da menção se for kd\r\n**!arma nomeArma** - registra a sua arma principal de preferência\r\n**!ideia msg** - envia uma mensagem de melhoria pro bot\r\n**.vs playerA x playerB** - [premium reifeltracker], compara dois players\r\n**passiva premium** - [premium reifeltracker] atualiza stats no nick sozinho de tempo em tempo\r\npremium R$3 por 4 meses (boleto,transferencia,paypal)";

const errorUsuarioRegistrado = "usuario ja esta registrado", errorRefreshLotado="fila atualizacao lotada", 
sucessoRegistro=" conseguiu se registrar", chamadaFilaLIVRE=">> a fila de atualizar win % automatica esta LIVRE <<", sucessoWinRateAtualizado="atualizei os win % de vcs";

var salaRank,salaVotem,salaAposta, reifelUser;

var TAG = "";
var cooldownUser = [];

var imageJimp,fontJimp;
const tempFile="stats.png";

var discAutorizados, salasAutorizadas;


const cred12 = 1100;
var credito, indiceCredAtt=0, credBase;

var boletoanonimo;

var mempeak=0;
var ativarsuspender=false;
var suspensos = [];

var todosDias, diaHoje, liberarDiaExtra, barraApoio;

const lugaresApex = [["Skulltown (Caveira)","https://i.imgur.com/rifvCok.gif"], ["Thunder (Cúpula do Trovão)","https://i.imgur.com/x1U6nau.gif"], ["Mercado","https://i.imgur.com/oHHJspW.gif"], ["Base aérea", "https://i.imgur.com/9Z9b9Ms.gif"], ["Artilharia","https://i.imgur.com/p8oZU8k.gif"], ["Repulsor","https://i.imgur.com/eQ7kUIr.gif"], ["Nave", "https://i.imgur.com/lAxCCeg.gif"], ["Cascatas","https://i.imgur.com/OTgxhft.gif"]];
var lugaresEmbed;

var xu77=null;
var statsv2 = null;

var channelBuscaDM = null;

/*= {
  "embed": {
    "description": lugaresApex[0][0],
    "image": {
      "url": lugaresApex[0][1]
    }
  }
};
*/
//var primeiroDia, fimDoDia, diaAtual, liberarDiaExtra, horaAtual;
//var 3dias = [primeiroDia+86400, primeiroDia+345600, primeiroDia+604800]; //domingo, quarta, sabado (insere posicao 0 - 1535241600, e as outras sao [0]+3*86400 e [0]+6*86400

var frees = [];

function salvarFrees(id, rolesCriadas){
	frees[id+""] = rolesCriadas;	
	client.channels.get("459432939898273798").fetchMessage('502436327258718208')
				  .then(message2 => {
						var obj = JSONbig.parse(message2.content);
						//var obj = {};
						obj[id+""] = rolesCriadas;
						message2.edit(JSON.stringify(obj));
				} )
				  .catch(e => null);	
}

//joined a server
client.on('guildCreate', guild => {
	
	//liberarFree 31/out
	var idGuild;
	try{
	idGuild = Math.round(guild.id);
	}catch(e){}
	
	if(idGuild!=363610360688672800){
		if(!discAutorizados.includes(idGuild)){ //se cliente nao aplica
			
			/*
			if(message.content.includes("convitegratis")){
				message.author.send(conviteFreeLink);
				reifelUser.send(message.author+" ta usando free");
			}
			//aplicar limitante modo free
			horaAtual = message.createdTimestamp;			
			//mais simples (porem mais custoso)
			if(!todosDias){
				//ajuda se calcular o timestamp do proximo dia, e nao precisar criar o date, talvez fazer dps diaHoje.setHours(0,0,0) if(getDay() > 0) proximoDia= 3-getDay() * 86400
				diaHoje = new Date(horaAtual*1000).getDay();
				switch(diaHoje){
					case 0: if(!liberarDiaExtra) return;
					case 3:
					case 6:
					break;
					default:
						print(message,"modo gratuito [liberado](https://discordapp.com/oauth2/authorize?client_id=373443049818161153&scope=bot&permissions=469830656) a todos, os comandos estão ativos nas quartas e sábados.\r\nos domingos ao atingir 50% de apoio no mês e 100% de apoio libera todos dias no mês [R$3 vale 10%][o progresso ao apoiar é compartilhados por todos discords e qualquer membro pode apoiar].\r\ncomando para apoio para custear funcionamento [.apoio] ou contrate um plano,\r\npegue seu [convite do bot](https://discordapp.com/oauth2/authorize?client_id=373443049818161153&scope=bot&permissions=469830656) para seu servidor e use tb o modo gratuito (quartas e sabado)\r\n"+barraApoio);
						return;
					break;
				}		
			}
			*/
			try{
			client.users.get(guild.ownerID).send("Não Autorizado por Reifel\r\n"+tabelaPreco).catch(e => null);
			guild.leave(); return;
			}catch(e){guild.leave();}
		}
	}
	return;
	
	client.channels.get("459432939898273798").fetchMessage('502436327258718208')
				  .then(message2 => {
						var obj = JSONbig.parse(message2.content);
						//var obj = {};
						if(obj[guild.id+""]) return;
						var rolesCriadas = [0,0,0];
								try{
									guild.createRole({
										name: 'Lendário',
										color: 'GOLD',
										hoist: true, 
										managed: true,
										mentionable: true

									}).then(role => rolesCriadas[0] = role.id).catch(e => null);

									guild.createRole({
										name: 'Épico',
										color: 'PURPLE',
										hoist: true, 
										managed: true,
										mentionable: true
									}).then(role => rolesCriadas[1] = role.id).catch(e => null);		

									guild.createRole({
										name: 'Raro',
										color: 'BLUE',
										hoist: true, 
										managed: true,
										mentionable: true
									}).then(role => {rolesCriadas[2] = role.id; salvarFrees(guild.id,rolesCriadas);}).catch(e => null);
								}catch(e){};
				} )
				  .catch(e => null);
				  
			
			client.users.get(guild.ownerID).send("para permitir cargos utilizar o bot va em:\r\nconfigurações do servidor >> cargos >> arraste reifeltracker pra cima\r\ne coloque acima dos cargos que vão utilizar o bot.\r\nvc pode renomear os cargos, se precisar de suporte, envie mensagem para Reifel#5047").catch(e => null);
			
			//client.user.setPresence({
			//	game: {
			//		name: "com "+client.guilds.array().length +" |.discord"
			//	}
			//}); 
	
});


//react
//fila ranked bot
var primeiroReagiu = false;
var maxTempo, msgFila=null, qtdTickets;

Date.prototype.addMinutes15 = function() {
  this.setTime(this.getTime() + (900000));
  return this;
}

function zerarFilaRankedBot(){ //qnd atingir jogadores necessarios ou acabar o tempo de 15 min da fila
	primeiroReagiu=false; 
	//apagar e depois reagir
	msgFila.clearReactions().then( 
		setTimeout(function(){msgFila.react(ticketRankedEmoji).catch(e=>null);},1000) 
	);  
}

client.on('messageReactionAdd', (reaction, user) => {
	//so funciona com mensagens criadas/editadas apos iniciar o client
	/*
	console.log(reaction);
	console.log("\r\n####################\r\n");
	console.log(user);
	*/
	if(user.bot) return;
	switch(reaction.message.id){
		case "617884991531122688": //msg de tickets do bot
			var offlineUsers=0;
			qtdTickets = reaction.message.reactions.get(ticketRankedEmoji);
			if(qtdTickets!=null){			
				//se atingiu a qtd necessaria pra ranked
				if(qtdTickets.count > 45){
					var msgUsersMention="";
					var u = qtdTickets.users;
					//zerarFilaRankedBot();
					//reaction.remove(client.user);
					for(var i of u){
					  if(i[1].presence.status == 'offline') {
						  //reaction.remove(i[1]);
						  offlineUsers++;
					  }else{
						msgUsersMention+=i[1];
					  }
					  //if(i[1].bot === false) msgUsersMention+=i[1];					  
					}
					
					if((qtdTickets.count - offlineUsers) > 45) {
						//zerarFilaRankedBot();	
						/*
						reaction.clearReactions().then( 
							setTimeout(function(){reaction.react(ticketRankedEmoji).catch(e=>null);},1000) 
						);  
						*/
						reaction.message.channel.send(msgUsersMention).then(mentionMsg => mentionMsg.delete(10000)).catch(e => null);
					}
				}
			}
		break;
			
		case "624424320919404544":
			reaction.remove(user).catch(e=>null);
			//se passaram 30 min da ultima checagem
			if(user==reifelUser || ( new Date().getTime() - reaction.message.editedTimestamp ) > 1800000){
				/*
				reaction.message.clearReactions().then( 
					setTimeout(function(){reaction.message.react("♻").catch(e=>null);},1000) 
				);
				*/

				atualizarCargosRanksOnline(reaction.message.guild, reaction);
			}
		break;
			
		
		case "664193900835110955":			
			reaction.remove(user).catch(e=>null);
			
			var reactionTimestamp = Math.round((new Date()).getTime() / 1000);
			reactionTimestamp *= 1000;
			//864000 24hrs
			var currTime = (~~((reactionTimestamp%10000000000) /10000));
			currTime = currTime*10; //ficar em segundos	

			executarComandoKM(currTime, user.id);
		break;
	}
	
	if(reaction.message.author == client.user){
		reaction.remove(user).catch(e=>null);
		var conteudo, numero;
		try{
			conteudo = reaction.message.embeds[0].description;
		}catch(e){
			return;
		}
		if(conteudo.indexOf("Comandos") == -1) return;
		var oldEmbed = reaction.message.embeds[0];
		var newEmbed = {embed: 
				{
					color: oldEmbed.color,
					description: "",
					footer: {text:oldEmbed.footer.text}
				}
			};
		
		switch(reaction.emoji.name){
			case "➡":
				numero = Number(conteudo.substring(0,1));
				numero -= 1;
				numero = numero < menuComandos.length-1 ? numero+1 : 0;
				newEmbed.embed.description = menuComandos[numero];
				reaction.message.edit(newEmbed);
			break;
			case "⬅":
				numero = Number(conteudo.substring(0,1));
				numero -= 1;				
				numero = numero > 0 ? numero-1 : menuComandos.length-1;
				newEmbed.embed.description = menuComandos[numero];
				reaction.message.edit(newEmbed);
			break;
			
		}
	}
	
});
//fim react

client.on('ready', () => {
	debug = client.channels.get('598226746701119711');
	
	channelBuscaDM = client.channels.get("661294470980960257");
	
	//reacao
	client.channels.get("617882572743245863").fetchMessage('617884991531122688').then(message2 => {		
		//message2.edit("reaja com :tickets: para entrar na fila ranked para ouro, platina, diamante ou predador\r\n:recycle: para ficar entrando automaticamente na fila\r\n:x: para parar de entrar automaticamente");
		
		//message2.clearReactions();
		//setTimeout(aguardarReacao(message2),0);
		message2.react(ticketRankedEmoji).catch(e=>null);
	} )
	  .catch(e => null);
	//fim-reacao
	
	//menu km
	client.channels.get("663841496562270208").fetchMessage('664193900835110955').then(message2 => {		
		message2.edit("**Menu KM**\n:radio_button: -> contabilizar kills (após uma ou várias partidas)\n\n:hourglass_flowing_sand: -> antes de começar a jogar (ou após pausa longa)");
		message2.react("🔘").catch(e=>null);
		message2.react("⏳").catch(e=>null);
	} )
	  .catch(e => null);
	
	//boleto anonimo
	client.channels.get("625721376308723713").fetchMessage('625721462526836746').then(message2 => {		
		boletoanonimo = JSON.parse(message2.content);
	} )
	  .catch(e => null);
	//fim-boleto
	
	var dt = client.channels.get("459432939898273798");
	dt.fetchMessage('616043152905863178')
		  .then(message2 => {
			xu77 = message2;
		} )
		  .catch(e => null);
	
	dt.fetchMessage('617664454896648203')
		  .then(message2 => {
			statsv2 = message2;
		} )
		  .catch(e => null);
	
	
	dt.fetchMessage('616043152905863178')
			  .then(message => {
					try{
						credito = message.content;
						credito = Number(message.content);				
					}catch(e){}
			} )
			  .catch(e => null);


	dt.fetchMessage('661901181840523274')
		  .then(message2 => {
			usersPremium = message2.split(',');
		} )
		  .catch(e => null);
	
	
	
	credBase = [];
	//credBase[0] = 850;
	for(var i=0; i<5; i++){
		credBase[i]= cred12*i;
	}
	
	top10ELO = [new DoubleLinkedListJSON(),null];
	
	client.channels.get("459432939898273798").fetchMessage('483646835710361622')
			  .then(message => {
					try{
						var obj =  JSON.parse(message.content);
						todosDias = obj["todosDias"];
						liberarDiaExtra= obj["liberarDiaExtra"];
						atualizarBarraApoio(obj["progresso"]);						
					}catch(e){}
			} )
			  .catch(e => null);
			  
	client.channels.get("459432939898273798").fetchMessage('479842842899120134')
			  .then(message => {
					try{
					var obj =  JSON.parse(message.content);
					suspensos = obj["suspenso"];
					if(suspensos.length!=0)ativarsuspender=true;				
					}catch(e){}
			} )
			  .catch(e => null);
	
	client.channels.get("459432939898273798").fetchMessage('461722127205269505')
			  .then(message => {
					try{
					var obj =  JSON.parse(message.content);
					discAutorizados = obj["discords"];
					salasAutorizadas = obj["salas"];
										
					}catch(e){}
			} )
			  .catch(e => null);
			  
	client.channels.get("459432939898273798").fetchMessage('502436327258718208')
				  .then(message2 => {
						var obj = JSONbig.parse(message2.content);
						frees = obj;
				} )
				  .catch(e => null);
	
	client.channels.get("459432939898273798").fetchMessage('559897722296205324')
				  .then(message2 => {
						if(Number(message2.content)==0) aprendizadoPausado = false;
						else aprendizadoPausado = true;
				} )
				  .catch(e => null);
	
	try{
		//client.user.setUsername("ReifelTracker");
	}catch(e){}
	salaRank = client.channels.get("368505848667832321");	
	salaVotem = client.channels.get("413597195846156299");	
	salaAposta = client.channels.get("416769967690743819");
	reifelUser = client.users.get('195731919424585728');
	//client.user.setActivity("interessados: https://u.nu/reifelcontato |Reifel#5047 |.queroessebot", { type: 'WATCHING', url:'https://www.twitch.tv/reifel'});
	//dono:Reifel#5047 desde:2017 jogos:fortnite,apex +info em assistir >>
	client.user.setPresence({
			game: {
				//name: "com "+client.guilds.array().length +"|dono:Reifel#5047"
				name: atividade,
				url: "https://www.twitch.tv/reifel",
				type: "STREAMING"
			}
		});	

/*client.user.setPresence({
		game: {
			//name: "com "+client.guilds.array().length +"|dono:Reifel#5047"
			name: "c/ meu dono Reifel#5047 |.queroessebot"
		}
	}); 
	*/
	//http://snip.li/reifelbackground1
	Jimp.read("https://i.imgur.com/IiwIFC0.png", function (err, imagemBackground) {
		Jimp.loadFont(Jimp.FONT_SANS_16_WHITE).then(function (fontCarregada) {
			imageJimp=imagemBackground;
			fontJimp=fontCarregada;
			
			imageJimp.deflateStrategy(0).filterType(0);
		});
	});
	
	
	Jimp.read("https://i.imgur.com/tdsP9PU.png", function (err, imagemBackground) {
		//Jimp.loadFont(Jimp.FONT_SANS_16_WHITE).then(function (fontCarregada) {
			imageJimpApex=imagemBackground;
			//fontJimp=fontCarregada;
			
			imageJimpApex.deflateStrategy(0).filterType(0);
		//});
	});
	
	/*
	var guildsRegistradas = client.guilds.array();
	for(var a of guildsRegistradas){
		console.log(a.name+quebraLinha+a.id+quebraLinha+"<@"+a.ownerID+">"+quebraLinha+"https://cdn.discordapp.com/icons/"+a.id+"/"+a.icon+".png"+quebraLinha);
	}
	*/
	/* v3
	//ranked 
	// Create a reaction collector
	const filter = (reaction, user) => reaction.emoji.name === '🎟';
	message.awaitReactions(filter, { maxUsers: 60, time: 15000 })
	  .then(collected => console.log(`Collected ${collected.size} reactions`))
	  .catch(console.error);
	*/
	
	//msg rank online
	client.channels.get("617882572743245863").fetchMessage('624424320919404544')
	  .then(message2 => {
		  message2.edit("<<quantidade ONLINE NO MOMENTO>>\nreaja ♻ para atualizar");
	} )
	  .catch(e => null);
	
});

/*
//twitch
function mute(channel, user, time, reason){
	clientTwitch.timeout(channel, user.username, time, reason).catch(function(e){});
}
function msgTwitch(texto){
	clientTwitch.action("reifel",texto).catch(function(e){});
}
var poll = [0,0,0];
var contagemVoto=0;
const tempoVotacao = 6, tempoVotacaoSegundos=tempoVotacao*1000;

var filaSquad = [];

const clip=[
"desert eagle + sniper: https://clips.twitch.tv/HorribleYawningMelonKeyboardCat",
"impulse bomb + 1 granada 2 shield + pistolao: https://clips.twitch.tv/SlickClearNoodleRedCoat", 
"desert eagle + shotgun: https://clips.twitch.tv/PiliableBitterFiddleheadsAsianGlow",
"https://clips.twitch.tv/PlainSpinelessArugulaTwitchRaid"];

const avisoLiveOn="eae! to ao vivo! twitch.tv/reifel";
var avisoLiveOnHorario;
//const followers = ["96dps", "alelg27", "alm_a03", "andrerocha2511", "antoniogerson", "argentabryan", "azuzinho123", "barbosarj", "batatatwitcha", "benguinha", "bhgameplays", "biasmadafaka", "bielzim223", "biiagianni", "blasmadafaka", "borgodd", "botwu", "bozo126", "brunocarlan", "burgair", "bzhx", "caiohms", "call_strom", "cattkn", "cauamandraga", "cazinskye", "cogwhistle", "colb_elite", "columbina", "correiakk", "crshadowzzd", "cyanide_poison", "davir34", "deadlikeimearnhardt", "deathsavage_", "delfim88", "dmtrafaaa", "doggamerbrr", "domineiter", "dravenisbroken", "duskyzao", "duuuuh_", "edacata", "enejoita", "erianxxt", "erzatv1", "expecial_light", "ezeey_", "factor77", "fatihtkale", "fefeugreen", "ffninja", "fofenho", "foliao543", "fucious07", "gabrielnogas", "gabussauro", "galudaoo", "gamerplay000", "garamirezyt", "gaygsygsvs", "gersonplays", "gigozubu", "goldenngamergg", "gotalitu", "grayguitar", "grutz", "guilhermealfenas", "guilhermemoralll", "gusa08", "gustavo010206", "gustavopegorin", "hacknux", "hazir157", "holykat_", "hugonm", "hy4z", "iazulmarinho", "iceonice", "ileoox", "imunleqit12345", "inst34d", "itsspdrr", "itzbrennoh", "jbfortnite0o", "jbplay00", "jebrugo", "jesseferreiradavid", "jhonniehue", "jijuzuda", "joao45620", "joaobombadill", "joaobpb", "joaopedrotwd123", "joaosemsobrenom", "joao_flubm", "jose08victor", "jrbellon", "kaaiioo12", "kaczorex00777", "kaena1", "kaka01052005", "kalapus", "kauanrs", "kaueeszzz", "keiroga", "kevinntc_", "kongz_star", "krushem761", "kumma", "lacolombina", "lari", "lazorken", "leehunterz", "lekdoguinho", "leleofps1", "leojobim", "leozinrasta", "lethalfiness", "lhiel", "llhawkblack", "lmythsl", "loosebr", "lordhigor3", "luannnz", "lucaasroxy1", "lucaosxd", "lucasbr0501", "luizcarlos741", "marechal401", "mariobigode", "martos441", "matsigui", "matthcrf", "matzeras", "mdg_swagger", "megazzero", "meneguccii", "midnesscsgo", "miewhaba", "miguel_alv32", "miwo55", "mrmycke", "mrwaguinho", "mtadeuz", "namoratozy", "nasesikej", "nether1_", "newmity", "nicoedu", "nicolas_sempai", "ninjadfps", "oiieusougokuuu", "olek0707pt", "orerevo", "orfell5", "overlocked", "p4n4sonic", "painmandara", "pandasincero", "parkkman", "pedrogalixx", "pedrohfhg", "pedrolimas11", "pedronkz", "peterparker_4g", "pguede", "phzeera1337", "play_salve_112", "poste9", "quecalordapoha", "raelsz", "raind4k1ng", "raulcent", "refluxlt", "remx28", "rhuly15", "riialo", "ripyouall", "rogatkagaming", "rskaliburb", "rudyhimself", "rxpeppa", "ryanpatric4555", "s2stole", "santt", "scifi404", "senterppppp", "seuexemplo_", "shagnakam_", "sk0pattack", "skaf12345", "skgm666", "slingy0", "spnnng0d", "spray_arg", "sstylerr97", "swagman4778", "sxxmarvs", "taiobatv00", "taizun22", "tarsisfventura", "tenkwait", "thelfps", "thiagoortukz", "thronezilla", "tiagoparantes10", "tonhaotv", "tsumiki220", "twitchtigger", "uns3en_7", "uvbloo", "virti", "vitinhoisgod", "voiceew", "voltagexking_yt", "wtg_mojito", "xeeezo", "xinbinha2468", "xisquedelhenapan", "y3ux", "yosteferson", "zecapiranha", "zeneth44", "zfearz", "zhades9", "zrewtor", "zslym", "zyanyz","nemesiisss_"];

//visitantes que nao deram follow
const followers = ["3whoami3", "ac3go", "adasdsdadsasdasd", "al0nsooo", "alelg27", "allanferrari2018", "allankapa", "allion12", "alluntc", "andremarcatto", "artd", "arthurnnc2", "augustomachad0", "ayrtonou", "azuzinho123", "batatatwitcha", "bebelligerent", "bhgameplays", "bicoitinhom", "bitmoe", "black2ktw", "blackjeh", "borgodd", "brokeenout", "brunocarlan", "budweis3rplay", "burgair", "call_strom", "cauamandraga", "cauanh8", "censeu", "cesarpox98", "cezujadoje", "chaosclanofficial", "chaveboy1997", "cleitonatraente", "clevecraftlive", "correiakk", "davir34", "deadlikeimearnhardt", "delfim88", "deonixshow", "devourerqq", "dieg0_7102", "dmtrafaaa", "dspir", "duuuuh_", "edacata", "eddy200303", "edreen", "eduk775", "egr1f", "enejoita", "erianxxt", "erzatv1", "eternalwit", "expecial_light", "factor77", "feh_leonharts", "feif2140", "feltfps", "ferlpes007", "foxxnotch", "francorl", "fucious07", "gabrieljsjr", "gabrielnogas", "gabussauro", "garamirezyt", "gaygsygsvs", "givemehoneynow", "goldenngamergg", "gotalitu", "grayguitar", "grutz", "guilhermemoralll", "gustavopegorin", "hacknux", "hemsey", "herobomberman", "holykat_", "hulkinhuu", "hxmmatador", "hyperfuryft", "icebluemink21", "igor_walex", "ileoox", "ilow", "imunleqit12345", "ingra", "itrugamer71", "jadsonfilho", "jebrugo", "jephux", "jhonniehue", "jibam4582", "jijuzuda", "joaopaulofelix", "joaosemsobrenom", "joao_gabriell", "jocielklleyton", "johnpaulio99", "john_rally", "jose08victor", "jrbellon", "junioroloko", "jutixnimmo", "jv1_", "ka1van", "kaaayote", "kaczorex00777", "kaka01052005", "kalapus", "kallow", "kallowpk", "kauanrs", "keiroga", "kevinntc_", "kofroyal", "kongz_star", "korkronth", "krushem761", "ksier7", "kumma", "kuya_cj", "kyokui", "lamin7", "lari", "lcmtrembala", "leehunterz", "lekdoguinho", "leleofps1", "leojobim", "leonardojosebeu", "leozinrasta", "lethalfiness", "lhamadomorro", "lightp11", "llhawkblack", "lmythsl", "lorinho008", "lostedntc", "lskunkd", "lucaasroxy1", "lucaosxd", "lucasbr0501", "lukehstrong", "luyzfern4ndo ", "marc"552215", "marcofeliponi", "marcosgfie", "mariobigode", "matsigui", "matthcrf", "matzeras", "mauroxt24", "megazorddoforro", "megazzero", "meneguccii", "menorziiim", "michael_lft", "midnesscsgo", "miewhaba", "misterjaay", "mit1cc", "mrmycke", "mrwaguinho", "mtadeuz", "namoratozy", "nasesikej", "nemesiisss_", "newmity", "nicolasdngames", "nicolas_sempai", "nitrovok", "ocfelippee1", "odda", "oiieusougokuuu", "omaisbrabotemnome", "omnipotent_ow", "oreki_sama", "orerevo", "oshiftp", "overlocked", "p4n4sonic", "pablaouu", "painmandara", "pandasincero", "parkkman", "patodonald302", "paulnogard", "paulophsgs", "pedrogalixx", "pedronkz", "perigofortnite", "phzeera1337", "pirupiro1012", "playerburi", "playsalve112", "plsher", "poste9", "quartelxgeneral", "quecalordapoha", "quintenyt", "raelsz", "rafudoo", "raind4k1ng", "raonikill", "raulcent", "reimy08", "remx28", "reveex", "rhuly15", "richerd1624", "riikardo297", "ripyouall", "rishardsx", "robsonbope254", "ronaldinhopex", "rskaliburb", "rudyhimself", "rxpeppa", "s2stole", "santt", "senterppppp", "seuexemplo_", "sk0pattack", "skgm666", "slocool", "slow_hacker", "sniper100mira", "sossolooti1", "sotorpe2", "speakenglixian", "spnnng0d", "spyderx17", "sstylerr97", "still_human", "stonera1", "swagman4778", "sxxmarvs", "tales7germano", "talissonandrade2004", "tarashanatsu", "taynim_", "tenkwait", "thedwpe", "thelfps", "themanu34", "theodor488", "thespyy04", "thezze", "thiagoortukz", "threelegs", "thuanepm", "tiagoparantes10", "tkwowww", "trazzz_tv", "trunkz_", "twitch_b3rg", "ughostz", "uhtiago", "uns3en_7", "uruw4ch0n", "uvbloo", "vaveh55", "vaveh56", "velame123", "veronesiii", "victorsb12", "vin1ctv", "viniciusdps9584", "viniciusfps17", "virgoproz", "virti", "vitinhoisgod", "voiceew", "wefenz", "westcoastbr", "williamftr", "xinbinha2468", "xxchristian4355xx", "xxpedrocfxx", "xxtrolleis", "y3ux", "yfelipels", "ykkur", "yookonz", "yosteferson", "youmustbe", "yummycooky", "yweeest", "zapdius", "zefrax_", "zerefg0d", "zfearz", "zhades9", "zkevinho", "zooseyboy", "zotie2k"];

clientTwitch.on("notice", function (channel, msgid, message) {
    switch(msgid){
		case "msg_timedout":
		break;
	}
});

clientTwitch.on("join", function (channel, username, self) {
	switch(username){
		case "nightbot":
		case "electricalskateboard":
		case "stay_hydrated_bot":
		case "streamelements":
			return;
		break;
		default:
			msgTwitch("Bem vindo (Welcome) a live @"+username);
		break;
	}
});

clientTwitch.on("part", function (channel, username, self) {
	switch(username){
		case "nightbot":
		case "electricalskateboard":
		case "96dps":
		case "stay_hydrated_bot":
		case "streamelements":
		case "givemehoneynow":
			return;
		break;
		default:
			var d = new Date();
			var horaAtual = Number(d.getHours());
			horaAtual = horaAtual < 3 ? 21 + horaAtual :  horaAtual - 3;
			horaAtual = horaAtual + " : "+d.getMinutes();
			reifelUser.send(username+" saiu da live "+horaAtual);
		break;
	}
});

function anunciarRecursivo(i){
	if(i<followers.length){
		setTimeout(
		function() {
			clientTwitch.whisper(followers[i], avisoLiveOnHorario).then(function(data) {anunciarRecursivo(i+1); return;}).catch(function(err) {anunciarRecursivo(i+1); return;});
		}, Math.floor(((Math.random()*14000)+3300)));
	}else{
		return;
	}
}

clientTwitch.on('chat', function(channel, user, message, self){
	if (self) return;//nao se ouvir
	try{
		var numero = Number(message[0]);
		if(numero!=0 && numero<4){
			poll[numero-1]++;
			
			//mute(channel, user, tempoVotacao, "voted");
			if(contagemVoto==0){
				setTimeout(
					function() {
						var vencedor = [0,0];
						for(i=0,maior=0; i<poll.length; i++ ){
							if(poll[i]>maior){
								vencedor[0]=i;
								maior=vencedor[1]=poll[i];
							}
						}
						vencedor[0]='('+(vencedor[0]+1)+')';
						/*switch(vencedor[0]){
							case 0:
							vencedor[0]='(1)';
							break;
							case 1:
							vencedor[0]='(2)';
							break;
							case 2:
							vencedor[0]='(3)';
							break;
						}//fechar comentario
						msgTwitch("vencedor: "+vencedor[0]+" com "+vencedor[1]+" votos - -- -- - resultado total: (1): "+poll[0]+" - (2): "+poll[1]+" - (3): "+poll[2]);
						contagemVoto=0;
						poll[0]=poll[1]=poll[2]=0;//zerando poll
					  
					}, tempoVotacaoSegundos);
			}
			contagemVoto++;
		}
		
	}catch(e){}
	
	var comando;
	var possuiParametro = message.indexOf(" ");
	if(possuiParametro != -1){
		comando = message.substring(1,possuiParametro);		
	}else{ comando = message.substring(1);}
	var nick="reifel", nickLegivel="Reifel";
	
	switch(comando){
		/*
		case "votar":
			var voto =message.replace("!votar ","");
			switch(voto.toLowerCase()){
				case '1':
				case 'a':
				poll[0]++;
				break;				
				case '2':
				case 'b':
				poll[1]++;
				break;
				case '3':
				case 'c':
				poll[2]++;
				break;
				default:
					return;
				break;
			}			
			mute(channel, user, 3, "voted");
			if(contagemVoto==0){
				setTimeout(
					function() {
						var vencedor = [0,0];
						for(i=0,maior=0; i<poll.length; i++ ){
							if(poll[i]>maior){
								vencedor[0]=i;
								maior=vencedor[1]=poll[i];
							}
						}
						
						switch(vencedor[0]){
							case 0:
							vencedor[0]='A';
							break;
							case 1:
							vencedor[0]='B';
							break;
							case 2:
							vencedor[0]='C';
							break;
						}
						msgTwitch("vencedor: "+vencedor[0]+" com "+vencedor[1]+" votos - -- -- - resultado total: A: "+poll[0]+" - B: "+poll[1]+" - C: "+poll[2]);
						contagemVoto=0;
						poll[0]=poll[1]=poll[2]=0;//zerando poll
					  
					}, 3000);
			}
			contagemVoto++;

		break;
		case "resultado":
			if(user.username=='reifel'){
				pollAberta=false;
				msgTwitch();
			}
		break;
		//fechar comentario
		case "queroessebot":
		case "discord":
			msgTwitch("discord dos Followers - discord.gg/RyZNvbe");				
			//if(followers.includes(user.username)){} //verifica se eh follower
		break;
		case "fila":
			if(filaSquad.includes(user.username)){}
			else{msgTwitch(user.username+" sua posicao na fila é "+(filaSquad.push(user.username)))}
		break;
		case "andarfila":
			if(user.username=='reifel'){
				var qtd = message.replace("!andarfila ",""), escolhidos="Escolhidos: ";
				qtd = Number(qtd);
				for(i=0; i<qtd;i++){
					escolhidos += filaSquad.shift()+" - ";
				}
				msgTwitch(escolhidos);
			}
		break;
		case "verfila":
			if(filaSquad.length==0) msgTwitch("vazia");
			else msgTwitch(filaSquad.toString());
		break;
		
		case "clips":
			//if(user.username == 'reifel'){
				//for(i=0;i<4;i++){ //4 vezes
					//setTimeout(
						//function() {
							msgTwitch("Top 3 clips da semana - Reifel:");
							msgTwitch(clip[0]);
							msgTwitch(clip[1]);
							msgTwitch(clip[2]);
							msgTwitch("extra: rocket ride do dia: "+clip[3]);
							msgTwitch("ql horario vc costuma ver stream? diz em tiny.cc/enquete-reifel");
						//}
					//,1800000);//30min				
				//}
			//}
		break;
		case "anunciar":
			if(user.username == 'reifel' || user.username == 'skaf12345'){
				var d = new Date();
				var horaAtual = Number(d.getHours());
				horaAtual = horaAtual < 3 ? 21 + horaAtual :  horaAtual - 3;
				avisoLiveOnHorario=avisoLiveOn+" hj dia "+d.getDate()+" iniciou de "+horaAtual+"h (now)";
				anunciarRecursivo(0);
			}
		break;
		case "squad":
			nick = message.replace("!squad ","");
			nickLegivel = nick;
			nick = nick.replace(" ","%20");
			comando = "tracker";
		break;
		case "reifel":
			comando = "tracker";
		break;
	}
	switch(comando){
	
		case "tracker":
		site = siteFortniteTracker+nick+ftParam;
		var variavelVisita = Browser.visit(site, function (e, browser) {				
					try{
						var text = browser.html();
						
						var jsonSquad;
						try{
							jsonSquad = getJsonSquad(text);
							//console.log(jsonSquad);
							text=null;
						}catch(e){		
							console.log("error search");
							throw false;
						}
						
						msgTwitch( "Números em Squad de "+nickLegivel+": "+search(jsonSquad,'t') );
						
					}catch(e){};
		});		
		break;
		
		
	}
});
clientTwitch.on('connected', function(channel, user, message, self){
	msgTwitch( "estou vivo, reifel");
});
//fim-twitch
*/
function suspenso(message){
	print(message,"Suspenso, aguardando admin ou responsável renovar o contrato...");
}

client.on('error', err => {
	return;
}); //handle client errors

client.on('message', message => {
	if(message.author.bot) return; //ignora poupar processamento bot	
	
	if(message.channel.type === "dm"){		
			var args = message.content.slice(1).trim().split(/ +/g);
			try{
			executarComandos(message, args[0].toLowerCase(),args, true);
			}catch(e){console.log(e.message)}
		return;
	}
	
	/* //temporario rank por imagem
	var arrayIDcargosRead=null;
	switch(message.channel.id){
		case '595937348127162379':
			if(arrayIDcargosRead==null) arrayIDcargosRead=['DIAMANTE I', 'DIAMOND I', '595930565690261535'];
		case '595937385771040778':
			if(arrayIDcargosRead==null) arrayIDcargosRead=['PLATINA I', 'PLATINUM I', '595930566482984961'];
		case '595937398613868544':
			if(arrayIDcargosRead==null) arrayIDcargosRead=['OURO I', 'GOLD I', '595930566847627265'];
			try{
				var att = (message.attachments).array();
				var h = att[0].height, w=att[0].width;
				var aspectRatio = Math.round((w/h)*100)/100;
				var aRFactor = 0, wideFactor = 0, smallwide=0, topFactor=0;
				
				if(aspectRatio > 2.3){
					wideFactor= -0.02;
				}
				if(aspectRatio > 1.4){
					aRFactor = 0.03;
				}
				if(w < 1360){
					smallwide = 0.02;
				}
				
				if(w>1900){ //big wide
					smallwide = 0.01;
					wideFactor= -0.02;
					topFactor = -0.02;
					//aRFactor = 0.05;
				}
				cropReadImg(message, att[0].url, w, h, [ (0.12+wideFactor)*w , (0.08+topFactor)*h, (0.44+smallwide)*w, (0.55+aRFactor)*h], cargosimg, arrayIDcargosRead); //c = [cropLeft, cropTop, cropRight, cropBottom] in px			
				
				
			}catch(e){}
		break;
			
	}
	*/
	/*//leitura de imagem ams-scrim
	if(message.channel.id==555030723527049237) {try{aprendizado(message);}catch(e){} return;}
	if(message.channel.id==559100608666271754) if(typeof message.member.voiceChannel == 'undefined') {message.member.send("apenas quem está na scrim"); message.delete(); return;} //limitar streamers em scrim ams
	if(message.channel.id==546932004931895317||message.channel.id==551441598697963541) {
		var attch = (message.attachments).array();
		if(attch.length == 0) {message.delete(); return;}
		var membro = message.member;
		var copia = message;
		
		try{
		nickLegivel=parametroUsado = getNickConhecidoApexAMS(copia);
				Browser.visit(attch[0].url, function (e, browser) {
					var text = browser.text();
					text= text.substring(text.indexOf('localClientPlayerCachedLevel "')+30);
					text= text.substring(0,text.indexOf('"'));
					
					if(parseInt(text) == 1 || parseInt(text) == 100 || text == "") {membro.send("você possui o bug conhecido do lvl 1 ou lvl 100+, não atualizei, atualize pelo comando .lvl se for possível"); message.delete(); return;}
					switch(message.guild.id){
							case '542501711860727848':
								mudarNickSilencioso(message, padraoNickApex(text,nickLegivel));
							break;
								
							case '550108927698927626':
								mudarNickSilencioso(message, padraoNickApexAMS(text,nickLegivel));
							break;
							
							case '542501242916700181':
								mudarNickSilencioso(message, padraoNickApexAMS(text,nickLegivel));
							break;
						}
					
					message.delete();
				});
			
		}catch(e){message.delete();}
		
	}
	*/
	if(!(message.content[0] === pfxCom1 || message.content[0] === pfxCom2)) return; //filtrar pfx bot
	
	//antiga checagem autorizados
	
	/*
	
	switch(diaAtual){
		case 0: //sabado
			if(horaAtual<3dias[2])
		case 1: //quarta
		
		case 2: //domingo
			if(!liberarDiaExtra) return;
	}
	*/	
	
	if(message.content[0] === pfxCom1) {
		//print(message,"Opaa...\r\na v2 do reifelTracker agora inicia o comando com **.** \r\nexemplos: .t .up .help"); 
		message.content[0]='.';
	}
	else{
		if(message.content[0] !== pfxCom2){
			//if(message.content[0] === pfxCom3 && message.content[1] === pfxCom1) message.reply("u.u c! é comando de bot que usa base roubada do meu código fonte. criei em 30/11/2016 e fui roubado & banido, tenho provas");
			return; //se nao for comando ignora
		}
			
	}
	//31/out
	//var idSala;
	//idSala= Math.round(message.channel.id)
	
	//if(idGuild!=363610360688672800){
	//	if(!salasAutorizadas.includes( idSala )) return;
	//}
	
	//anti-spam
	if(message.member == null) return; //crash logs	
	if(cooldownUser.indexOf(message.member.id) !== -1 ){print(message,"você está em cooldown");return;}
	else{
		cooldownUser.push(message.member.id);
		setTimeout(
		function remove() {
			const index = cooldownUser.indexOf(message.member.id);
			
			if (index !== -1) {
				cooldownUser.splice(index, 1);
			}
		}, 13000);
	}
	//fim anti
	
	/*
	//stats
	client.channels.get("459432939898273798").fetchMessage('558602381558939658')
				  .then(message2 => {
						var obj = JSONbig.parse(message2.content);
						//var obj = {};
						if(obj[message.guild.id+""])  {obj[message.guild.id+""].qtd += 1;}
						else {obj[message.guild.id+""] = {"qtd":1, "nome":message.guild.name}; }
						message2.edit(JSON.stringify(obj));
				} )
				  .catch(e => null);	
	//fim-stats
	*/
	//stats v2
	if(statsv2 !=null){		
		var obj = JSONbig.parse(statsv2.content);
		//var obj = {};
		if(obj[message.guild.id+""])  {obj[message.guild.id+""].qtd += 1;}
		else {obj[message.guild.id+""] = {"qtd":1, "nome":message.guild.name}; }
		statsv2.edit(JSON.stringify(obj));
	}	
	//fim-stats
		
	//dividindo cada palavra da mensagem em um array de palavras
	var args = message.content.slice(1).trim().split(/ +/g);
	//console.log(args);
	var comando = args[0];
	comando = comando.toLowerCase();
	try{
		executarComandos(message, comando, args, false);
	}catch(e){
		console.log(e.message);
	}
});

function executarComandos(message, comando, args, isDM, nickConhecido){
	switch(comando){ //so responder a nossos comandos, poupar cpu
		case "t":
		case "ti":
		case "alt":
		case "alt2":
		case "alt3":
		case "lvl":
		case "lvl2":
		case "lendas":
		case "ce":
		case "km":
		case "ranked":
		case "elo":
		case "ondevou":
		//no memory
		case "elotops":
		case "elotop":
		case "carregartabelaelo":
		/*
		case "elotopa":
		case "removertabeloa":
		case "removertabeloa":
		case "salvartabelaelo":
		case "salvartabelaeloa":
		case "carregartabelaeloa":
		*/
		case "vitoria":
		case "attboleto":
		case "ci":
		case "dk":
		case "empartida":
		case "att":
		case "r":
		case "up":
		case "vs":
		case "help":
		case "solo":
		case "comandos":
		case "ranking":
		case "rank":
		case "troquei":
		case "mudei":
		case "arma":
		case "ideia":
		case "semana":
		case "queroessebot":
		case "discord":
		case "tbquero":
		case "convitegratis":
		case "novavotacao":
		case "apostar":
		case "modificar":
		case "getrid":
		case "ren":
		case "diamante":
		case "platina":
		case "ouro":
		case "prefab":
		case "verificar":
		case "debug":			
		case "db":		
		case "add":		
		case "new":		
		case "rem":
		case "clientes":
		case "preco":		
		case "apoio":	
		case "barra":	
		case "txt":
		//case "c":
		//case "d":
		//case "b":
		//case "v":
		case "s":
		case "rempontos":
		case "addpontos":
		case "nanpontos":
		case "send":
		case "edit":
		case "creditar":
		case "editcreditar":
		case "pm":
		case "reloadimg":
		case "uninstall":
		case "sair":
		case "togglesuspender":
		case "suspender":
		case "dessuspender":
		case "testesuspender":
		case "boleto":
		case "recorde":
		break;
		default:
			return;
		break;
	}
	
	
	var parametroUsado, nickLegivel, site;
	
	//se tiver espaco no nick
	if(args.length>2){ 
		for (i = 1; i < args.length; i++) { 
			parametroUsado += args[i] + "%20";
			nickLegivel += args[i] + " ";
		}
		parametroUsado = parametroUsado.slice(0, -3); //remover o ultimo %20 q sobra	
	}else{		
		nickLegivel=parametroUsado = args[1];	
	}
	
	if(isDM==false){		
		//31/out
		//sistema de suspender pra guild
		/*
		if(ativarsuspender){
			if(suspensos.includes(message.guild.id.substring(0,15))) {suspenso(message);return;}
		}
		
		//sistema de credito das guilds
		credito--;
		indiceCredAtt++;
		if(indiceCredAtt%5 == 0){
			indiceCredAtt=0;
			if(xu77!=null) xu77.edit(credito);	
		}
		//se for conta nova e esta usando level
		if( credito < 0) {
			//estou sem credito
			
			//se for conta nova funcione para comando lvl
			if( (comando.indexOf("lvl")!=-1 && message.member.nickname.indexOf("★")==-1) ){
			 //deixe passar
			}else{		
				if(!usersPremium.includes(message.author.id) && message.guild.id == '542501242916700181'){
					var msgBoletoAnonimo = "boleto sem cadastrar (vencimento: "+boletoanonimo.boleto5.venc+") pdf: [R$ 5]("+boletoanonimo.boleto5.link+") \t|\t [R$ 12]("+boletoanonimo.boleto20.link+")\r\nPara mais pdf de boletos prontos acesse o [Boletos ReifelTracker](https://cdn.discordapp.com/attachments/625721376308723713/643494075894464543/Boletos_ReifelTracker.pdf)";
					if(msgCatarseEnviada==false) print(message, "Desculpe, no momento esse comando não funciona,\r\npara voltar a funcionar é preciso pagar os serviços com o dinheiro da vaquinha feita no: https://catarse.me/reifeltracker (boleto, cartão)\r\n os contribuintes serão premiados e os valores irão carregar a 'carga 0%💢🔥🔥🔥' de funcionamento\r\n**você poderia contribuir para o projeto?**\numa forma fácil de contribuir é:\r\n"+msgBoletoAnonimo);
					msgCatarseEnviada=true;
					return;		
				}
			}
		}
		//60 reais 10200 --- 5 rs 850 --- 12 2040
		switch(message.guild.id){
			case '542501242916700181':
				message.guild.me.setNickname(atualizarVisualCredito());
			break;
		}
		*/
	}
	
	switch(comando){
		case "t":
		var proprionick=false;
			if(nickLegivel === undefined){
				proprionick=true;
				try{
					nickLegivel=parametroUsado = getNickConhecido(message);
					parametroUsado=encodeURI(parametroUsado);
				}catch(e){
					print(message, errorNickNaoEncontrado); return;
				}
			}
			//if(nickLegivel === undefined) {print(message, errorNickNaoEncontrado); return;}
			
			site = siteFortniteTracker+parametroUsado+ftParam;
			//crawler
			try{
				Browser.visit(site, function (e, browser) {				
					try{
						var text = browser.html();
						
						var jsonSquad;
						try{
							jsonSquad = getJsonSquad(text);
							//console.log(jsonSquad);
							text=null;
						}catch(e){		
							//console.log("error search");
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
						day7elem = browser.queryAll("body > div.container.content-container > div:nth-child(1) > script:nth-child(10)");
						
						var j7 = day7elem[0].textContent;
						day7elem=null;
						var j8 = j7.split("}");
						d7kd = j8[13].split(":")[2].replace(/(\r\n|\n|\r|\"| )/gm,"");
						d7WinRate = j8[15].split(":")[2].replace(/(\r\n|\n|\r|\"| )/gm,"");
						//d7WinRate = d7WinRate.slice(0,-1);
						
						d7Texto="\r\n7dias: **"+d7WinRate+"** kd: **"+d7kd+"**";
						
						}catch(e){
							d7Texto = "sem dessa vez :(";
						}
						msgPadraoBot( message, search(jsonSquad)+d7Texto, site, nickLegivel );
						//imbutir up aqui, pois agr so atualiza se for maior
						if(proprionick) {							
							var winrKD = up(jsonSquad);
							var posPercent = message.member.nickname.indexOf("%");
							var winrNome;
							if(posPercent!=-1){
								winrNome= message.member.nickname.substring(0,posPercent);
								if(Number(winrNome)<Number(winrKD[0])) {
									mudarNick(message, padraoNick(winrKD[0],nickLegivel), txt2MudarNick+winrKD[1]+txt3MudarNick);
									//message.member.setNickname( padraoNick(winrKD[0],nickLegivel) ).then(user => message.reply("kd: **"+winrKD[1]+`**, atualizei winrate \:umbrella2:`)).catch(err => console.log(err));
								}
								
							}else{
								posPercent = message.member.nickname.indexOf(trackerTag);
								winrNome= message.member.nickname.substring(0,posPercent);
								if(Number(winrNome)<Number(winrKD[1])) {
									mudarNick(message, padraoNickKD(winrKD[1],nickLegivel), txt1MudarNick+winrKD[0]+txt3MudarNick);
									//message.member.setNickname( padraoNickKD(winrKD[1],nickLegivel) ).then(user => message.reply("winrate: **"+winrKD[0]+`**, atualizei kd \:umbrella2:`)).catch(err => console.log(err));
								}
								
							}
							//else {message.reply(winrKD[0]+" é o valor no site logo é a mesma winrate ou uma menor, não atualizei");}										
						}
					}catch(e){
						console.log(e.message);
						print(message, nickLegivel + errorFortnitetracker);
					}
					
					limparMemoria(browser);
				});
			}catch(e){}			
		break;
		
		case "up":			
			try{
				nickLegivel=parametroUsado = getNickConhecido(message);
				parametroUsado=encodeURI(parametroUsado);
				if(args[1] !== undefined) print(message,errorNaoUsarProprioNick);
			}catch(e){
				//caso nao tenha guarda chuva, mantem o nick como arg
			}
			//console.log(parametroUsado+espaco+nickLegivel);
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
			
			site = siteFortniteTracker+parametroUsado+ftParam;
			try{
				Browser.visit(site, function (e, browser) {
					try{					
						var text = browser.html();
						padraoAtualizarNome(message,nickLegivel,text,site);
					}catch(e){
						try{ //tentar atualizar usando outro site
							var site = siteFortniteScout+parametroUsado;
							Browser.visit(site, function (e, browser) {					
								var winP, selector;	
								try{							
									selector= "#performanceSquad > div.fillCard > div:nth-child(6) > div.statLineRightSide > span";
									winP = getInnerHtml(browser, selector);
									winP = winP.slice(0, -1);//remover char porcentagem
								}catch(e){
									print(message,errorNickNaoEncontrado);
									return;
								}			
								mudarNick(message, padraoNick(winP,nickLegivel));
								//message.member.setNickname( padraoNick(winP,nickLegivel) ).then(user => message.reply(`atualizei winrate \:umbrella2:`)).catch(err => console.log(err));	
								
								
								limparMemoria(browser);
							});
						}catch(e){
							print(message, nickLegivel + errorFortnitetracker);						
						}
					}
					
					limparMemoria(browser);
				});	
			}catch(e){}
		break;
		
		/*
		case ".mtracker": //atualiza sem por TAG	
			if(nickLegivel === undefined) {print(message, errorNickNaoEncontrado); return;}	
			TAG = "";
			site = siteFortniteTracker+parametroUsado;
			var variavelVisita = Browser.visit(site, function (e, browser) {
				try{
					var text = browser.html();
					padraoAtualizarNome(message,nickLegivel,text,site);
				}catch(e){
					print(message, nickLegivel + errorFortnitetracker);
				}	
			});	
		break;
		*/
		
		case "solo":
			if(nickLegivel === undefined){
				try{
					nickLegivel=parametroUsado = getNickConhecido(message);
					parametroUsado=encodeURI(parametroUsado);
					if(args[1] !== undefined) print(message,errorNaoUsarProprioNick);
				}catch(e){
					//caso nao tenha guarda chuva, mantem o nick como arg
				}
			}
			site = siteFortniteScout+parametroUsado;
			try{
				Browser.visit(site, function (e, browser) {				
					var wins,winP,kd,kills,selector;	
					try{
						selector = "#performanceSolo > div.fillCard > div.matchPlacementsLegends > div.matchPlacementLegend.matchPlacementWinsColor";
						wins = getInnerHtml(browser, selector);
						wins = wins.substring(wins.indexOf(">")+1);
						
						selector= "#performanceSolo > div.fillCard > div:nth-child(5) > div.statLineRightSide > small:nth-child(1)";
						kills = getInnerHtml(browser, selector);
						kills = kills.substring(0,kills.indexOf("/"));
						
						selector= "#performanceSolo > div.fillCard > div:nth-child(5) > div.statLineRightSide > span";
						kd = getInnerHtml(browser, selector);
						
						selector= "#performanceSolo > div.fillCard > div:nth-child(6) > div.statLineRightSide > span";
						winP = getInnerHtml(browser, selector);
						winP = winP.slice(0, -1);//remover char porcentagem
					}catch(e){
						print(message,"comando alt esta instavel (so funciona na segunda tentativa ou indefinido)");
						return;
					}
					var resultado = formatarMsg(winP,kd,wins,kills,'--');
					msgPadraoBot(message, resultado, site, nickLegivel, " (Solo)");
				});	
			}catch(e){}
		break;
			
		case "troquei":
			var nick = message.member.nickname;
			var winrate = nick.substring(0,nick.indexOf(trackerTag)-1);
			site = siteFortniteTracker+parametroUsado+ftParam;
			Browser.visit(site, function (e, browser){
				try{					
					var text = browser.html();
					var jsonSquad;
					try{
						jsonSquad = getJsonSquad(text);
						text=null;
					}catch(e){			
						//console.log("error rank");
						throw false;		
					}
					var winrKD = up(jsonSquad);
					if(nick.indexOf("%") === -1){
						if( (parseFloat(winrate) + 1) >= parseFloat(winrKD[1]) ) { //se o stats atual offline for menor ou igual ao stats online
							mudarNick(message, padraoNickKD(winrKD[1],nickLegivel));
							//message.member.setNickname( padraoNickKD(winrKD[1],nickLegivel) ).then(user => message.reply("o seu nick foi atualizado")).catch(err => console.log(err));
							return;
						}else{
							//reifelUser.send(nickLegivel+"kd: "+parseFloat(winrKD[0])- (parseFloat(winrate) + 1) );
							print(message, "nao posso trocar seu nick");
						}
					}else{					
						if( (parseFloat(winrate) + 2.4) >= parseFloat(winrKD[0]) ) { //winrate
							mudarNick(message, padraoNick(winrKD[0],nickLegivel));
							//message.member.setNickname( padraoNick(winrKD[0],nickLegivel) ).then(user => message.reply("o seu nick foi atualizado")).catch(err => console.log(err));
							return;
						}else{
							//reifelUser.send(nickLegivel+"win%: "+parseFloat(winrKD[0])- (parseFloat(winrate) + 2.4) );
							print(message, "nao posso trocar seu nick");
						}
					}					
					
					limparMemoria(browser);
				}catch(e){}
			});
		break;
			
		case "getrid":
			getRoleID(message);
		break;
		
		case "ren":
			if(message.author!=reifelUser) return;
			var user = message.mentions.users.array()[0];
			if(user) user= user.id;
			message.guild.members.find(val => val.id === user).setNickname(nickLegivel.substring(nickLegivel.indexOf("=")+1)).catch(e=>null);
		break;
			
		//apex ams multi change role mention
		case "diamante":
			if(message.member.roles.has('545016072521121803')) changeRoleMention(message,'595930565690261535');
		break;
		case "platina":
			if(message.member.roles.has('545016072521121803')) changeRoleMention(message,'595930566482984961');
		break;
		case "ouro":
			if(message.member.roles.has('545016072521121803')) changeRoleMention(message,'595930566847627265');
		break;
			
		case "modificar":
		if(message.author==reifelUser){}else {if(!message.channel.permissionsFor(message.member).has("ADMINISTRATOR")) {print(message,"Sem permissão");return;}}
		
		var nick = parametroUsado.substring(parametroUsado.indexOf("=")+1);
		site = siteFortniteTracker+nick+ftParam;
			try{
				Browser.visit(site, function (e, browser) {				
					var text = browser.html();
						
					var jsonSquad;
					try{
						jsonSquad = getJsonSquad(text);
						//console.log(jsonSquad);
						text=null;
					}catch(e){		
						console.log("error search");
					}
					
					var winrkd = up(jsonSquad);
					
					var indiceEscolhido=0;
					if(parametroUsado.indexOf("kd")!==-1){
						indiceEscolhido=1;
						winrkd[indiceEscolhido]+="%";
					}
					
					var user = message.mentions.users.array()[0];
					if(user) user= user.id;
					message.guild.members.find(val => val.id === user).setNickname(winrkd[indiceEscolhido]+" ☂ "+nickLegivel.substring(nickLegivel.indexOf("=")+1)).catch(e=>{});
				});
			}catch(e){}
		
		break;

		case "vs":
		if(!( usersPremium.includes(message.author.id) )) return;
		var jsonSquadPA,jsonSquadPB;
		
		var players = parametroUsado.split("%20x%20");
				
		site = siteFortniteTracker+players[1]+ftParam;
		
		try{
			Browser.visit(site, function (e, browser) {				
						try{
							var text1 = browser.html();
							
							try{
								jsonSquadPB = getJsonSquad(text1);
								//console.log(jsonSquad);
								text1=null;
								
								site = siteFortniteTracker+players[0]+ftParam;
								try{
									Browser.visit(site, function (e, browser2) {				
												try{
													var text2 = browser2.html();
													
													try{
														jsonSquadPA = getJsonSquad(text2);
														//console.log(jsonSquad);
														text2=null;
														print( message, compararPlayers(jsonSquadPA, decodeURI(players[0]), jsonSquadPB, decodeURI(players[1]), message) );
														
													}catch(e){		
														//console.log("error search");
														throw false;
													}
												}catch(e){
													console.log(e.message);
													print(message, nickLegivel + errorFortnitetracker);
												}
																								
												limparMemoria(browser2);
									});
								}catch(e){}
							}catch(e){		
								//console.log("error search");
								throw false;
							}
						}catch(e){
							console.log(e.message);
							print(message, nickLegivel + errorFortnitetracker);
						}
												
						limparMemoria(browser);
			});
		}catch(e){}
			
		break;
		
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
				print(message, nickLegivel+sucessoRegistro+espaco+refreshTamanho+"/"+refreshMAXSTACK);
				//print(message, refreshAuto.length);				
			}else{
				print(message, errorRefreshLotado); //error stack lotado
			}
		break;
		
		case "alt3":
			site = siteStormShield+parametroUsado;
			try{
				Browser.visit(site, function (e, browser) {				
					var wins,winP,kd,kills;	
					try{				
						kills = padraoAlt(browser,5);				
						wins = padraoAlt(browser,2);
						kd = padraoAlt(browser,6);

						winP = padraoAlt(browser,9);
						winP = winP.slice(0, -1);//remover char porcentagem
					}catch(e){
						//print(message, e.message);
						print(message,"comando alt esta instavel (so funciona na segunda tentativa ou indefinido)");
						return;
					}
					
					
					//console.log(wins+espaco+kd+espaco+winP+espaco+kills);
					
					//var resultado = ">> "+nickLegivel+" Squad <<\r\nWins: "+ wins +separador+"Win %: "+ winP +separador+"Kills: "+ kills +separador+ "K/d: "+kd;
					var resultado = formatarMsg(winP,kd,wins,kills,'--');
					msgPadraoBot(message, resultado, site, nickLegivel);
				});
			}catch(e){}
		break;
		
		case "alt2":
			site = siteFortniteStatsCOM+parametroUsado;
			try{
				Browser.visit(site, function (e, browser) {				
					var wins,winP,kd,kills;	
					try{				
						kills = padraoAlt(browser,1, 2);				
						wins = padraoAlt(browser,3, 2);
						kd = padraoAlt(browser,2, 2);

						winP = padraoAlt(browser,6, 2);
						winP = winP.slice(0, -1);//remover char porcentagem
					}catch(e){
						print(message,"comando alt esta instavel (so funciona na segunda tentativa ou indefinido)");
						return;
					}
					
					
					//console.log(wins+espaco+kd+espaco+winP+espaco+kills);
					
					//var resultado = ">> "+nickLegivel+" Squad <<\r\nWins: "+ wins +separador+"Win %: "+ winP +separador+"Kills: "+ kills +separador+ "K/d: "+kd;
					var resultado = formatarMsg(winP,kd,wins,kills,'--');
					msgPadraoBot(message, resultado, site, nickLegivel);
				});
			}catch(e){}
		break;
		
		case "alt":
			site = siteFortniteScout+parametroUsado;
			try{
				Browser.visit(site, function (e, browser) {				
					var wins,winP,kd,kills,selector;	
					try{
						selector = "#performanceSquad > div.fillCard > div.matchPlacementsLegends > div.matchPlacementLegend.matchPlacementWinsColor";
						wins = getInnerHtml(browser, selector);
						wins = wins.substring(wins.indexOf(">")+1);
						
						selector= "#performanceSquad > div.fillCard > div:nth-child(5) > div.statLineRightSide > small:nth-child(1)";
						kills = getInnerHtml(browser, selector);
						kills = kills.substring(0,kills.indexOf("/"));
						
						selector= "#performanceSquad > div.fillCard > div:nth-child(5) > div.statLineRightSide > span";
						kd = getInnerHtml(browser, selector);
						
						selector= "#performanceSquad > div.fillCard > div:nth-child(6) > div.statLineRightSide > span";
						winP = getInnerHtml(browser, selector);
						winP = winP.slice(0, -1);//remover char porcentagem
					}catch(e){
						print(message,"comando alt esta instavel (so funciona na segunda tentativa ou indefinido)");
						return;
					}
					var resultado = formatarMsg(winP,kd,wins,kills,'--');
					msgPadraoBot(message, resultado, site, nickLegivel);
				});
			}catch(e){}
		break;
			
		case "att":
			print(message,"o comando att foi desativado, confira a sala att-level para atualizar o nick");
			return;
			break;
		case "r":
			//message.author.send("devido a sobrecarga na origin o comando r foi desativado, solicite sala no servidor para atualizar com arquivo");
			//message.author.send("devido a sobrecarga na origin o comando r foi desativado, use o comando .lvl a cada 3 níveis");
			tryPM(message.author, "devido a sobrecarga na origin o comando r foi desativado, use o comando .lvl a cada 3 níveis");
			return;
			break;
			try{
				switch(message.guild.id){								
					case '550108927698927626':
						nickLegivel=parametroUsado = getNickConhecidoApexAMS(message);
					break;

					case '542501242916700181':
						nickLegivel=parametroUsado = getNickConhecidoApexAMS(message);
					break;
					default:								
						nickLegivel=parametroUsado = getNickConhecidoApex(message);
					break;
				}
				
				parametroUsado=encodeURI(parametroUsado);
				if(args[1] !== undefined) /*message.author.send(errorNaoUsarProprioNick);*/tryPM(message.author, errorNaoUsarProprioNick);
			}catch(e){
				//caso nao tenha guarda chuva, mantem o nick como arg
			}
			site = "https://apex.tracker.gg/profile/pc/"+parametroUsado;
			try{
				Browser.visit(site, function (e, browser) {				
					var level;	
					try{
						var text = browser.html();
						text = text.substring(text.indexOf('"playerId": "'));
						text = "[{"+text.substring(0,text.indexOf(']'))+"]";
						text = JSON.parse(text);	
						level = text[0].level.value
						
						level = [level, level];
						
						switch(message.guild.id){
							case '542501711860727848':
								mudarNick(message, padraoNickApex(level[0],nickLegivel));
							break;
								
							case '550108927698927626':
								mudarNick(message, padraoNickApexAMS(level[0],nickLegivel));
							break;
							
							case '542501242916700181':
								mudarNick(message, padraoNickApexAMS(level[0],nickLegivel));
							break;
						}
					}catch(e){
						print(message,"erro: dados do apex tá offline, tente dps de 30s");
						return;
					}
					//var resultado = formatarMsg(winP,kd,wins,kills,'--');
					//msgPadraoBot(message, resultado, site, nickLegivel);
				});
			}catch(e){}
		break;
			
		
		case "mudei":
			getDadosApex(message, parametroUsado, nickLegivel, mudeiApex, false);
			/*site = "http://api.mozambiquehe.re/bridge?platform=PC&auth=0V7bLm3DwwImSEr9ruFI&player="+parametroUsado;
			try{
					var level;
				request(site, function (error, response, body) {
					try{
						var text = body;
						if(text == undefined) throw false; //crash logs
						var data;
						data = JSON.parse(text.substring(text.indexOf("{"), text.lastIndexOf("}")+1));
						if(data.global == undefined) {message.reply("tente novamente mais tarde");return;}
						level = data.global.level;
						
							
					}catch(e){return;}
				});
			}catch(e){
						//print(message,e);
			}
			*/
		break;
		
		
		case "km":
			// ~~ /100000 decartar segundos e milisegundos
			//console.log(message.createdTimestamp);
			//864000 24hrs
			var currTime = (~~((message.createdTimestamp%10000000000) /10000));
			currTime = currTime*10; //ficar em segundos
			//console.log(currTime);			
			
			executarComandoKM(currTime, message.author.id);
		break;
	
		
		case "ce":
		
		if(isDM) {
			if(nickConhecido){
				nickLegivel=parametroUsado= nickConhecido;
			}else{
				if(parametroUsado==undefined) getNickConhecidoDM(executarComandos, message, comando, args, isDM);
			}
			
		}
		
			if(!(message.author==reifelUser || usersPremium.includes(message.author.id))) {print(message,"comando exclusivo [Premium](https://catarse.me/reifeltracker)");return;}
		site = "https://apex.tracker.gg/profile/pc/"+parametroUsado;
			try{
				Browser.visit(site, function (e, browser) {				
					var kills=-1, dano=-1, level=0;	
					try{
						var text = browser.html();
						text = text.substring(text.indexOf('imp_Overview')+15);
						text = text.substring(0,text.indexOf('};')+1);
						text = JSON.parse(text);
						
						dano = text.damage.value;
						kills = text.kills.value;
						level = text.level.value;

							//if(partidas===undefined) {print(message,"ative partidas jogadas (games played) no banner e jogue uma partida para atualizar"); return;}

							//if(partidas < 150) {print(message,"quantidade de partidas insuficiente, minimo 150"); throw false;}
							if(level < 85) {print(message,"level insuficiente, minimo 85"); throw false;}
							//if(kills===undefined) kills = 0;
							var eloPontos = getEloKL(level,kills,0,dano);
							var pontos = eloPontos[2];
							message.reply("esse nick é tier "+eloPontos[0]+" e possui: "+pontos);

					}catch(e){
						//console.log(e);
					}
					
					limparMemoria(browser);
				});
			}catch(e){}
		break;
			
		//case "elotopa":
		case "elotops":
		case "elotop":
			var indiceTop, msgPrefix, msgID;
			switch(comando){
				case "elotops":	
				case "elotop":
					indiceTop=0;
					msgPrefix="Tier S ";
					msgID='565792106036199434';
				break;
				case "elotopa":
					indiceTop=1;
					msgPrefix="Tier A ";
					msgID='565792170108518400';
				break;
			}
			//if(topEloDesatualizado[indiceTop]){
			var resultado = "";
				/*
				//old
				var resultadoJSON = (top10ELO[indiceTop]).toJSON();
				if(resultadoJSON === undefined) return;
				for(var i=1; i<11; i++){
					if(resultadoJSON[i]!==undefined) resultado += (i)+" \t- \t"+resultadoJSON[i].nick+" \t"+resultadoJSON[i].elo+quebraLinha;
					else break;
				}
				*/
				//topEloSalvo[indiceTop] = resultado;
				resultado=(top10ELO[indiceTop]).print();
				client.channels.get("565784766901649409").fetchMessage(msgID)
				  .then(message2 => {
					message2.edit(resultado);
				} )
				  .catch(e => null);
				//topEloDesatualizado[indiceTop]=false;
			//}
			
			/*else{
				resultado = topEloSalvo[indiceTop];
			}
			
			print(message,msgPrefix+"ELO Ranking:"+quebraLinha+resultado);*/
			//print(message,"confira a sala ranking, na categoria elos");
		break;
			
		case "salvartabelaeloa":
		case "salvartabelaelo":
			if(message.author!=reifelUser) return;
			var indiceTop, msgID;
			switch(comando){
				case "salvartabelaelo":
					indiceTop=0;
					msgID = '565299781119770637';
				break;
				case "salvartabelaeloa":
					indiceTop=1;
					msgID = '565439920215425034';
				break;
			}
			var r="";
			for(var d of (top10ELO[indiceTop].root())) r+=JSON.stringify(d)+",";
			r='{"dados":['+r.substring(0,r.length-1)+']}';
			
			client.channels.get("459432939898273798").fetchMessage(msgID)
				  .then(message2 => {
					message2.edit(r);
				} )
				  .catch(e => null);
		break;
		
		
		/*case "removertabelaa":
		case "removertabela":
			if(message.author!=reifelUser) return;
			var indiceTop;
			switch(comando){
				case "removertabela":
					indiceTop=0;
				break;
				case "removertabelaa":
					indiceTop=1;
				break;
			}
			
			topEloDesatualizado[indiceTop] = true;
			(top10ELO[indiceTop]).removeAt(Number(nickLegivel)-1);
		break;
		*/

		case "carregartabelaeloa":
		case "carregartabelaelo":
			if(message.author!=reifelUser) return;
			var indiceTop, msgID;
			switch(comando){
				case "carregartabelaelo":
					indiceTop=0;
					msgID = '565299781119770637';
				break;
				case "carregartabelaeloa":
					indiceTop=1;
					msgID = '565439920215425034';
				break;
			}
			
			client.channels.get("459432939898273798").fetchMessage(msgID)
				  .then(message2 => {
					var jsonCarregado = JSON.parse(message2.content);
					jsonCarregado = jsonCarregado["dados"];
					(top10ELO[indiceTop]).create(jsonCarregado);
					/*for(var i = 1; i<6; i++){
						if(jsonCarregado[i]) (top10ELO[indiceTop]).add(jsonCarregado[i]);
						else break;
					}*/
				} )
				  .catch(e => null);
			//topEloDesatualizado[indiceTop] = true;
		break;
		
		case "rank":	
		case "ranked":			
			try{
				switch(message.guild.id){								
						case '550108927698927626':
							nickLegivel=parametroUsado = getNickConhecidoApexAMS(message);
						break;

						case '542501242916700181':
							nickLegivel=parametroUsado = getNickConhecidoApexAMS(message);
						break;
						default:								
							nickLegivel=parametroUsado = getNickConhecidoApex(message);
						break;
				}
			}catch(e){/*nick nao conhecido*/
				message.reply("Nick não registrado, envie o seu nick da origin no comando lvl (exemplo: .lvl nick)");
				return;
			}

			var rolesRank;
			switch(message.guild.id){
				default:
					rolesRank = ['595930565690261535','595930566482984961', '595930566847627265'];
				break;
			}
		
			site = "https://apex.tracker.gg/profile/pc/"+parametroUsado;
			Browser.visit(site, function (e, browser) {		
				//var level,wins,winP,kd,kills,selector;	
				try{
					text = browser.html();
					text = text.substring(text.indexOf('imp_Overview')+15);
					text = text.substring(0,text.indexOf('};')+1);
					text = JSON.parse(text);
					var rp = text.rankScore.value;
					var role = null;
					if(rp > 719){
						//diamante
						role = rolesRank[0];
					}else if(rp > 479){							
						//platina
						role = rolesRank[1];
					}else if(rp > 279){					
						//gold
						role = rolesRank[2];					
					}

					if(role != null){
						setTimeout(function(){ 
							message.member.addRole(role).catch(err => null);			
							try{message.react(reactEmoji).catch(e=>null);}catch(e){}
						}, 1700);		
					}else{
						message.reply("apenas diamante, platina ou ouro");
					}
					
						limparMemoria(browser);

				}catch(e){}
			});
		break;
		
		
		case "ondevou":
			//nao foi possivel colocar gif no embed.image e nem no setImage do richembed
			//so pegou usando attachment
			var lugar = Math.floor(Math.random() * (100))%lugaresApex.length;
			const attachment = new Discord.Attachment(lugaresApex[lugar][1]);
			
			message.channel.send("te DESAFIO a ir aqui: :point_down: "+lugaresApex[lugar][0], attachment).catch(e => null);
		break;
			
		case "elo":
		try{
			switch(message.guild.id){								
					case '550108927698927626':
						nickLegivel=parametroUsado = getNickConhecidoApexAMS(message);
					break;

					case '542501242916700181':
						nickLegivel=parametroUsado = getNickConhecidoApexAMS(message);
					break;
					default:								
						nickLegivel=parametroUsado = getNickConhecidoApex(message);
					break;
			}
		}catch(e){/*nick nao conhecido*/
			message.reply("Nick não registrado, envie o seu nick da origin no comando lvl (exemplo: .lvl nick)");
			return;
		}
			var cargosElo;
			
			switch(message.guild.id){
				case '566666902748004363': //FNT
					cargosElo = ['591235793335484437', '591235793390010370', '591235793817829376', '0'];
				break;
					
				default:
					cargosElo = ['562423267894231072', '622443382538502144', '562423268511055892', '581226705612701700']
				break;
			}
		/*	
		site = "https://www.apexlegendsapi.com/api/v1/player?platform=pc&name="+parametroUsado;
			try{
				Browser.visit(site, function (e, browser) {	
					try{
						var text = browser.html();
						var data = JSON.parse(text.substring(text.indexOf("{"), text.lastIndexOf("}")+1));
						
						if(data == undefined) {message.reply("tente novamente mais tarde");return;}
						var level = data.level;
						data = (data.legends[0]).stats;
						var a = data;
						var c = {};
						for(var i of a) for(var key in i) c[key] = i[key];
						data = c;
						
						a=c=null;						
						var partidas = data.games_played, kills = data.kills;
						*/
			site = "https://apex.tracker.gg/profile/pc/"+parametroUsado;
			var dados = {"level":0, "dano": -1, "kills": -1};
			try{
				Browser.visit(site, function (e, browser) {				
					var kills=-1, dano=-1, level=0;	
					try{
						var text = browser.html();
						text = text.substring(text.indexOf('imp_Overview')+15);
						text = text.substring(0,text.indexOf('};')+1);
						text = JSON.parse(text);
						
						dano = text.damage.value;
						kills = text.kills.value;
						level = text.level.value;
						text=null;
							//if(partidas===undefined) {print(message,"ative partidas jogadas (games played) no banner e jogue uma partida para atualizar"); return;}
						
						dados.level = level;
						dados.dano = dano;
						dados.kills = kills;
						eloApex(message, cargosElo, dados, nickLegivel);
						limparMemoria(browser);
					}catch(e){											
						limparMemoria(browser);
						switch(e.name){
							case "SyntaxError":
							break;
						}
						
						//callDebug(e, "elo", message.author);
						//message.reply("houve um problema, se o elo for menor, jogue uma partida com cada campeao, enviando elo quando terminar a partida");
						site = "http://api.mozambiquehe.re/bridge?platform=PC&auth=0V7bLm3DwwImSEr9ruFI&player="+parametroUsado;
						try{
								//var level;
							request(site, function (error, response, body) {
								try{
									var text = body;
									if(text == undefined) throw false; //crash logs
									var data;
									data = JSON.parse(text.substring(text.indexOf("{"), text.lastIndexOf("}")+1));
									text = body = null;
									if(data.global == undefined) {message.reply("tente novamente mais tarde");return;}
									level = data.global.level;
									kills = data.total.kills;
									dano = data.total.damage;
									data = null;
									

									dados.level = level;
									dados.dano = dano;
									dados.kills = kills;					
									eloApex(message, cargosElo, dados, nickLegivel);	

								}catch(e){
								}
							});
						}catch(e){
									//print(message,e);
						}
					}
					
				});
			}catch(e){
				//site alt
				
				callDebug(e, "elo manutencao", message.author);
				message.reply("elo em manutenção");
			}
			
						
						/*
						if(dano===undefined) dano = 0;
						if(kills===undefined) kills = 0;
						var eloPontos = getElo(level,kills,dano);
						var pontos = Number(eloPontos[1]).toFixed(0);
						switch(eloPontos[0]){
							case "S":
								changeRole(message.member, "562135972028874762", "562135971517300736");
								message.reply(pontos+" pontos, tierS");
								break;
							case "A":
								if(message.member.roles.has("562135971517300736")){
									setTimeout(function(){ 
										message.member.removeRole("562135971517300736").catch(err => console.log(err)).then( () => 
											{												
												changeRole(message.member, "562135972028874762", "562135971802513408");
												message.reply(pontos+" pontos, tierA");
											}
										);
									}, 1700);	
								}else{
									changeRole(message.member, "562135972028874762", "562135971802513408");
									message.reply(pontos+" pontos, tierA");
								}
								
								break;
							case "B":
								changeRole(message.member, "562135972028874762", "562135972028874762");
								message.reply(pontos+" pontos, tierB");
								break;
							default:
								message.reply(pontos+" não elegivel para tier ainda");
								break;
						}
						
					}catch(e){
						//console.log(e);
					}
					
					limparMemoria(browser);
				});	
			}catch(e){}	*/
		break;
			
		case "dk":			
			if(args[1] === undefined) {print(message,"faltou colocar o nick desejado depois de dk (.dk nick)");return;}
			
			site = "https://apex.tracker.gg/profile/pc/"+parametroUsado;
			try{
				Browser.visit(site, function (e, browser) {				
					var kills=-1, dano=-1;	
					try{
						var text = browser.html();
						text = text.substring(text.indexOf('imp_Overview')+15);
						text = text.substring(0,text.indexOf('};')+1);
						text = JSON.parse(text);
						kills = text.kills.value;
						dano = text.damage.value;
						
						if(dano===-1) dano = "---";
						if(kills===-1) kills = "---";
						msgImgApex(message, [dano+"", kills+"", nickLegivel+""]);

					}catch(e){
						//console.log(e);
					}
					
					limparMemoria(browser);
				});
			}catch(e){}	
		break;
		
		case "attboleto":
			if(message.author!=reifelUser) return;
			//boleto anonimo
			client.channels.get("625721376308723713").fetchMessage('625721462526836746').then(message2 => {		
				boletoanonimo = JSON.parse(message2.content);
			} )
			  .catch(e => null);
			//fim-boleto
		break;
			
		case "vitoria":
			var att = (message.attachments).array();
			//if(att[0].filesize > 1000000) {message.author.send("**limite ultrapassado (>1MB)**,\r\n use um desses sites para reduzir o tamanho e envie a imagem gerada no site:\r\n http://tinypng.com (.PNG) | http://tinyjpg.com (.JPG) | png2jpg.com"); return;};
			var h = att[0].height, w = att[0].width;
			if(h<720) {print(message, "erro: print de baixa qualidade, resoluções permitidas: 720p ou mais ( _ x 720)"); return;}
						
			var formato = att[0].url;
			formato = formato.substring(formato.lastIndexOf(".")+1);
			options.imageFormat = "image/"+formato;
			
			Jimp.read(att[0].url)
				  .then(compressImg => {
					var cx = 0.27*w, cy=0.10*h, cw=2*cx, ch=cy;
					compressImg
					  //.resize(1360, 768) // resize
					  //.quality(40) // set JPEG quality
					  .greyscale() // set greyscale
					  .crop(cx,cy,cw,ch)
					  //.crop(360,70,700,70)
					  //.write('teste.jpg'); // save
					  ;
					  compressImg.getBase64(Jimp.AUTO, (err, res) => {						
						parseImageFromBase64(res, options)
						  .then( function (parsedResult){print(message,imgrResultado(parsedResult)); }
							).catch(err => {
								e => null(err);
							  }); 
					  });


					  
				  })
				  .catch(err => {
					e => null(err);
				  });
			/*
			parseImageFromUrl(att[0].url, options)
			  .then(function (parsedResult) {
				  var a = JSON.parse(parsedResult);
				  //parsedResult = parsedResult.ParsedResults[0].ParsedText;
				  var leitura = sort_unique(a.ParsedResults[0].ParsedText.split("\r\n"));
				  var kills="", lugar="";
				  var posKills, posLugar;
				  for(var i of leitura){
					  //console.log(i);
					posKills = i.indexOf("SQUAD KILLS");
					if(posKills===-1) posKills = i.indexOf(" ELIMINA");

					posLugar = i.indexOf("PLACED");
					if(posLugar===-1) posLugar = i.indexOf("POSI");

					if(posKills !== -1) kills = i.substr(0,2);
					if(posLugar !== -1) lugar = i.substr(8,2);
				  }
				  print(message, lugar.replace("DE","1").replace("#","").replace("I","1")+" "+kills.replace("B","8"));
			  }).catch(function (err) {
				console.log('ERROR:', err);
			  });*/
		break;
		
		case "lvl":			
			try{
				switch(message.guild.id){								
					case '550108927698927626':
						nickLegivel=parametroUsado = getNickConhecidoApexAMS(message);
					break;

					case '542501242916700181':
						nickLegivel=parametroUsado = getNickConhecidoApexAMS(message);
					break;
					default:								
						nickLegivel=parametroUsado = getNickConhecidoApex(message);
					break;
				}
				
				parametroUsado=encodeURI(parametroUsado);
				if(args[1] !== undefined) /*message.author.send(errorNaoUsarProprioNick);*/tryPM(message.author, errorNaoUsarProprioNick);
			}catch(e){
				//caso nao tenha guarda chuva, mantem o nick como arg
				if(args[1] == undefined) {print(message,"ainda não registrado, envie o comando .lvl espaço seu nick da origin");return;}
			}
			
			getDadosApex(message, parametroUsado, nickLegivel, padraoLvlApex, true);
			
		break;
			
		case "lendas":
			
			if(isDM) {
				if(nickConhecido){
					nickLegivel=parametroUsado= nickConhecido;
				}else{
					if(parametroUsado==undefined) getNickConhecidoDM(executarComandos, message, comando, args, isDM);
				}

			}
			
			if(!(message.author==reifelUser || usersPremium.includes(message.author.id))) {print(message,"comando exclusivo [Premium](https://catarse.me/reifeltracker)");return;}
			if(parametroUsado === "") return;
			var site;		
			try{ //tentar atualizar usando outro site
				var selector, temp;
				site = "https://public-api.tracker.gg/apex/v1/standard/profile/5/"+parametroUsado;	
				Browser.visit(site, function (e, browser) {
					try{
						var a = JSON.parse(browser.text('body'));
						var ar = [];
						for(var i=0; i<a.data.children.length; i++){
							if(a.data.children[i].stats[0].metadata.key=="Kills") ar.push({"n":a.data.children[i].metadata.legend_name, "k":a.data.children[i].stats[0].value});
						}

						ar.sort(function(x,y){
							if(x.k > y.k) return -1;
							if(x.k < y.k) return 1;
							return 0;
						});

						var rn = [];
						var rk = [];
						for(var i=0; i<3; i++){
							if(ar[i]) {
								rn.push(ar[i].n);
								rk.push(ar[i].k);
							}

						}
						print(message, rn.join(' > ')+"\r\nkills: ( "+rk.join(', ')+" )");

						//ad
						sendAD(message);

						limparMemoria(browser);					
					}catch(e){						
						limparMemoria(browser);
						return;
					}
				});
			}catch(e){
						//print(message, e.message);
				//print(message, nickLegivel + " lendas");						
			}
			
		break;
			
		case "semana":
			message.author.send("Certo! avisei ao Reifel que vc quer semana gratis, ele vai mandar msg pra vc jaja pra comecar a instalação, se quiser adiantar: cria uma sala reifeltracker no discord q vai usar e manda um convite pro @Reifel#5047 <@195731919424585728> que ele instala");
			reifelUser.send(message.author+" quer semana gratis");
		break;
		case "queroessebot":
		case "discord":
		case "tbquero":
			message.author.send("Agradeço pelo interesse "+message.author+"\r\n"+tabelaPreco).catch(e => null);
			reifelUser.send(message.author+" futuro cliente https://discordapp.com/users/"+message.author.id);
		break;
		
		case "convitegratis":			
			message.author.send(conviteFreeLink);
			reifelUser.send(message.author+" ta usando free");
		break;
		
		case "rankFort":
			
			try{
				nickLegivel=parametroUsado = getNickConhecido(message);
				parametroUsado=encodeURI(parametroUsado);
				if(args[1] !== undefined) print(message,errorNaoUsarProprioNick);
			}catch(e){
				//caso nao tenha guarda chuva, mantem o nick como arg
			}
			
		site = siteFortniteTracker+parametroUsado+ftParam;
		try{
			Browser.visit(site, function (e, browser){
				try{					
					var text = browser.html();
					var jsonSquad;
					try{
						jsonSquad = getJsonSquad(text);
						text=null;
					}catch(e){			
						//console.log("error rank");
						throw false;		
					}
					var winrKD = up(jsonSquad);
					
					switch(message.guild.id){
						case '325413143943577601': //pai
							const ouro = '410483257264701441', prata = '410483152214163457', bronze = '410529877830139924',continuaOndeEstaPai = "continua onde está,\r\nOuro - kd >= 2.0\r\nPrata - kd >= 1.0\r\nBronze < 1.0";
							if(winrKD[1]>=2.0){
								if(message.member.roles.has(ouro)) {print(message,"você está na patente máxima");return;}
								changeRole(message.member, prata, ouro);	
								print(message,"Parabéns! Você agora é <@&410483257264701441> \:trophy: \:ok_hand:");
							}else if(winrKD[1]>=1.0){
								if(message.member.roles.has(prata)) {print(message,continuaOndeEstaPai); return;}
								changeRole(message.member, bronze, prata);	
								print(message,"Parabéns! Você agora é <@&410483152214163457> \:trophy: \:ok_hand:");
							}else{
								if(message.member.roles.has(bronze)) {print(message,continuaOndeEstaPai); return;}
								changeRole(message.member, ouro, bronze);	
								print(message,"Parabéns! Você agora é <@&410529877830139924> \:trophy: \:ok_hand:");
							}
							mudarNick(message, padraoNickKD(winrKD[1],nickLegivel), txt1MudarNick+winrKD[0]+txt3MudarNick);
							//message.member.setNickname( padraoNickKD(winrKD[1],nickLegivel) ).then(message.member.setNickname( padraoNickKD(winrKD[1],nickLegivel) )).then(user => message.reply("winrate: **"+winrKD[0]+`**, atualizei kd \:umbrella2:`)).catch(err => console.log(err));
						break;
						
						case '368240657816354836': //bro
							var matches=11;
							if(jsonSquad[matches].label !== 'Matches'){
								var n=0;
								for( i=0; i < jsonSquad.length; i++ ){
									//console.log(jsonSquad[i].label);
									switch(jsonSquad[i].label){
										case "Matches":
											matches = n;
										break;					
									}
									n++;
								}					
							}	
						
							const unstoppable='414929764961484800',sanguinario='414929831508312064',mitico='393260318434000907', godlike='376840180688224257', legendary='373639920591306753', epic='373640006314754057', rare='373640089986924554', incomum='373640161290092544', desconhecido='387071306451124224', continuaOndeEsta = "continua onde está, verifique "+salaRank+" antes de usar o comando rank";
							//se n tiver o minimo de wins ignora
							if(jsonSquad[matches].ValueInt > 250){
								if(  message.member.roles.has(desconhecido) ) message.member.removeRole(desconhecido).catch(err => console.log(err));
							}else{					
								changeRole(message.member, desconhecido, incomum);
								//remover desconhecido
								mudarNick(message, padraoNick(winrKD[0],nickLegivel), txt2MudarNick+winrKD[1]+txt3MudarNick);
								//message.member.setNickname( padraoNick(winrKD[0],nickLegivel) ).then(message.member.setNickname( padraoNick(winrKD[0],nickLegivel) )).then(user => message.reply("kd: **"+winrKD[1]+`**, atualizei winrate \:umbrella2:`)).catch(err => console.log(err));
								if(  message.member.roles.has(desconhecido) ) message.member.removeRole(desconhecido).catch(err => console.log(err));
								print(message,"Parabéns! Você agora é <@&373640161290092544> \:trophy: \:ok_hand:");
								jsonSquad=null;								
								return;
							}
							jsonSquad=null;
							
							/*
							MITICO		- Win % 45 - K/d 6.7
							GODLIKE		- Win % 30 - K/d 4.3
							LEGENDARY	- Win % 25 - K/d 3.5
							EPIC		- Win % 20 - K/d 2.7
							RARE		- Win % 15  - K/d 1.9
							INCOMUM		- Win % 10 - K/d 1.1
							*/
							
							try{
								if( 			winrKD[0]>=45 && winrKD[1]>=7.4){//unstoppable
									if(message.member.roles.has(unstoppable)) {print(message,"você está na patente máxima");return;}
									changeRole(message.member, sanguinario, unstoppable);	
									print(message,"Parabéns! Você agora é <@&414929764961484800> \:trophy: \:ok_hand:");
									
								}else if(		winrKD[0]>=40 && winrKD[1]>=6.5){//sanguinario
									if(message.member.roles.has(sanguinario)){print(message,continuaOndeEsta); return;}
									changeRole(message.member, mitico, sanguinario);	
									print(message,"Parabéns! Você agora é <@&414929831508312064> \:trophy: \:ok_hand:");
								
								}else if(		winrKD[0]>=35 && winrKD[1]>=5.7){//mitico
									if(message.member.roles.has(mitico)){print(message,continuaOndeEsta); return;}
									changeRole(message.member, godlike, mitico);	
									print(message,"Parabéns! Você agora é <@&393260318434000907> \:trophy: \:ok_hand:");
									
								}else if(winrKD[0]>=30 && winrKD[1]>=4.3){//godlike
									if(message.member.roles.has(godlike)) {print(message,continuaOndeEsta); return;}
									changeRole(message.member, legendary, godlike);	
									print(message,"Parabéns! Você agora é <@&376840180688224257> \:trophy: \:ok_hand:");	
									
								}else if(winrKD[0]>=25 && winrKD[1]>=3.5){//lendario
									if(message.member.roles.has(legendary)) {print(message,continuaOndeEsta); return;}
									changeRole(message.member, epic, legendary);
									print(message,"Parabéns! Você agora é <@&373639920591306753> \:trophy: \:ok_hand:");	
									
								}else if(winrKD[0]>=20 && winrKD[1]>=2.7){//epic
									if(message.member.roles.has(epic)){print(message,continuaOndeEsta); return;}
									changeRole(message.member, rare, epic);
									print(message,"Parabéns! Você agora é <@&373640006314754057> \:trophy: \:ok_hand:");
									
								}else if(winrKD[0]>=15 && winrKD[1]>=1.9){//rare
									if(message.member.roles.has(rare)) {print(message,continuaOndeEsta); return;}
									changeRole(message.member, incomum, rare);	
									print(message,"Parabéns! Você agora é <@&373640089986924554> \:trophy: \:ok_hand:");
									
								}else if(winrKD[0]>=10 && winrKD[1]>=1.1){//incomum
									if(message.member.roles.has(incomum)) {print(message,continuaOndeEsta); return;}
									changeRole(message.member, desconhecido, incomum);		
									print(message,"Parabéns! Você agora é <@&373640161290092544> \:trophy: \:ok_hand:");
									
								}else {
									//um dia talvez sera aqui q serao kickados e mandando msg q qnd atingir 10% e 1.1 kd podem voltar
									//aprendiz
									changeRole(message.member, desconhecido,'376134044439805952'); //aprendiz
									print(message,"patente cadastrada");
								}
								if(message.member.roles.has(desconhecido)) {message.member.removeRole(desconhecido).then(message.member.removeRole(desconhecido)).then(/*message.member.setNickname( padraoNick(winrKD[0],nickLegivel) )*/ mudarNick(message, padraoNick(winrKD[0],nickLegivel)) ).catch(err => message.reply("houve um problema")); return;}
								mudarNick(message, padraoNick(winrKD[0],nickLegivel), txt2MudarNick+winrKD[1]+txt3MudarNick);
								//message.member.setNickname( padraoNick(winrKD[0],nickLegivel) ).then(message.member.setNickname( padraoNick(winrKD[0],nickLegivel) )).then(user => message.reply("kd: **"+winrKD[1]+`**, atualizei winrate \:umbrella2:`)).catch(err => console.log(err));
							}catch(e){
								
							}
						break;
						
						case '313195845761761281'://galera gamer (09-18 gg esport gers)
							padraoRankWin(message, message.member, nickLegivel, winrKD, '495770249308667915', '495770249841344522', '495770250026024971', [30, 22], "Continua onde está,\r\Diamante - winrate >= 30\r\Ouro - winrate >= 22\r\nBronze < 22");
							
							/*
							const galComum='410811911567835157', galEpico='410811966618337280', galLendario='410812044397379604', continuaOndeEstaGal = "continua onde está,\r\Diamante - winrate >= 30\r\Ouro - winrate >= 22\r\nBronze < 22";
							if(winrKD[0]>=30){
								if(message.member.roles.has(galLendario)) {print(message,"você está na patente máxima");return;}
								changeRole(message.member, galEpico, galLendario);	
								print(message,"Parabéns! Você agora é <@&410812044397379604> \:trophy: \:ok_hand:");
							}else if(winrKD[0]>=22){
								if(message.member.roles.has(galEpico)) {print(message,continuaOndeEstaGal); return;}
								changeRole(message.member, galComum, galEpico);	
								print(message,"Parabéns! Você agora é <@&410811966618337280> \:trophy: \:ok_hand:");
							}else{
								if(message.member.roles.has(galComum)) {print(message,continuaOndeEstaGal); return;}
								changeRole(message.member, galLendario, galComum);	
								print(message,"Parabéns! Você agora é <@&410811911567835157> \:trophy: \:ok_hand:");
							}
							message.member.setNickname( padraoNick(winrKD[0],nickLegivel) ).then(message.member.setNickname( padraoNick(winrKD[0],nickLegivel) )).then(user => message.reply("kd: **"+winrKD[1]+`**, atualizei winrate \:umbrella2:`)).catch(err => console.log(err));
							*/
						break;
						
						case '398566083101196298': //fortnite da depressaum
							padraoRankKD(message, message.member, nickLegivel, winrKD, '419295597061865492', '419295575960322048', '419295542863069205', [3, 2, 1], "Continua onde está,\r\Lendário - kd >= 3\r\Epico - kd >= 2\r\nRaro >= 1");
							/*
							const depRaro='419295542863069205', depEpico='419295575960322048', depLendario='419295597061865492',continuaOndeEstadep = "continua onde está,\r\Lendário - kd >= 3\r\Epico - kd >= 2\r\nRaro >= 1";
							if(winrKD[1]>=3){
								if(message.member.roles.has(depLendario)) {print(message,"você está na patente máxima");return;}
								changeRole(message.member, depEpico, depLendario);	
								print(message,"Parabéns! Você agora é <@&419295597061865492> \:trophy: \:ok_hand:");
							}else if(winrKD[1]>=2){
								if(message.member.roles.has(depEpico)) {print(message,continuaOndeEstadep); return;}
								changeRole(message.member, depRaro, depEpico);	
								print(message,"Parabéns! Você agora é <@&419295575960322048> \:trophy: \:ok_hand:");
							}else if(winrKD[1]>=1){
								if(message.member.roles.has(depRaro)) {print(message,continuaOndeEstadep); return;}
								changeRole(message.member, depLendario, depRaro);	
								print(message,"Parabéns! Você agora é <@&419295542863069205> \:trophy: \:ok_hand:");
							}else{
								print(message,continuaOndeEstadep); return;
							}
							message.member.setNickname( padraoNickKD(winrKD[1],nickLegivel) ).then(message.member.setNickname( padraoNickKD(winrKD[1],nickLegivel) )).then(user => message.reply("winrate: **"+winrKD[0]+`**, atualizei kd \:umbrella2:`)).catch(err => console.log(err));
							*/
						break;
						
						case '385896642429321216': //colosso
							padraoRankKD(message, message.member, nickLegivel, winrKD, '419295597061865492', '419295575960322048', '419295542863069205', [4, 2.5, 1.25], "Continua onde está,\r\Big Rider - kd >= 4\r\Marola - kd >= 2.5\r\Pescador >= 1.25");
							/*
							const colRaro='442862754886451200', colEpico='442862734460059668', colLendario='442862713681477644',continuaOndeEstacol = "continua onde está,\r\Big Rider - kd >= 4\r\Marola - kd >= 2.5\r\Pescador >= 1.25";
							if(winrKD[1]>=4){
								if(message.member.roles.has(colLendario)) {print(message,"você está na patente máxima");return;}
								changeRole(message.member, colEpico, colLendario);	
								print(message,"Parabéns! Você agora é <@&442862713681477644> \:trophy: \:ok_hand:");
							}else if(winrKD[1]>=2.5){
								if(message.member.roles.has(colEpico)) {print(message,continuaOndeEstacol); return;}
								changeRole(message.member, colRaro, colEpico);	
								print(message,"Parabéns! Você agora é <@&442862734460059668> \:trophy: \:ok_hand:");
							}else if(winrKD[1]>=1.25){
								if(message.member.roles.has(colRaro)) {print(message,continuaOndeEstacol); return;}
								changeRole(message.member, colLendario, colRaro);	
								print(message,"Parabéns! Você agora é <@&442862754886451200> \:trophy: \:ok_hand:");
							}else{
								print(message,winrKD[1]+"de KD\r\nContinue melhorando! ainda não possui KD pra conquistar seu cargo.\r\n(use comando !up se quiser atualizar nick)\r\n"+continuaOndeEstacol); return;
							}
							message.member.setNickname( padraoNickKD(winrKD[1],nickLegivel) ).then(message.member.setNickname( padraoNickKD(winrKD[1],nickLegivel) )).then(user => message.reply("winrate: **"+winrKD[0]+`**, atualizei kd \:umbrella2:`)).catch(err => console.log(err));
							*/
						break;
						
						case '377628278627893248': //most wanted
							padraoRankKD(message, message.member, nickLegivel, winrKD, '420326999064707082', '420326972045000715', '420326919758807060', [5,3,1], "Continua onde está,\r\Lendário - kd >= 5\r\Epico - kd >= 3\r\nRaro >= 1");
							/*
							const mwdRaro='420326919758807060', mwdEpico='420326972045000715', mwdLendario='420326999064707082',continuaOndeEstamwd = "continua onde está,\r\Lendário - kd >= 3\r\Epico - kd >= 2\r\nRaro >= 1";
							if(winrKD[1]>=5){
								if(message.member.roles.has(mwdLendario)) {print(message,"você está na patente máxima");return;}
								changeRole(message.member, mwdEpico, mwdLendario);	
								print(message,"Parabéns! Você agora é <@&420326999064707082> \:trophy: \:ok_hand:");
							}else if(winrKD[1]>=3){
								if(message.member.roles.has(mwdEpico)) {print(message,continuaOndeEstamwd); return;}
								changeRole(message.member, mwdRaro, mwdEpico);	
								print(message,"Parabéns! Você agora é <@&420326972045000715> \:trophy: \:ok_hand:");
							}else if(winrKD[1]>=1){
								if(message.member.roles.has(mwdRaro)) {print(message,continuaOndeEstamwd); return;}
								changeRole(message.member, mwdLendario, mwdRaro);	
								print(message,"Parabéns! Você agora é <@&420326919758807060> \:trophy: \:ok_hand:");
							}else{
								print(message,continuaOndeEstamwd); return;
							}
							message.member.setNickname( padraoNickKD(winrKD[1],nickLegivel) ).then(message.member.setNickname( padraoNickKD(winrKD[1],nickLegivel) )).then(user => message.reply("winrate: **"+winrKD[0]+`**, atualizei kd \:umbrella2:`)).catch(err => console.log(err));
							*/
						break;
						
						
						
						case '263777831635386368': //brothers
							padraoRankWin(message, message.member, nickLegivel, winrKD, '453703573537030144', '453703574124363776', '453703574380347403');
							
							/*
							const brtsRaro='453703574380347403', brtsEpico='453703574124363776', brtsLendario='453703573537030144',continuaOndeEstabrts = "continua onde está,\r\Lendário - kd >= 30\r\Epico - kd >= 22\r\nRaro < 22";
							if(winrKD[0]>=30){
								if(message.member.roles.has(brtsLendario)) {print(message,"você está na patente máxima");return;}
								changeRole(message.member, brtsEpico, brtsLendario);	
								print(message,"Parabéns! Você agora é <@&453703573537030144> \:trophy: \:ok_hand:");
							}else if(winrKD[0]>=22){
								if(message.member.roles.has(brtsEpico)) {print(message,continuaOndeEstabrts); return;}
								changeRole(message.member, brtsRaro, brtsEpico);	
								print(message,"Parabéns! Você agora é <@&453703574124363776> \:trophy: \:ok_hand:");
							}else{
								if(message.member.roles.has(brtsRaro)) {print(message,continuaOndeEstabrts); return;}
								changeRole(message.member, brtsLendario, brtsRaro);	
								print(message,"Parabéns! Você agora é <@&453703574380347403> \:trophy: \:ok_hand:");
							}
							message.member.setNickname( padraoNick(winrKD[0],nickLegivel) ).then(message.member.setNickname( padraoNick(winrKD[0],nickLegivel) )).then(user => message.reply("kd: **"+winrKD[1]+`**, atualizei winrate \:umbrella2:`)).catch(err => console.log(err));
							*/
						break;
							
						case '381535199454035968': //skgaming
							padraoRankWin(message, message.member, nickLegivel, winrKD, '456170372392419328', '456170373055250454', '456170373743116288');
						break;
							
						case '308334202158579714': //scream
							padraoRankWin(message, message.member, nickLegivel, winrKD, '464536409773178880', '464536410485948416', '464536410624360471');
						break;
						
						case '401211618240888833': //fortmito
							padraoRankKD(message, message.member, nickLegivel, winrKD, '464623293576511519', '464623293820043276', '464623294574886922');
						break;
						
						case '396432582897827840': //xirus
							padraoRankWin(message, message.member, nickLegivel, winrKD, '466787845076549647', '466787845328207882', '466787845596512266');
						break;
							
						case '495268890750746625': //marvel
							padraoRankWin(message, message.member, nickLegivel, winrKD, '496161210056835092', '496161210178469900', '496161210702626826');
						break;
												
						default:
							var rolesFree = frees[message.guild.id+""];
							padraoRankWin(message, message.member, nickLegivel, winrKD, rolesFree[0], rolesFree[1], rolesFree[2]);
						break;
						
					}
					
				}catch(e){					
					//console.log("error rank2");
				}
			});
		}catch(e){}
		break;
		
		case "arma":
			const sniper = '413377502552129538', shotgun = '413377506524135455', explosivos = '413377504620052490', sucessoArma="arma registrada com sucesso", opcoesArma="opcoes: sniper, shotgun, explosivos";
			 
			if( message.member.roles.some(r=>[sniper, shotgun, explosivos].includes(r.id)) ){
				print(message,"Arma principal já registrada");
				return;
			}else{
				if(nickLegivel==undefined){
					print(message,opcoesArma);
					return;
				}
				switch(nickLegivel.toLowerCase()){
					case "sniper":
						message.member.addRole(sniper).catch(err => console.log(err));
						print(message,sucessoArma);
					break;
					
					case "12":
					case "espingarda":
					case "pump":
					case "shotgun":
						message.member.addRole(shotgun).catch(err => console.log(err));
						print(message,sucessoArma);
					break;
					
					case "bazuca":
					case "rocket":
					case "granadeira":
					case "granada":
					case "explosivos":
						message.member.addRole(explosivos).catch(err => console.log(err));
						print(message,sucessoArma);
					break;
					
					case "opcoes":
						print(message,opcoesArma);
					break;
					
					default:
						print(message,opcoesArma);
					break;
				}
			}
		break;
		case "ti":
			var proprionick=false;
			if(nickLegivel === undefined){
				proprionick=true;
				try{
					nickLegivel=parametroUsado = getNickConhecido(message);
					parametroUsado=encodeURI(parametroUsado);
				}catch(e){
					print(message, errorNickNaoEncontrado); return;
				}
			}
			site = siteFortniteTracker+parametroUsado+ftParam;
			//crawler
			try{
				Browser.visit(site, function (e, browser) {				
					try{
						var text = browser.html();

						var jsonSquad;
						try{
							jsonSquad = getJsonSquad(text);
							//console.log(jsonSquad);
							text=null;
						}catch(e){		
							//console.log("error search");
							throw false;
						}

						try{
						//day7
						var d7WinRate, d7kd;
						var day7elem;


						day7elem = browser.queryAll("body > div.container.content-container > div:nth-child(1) > script:nth-child(10)");

						var j7 = day7elem[0].textContent;
						day7elem=null;
						var j8 = j7.split("}");
						d7kd = j8[13].split(":")[2].replace(/(\r\n|\n|\r|\"| )/gm,"");
						d7WinRate = j8[15].split(":")[2].replace(/(\r\n|\n|\r|\"| )/gm,"");
						d7WinRate = d7WinRate.slice(0,-1);

						

						}catch(e){
							
							d7WinRate="?";
							d7kd="?";
						}
						var valoresJimp = searchJimp(jsonSquad);
						valoresJimp.push(d7WinRate);
						valoresJimp.push(d7kd);
						valoresJimp.push(nickLegivel);
						msgImg(message, valoresJimp);
						//var imprimirvalores="";
						//for(var i of valoresJimp){
						//	imprimirvalores+=i+" ";
						//}
						//print(message,imprimirvalores);
						}catch(e){
						//console.log(e.message);
						print(message, nickLegivel + errorFortnitetracker);
					}

					
					limparMemoria(browser);
				});
			}catch(e){}
		break;
		
		case "novavotacao":
			if(message.member.roles.some(r=>[373640089986924554, 373640161290092544].includes(r.id))){return;}//raro e incomum nao pode - multiple
			salaVotem.send('/poll "Role de '+nickLegivel+' em highelo gameplay" "Rusher Primário" "Rusher Secondário" "Sniper" "Suporte" "Safe Player"').then(message => message.delete());
			print(message,"enviado para "+salaVotem);
		break;
		
		case "apostar":
			var nicks = nickLegivel.split(",").join('\" \"');
			salaAposta.send('/poll "Apostas" "'+nicks+'\"').then(message => message.delete());
			print(message,"enviado para "+salaAposta);
		break;
		
		case "ideia":			
			reifelUser.send("ideia: "+nickLegivel);
		break;
		
		case "reloadimg":
			if(message.author!=reifelUser) return;
			Jimp.read("http://snip.li/reifelbackground1", function (err, imagemBackground) {
				Jimp.loadFont(Jimp.FONT_SANS_16_WHITE).then(function (fontCarregada) {
					imageJimp=imagemBackground;
					fontJimp=fontCarregada;

					imageJimp.deflateStrategy(0).filterType(0);
				});
			});
		break;
		
		case "debug":
			if(message.author!=reifelUser) return;
			switch(parametroUsado){
				case "mem":
					var used = process.memoryUsage().heapUsed / 1048576; // /1024 /1024
					print(message,`The script uses approximately ${Math.round(used * 100) / 100} MB`);
				break;
				
				case "peak":
					print(message,mempeak+" MB");
				break;
			}
			//print(message,"ok");
			//msgImg(message);
			//console.log(message);
			//var indice = message.member.nickname.indexOf(trackerTag)+2;
			//console.log(message.member.nickname.substring(indice));
		break;
		
		case "txt":
			var Attachment = (message.attachments).array();
			console.log(Attachment[0].url); //outputs array
				try{
						Browser.visit(Attachment[0].url, function (e, browser) {
							var text = browser.text();
							text= text.substring(text.indexOf('localClientPlayerCachedLevel "')+30);
							text= text.substring(0,text.indexOf('"'));
							console.log(text);
						});
					
				}catch(e){}
		break;
		
		case "d":
			if(message.author!=reifelUser) return;
			var canal = "";
			var id = message.content;
			id = id.substring(3);
			var arrayCategorias=message.guild.channels.array();
			for(var idCategoria in arrayCategorias){ 		
				if(arrayCategorias[idCategoria].parentID == id) arrayCategorias[idCategoria].delete();
			}
		break;
			
		case "b": 
			if(message.author!=reifelUser) return;
			//adiciona a role bloqueado em todas as salas
			var canal = "";
			var id = message.content; //role id
			id = id.substring(3);
			var arrayCategorias=message.guild.channels.array();
			for(var idCategoria in arrayCategorias){				
				arrayCategorias[idCategoria].overwritePermissions(id,{'CREATE_INSTANT_INVITE': false,'KICK_MEMBERS': false,'BAN_MEMBERS': false,'ADMINISTRATOR': false,'MANAGE_CHANNELS': false,'MANAGE_GUILD': false,'ADD_REACTIONS': false,'VIEW_AUDIT_LOG': false,'VIEW_CHANNEL': false,'SEND_MESSAGES': false,'SEND_TTS_MESSAGES': false,'MANAGE_MESSAGES': false,'EMBED_LINKS': false,'ATTACH_FILES': false,'READ_MESSAGE_HISTORY': false,'MENTION_EVERYONE': false,'USE_EXTERNAL_EMOJIS': false,'CONNECT': false,'SPEAK': false,'MUTE_MEMBERS': false,'DEAFEN_MEMBERS': false,'MOVE_MEMBERS': false,'USE_VAD': false,'PRIORITY_SPEAKER': false,'CHANGE_NICKNAME': false,'MANAGE_NICKNAMES': false,'MANAGE_ROLES': false,'MANAGE_WEBHOOKS': false,'MANAGE_EMOJIS': false});
			}
		break;
		
		case "c":
			if(message.author!=reifelUser) return;
			try{
				var jsonConfig = message.content;
				jsonConfig = jsonConfig.substring(3);
				var obj =  JSON.parse(jsonConfig);
				var numeroInicio = obj["comeco"];
				if(numeroInicio===undefined){numeroInicio=1}
				
				var arrayCategorias=message.guild.channels.get(obj["categoriaID"]);
				var permissoes = [];
				var arrayPermissoesPai = arrayCategorias.permissionOverwrites.array();
				//fix permissionoverride obsoleto -> ChannelCreationOverwrites
				//id sao roles
				//arrayPermissoesPai = [ {id:'562812353343651840', allow: 1049600},  {id:'542501242916700181', deny: 1049600}];
				
				for(var perm of arrayPermissoesPai){
						var j = {};
						j["id"] = perm["id"];
						j["allow"] = perm["allow"];
						j["deny"] = perm["deny"];
						permissoes.push(j);
				}
				
				/*
				for(var permissao in arrayPermissoesPai){
					permissoes.push({"id":arrayPermissoesPai[permissao].id,"deny":arrayPermissoesPai[permissao].deny,"allow":arrayPermissoesPai[permissao].allow});
				}
				console.log(permissoes);
				*/
				
				criarVoice(obj, numeroInicio, obj["qtd"], message, obj["name"], permissoes);				
			}catch(e){console.log("error criar"); console.log(e);}
		
		break;
		
		case "db":
			if(message.author!=reifelUser) return;
			message.channel.send(ad).catch(e => null);
			return;
			var channelBusca = client.channels.get("459432939898273798");			
			//channelBusca.send('{ "name":"Rafael", "count":30}');
			
			channelBusca.fetchMessage('459435742351982618')
			  .then(message => editarJSON(message) )
			  .catch(e => null);
		break;
			
		
		case "add":
			if(message.author!=reifelUser) return;
			
			var novo = nickLegivel.split("+");
			
			
			//client.channels.get("459432939898273798").send('{ "discords":[368240657816354836,377628278627893248,363610360688672778], "salas":[387003077695373315,428883305874718731] }');
			
			
			client.channels.get("459432939898273798").fetchMessage('461722127205269505')
			  .then(message => {
					try{
					var obj =  JSON.parse(message.content);
					obj["discords"].push(Number(novo[0]));
					obj["salas"].push(Number(novo[1]));
					discAutorizados = obj["discords"];					
					salasAutorizadas = obj["salas"];
					message.edit(JSON.stringify(obj));
										
					}catch(e){}
			} )
			  .catch(e => null);
		break;
		case "preco":
			if(message.author!=reifelUser) return;
			var guildsRegistradas = client.guilds.array();
			var retorno="", preco;
			for(var a of guildsRegistradas){
				console.log(a.memberCount);
				if(a.memberCount < 86){
					preco = "R$ 8 - ";
				}else
				if(a.memberCount < 251){
					preco = "R$ 15 - ";
				}else
				if(a.memberCount < 651){
					preco = "R$ 18 - ";
				}else{
					preco = "R$ 22 - ";
				}			
				retorno+=(preco+a.name+quebraLinha+a.memberCount+quebraLinha+a.id+quebraLinha+"<@"+a.ownerID+"> "+quebraLinha+client.users.get(a.ownerID).username+" "+quebraLinha+quebraLinha);
			}
			print(message,retorno);
		break;
		case "rem":
			if(message.author!=reifelUser) return;
			
			var novo = nickLegivel.split("+");
			
			
			//client.channels.get("459432939898273798").send('{ "discords":[368240657816354836,377628278627893248,363610360688672778], "salas":[387003077695373315,428883305874718731] }');
			
			
			client.channels.get("459432939898273798").fetchMessage('461722127205269505')
			  .then(message => {
					try{
					var obj =  JSON.parse(message.content);
					obj["discords"].splice(obj["discords"].indexOf(Number(novo[0])),1);
					obj["salas"].splice( obj["salas"].indexOf(Number(novo[1])),1);
					discAutorizados = obj["discords"];					
					salasAutorizadas = obj["salas"];
					message.edit(JSON.stringify(obj));
										
					}catch(e){}
			} )
			  .catch(e => null);
			
			client.guilds.get(novo[0]).leave();
		break;
		
		
		case "new":
			if(message.author!=reifelUser) return;
			
			var novo = nickLegivel;
			
			
			//client.channels.get("459432939898273798").send('{ "discords":[368240657816354836,377628278627893248,363610360688672778], "salas":[387003077695373315,428883305874718731] }');
			
			
			client.channels.get("459432939898273798").fetchMessage('461722127205269505')
			  .then(message => {
					message.edit(novo);
					discAutorizados = novo["discords"];					
					salasAutorizadas = novo["salas"];
			} )
			  .catch(e => null);
		break;
			
		case "clientes":
			if(message.author!=reifelUser) return;
			
			var guildsRegistradas = client.guilds.array();
			for(var a of guildsRegistradas){
				print(message, a.name+quebraLinha+a.id+quebraLinha+"<@"+a.ownerID+">"+quebraLinha+"https://cdn.discordapp.com/icons/"+a.id+"/"+a.icon+".png"+quebraLinha);
			}
		break;
			
		case "apoio":
			if(nickLegivel === undefined) message.author.send("Obrigado pelo interesse de apoiar, envie o comando apoio seguido de qualquer valor em reais [R$3 vale 10%] (.apoio 5) ou envie msg privada para (@Reifel#5047 <@195731919424585728>),\r\ntem disponivel essas formas de pagamento: boleto, transferência bancária (banco do brasil), depósito, paypal");
			reifelUser.send(message.author+" quer apoiar");
		break;
			
		case "barra":
			if(message.author!=reifelUser) return;
			
			atualizarBarraApoio(nickLegivel);
		break;
					
		case "edit":		
			if(message.author!=reifelUser) return;	
			var idMsg = nickLegivel.split("+");
			client.channels.get("459432939898273798").fetchMessage(idMsg[0])
				  .then(message2 => {
					message2.edit(idMsg[1]);
				} )
				  .catch(e => null);		
		break;
					
		case "creditar": //insere em reais e eh convertido em credito	
			if(message.author!=reifelUser) return;	
			client.channels.get("459432939898273798").fetchMessage("616043152905863178")
				  .then(message2 => {
					var adicional = (cred12*Number(nickLegivel))/12;
					adicional= adicional.toFixed(0);
					var atual = Number(message2.content);
					adicional = Number(adicional);
					message2.edit(atual+adicional);
				
					credito+=adicional;
					message.guild.me.setNickname(atualizarVisualCredito());
				} )
				  .catch(e => null);		
		break;
		
			
					
		case "editcreditar": //insere em reais e eh convertido em credito	
			if(message.author!=reifelUser) return;	
			client.channels.get("459432939898273798").fetchMessage("616043152905863178")
				  .then(message2 => {
					
					message2.edit(Number(nickLegivel));
				
					credito=Number(nickLegivel);
					message.guild.me.setNickname(atualizarVisualCredito());
				} )
				  .catch(e => null);		
		break;
			
		case "send":
			if(message.author!=reifelUser) return;
			
			var channelBusca = client.channels.get(parametroUsado);			
			channelBusca.send('{}');
		break;
				
		
		case "pm":
			if(message.author!=reifelUser) return;
			try{				
				var igualtoken=nickLegivel.indexOf("=");
				var id = nickLegivel.substring(0,igualtoken);
				var msg = nickLegivel.substring(igualtoken+1);
				var userpm = client.users.get(id);
				userpm.send(msg);
			}catch(e){}
		break;
			
		
		case "sair":			
			if(message.author!=reifelUser) return;
			client.guilds.get(nickLegivel).leave();
		break;
		case "uninstall":
			if(message.author!=reifelUser) return;
			
			//removendo o apelido de todos
			for(var membros of message.guild.members){
				try{
					if(membros[1].nickname) membros[1].setNickname("").catch(err=>{});
				}catch(e){}
			}

			//removendo as roles
			var roles = nickLegivel.replace(/(')/gm,"").split(", ");
			for(var role of roles){
				try{message.guild.roles.find("id",role).delete();}catch(e){}
			}

			//tirando bot do server
			//message.guild.leave();
			
			print(message,"reifeltracker 100% desinstalado");
			
		break;
		
		case "empartida":			
			return; //desativado
			//if(!saoOrganizadores(message)) return;
			site = "http://api.apexlegendsstatus.com/bridge?platform=PC&auth=0V7bLm3DwwImSEr9ruFI&player="+parametroUsado;
			try{
				request(site, function (error, response, body) {
					try{
						var text = body;
						if(text == undefined) throw false; //crash logs
						var data;
						data = JSON.parse(text.substring(text.indexOf("{"), text.lastIndexOf("}")+1));
						if(data.realtime.isInGame){
							print(message,"em partida");
						}else{
							print(message,"no lobby");
						}
					}catch(e){return;}
				});
			}catch(e){
						//print(message,e);
			}	
			break;
		case "rempontos":
			if(!saoOrganizadores(message)) return;
			var timeP = nickLegivel.split("-");
			retirarPontos(timeP[0],Number(timeP[1]));
		break;
		case "addpontos":
			if(!saoOrganizadores(message)) return;
			var timeP = nickLegivel.split("-");
			retirarPontos(timeP[0],Number(timeP[1])*(-1));
		break;
			
		case "nanpontos":
			if(!saoOrganizadores(message)) return;
			client.channels.get("558046408989474886").fetchMessage('559502399614484490')
				  .then(message2 => {					   
						message2.edit(message2.content.replace("NaN",nickLegivel));
				} )
				  .catch(e => null);
		break;
			
		case "s":
			if(!saoOrganizadores(message)) return;
			switch(parametroUsado){
				case "id":
					message.channel.send({embed: {
						  color: 3447003,
							description: "A contagem de times por partida começou! (ex. 73e)\r\n(digite os 3 digitos do código da partida APENAS UMA vez, será lido e deletado pelo bot)"
						}
					});
					
					message.channel.send('Resultado em breve...')
					  .then(msgContagem => setTimeout(function(){msgContagem.delete()}, 90000) )
					  .catch(e => null);
					
					var partidas={};
					var usuariosPartidas = {};
					
					// Await !vote messages
					const filter = m => m.content;
					// Errors: ['time'] treats ending because of the time limit as an error
					message.channel.awaitMessages(msg => {
						if(!msg.author.bot){
							var codigo = msg.content;
							if(codigo.length > 3) codigo = codigo.substring(0,3);
							
							codigo = codigo.toLowerCase();
							
							if(partidas[codigo]) partidas[codigo]++;
							else partidas[codigo] = 1;

							if(usuariosPartidas[codigo]) usuariosPartidas[codigo] += " / "+msg.author; //inicializar 
							else usuariosPartidas[codigo] = msg.author;

							msg.delete();	
						}
					}, { max: 110, time: 100000, errors: ['time'] })
					  .then(collected => {print(message,contagemPartidas(partidas)); message.author.send(contagemUsuarioPartidas(usuariosPartidas));})
					  .catch(collected => {print(message,contagemPartidas(partidas)); message.author.send(contagemUsuarioPartidas(usuariosPartidas));});

				break;
				case "ativarprints":
					aprendizadoPausado=false;
					print(message,"prints ativo");
					client.channels.get("459432939898273798").fetchMessage('559897722296205324')
					  .then(message2 => {
							message2.edit("1");
					} )
					  .catch(e => null);
				break;
				case "pausarprints":
					aprendizadoPausado=true;
					print(message,"prints pausado");

					client.channels.get("459432939898273798").fetchMessage('559897722296205324')
					  .then(message2 => {
							message2.edit("0");
					} )
					  .catch(e => null);
				break;
			}
		break;
		/*
		case "v":			
			switch(parametroUsado){
				case "off": 
					voiceChannel.leave();
					voiceChannel=null;
				return;
				break;
				
				case "go":	
					const stream = ytdl('https://www.youtube.com/watch?v=Pexk2sDn_yA', {highWaterMark: 30739, filter: 'audioonly', quality: 'lowest'} );
					
					const dispatcher = connectionGlobal.playStream(stream, { seek: 0, volume: 1 });
					
				break;
				
				default:			
					if(nickLegivel) voiceChannel = client.channels.find("name",nickLegivel);	
				break;
				
			}				

			if(voiceChannel) voiceChannel.join()
			  .then(connection => {
				connectionGlobal = connection;
			  })
			  .catch(e => null);
		break;
		*/
		
		case "help":
		case "comandos":
			//print(message, helpMessage);
			

			message.channel.send({embed: {
					color: 3447003,
					description: menuComandos[0],
					footer: {text:"desde 2017, dono: Reifel#5047, catarse.me/reifeltracker"}
				}
			}).then(msg => msg.react("⬅").then(() => msg.react("➡")));	
		break;
		
		case "prefab":
			if(message.author!=reifelUser) return;
			
			var rolesCriadas = [0,0,0];
			try{
				message.guild.createRole({
					name: 'Lendário',
					color: 'GOLD',
					hoist: true, 
					managed: true,
					mentionable: true

				}).then(role => rolesCriadas[0] = role.id).catch(e => null);

				message.guild.createRole({
					name: 'Épico',
					color: 'PURPLE',
					hoist: true, 
					managed: true,
					mentionable: true
				}).then(role => rolesCriadas[1] = role.id).catch(e => null);		

				message.guild.createRole({
					name: 'Raro',
					color: 'BLUE',
					hoist: true, 
					managed: true,
					mentionable: true
				}).then(role => print(message,"'"+rolesCriadas[0]+"', '"+rolesCriadas[1]+"', '"+role.id+"'")).catch(e => null);
			}catch(e){};

			//verificar os cargos que nao podem usar o bot (hierarquia)				
			var roleBotPosicao;
			try {roleBotPosicao == message.guild.roles.find("name","ReifelTracker").position;}
			catch(e){roleBotPosicao == message.guild.roles.find("name","reifelTracker").position;}
			var tempRole;
			var retorno ="```diff\r\n- Dono do servidor\r\n";
			for(var roleID of message.guild.roles){
				tempRole=message.guild.roles.get(roleID[0]);
				if(roleBotPosicao < tempRole.position) retorno+="- "+tempRole.name+quebraLinha;				
			}
			if(retorno.length===9) {retorno+="+todos tem permissão```";print(message,retorno);return;}
			retorno+="```";			
			print(message,"cargos que reifeltracker não tem permissão de alterar o nick:\r\n"+retorno+"\r\npara permitir pra esses cargos,\r\nconfigurações do servidor >> cargos >> arraste reifeltracker pra cima\r\ne coloque acima dos cargos que vão utilizar o bot");

		break;
				
		//case ".ready":
		//	readySimultaneo(message);
		//break;
			
		case "verificar":
			if(message.author!=reifelUser) return;
			//verificar os cargos que nao podem usar o bot (hierarquia)						
			var roleBotPosicao;
			try {roleBotPosicao == message.guild.roles.find("name","ReifelTracker").position;}
			catch(e){roleBotPosicao == message.guild.roles.find("name","reifelTracker").position;}
			
			var tempRole;
			var retorno ="```diff\r\n- dono do server\r\n";
			for(var roleID of message.guild.roles){
				tempRole=message.guild.roles.get(roleID[0]);
				if(roleBotPosicao < tempRole.position) retorno+="- "+tempRole.name+quebraLinha;				
			}
			if(retorno.length===9) {retorno+="+todos tem permissão```";print(message,retorno);return;}
			retorno+="```";
			print(message,"cargos que reifeltracker não tem permissão de alterar o nick:\r\n"+retorno+"\r\npara permitir pra esses cargos,\r\nconfigurações do servidor >> cargos >> arraste reifeltracker pra cima\r\ne coloque acima dos cargos que vão utilizar o bot");

		break;
		
		case "recorde":
			
		
			
			try{ //tentar atualizar usando outro site
				var selector;
				var site = "https://fortnitetracker.com/profile/pc/"+parametroUsado+"/bests";
				Browser.visit(site, function (e, browser) {					
					var resultado, selector;	
					try{							
						selector= "body > div.trn-site__container > script:nth-child(4)"; //account id
						//https://fortnitetracker.com/api/v0/profile/account_id/records
						resultado = getInnerHtml(browser, selector);
						print(message, resultado);
					}catch(e){
						print(message,"erro recorde");
						return;
					}
					//message.member.setNickname( padraoNick(winP,nickLegivel) ).then(user => message.reply(`atualizei winrate \:umbrella2:`)).catch(err => console.log(err));	
					
					
					limparMemoria(browser);
				});
			}catch(e){
				print(message, nickLegivel + " recorde");						
			}

		break;
		
		case "boleto":			
			if(message.author!=reifelUser) return;
			reifelUser.send(format(nickLegivel));
		break;
		
		case "togglesuspender":
			if(message.author!=reifelUser) return;
			ativarsuspender = !ativarsuspender;
			print(message,"ok");
		break;
		case "suspender":
			if(message.author!=reifelUser) return;
			suspensos.push(nickLegivel);
			print(message,"ok");
		break;
		case "dessuspender":
			if(message.author!=reifelUser) return;
			for( i=0; i < suspensos.length; i++ ){
				if(suspensos[i]==nicklegivel) suspensos.splice(i,1);
			}
			print(message,"ok");
		break;
		case "testesuspender":
			print(message,ativarsuspender);
			var resultado="";
			for(var k of suspensos){
				resultado+=k+", ";
			}
			print(message,resultado);
		break;
		default:
			print( message, comandoErrado);
		break;
	}	
}


const topPartidas = 6;
function contagemPartidas(dict){
	// Create items array
	var items = Object.keys(dict).map(function(key) {
	  return [key, dict[key]];
	});

	// Sort the array based on the second element
	items.sort(function(first, second) {
	  return second[1] - first[1];
	});
	
	items = items.slice(0, topPartidas);
	
	var retorno="Times por partida:\r\n";
	for(var i of items){
		retorno+=i[1]+"\t-\t"+i[0]+quebraLinha;
	}
	
	return retorno;
}

function contagemUsuarioPartidas(dict){
	// Create items array
	var items = Object.keys(dict).map(function(key) {
	  return [key, dict[key]];
	});
	
	// Sort the array based on the second element
	items.sort(function(first, second) {
	  return second[1].length - first[1].length;
	});
	
	
	items = items.slice(0, topPartidas);
	
	var retorno="Usuarios por partida:\r\n";
	for(var i of items){
		retorno+=i[0]+"\t-\t"+i[1]+"\r\n";
	}
	
	return retorno;
}

function editarJSON(message){
	try{
	var obj =  JSON.parse(message.content);
	obj.count += 1;
	message.edit(JSON.stringify(obj));
					
	}catch(e){}
	/*
	para nova key, obj[NovaKey] = valores
	*/
}

//codigo criacao de reifel
var buscas= [
'var playerData',
'</script>',
'"p9"'
];

const msg1Rank="Parabéns! Você agora é <@&",msg2Rank="> \:trophy: \:ok_hand:";
function padraoRankWin(message, usuario, nickLegivel, winrKD, lendario, epico, raro, tabela=[30,22], continuaRank="Continua onde está,\r\Lendário - winrate >= 30\r\Epico - winrate >= 22\r\nRaro < 22"){
		if(winrKD[0]>=tabela[0]){
			if(usuario.roles.has(lendario)) {print(message,"Você está na patente máxima");return;}
			changeRole(usuario, epico, lendario);	
			print(message,msg1Rank+lendario+msg2Rank);
		}else if(winrKD[0]>=tabela[1]){
			if(usuario.roles.has(epico)) {print(message,continuaRank); return;}
			changeRole(usuario, raro, epico);	
			print(message,msg1Rank+epico+msg2Rank);
		}else{
			if(usuario.roles.has(raro)) {print(message,continuaRank); return;}
			changeRole(usuario, lendario, raro);	
			print(message,msg1Rank+raro+msg2Rank);
		}
		mudarNick(message, padraoNick(winrKD[0],nickLegivel), txt2MudarNick+winrKD[1]+txt3MudarNick);
		//usuario.setNickname( padraoNick(winrKD[0],nickLegivel) ).then(usuario.setNickname( padraoNick(winrKD[0],nickLegivel) )).then(user => message.reply("kd: **"+winrKD[1]+`**, atualizei winrate \:umbrella2:`)).catch(err => console.log(err));	
}

//const continuaRankKD= "Continua onde está,\r\Lendário - kd >= 4\r\Epico - kd >= 2.5\r\nRaro >= 1.25\r\nPrecisa melhorar < 1.25";
function padraoRankKD(message, usuario, nickLegivel, winrKD, lendario, epico, raro, tabela=[4, 2.5, 1.25], continuaRank="Continua onde está,\r\Lendário - kd >= 4\r\Epico - kd >= 2.5\r\nRaro >= 1.25\r\nPrecisa melhorar < 1.25"){
		if(winrKD[1]>=tabela[0]){
			if(usuario.roles.has(lendario)) {print(message,"Você está na patente máxima");return;}
			changeRole(usuario, epico, lendario);	
			print(message,msg1Rank+lendario+msg2Rank);
		}else if(winrKD[1]>=tabela[1]){
			if(usuario.roles.has(epico)) {print(message,continuaRank); return;}
			changeRole(usuario, raro, epico);	
			print(message,msg1Rank+epico+msg2Rank);
		}else if(winrKD[1]>=tabela[2]){
			if(usuario.roles.has(raro)) {print(message,continuaRank); return;}
			changeRole(usuario, lendario, raro);	
			print(message,msg1Rank+raro+msg2Rank);
		}else{
			print(message,winrKD[1]+" de KD\r\nContinue melhorando! ainda não possui KD pra conquistar seu cargo.\r\n(use comando !up se quiser atualizar nick)\r\n"+continuaRank); return;
		}
		mudarNick(message, padraoNickKD(winrKD[1],nickLegivel), txt1MudarNick+winrKD[0]+txt3MudarNick);
		//message.member.setNickname( padraoNickKD(winrKD[1],nickLegivel) ).then(message.member.setNickname( padraoNickKD(winrKD[1],nickLegivel) )).then(user => message.reply("winrate: **"+winrKD[0]+`**, atualizei kd \:umbrella2:`)).catch(err => console.log(err));
}

function msgImg(message, valoresJimp){//winrate, kd, wins, kills, trn
	
	var copiaJimp = imageJimp.clone();
	const linha1=6,linha2=62,linha3=30, linha4=92, linha5=110;
	copiaJimp.print(fontJimp, 56,linha1, valoresJimp[0])
		.print(fontJimp, 149,linha1, valoresJimp[1])
		.print(fontJimp, 47,linha2, valoresJimp[2])
		.print(fontJimp, 138,linha2, valoresJimp[3])
		.print(fontJimp, 95,linha4, (valoresJimp[4]*0.02).toFixed(2)+"%")		
		.print(fontJimp, 59,linha3, valoresJimp[5])		
		.print(fontJimp, 151,linha3, valoresJimp[6])
		.print(fontJimp, 5,linha5, valoresJimp[7])
		.write(tempFile, function(){
		
			// Create the attachment using MessageAttachment
			const attachment = new Discord.Attachment(tempFile);
			// Send the attachment in the message channel with a content
			message.channel.send(attachment);
		});
	copiaJimp=null;
}

function compararPlayers(jsonSquadPA,nickA, jsonSquadPB,nickB){
	//console.log(text+"\r\n\r\n");
	
	var resultado="";
	var trn = 0
	,wins = 2
	,kd = 9
	,winP = 10
	,kills = 12;
	
	const winsLabel = 'Wins'
	,winpLabel = 'Win %'
	,killsLabel = 'Kills'
	,kdLabel = 'K/d'
	,trnLabel = 'TRN Rating'
	;
	
	if(jsonSquadPA[wins].label === 'Wins' && jsonSquadPA[winP].label === 'Win %' && jsonSquadPA[kills].label === 'Kills' && jsonSquadPA[kd].label === 'K/d')
	{}	
	else{			
			var n=0;
			for( i=0; i < jsonSquadPA.length; i++ ){
				//console.log(jsonSquadPA[i].label);
				switch(jsonSquadPA[i].label){
					case winsLabel:
						wins = n;
						//console.log("wins = "+n);
					break;
					
					case winpLabel:
						winP = n;
						//console.log("winP = "+n);
					break;
						
					case killsLabel:
						kills = n;
						//console.log("kills = "+n);
					break;
					
					case kdLabel:
						kd = n;
						//console.log("kd = "+n);
					break;
					
				}
				n++;
			}
	}
	var trnA, trnB;
	try{
		trnA = jsonSquadPA[trn].ValueInt;	
		trnB = jsonSquadPB[trn].ValueInt;			
	}catch(e){
		trnA = 0;	
		trnB = 0;
	}
	
	var ganhos=["",""];
	var txtwins=" Wins ", txtkd=" kd ",  txtwinsP=" Wins% ", txtkills=" kills ", txttrn=" desempenho ";
	var ganhador=0;
	

	
	ganhador = (jsonSquadPA[wins].ValueInt > jsonSquadPB[wins].ValueInt ) ? 0 : 1;
	ganhos[ganhador]+=txtwins;
	
	ganhador = (jsonSquadPA[kd].ValueDec > jsonSquadPB[kd].ValueDec )? 0 : 1;	
	ganhos[ganhador]+=txtkd;
	
	ganhador = (jsonSquadPA[winP].ValueDec > jsonSquadPB[winP].ValueDec )? 0 : 1;	
	ganhos[ganhador]+=txtwinsP;
	
	ganhador = (jsonSquadPA[kills].ValueInt > jsonSquadPB[kills].ValueInt )? 0 : 1;	
	ganhos[ganhador]+=txtkills;
	
	ganhador = (trnA > trnB )? 0 : 1;	
	ganhos[ganhador]+=txttrn;
	
	
	if(ganhos[0]=="") ganhos[0]="nada";
	if(ganhos[1]=="") ganhos[1]="nada";
	resultado = "\r\n```bash\r\n\r\ncomando exclusivo $premium\r\n```\r\nNa comparação foi melhor\r\n"+nickA+": "+ganhos[0]+"\r\n"+nickB+": "+ganhos[1];
	
	
	return resultado;
}

function searchJimp(jsonSquad){ //plataforma discord ou twitch	
	//console.log(text+"\r\n\r\n");
	
	var resultado=[];
	var trn = 0
	,wins = 2
	,kd = 9
	,winP = 10
	,kills = 12;
	
	const winsLabel = 'Wins'
	,winpLabel = 'Win %'
	,killsLabel = 'Kills'
	,kdLabel = 'K/d'
	,trnLabel = 'TRN Rating'
	;
	
	if(jsonSquad[wins].label === 'Wins' && jsonSquad[winP].label === 'Win %' && jsonSquad[kills].label === 'Kills' && jsonSquad[kd].label === 'K/d')
	{}	
	else{			
			var n=0;
			for( i=0; i < jsonSquad.length; i++ ){
				//console.log(jsonSquad[i].label);
				switch(jsonSquad[i].label){
					case winsLabel:
						wins = n;
						//console.log("wins = "+n);
					break;
					
					case winpLabel:
						winP = n;
						//console.log("winP = "+n);
					break;
						
					case killsLabel:
						kills = n;
						//console.log("kills = "+n);
					break;
					
					case kdLabel:
						kd = n;
						//console.log("kd = "+n);
					break;
					
					case trnLabel:
						trn = n;
						//console.log("trn = "+n);
					break;
					
				}
				n++;
			}
	}
	
	var valorTrn;
	try{
		valorTrn = jsonSquad[trn].value;		
	}catch(e){
		valorTrn = '--';
	}
	
	if(jsonSquad[wins].value===0) resultado= errorNuncaGanhouSquad;
	//resultado = ">> "+nick+" Squad <<\r\nWins: "+jsonSquad[wins].value+separador+"Win %: "+jsonSquad[winP].value +separador+"Kills: "+jsonSquad[kills].value +separador+ "K/d: "+jsonSquad[kd].value +quebraLinha+ site +quebraLinha+ creditos;
	//else resultado = ">> "+nick+" Squad <<\r\nWins: "+jsonSquad[wins].value+separador+"Win %: "+jsonSquad[winP].value +separador+"Kills: "+jsonSquad[kills].value +separador+ "K/d: "+jsonSquad[kd].value;
	//else resultado = ">> "+nick+" Squad <<\r\nWins: "+jsonSquad[wins].value+separador+"Win %: "+jsonSquad[winP].value +separador+"Kills: "+jsonSquad[kills].value +separador+ "K/d: "+jsonSquad[kd].value;
	else {
			
			resultado=[jsonSquad[winP].value, jsonSquad[kd].value, jsonSquad[wins].value, jsonSquad[kills].value, valorTrn];
		
		
		//fim modif twitch
	}
	jsonSquad=null;	
	
	return resultado;
}

function search(jsonSquad,plataforma){ //plataforma discord ou twitch	
	//console.log(text+"\r\n\r\n");
	
	var resultado="";
	var trn = 0
	,wins = 2
	,kd = 9
	,winP = 10
	,kills = 12;
	
	const winsLabel = 'Wins'
	,winpLabel = 'Win %'
	,killsLabel = 'Kills'
	,kdLabel = 'K/d'
	,trnLabel = 'TRN Rating'
	;
	
	if(jsonSquad[wins].label === 'Wins' && jsonSquad[winP].label === 'Win %' && jsonSquad[kills].label === 'Kills' && jsonSquad[kd].label === 'K/d')
	{}	
	else{			
			var n=0;
			for( i=0; i < jsonSquad.length; i++ ){
				//console.log(jsonSquad[i].label);
				switch(jsonSquad[i].label){
					case winsLabel:
						wins = n;
						//console.log("wins = "+n);
					break;
					
					case winpLabel:
						winP = n;
						//console.log("winP = "+n);
					break;
						
					case killsLabel:
						kills = n;
						//console.log("kills = "+n);
					break;
					
					case kdLabel:
						kd = n;
						//console.log("kd = "+n);
					break;
					
					case trnLabel:
						trn = n;
						//console.log("trn = "+n);
					break;
					
				}
				n++;
			}
	}
	
	var valorTrn;
	try{
		valorTrn = jsonSquad[trn].value;		
	}catch(e){
		valorTrn = '--';
	}
	
	if(jsonSquad[wins].value===0) resultado= errorNuncaGanhouSquad;
	//resultado = ">> "+nick+" Squad <<\r\nWins: "+jsonSquad[wins].value+separador+"Win %: "+jsonSquad[winP].value +separador+"Kills: "+jsonSquad[kills].value +separador+ "K/d: "+jsonSquad[kd].value +quebraLinha+ site +quebraLinha+ creditos;
	//else resultado = ">> "+nick+" Squad <<\r\nWins: "+jsonSquad[wins].value+separador+"Win %: "+jsonSquad[winP].value +separador+"Kills: "+jsonSquad[kills].value +separador+ "K/d: "+jsonSquad[kd].value;
	//else resultado = ">> "+nick+" Squad <<\r\nWins: "+jsonSquad[wins].value+separador+"Win %: "+jsonSquad[winP].value +separador+"Kills: "+jsonSquad[kills].value +separador+ "K/d: "+jsonSquad[kd].value;
	else {
		//twitch
		switch(plataforma){			
			case 't':
				resultado = "[ "+jsonSquad[winP].value+"% de Win Rate] --- [ "+ jsonSquad[kd].value +" de kills antes de morrer] --- [ "+ jsonSquad[wins].value +" de Win] --- [ " + jsonSquad[kills].value +" no total de Kills] --- [ Desempenho: "+ valorTrn+" de 5000]";
			break;
			
			default:
				resultado = formatarMsg(jsonSquad[winP].value, jsonSquad[kd].value, jsonSquad[wins].value, jsonSquad[kills].value, valorTrn);
			break;
		}
		//fim modif twitch
	}
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

function formatarMsg(winP, kd, wins, kills,trn){
	var valorTrn;
	if(trn[0]=='-') valorTrn = "--";
	else valorTrn = (trn*0.02).toFixed(2);
	const p1 = "Win %: **"+winP+"** \t/\t Kd: **"+kd+"**"
	,p2 = "Wins: "+wins+" / Kills: "+kills
	,p3 = "Wins: "+wins+rightJustify(p2,p1.length-7,' ')+" \t/\t Kills: "+kills
	,p4 = "Desempenho: **"+valorTrn+"**%";
	return p1+quebraLinha+p3+quebraLinha+p4;
}

function up(jsonSquad){	
	
	var winP = 10, matches = 11, kd = 9;
	var retorno = [];
	
	if(jsonSquad[winP].label !== 'Win %' || jsonSquad[matches].label !== 'Matches' || jsonSquad[kd].label !== 'K/d'){			
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
		//cap new accounts - nerf smurf
		if(jsonSquad[matches].ValueInt < 36){ //no data to build trusty sample
			retorno[0] = (jsonSquad[winP].ValueDec * 0.2).toFixed(2)+"*";
			retorno[1] = (jsonSquad[kd].ValueDec * 0.2).toFixed(2)+"*";
		}
		//old accounts or ok winrate
		if(jsonSquad[matches].ValueInt > 250){ //pessoas de conta antiga ou pessoas q sao novas e tem winrate aceitavel
			retorno[0] = jsonSquad[winP].value;
			retorno[1] = jsonSquad[kd].value;
		}else{			
			retorno[0] = (jsonSquad[winP].ValueDec * 0.57).toFixed(2)+"*";
			retorno[1] = (jsonSquad[kd].ValueDec * 0.57).toFixed(2)+"*";
		}
		
	}catch(e){
		console.log("erro no cap");
	}
	
	//retorno[1]=jsonSquad[kd].value;
	
	return retorno;
	
}

function msgPadraoBot(message, text, site, nick, modo=" (Squad)"){
		message.channel.send({embed: {
			  color: 3447003,
				description: text+quebraLinha+randomDonate(),
				title: ( nick.charAt(0).toUpperCase() + nick.slice(1) ) + modo,
				url:site,
				//author: {
				//	name : "Perfil Squad de "+nick,
				//	icon_url :message.guild.iconURL,
				//	url:site
				//},
				footer: {
					icon_url:"https://cdn.discordapp.com/avatars/195731919424585728/9d5e514c328e3573531c72664b2e6d2b.png?size=32",
					text: rodape
				}
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
		var site = siteFortniteTracker+refreshAuto[i].parametroUsado+ftParam;
		
		setWinRateNick(message, site, i);
		
	}
}

function atualizarWinRateNick(message, winRate, i){
	message.guild.members.get(refreshAuto[i].member).setNickname( padraoNick(winRate, refreshAuto[i].nickLegivel) ).then( forRecusivo(message, i+1) ).catch(err => console.log(err));
}
//fim ForRecursivo - stack update

function setWinRateNick(message, site, i){
	try{
		Browser.visit(site, function (e, browser) {
			var text = browser.html();	
			try{
				var jsonSquad;
				try{
					jsonSquad = getJsonSquad(text);
					text=null;
				}catch(e){			
					//console.log("error up");
					throw false;		
				}
				
				var winrKD = up(jsonSquad);	
				atualizarWinRateNick(message, winrKD[0], i);
			}catch(e){
				refreshAuto = refreshAuto.splice(i, 1);//nick errado remove do array
			}		
		});
	}catch(e){}
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
				print(message,sucessoWinRateAtualizado+espaco+refreshRealizados+"ª das "+refreshRealizadosMAX);
				
			}
      }, refreshTEMPO);
}

function mudarNick(message, novoNick, extra=""){
	message.member.setNickname( novoNick ).then(user => message.reply(extra+`atualizei o nick`)).catch(err => message.reply(`Não consegui atualizar, mas seria: `+novoNick));
}

function mudarNickSilencioso(message, novoNick, extra=""){
	message.member.setNickname( novoNick ).then(user => tryPM(message.member, extra+`atualizei o nick`)).catch(err => message.reply(`Não consegui atualizar, mas seria: `+novoNick));
}


function mudarNickCalado(message, novoNick, extra=""){
	message.member.setNickname( novoNick ).catch(err => message.reply(`Não consegui atualizar, mas seria: `+novoNick));
}

//"☂ "
function padraoNick(winrate, nick){
	return winrate+"% ☂"+TAG+espaco+nick;
}

function padraoNickKD(kd, nick){
	return kd+" ☂"+TAG+espaco+nick;
}

function padraoNickApex(level, nick){
	return level+" ★"+TAG+espaco+nick;
}

function padraoNickApexAMS(level, nick){
	return TAG+espaco+nick+" "+level+" ★";
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
		//console.log("erro getJsonSquad");
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
			//console.log("error up");
			throw false;		
		}
		var winrKD = up(jsonSquad);
	}catch(e){
		//console.log("erro padraoAtualizarNome");
		throw false;
	}
	
	var userNick, posChuva;
	try{
		userNick = message.member.nickname;
		posChuva = userNick.indexOf(trackerTag);
	}catch(e){
		userNick = null;
		posChuva = -1;
	}
	var winrNome;	
	
	switch(message.guild.id){
		
		/*
		case "313195845761761281": //galera gamer
		case "368240657816354836": //bro
		case "263777831635386368": //brts
		case "381535199454035968": //skgaming
		case "455509665661583360": //snow
			var winrNome = message.member.nickname.substring(0,message.member.nickname.indexOf("%"));
			if(Number(winrNome)<Number(winrKD[0])) {
				mudarNick(message, padraoNick(winrKD[0],nickLegivel), txt2MudarNick+winrKD[1]+txt3MudarNick);
				//message.member.setNickname( padraoNick(winrKD[0],nickLegivel) ).then(user => message.reply("kd: **"+winrKD[1]+`**, atualizei winrate \:umbrella2:`)).catch(err => console.log(err));
			}
			else {message.reply(" não atualizei, pois no site está: "+winrKD[0]);}
		break;
		*/
					
		case "325413143943577601"://pai
		case "398566083101196298"://depressaum
		case "377628278627893248"://mwd
		case "385896642429321216"://colosso
		case "401211618240888833"://fortmito
		
			if(!userNick){ //eh dono
				mudarNick(message, padraoNickKD(winrKD[1],nickLegivel), txt1MudarNick+winrKD[0]+txt3MudarNick);
				return;
			}
			
			winrNome = userNick.substring(0,posChuva);
			if(Number(winrNome)<Number(winrKD[1])) {
				mudarNick(message, padraoNickKD(winrKD[1],nickLegivel), txt1MudarNick+winrKD[0]+txt3MudarNick);
				//message.member.setNickname( padraoNickKD(winrKD[1],nickLegivel) ).then(user => message.reply("winrate: **"+winrKD[0]+`**, atualizei kd \:umbrella2:`)).catch(err => console.log(err));	
			}
			else {message.reply(" não atualizei, pois no site está: "+winrKD[1]);}	
			//console.log(message.guild.roles);
		break;
		
		default: //WINRATE		
			if(!userNick){ //eh dono
				mudarNick(message, padraoNick(winrKD[0],nickLegivel), txt2MudarNick+winrKD[1]+txt3MudarNick);
				return;
			}
			
			winrNome = userNick.substring(0,posChuva-2);
			if(Number(winrNome)<Number(winrKD[0])) {
				mudarNick(message, padraoNick(winrKD[0],nickLegivel), txt2MudarNick+winrKD[1]+txt3MudarNick);
				//message.member.setNickname( padraoNick(winrKD[0],nickLegivel) ).then(user => message.reply("kd: **"+winrKD[1]+`**, atualizei winrate \:umbrella2:`)).catch(err => console.log(err));
			}
			else {message.reply(" não atualizei, pois no site está: "+winrKD[0]);}		
		break;
	}
	//if(message.member.hasPermission("MANAGE_NICKNAMES"))
	
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

function padraoAlt(browser,id, opcaoSite=2) {
	var elem, retorno;
	switch(opcaoSite){
		case 1: //stormshield
			//if(id===0){
			//	elem = browser.queryAll(winsStormShieldPath);		
			//}else{
			//	elem = browser.queryAll("body > div.container.pvp > div:nth-child(1) > div.col-12.col-md-8 > div:nth-child(1) > div:nth-child(4) > div > div.post > div:nth-child(3) > div:nth-child("+id+") > div > a > div.stat__value");
			//}
			elem = browser.queryAll("body > div.container.pvp > div:nth-child(1) > div.col-12.col-md-8 > div:nth-child(1) > div:nth-child(4) > div > div.post > div:nth-child(3) > div:nth-child("+id+") > div > a > div.stat__value");
			try{
				retorno = elem[0].innerText;
				retorno = retorno.substring(0,retorno.indexOf(espaco));				
			}catch(e){retorno="";}
		break;
		
		case 2: //fortnitestats.com
			elem = browser.queryAll("body > div.container.content > div > div.col-md-8 > div > div:nth-child(10) > div > div:nth-child("+id+") > h4");
			retorno = elem[0].innerHTML;
		break;
		
	}
	return retorno.replace(/(\r\n|\n|\r)/gm,"");
}

function getInnerHtml(browser, selector){
	var elem, retorno;
	elem = browser.queryAll(selector);
	try{
		retorno = elem[0].innerHTML;
	}catch(e){/*retorno="";*/throw false;}
	
	return retorno.replace(/(\r\n|\n|\r)/gm,"");
}


//pode ter uma forma melhor de fazer, do q repetir a chamada da funcao adicionando novo paramentro
function getNickConhecidoDM(executarComandos, message, comando, args, isDM){
	//eu posso fetchar uma vez apenas, e caso nao esteja, fetcha dnvo e ve se foi adicionado, se nao foi adiciona
	channelBuscaDM.fetchMessages()
	.then(messages => {
			var idUser= message.author.id;
			var elemento = messages.filter(m => m.content.lastIndexOf(idUser,14) !== -1);
			elemento = elemento.first();
			//console.log(elemento.content);
			var json = JSON.parse(elemento.content);
			executarComandos(message, comando, args, isDM, json.nickConhecido); //executar agr com o nick conhecido
		}
	)
  .catch(e => {console.log(e.message); message.reply("usuario nao cadastrado")});
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

function getNickConhecidoApexAMS(message){
	var posicaoGuardaChuva = -1;
	try{
		posicaoGuardaChuva = message.member.nickname.indexOf("★");		
	}catch(e){
		
	}
	if(posicaoGuardaChuva !== -1){
		var retorno = message.member.nickname.substring(0,  message.member.nickname.lastIndexOf(" ", posicaoGuardaChuva-2));
		return retorno;
	}else{
		throw false;
	}
}

function getNickConhecidoApex(message){
	var posicaoGuardaChuva = -1;
	try{
		posicaoGuardaChuva = message.member.nickname.indexOf("★");		
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
	
	setTimeout(function(){ 
			member.addRole(newRole).catch(err => console.log(err));
		}, 1700);	
	
	//setTimeout(function(){ 
	//		if( member.roles.has(oldRole) ) member.removeRole(oldRole).catch(err => console.log(err));	
	//	}, 1700);
		
	/*
	//go horse
	try{
		member.addRole(newRole).then(verifyRole(member,newRole)).then(verifyRole(member,newRole)).catch(err => console.log(err));		
	}catch(e){};
	
	
	try{
		if( member.roles.has(oldRole) ) member.removeRole(oldRole).catch(err => console.log(err));	
	}catch(e){};
	*/
}

function verifyRole(member, role){
	if(member.roles.has(role)){return;}else{member.addRole(newRole);}
}

const msgDonate = ['Donate', 'Dá uma moral', 'Apoie', 'Nunca te pedi nda', 'Be my senpai', 'Envia um airdrop', 'Dropa bala média', 'Põe o jump', 'Gostou?', 'Faz um cover'];
var anuncieiRecente=false;
function randomDonate(){
	if(anuncieiRecente) {anuncieiRecente=false;return "";}
	const reduzirMsgDonate = Math.ceil(msgDonate.length*2.6);
	const index = Math.floor(Math.random() * (msgDonate.length+reduzirMsgDonate));
	if(index >= msgDonate.length) return "";
	else {anuncieiRecente=true; {var used = Math.round(process.memoryUsage().heapUsed / 1048576); if(mempeak < used) mempeak = used; return AnunciarNovosPlanos/*+quebraLinha+msgDonate[index]+doacao*/};}
}

//const ad = '```brainfuck\r\ngaranta seu uso e alivie pro dono do discord +recompensas```https://catarse.me/reifeltracker';
//const adsContent = ["com menos clientes (donos de discords) apoiando: o bot pode ser desativado,\r\npara manter o projeto ativo: [clique aqui](https://catarse.me/reifeltracker) (inclui prêmios)", "evite a barra [-----] credito, pois indica sem recurso e para de funcionar,\r\npara +detalhes ou creditar [clique aqui](https://catarse.me/reifeltracker)"];
const adsContent = ["para o bot não ser desativado, ele agora usa créditos/recargas para funcionar,\r\npara manter o projeto ativo: [credite aqui](https://catarse.me/reifeltracker) (inclui prêmios)", "evite a barra [-----] credito, pois indica sem recurso e para de funcionar,\r\npara +detalhes ou creditar [clique aqui](https://catarse.me/reifeltracker)"];
const ad = {
  "embed": {
    "description": adsContent[0],
    "color": 3447003
  }
};

const adRate = 47;
var anuncieiRecenteInt = 0;
const recenteRate = 3;
function randomADS(){
	if(anuncieiRecenteInt < recenteRate) {anuncieiRecenteInt++;return "";}
	if(Math.floor(Math.random() * (adRate)) > 10){
		return "";
	}else{
		anuncieiRecenteInt=0;
		
		var diaAtual = new Date();
		var dataBrutoVenc = boletoanonimo.boleto5.venc;
		dataBrutoVenc = dataBrutoVenc.split("/");
		var diaVencimento = new Date(dataBrutoVenc[1]+"/"+dataBrutoVenc[0]+"/"+diaAtual.getFullYear());
		
		var msgBoletoAnonimo;
		if(diaVencimento > diaAtual){
			msgBoletoAnonimo = "contribua no [projeto](https://www.catarse.me/reifeltracker) do bot pelo boleto em pdf: [R$ 5]("+boletoanonimo.boleto5.link+") | [R$ 12]("+boletoanonimo.boleto20.link+")  vencimento: "+boletoanonimo.boleto5.venc;
		}else{
			msgBoletoAnonimo = "contribua no [projeto](https://www.catarse.me/reifeltracker) do bot\r\ne .discord para usar em outro discord (a partir de R$ 8/mes)";			
		}
		ad.embed.description = msgBoletoAnonimo;
		/*
		if(Math.floor(Math.random() * (10)) > 6){ //0 a 9 (8, 9) sao 30 por cento
			ad.embed.description = adsContent[1];
		}else{
			ad.embed.description = adsContent[0];
		}
		*/
		
		return ad;
	}
}

function atualizarBarraApoio(progresso){
	switch(progresso){
		case 0:
		barraApoio="\r\n```diff\r\n\r\n+ 0% [.apoio]\r\n```";
		break;
		case 1:
		barraApoio="\r\n```diff\r\n\r\n+ 10% [.apoio]\r\n```";
		break;
		case 2:
		barraApoio="\r\n```diff\r\n\r\n+ 20% [.apoio]\r\n```";
		break;
		case 3:
		barraApoio="\r\n```diff\r\n\r\n+ 30% [.apoio]\r\n```";
		break;
		case 4:
		barraApoio="\r\n```diff\r\n\r\n+ 40% [.apoio]\r\n```";
		break;
		case 5:
		barraApoio="\r\n```diff\r\n\r\n+ 50% (domingos open) [.apoio]\r\n```";
		break;
		case 6:
		barraApoio="\r\n```diff\r\n\r\n+ 60% [.apoio]\r\n```";
		break;
		case 7:
		barraApoio="\r\n```diff\r\n\r\n+ 70% [.apoio]\r\n```";
		break;
		case 8:
		barraApoio="\r\n```diff\r\n\r\n+ 80% [.apoio]\r\n```";
		break;
		case 9:
		barraApoio="\r\n```diff\r\n\r\n+[#####|####-] 90% [.apoio]\r\n```";
		break;
		case 10:
		barraApoio="\r\n```diff\r\n\r\n+[#####|#####] 100% (todos os dias) [.apoio]\r\n```";
		break;
	}
}

//[para Valor Único] e no máximo 130 membros: R$ 45, pague uma vez e use sem mensalidade enquanto tiver no total 130 membros ou menos no servidor. Ao ultrapassar 130 membros o bot será desativado. */

function format(value) {
    var pattern='#####.##### #####.###### #####.###### # ##############';
    var i = 0,
        v = value.toString();
    return pattern.replace(/#/g, _ => v[i++]);
}

function criarVoice(obj, i, max, message, name, permissoesOverwrites){
	if(max===0) return;
	
	setTimeout(function(){ 
		message.guild.createChannel(name+i, "voice", permissoesOverwrites)
		.then(canalCriado=> {
			canalCriado.edit({
				userLimit: obj["limit"],
				parent: obj["categoriaID"]
			}).catch(e=>{console.log(e)});
			console.log(canalCriado);
			criarVoice(obj,i+1, max-1, message, name, permissoesOverwrites);
		}).catch(e => null);
	}, 300);		
}

function padraoRankWinApex(message, usuario, nickLegivel, winrKD, ranks=[], tabela=[100,78,48,26], continuaRank="Continua onde está, os niveis atuais são: 100+, 78+, 48+, 26+"){
		
		if(winrKD[0]>=tabela[0]){
			if(usuario.roles.has(ranks[0])) {return;}
			changeRole(usuario, ranks[1], ranks[0]);	
			print(message,msg1Rank+ranks[0]+msg2Rank);
		}else if(winrKD[0]>=tabela[1]){
			if(usuario.roles.has(ranks[1])) {return;}
			changeRole(usuario, ranks[2], ranks[1]);	
			print(message,msg1Rank+ranks[1]+msg2Rank);
		}else if(winrKD[0]>=tabela[2]){
			if(usuario.roles.has(ranks[2])) {return;}
			changeRole(usuario, ranks[3], ranks[2]);	
			print(message,msg1Rank+ranks[2]+msg2Rank);
		}else{
			//message.author.send("Você precisa de mais nível para registrar o rank (26+)");
			tryPM(message.author, "Você precisa de mais nível para registrar o rank (26+)");
		}
		
		//usuario.setNickname( padraoNick(winrKD[0],nickLegivel) ).then(usuario.setNickname( padraoNick(winrKD[0],nickLegivel) )).then(user => message.reply("kd: **"+winrKD[1]+`**, atualizei winrate \:umbrella2:`)).catch(err => console.log(err));	
}

const capLevel=3;
function capUpdate(message, level){
	try{
		try{message.react(reactEmoji).catch(e=>null);}catch(e){}
		var levelSite = parseInt(level);
		if(levelSite==60 || levelSite==61 || levelSite==100 || levelSite==101 ) return false; //liberar se tiver esses niveis
		
		var nome = message.member.nickname;
		var levelatual;
		if(nome.indexOf('★') == (nome.length-1))
			levelatual = nome.substring(nome.lastIndexOf(' ',nome.length-3)+1,nome.length-2);
		else
			levelatual = nome.substring(0,nome.indexOf(' '));
		var atual = parseInt(levelatual);
		if( (levelSite - atual) < capLevel) {tryPM(message.author,"aguarde sem atualizar até o level:"+(atual+capLevel)); return true;}
		return false;
	}catch(e){//novos
	console.log(e);
	}
}

function contagemRegressiva(message, segundos){
	if(segundos==0) {message.delete(); return;}
	setTimeout(function(){ message.edit("resultado em "+segundos).then( edited => contagemRegressiva(edited, segundos-1)); }, 800);
}

function msgImgApex(message, valoresJimp=["---","---","---"]){//winrate, kd, wins, kills, trn
	
	var copiaJimp = imageJimpApex.clone();
	const linha1=35,linha2=67, linha3=95;
	copiaJimp.print(fontJimp, 12,linha1, valoresJimp[0])	
		.print(fontJimp, 69,linha2, valoresJimp[1])	
		.print(fontJimp, 5,linha3, valoresJimp[2])
		.write(tempFile, function(){
		
			// Create the attachment using MessageAttachment
			const attachment = new Discord.Attachment(tempFile);
			// Send the attachment in the message channel with a content
			message.channel.send(attachment);//.then(msg=> msg.react("👉"));
			//message.member.send("[comando dk] reaja com as lendas na sequencia de mais jogado ao menos, embaixo da foto resultado (pra onde o emoji aponta)(clica reagir e busca o nome da lenda, no maximo 3)");
		});
	copiaJimp=null;
}

//img r
function sort_unique(arr) {
	var ret = [];
  for(var i of arr){	  
	if(i.indexOf("SQUAD KILLS") !== -1 || i.indexOf(" ELIMINA") !== -1 || i.indexOf(" ESQUA") !== -1) ret.push(i);
	if(i.indexOf("PLACED") !== -1 || i.indexOf("POSI") !== -1) ret.push(i);
  }
  return ret;
}

function parseImageFromUrl(imageUrl, options) {
  return _sendRequestToOcrSpace(undefined, imageUrl, options);
}

function parseImageFromBase64(imageUrl, options) {
  return _sendRequestToOcrSpace( imageUrl, undefined, options);
}

// Set default data
const _defaultOcrSpaceUrl = 'https://api.ocr.space/parse/image';
const _base64ImagePattern = 'data:%s;base64,%s';
const _defaultImageType = 'image/jpg';
const _defaultLanguade = 'eng';
const _isOverlayRequired = 'false';

var _sendRequestToOcrSpace = function(localFile, url, options) {
  return new Promise(function(resolve, reject) { 
    if (!options.apikey)
      reject("API key required");

    let req = request.post(_defaultOcrSpaceUrl, (error, response) => {
      if (error) 
        reject(error);

      let data = response.toJSON();
      if (data.statusCode === 200)
        resolve(data.body);
      else
        reject({error: { statusCode: data.statusCode, name: "Error", message: data.body}});
    });

    let form = req.form();
    form.append('language', options.language || _defaultLanguade);
    form.append('isOverlayRequired', 'false');
    form.append('apikey', options.apikey);
    if (url) 
      form.append('url', url);
    else {
      //base64
       form.append('Base64Image', localFile);   
      
    }
  });
}

function imgrResultado(parsedResult){
	try{
	  var a = JSON.parse(parsedResult);
	  //console.log(a);
	  //parsedResult = parsedResult.ParsedResults[0].ParsedText;
	  var leitura = sort_unique(a.ParsedResults[0].ParsedText.split("\r\n"));
	  var kills="", lugar="";
	  var posKills, posLugar;
	  //for(var i of leitura){
		  //console.log(i);
		//console.log(leitura);	
		var i="";
		try{i = leitura[1];}catch(e){i=leitura[0]}
		posKills = i.indexOf("SQUAD KILLS");
		if(posKills===-1) posKills = i.indexOf(" ELIMINA");
		if(posKills===-1) posKills = i.indexOf(" ESQUA");
		if(posKills !== -1) {kills = i.substr(0,2);}
		
		i = leitura[0];
		posLugar = i.indexOf("PLACED");
		if(posLugar===-1) posLugar = i.indexOf("POSI");
		
		if(posLugar !== -1) lugar = i.substr(8,2);
	}catch(e){}//evitar crashar na leitura
	  //}
	  if(lugar=="") {var numbers = a.ParsedResults[0].ParsedText.match(/\d+/g).map(Number); lugar=numbers[0]+"";} //possui tamanho 3, [lugar,totalSquad,kills]
	
	return [lugar,kills];
	//return ( lugar.replace("DE","1").replace("#","").replace("I","1")+" "+kills.replace("B","8"));
	  //return ( lugar.replace(/DE|I|O/,"1").replace(/F| |#/,"")+"º lugar e total de kills: "+kills.replace("B","8").replace("O","0")+"\r\nSe errei menciona/marca @ reifel1 aqui\r\nPontuação Total: "+pontTotal);
}
//fim img r

function aprendizado(message){
	if(aprendizadoPausado) {print(message,"print nao esta ativo, .s ativarprints"); return;}
var att = (message.attachments).array();
	if(att.length == 0) return;
			//if(att[0].filesize > 1000000) {message.author.send("**limite ultrapassado (>1MB)**,\r\n use um desses sites para reduzir o tamanho e envie a imagem gerada no site:\r\n http://tinypng.com (.PNG) | http://tinyjpg.com (.JPG) | png2jpg.com"); return;};
			var h = att[0].height, w = att[0].width;
			if(h<720) {print(message, "erro: print de baixa qualidade, resoluções permitidas: 720p ou mais ( _ x 720)"); return;}
						
			var formato = att[0].url;
			formato = formato.substring(formato.lastIndexOf(".")+1);
			options.imageFormat = "image/"+formato;
			
			Jimp.read(att[0].url)
				  .then(compressImg => {
					var cx = 0.27*w, cy=0.10*h, cw=1.7*cx, ch=0.6*cy;
					compressImg
					  //.resize(1360, 768) // resize
					  //.quality(40) // set JPEG quality
					  .greyscale() // set greyscale
					  .crop(cx,cy,cw,ch)
					  .contrast(0.5)
					  .scale(6)
					  //.crop(360,70,700,70)
					  //.write('teste.jpg'); // save
					  ;
					  compressImg.getBase64(Jimp.AUTO, (err, res) => {						
						parseImageFromBase64(res, options)
						  .then( 
							function (parsedResult){
								//print(message,imgrResultado(parsedResult)); 
								var lvlK = imgrResultado(parsedResult);
								calcularPontuacao(message,lvlK);
								message.reply("atualizei a pontuação: "+lvlK[0]+" "+lvlK[1]);
							}
							).catch(err => {
								e => null(err);
							  }); 
					  });					  
				  })
				  .catch(err => {
					e => null(err);
				  });
}

function saoOrganizadores(message){return (message.author == reifelUser || message.member.roles.has("544981841480777750") || message.member.roles.has("554332187152089088"))}

function calcularPontuacao(message, arrayPosicaoKills){
	var lugar = arrayPosicaoKills[0]+"", kills=arrayPosicaoKills[1]+"";
	console.log(lugar+" "+kills);
	var pontLugar=-1,pontKill=-1, pontTotal=0;
	try{pontLugar = Number( lugar.replace(/DE|I|O/,"1").replace(/F| |#/,"") ); pontKill=Number( kills.replace("B","8").replace("O","0").replace("I","1") );
	   switch(pontLugar){
		   case 1:
			   pontTotal+=10;
			   break;
		   case 2:
			   pontTotal+=5;
			   break;
		   case 3:
			   pontTotal+=3;
			   break;
	   }
	    pontTotal+=pontKill;
	   }catch(e){console.log(e)}
	   
	   var time = message.member.nickname || message.member.user.username;
	   time = time.substring(0,time.indexOf("-"));
	   
	   client.channels.get("558046408989474886").fetchMessage('559502399614484490')
				  .then(message2 => {
		   			try{
						var jsonTimes = JSON.parse("{"+message2.content+"}");
						//var obj = {};
					   if(jsonTimes[time]) jsonTimes[time] +=pontTotal;
					   else jsonTimes[time] = pontTotal;
		   
					   //ordenar
					   jsonTimes = sortJson(jsonTimes);
					   
					   var jsonString = "";
					   for(var i in jsonTimes){
						   jsonString += '"'+i+'": '+jsonTimes[i]+",\r\n";
					   }
					   jsonString = jsonString.substring(0,jsonString.lastIndexOf(","));
					   
						message2.edit(jsonString);
										
					}catch(e){}
				} )
				  .catch(e => null);	
	   
}

function sortJson(json){
    var result = [];
    var keys = Object.keys(json);
    keys.forEach(function(key){
        result.push([key,json[key]]);
    });
    return array2json(result.sort(function(a,b){return b[1]-a[1]}));
}

function array2json(array){
    var result = {};
	for(var i of array){
		result[i[0]]=i[1];
	}
    return result;
}

function retirarPontos(time,valor){
 client.channels.get("558046408989474886").fetchMessage('559502399614484490')
				  .then(message2 => {
	 				try{
						var jsonTimes = JSON.parse("{"+message2.content+"}");
					   jsonTimes[time] -=valor;
		   
					   //ordenar
					   jsonTimes = sortJson(jsonTimes);
					   
					   var jsonString = "";
					   for(var i in jsonTimes){
						   jsonString += '"'+i+'": '+jsonTimes[i]+",\r\n";
					   }
					   jsonString = jsonString.substring(0,jsonString.lastIndexOf(","));
					   
						message2.edit(jsonString);
										
					}catch(e){}
				} )
				  .catch(e => null);
}


function getEloKL(level,kills=0,matches=0,dano=0){
	var ratio = 3.6;
	var kl = (((2.6*kills)+(dano/175))/(0.932*level));
	//var kpm=0;
	//if(matches!=0) kpm = (kills/matches);	
	var msgComplemento = " kill+KillDano/lvl, K/l: "+(kills/level).toFixed(2);
	if(kl >= 19*ratio){
		//if(kpm > 4.8) return ["S+",kl,kl+" "+kpm];
		return ["S",kl+"",kl.toFixed(2)+msgComplemento];
	}else if(kl >= 15*ratio) {
		//if(kpm > 2) return ["A+",kl,kl+" "+kpm];
		return ["A",kl+"",kl.toFixed(2)+msgComplemento];
	}
	else if(kl >= 10*ratio){
		return ["B",kl+"",kl.toFixed(2)+msgComplemento];
	}else if(kl >= 15){
		return ["C",kl+"",kl.toFixed(2)+msgComplemento];
	}
	else return ["D",kl+"",kl.toFixed(2)+msgComplemento];
}

function getEloMatches(level,kills=0,matches){
	var kpm = (kills/matches);
	var resultado=0;
	var nerf = 0.58;
	if(level/kpm > 100) kpm *= nerf;
	/*
	if(resultado > 4){
		return ["S",resultado];
	}else if(resultado > 2) {return ["A",resultado];}
	else if(resultado > 1.6){return ["B",resultado];}
	else return ["C",resultado];*/
	
	resultado = level * kpm;
	if(resultado > 1000) resultado = 1000;
	if(kpm > 4.8){
		return ["S",resultado+"",kpm+""];
	}else if(kpm > 2) {return ["A",resultado+"",kpm+""];}
	else if(kpm > 1.5){return ["B",resultado+"",kpm+""];}
	else return ["C",resultado+"",kpm+""];	
}

function getElo(level, kills=0, dano){
	var a,b,c;
	a = (level/20)*10;
	if(a > 100) a = 100;
	b = (kills/150)*10;
	if(b > 300) b = 300;

	var desvio = 0.04;

	if( kills > 800){
		c = (dano/175);
		if(c < kills * (1-desvio)){
		    c = 60;
		}else
		if(c > kills * (1+desvio)){
				if(kills > 1300)
			c = 600;
				else 
					c = 300;
		}else{
		    c = 300;
		}
	}else c = 0;
	
	var r = a+b+c;
	if(kills==0||dano==0) r *= 0.43;
	
	var tierS = 68, tierA = 63, tierB = 33, tierAtual = r/10; 
	if(tierAtual >= tierS){
		return ["S",r+""];
	}else if(tierAtual >= tierA){
		return ["A",r+""];
	}else if(tierAtual >= tierB){
		return ["B",r+""];
	}else{
		return ["C",r+""];
	}	
}

function tryPM(member, msg){
	try{
		member.send(msg).catch(e => null);
	}catch(e){}
}

Number.prototype.toFixedNumber = function(x, base){
  var pow = Math.pow(base||10,x);
  return Math.round(this*pow) / pow;
}

function DoubleLinkedListJSON(){
	var a = 
	[
	{"t":2},
	{"n":"vazio","p":0,"next":4, "prev":-1},
	{"n":"vazio","p":0,"next":-1, "prev":5},
	{"n":"vazio","p":0,"next":0, "prev":4},
	{"n":"vazio","p":0,"next":3, "prev":1},
	{"n":"vazio","p":0,"next":2, "prev":3}
	];
	
	this.root = function(){return a};
	this.print=function(){
		var r = "";
		var pos = 5;
		for(var k = a[0].t; k!=-1; k = a[k].prev){
			r= "\r\n"+ pos--+"\t - \t"+a[k].n+" "+a[k].p + r;
		} 
		return r;
	}
/*
	function printR(){
		var r = "";
		for(var k = 1; k!=-1; k = a[k].next){
			r+=a[k].p+" ";
		} 
		console.log(r);
	}*/
	
	this.create = function(c){a=c;}

	//function inserirRankElo(a, dado){
	this.add = function(dado){
		if(a[a[0].t].p > dado.p) return;
		for(var k = a[0].t; k!=-1; k = a[k].prev){
			if(a[k].n == dado.n && a[k].p != dado.p) {this.remover(a[k].p,k);break;}
		}
		var temp;
		
		var head;
		//inserir no meio
		for(var k = a[0].t; k!=-1; k = a[k].prev){
			if(dado.p <= a[k].p){
				//remover tail
				a[(a[a[0].t].prev)].next = -1;
				
				//novo dado.p inserido no slot vazio
				a[a[0].t].p = dado.p;
				a[a[0].t].n = dado.n;
				temp = a[a[0].t].prev;
				a[a[0].t].prev = k;
				a[a[0].t].next = a[k].next;
				
				a[a[k].next].prev = a[0].t;
				a[k].next = a[0].t;
				a[0].t=temp;
				return;
			}
			head = k;
		}

		//remover tail
		a[(a[a[0].t].prev)].next = -1;

		//inserir no head    
		a[head].prev = a[0].t;
		a[a[0].t].p = dado.p;
		a[a[0].t].n = dado.n;
		temp = a[a[0].t].prev;

		a[a[0].t].prev = -1;
		a[a[0].t].next = head;
		
		a[0].t = temp;
	}

	this.remover = function(dado,posicao){
		if(posicao!=undefined){
			var k = posicao;
			console.log(k);
			a[k].n = "vazio";
				a[k].p = 0;
				a[a[k].prev].next = a[k].next;
				a[a[k].next].prev = a[k].prev;			
				a[k].next = -1;
				a[k].prev = a[0].t;

				a[a[0].t].next = k;
				
				a[0].t=k;
				console.log(a);
				return;
		}
		
		 for(var k = a[0].t; k!=-1; k = a[k].prev){
			if(dado == a[k].p){
				a[k].n = "vazio";
				a[k].p = 0;
				a[a[k].prev].next = a[k].next;
				a[a[k].next].prev = a[k].prev;			
				a[k].next = -1;
				a[k].prev = a[0].t;

				a[a[0].t].next = k;
				
				a[0].t=k;
				return;
			}
		}
}
}

function limparMemoria(browser){
	setTimeout(function(){ //executa sem parar o bloco de execucao
		try{ 
			//delete browser.cookies;
			//browser.cookies = new browser.cookies.constructor();
			browser.deleteCookies();
			
			//fix crash cookies undefined
			browser.cookies = new browser.cookies.constructor();
			browser.setCookie({ name: '', domain: '', value: '' }); //smallest dummy cookie
		}catch(e){}	
		try{ browser.tabs.closeAll(); 
		}catch(e){}
		try{ 
			browser.window.close();
			browser.close();
		}catch(e){}
		try{ 
			browser.destroy();
			delete browser;
		}catch(e){}
	},0);
}

function callAsync(func) {
    setTimeout(func, 0);
}

function elomerged(message, level, kills, dano, cargosElo){
		//elo merged
	if(level < 85) {throw false;}
	//if(kills===undefined) kills = 0;
	var eloPontos = getEloKL(level,kills,0,dano);
	var pontos = eloPontos[2];
	var cargosEloP = ['562939565329874954', '562939565388726285'];
	//var cargosElo = ['562423267894231072', '562423268292689920', '562423268511055892', '581226705612701700'];

	switch(eloPontos[0]){
		case "S+":
			changeRole(message.member, cargosEloP[1], cargosEloP[0]);
			//message.reply(pontos+", tierS+");
			break;
		break;
		case "S":
			changeRole(message.member, cargosElo[1], cargosElo[0]);
			//message.reply(pontos+", tierS");
			//(top10ELO[0]).add({"n":nickLegivel,"p":Number(eloPontos[1]).toFixedNumber(2)});
			//topEloDesatualizado[0] = true;
			break;

		case "A+":
			changeRole(message.member, cargosEloP[0], cargosEloP[1]);
			//message.reply(pontos+", tierA+");
			break;
		break;
		case "A":	
				changeRole(message.member, cargosElo[2], cargosElo[1]);
				message.reply(pontos+", tierA");

			//(top10ELO[1]).add({"n":nickLegivel,"p":Number(eloPontos[1]).toFixedNumber(2)});
			//topEloDesatualizado[1] = true;
			break;
		case "B":
			changeRole(message.member, cargosElo[1], cargosElo[2]);
			//message.reply(pontos+", tierB");
			break;
		case "C":
			//changeRole(message.member, cargosElo[2], cargosElo[3]);
			//message.reply(pontos+", tierC");
			break;
		default:
			//message.reply(pontos+" não elegivel para tier ainda (minimo: 33,84)");
			break;
	}
//fim elo merged
}


function padraoLvlApex(message, nickLegivel, dados){
	var level = [dados.level,dados.level];
	if(level[0] == undefined) throw false;
	
	var dano = dados.dano;
	var kills = dados.kills;
	
	switch(message.guild.id){
		case '542501711860727848':
			padraoRankWinApex(message, message.member, nickLegivel, level, ["547963888256286732","547959283116146718", "547959283141312525"],[100,60,30], "Continua onde está, os niveis atuais são: 100+, 60+, 30+");
			mudarNick(message, padraoNickApex(level[0],nickLegivel));
		break;
			
		case '550108927698927626': //ams scrims
			padraoRankWinApex(message, message.member, nickLegivel, level, ["550133503208062995", "550118715056848937","550118715337736210"], [150,100,60,30], "Continua onde está, os niveis atuais são: 150+, 100+, 60+, 30+");
			//mudarNick(message, padraoNickApexAMS(level[0],nickLegivel));
		break;
		
		case '542501242916700181': //ams
			//padraoRankWinApex(message, message.member, nickLegivel, level, ["550153057653227541", "550153058030583820", "550153058613723156","550153494045261837"], [150,100,60,30], "Continua onde está, os niveis atuais são: 150+, 100+, 60+, 30+");
			if(dados.level > 190){
				changeRole(message.member, "550153058030583820", "550153057653227541");
			}
			var posicaoGuardaChuva = -1;
			try{
				posicaoGuardaChuva = message.member.nickname.indexOf("★").catch(e => null);		
			}catch(e){

			}
			//if(posicaoGuardaChuva!==-1)return;
			mudarNickCalado(message, padraoNickApexAMS(level[0],nickLegivel));
			//elomerged(message, level, kills, dano, ['562423267894231072', '562423268292689920', '562423268511055892', '581226705612701700']);
		break;
			
		case '292028288178847744': //mago academy
			padraoRankWinApex(message, message.member, nickLegivel, level, ["559835221730525195","559835222024126476","559835222313664515"],[150,100,60], "Continua onde está, os niveis atuais são: 150+, 100+, 60+");
			mudarNick(message, padraoNickApex(level[0],nickLegivel));
		break;
			
		case '547602272516046849': //tiago airsoft
			padraoRankWinApex(message, message.member, nickLegivel, level, ["562034978913779712","562034979236741140","562034979534536705"],[150,100,60], "Continua onde está, os niveis atuais são: 150+, 100+, 60+");
			mudarNick(message, padraoNickApex(level[0],nickLegivel));
		break;
			
		case '562363572647100416': //lost spirit alms
			padraoRankWinApex(message, message.member, nickLegivel, level, ["562416591459975168","562416591753707521","562416592106029056"],[150,100,60], "Continua onde está, os niveis atuais são: 150+, 100+, 60+");
			mudarNick(message, padraoNickApex(level[0],nickLegivel));
		break;
			
		case '566666902748004363': //FNT-
			//padraoRankWinApex(message, message.member, nickLegivel, level, ['0', '0', '0'],[150,100,60], "Continua onde está, os niveis atuais são: 150+, 100+, 60+");
			mudarNickCalado(message, padraoNickApex(level[0],nickLegivel));
		break;
		
	}
	
	sendAD(message);
}



function getDadosApex(message, parametroUsado, nickLegivel, callback, isCapUpdate){
	var site, dados = {"level":0, "dano": -1, "kills": -1};
	var kills=-1, dano=-1, level=0;
	var text, data;
	site = "https://apex.tracker.gg/profile/pc/"+parametroUsado;
	try{
		Browser.visit(site, function (e, browser) {				
			//var level,wins,winP,kd,kills,selector;	
			try{
				text = browser.html();
				text = text.substring(text.indexOf('imp_Overview')+15);
				text = text.substring(0,text.indexOf('};')+1);
				text = JSON.parse(text);
				dano = text.damage.value;
				kills = text.kills.value;
				level = text.level.value;
				
				if(level=='0') throw false; //offline
				text = null;
				
				if(isCapUpdate && capUpdate(message, level)) {limparMemoria(browser); return;}
				
				//level = [level, level];
				
				dados.level = level;
				dados.dano = dano;
				dados.kills = kills;											
				callback(message, nickLegivel, dados);						
				
			}catch(e){
				//site alternativo
				//site = "https://apextab.com/api/search.php?platform=pc&search="+parametroUsado; //com defeito
				site = "https://apex.tracker.gg/profile/pc/"+parametroUsado;
				try{ //tentar atualizar usando outro site
					Browser.visit(site, function (e, browser) {	
						try{
							/*text = browser.html(); //pega o id profile
							var a = JSON.parse(text.substring(text.indexOf('{'), text.lastIndexOf('}')+1));										
							level = a.results[0].level;	
							kills = a.results[0].kills;
							a = null;
							if(level=='0') throw false; //offline
							if(isCapUpdate && capUpdate(message, level)) return;
							
							//level = [level, level];
							
							dados.level = level;
							dados.dano = dano;
							dados.kills = kills;								
							callback(message, nickLegivel, dados);		
							*/
							text = browser.html();
							text = text.substring(text.indexOf('imp_Overview')+15);
							text = text.substring(0,text.indexOf('};')+1);
							text = JSON.parse(text);
							dano = text.damage.value;
							kills = text.kills.value;
							level = text.level.value;

							if(level=='0') throw false; //offline
							text = null;

							if(isCapUpdate && capUpdate(message, level)) {limparMemoria(browser); return;}

							//level = [level, level];

							dados.level = level;
							dados.dano = dano;
							dados.kills = kills;											
							callback(message, nickLegivel, dados);
						}catch(e){								
							//print(message, "erro");
							//site alternativo2
							site = "https://www.apexlegendsapi.com/api/v2/player?platform=pc&name="+parametroUsado;
							try{
								Browser.visit(site, function (e, browser) {				
									//var level;	
									try{
										text = browser.html();
										if(text == undefined) throw false; //crash logs
										data = JSON.parse(text.substring(text.indexOf("{"), text.lastIndexOf("}")+1));
										level = data["level"];
										
										if(isCapUpdate && capUpdate(message, level)) {limparMemoria(browser); return;}
										
										//level = [level,level]; //gambiarra												
																						
										dados.level = level;
										dados.dano = dano;
										dados.kills = kills;									
										callback(message, nickLegivel, dados);		
									}catch(e){											
											//site alternativo
											site = "https://www.apexlegendshut.com/free-api?platform=PC&title="+parametroUsado;
											try{ //tentar atualizar usando outro site
												Browser.visit(site, function (e, browser) {					
														
													try{
														text = browser.html(); //pega o id profile
														data = JSON.parse(text.substring(text.indexOf('{'), text.lastIndexOf('}')+1));										
														level = data.results[0].level;	
														data = null;

														if(isCapUpdate && capUpdate(message, level)) {limparMemoria(browser); return;}

														//level = [level, level];																
														
																				
														dados.level = level;
														dados.dano = dano;
														dados.kills = kills;								
														callback(message, nickLegivel, dados);		

													}catch(e){
														//site alt
														site = "http://api.mozambiquehe.re/bridge?platform=PC&auth=0V7bLm3DwwImSEr9ruFI&player="+parametroUsado;
														try{
																//var level;
															request(site, function (error, response, body) {
																try{
																	text = body;
																	if(text == undefined) throw false; //crash logs
																	data = JSON.parse(text.substring(text.indexOf("{"), text.lastIndexOf("}")+1));
																	if(data.global == undefined) {message.reply("tente novamente mais tarde");return;}
																	level = data.global.level;
																	kills = data.total.kills;
																	dano = data.total.damage;
																	text = data = null;																	
																	
																	if(isCapUpdate && capUpdate(message, level)) {limparMemoria(browser); return;}

																	//level = [level, level];	
																											
																	dados.level = level;
																	dados.dano = dano;
																	dados.kills = kills;					
																	callback(message, nickLegivel, dados);	
																	
																}catch(e){}
															});
														}catch(e){
																	//print(message,e);
														}
													}	

													limparMemoria(browser);
												});
											}catch(e){

											}
									}
									
									limparMemoria(browser);
								});
							}catch(e){
							
							}	
						}	
				
						limparMemoria(browser);
				});
			}catch(e){					
				
			}
				//fim site alternativo
				
				
				//print(message,"ops: esqueceu do nick ou trocou? se nao, os dados estao offline, tente dps de 30s");
				
			}
			//var resultado = formatarMsg(winP,kd,wins,kills,'--');
			//msgPadraoBot(message, resultado, site, nickLegivel);
			
			limparMemoria(browser);
		});
	}catch(e){}
}

function mudeiApex(message, nickLegivel, dados){
	var level = dados.level;
	
	var levelatual;
	var nome = message.member.nickname;
	if(nome == null) throw false; //crash logs
	if(nome.indexOf('★') == (nome.length-1))
		levelatual = nome.substring(nome.lastIndexOf(' ',nome.length-3)+1,nome.length-2);
	else
		levelatual = nome.substring(0,nome.indexOf(' '));
	if( (parseInt(levelatual) + 60) >= parseInt(level) || similar_text(nome.replace(levelatual,"").replace(" ★",""), nickLegivel+" ") > 3) { 
		switch(message.guild.id){

			case '550108927698927626':
				mudarNick(message, padraoNickApexAMS(levelatual,nickLegivel));
			break;

			case '542501242916700181':
				mudarNick(message, padraoNickApexAMS(levelatual,nickLegivel));
			break;
			
			default:
				mudarNick(message, padraoNickApex(levelatual,nickLegivel));
			break;
		}
	}else{
		//reifelUser.send(nickLegivel+"win%: "+parseFloat(winrKD[0])- (parseFloat(winrate) + 2.4) );
		//debug.send("mudei: "+similarity(nome.replace(levelatual,"").replace(" ★",""), nickLegivel+" "));		
		print(message, "não posso trocar seu nick, pois demorou muito tempo com nick desatualizado, peça a algum moderador");
	}
}

const msgAttlvl = "";
function eloApex(message, cargosElo, dados, nickLegivel){
	padraoLvlApex(message,nickLegivel, dados);
	
	var level = dados.level;
	var dano = dados.dano;
	var kills = dados.kills;
	
//if(partidas < 150) {print(message,"quantidade de partidas insuficiente, minimo 150"); throw false;}
	if(level < 85) {print(message,"level insuficiente, minimo 85"); return;}
	//if(kills===undefined) kills = 0;
	var eloPontos = getEloKL(level,kills,0,dano);
	var pontos = eloPontos[2];
	var cargosEloP = ['562939565329874954', '562939565388726285'];
	//var cargosElo = ['562423267894231072', '562423268292689920', '562423268511055892', '581226705612701700'];

	switch(eloPontos[0]){
		case "S+":
			changeRole(message.member, cargosEloP[1], cargosEloP[0]);
			message.reply(pontos+", tierS+");
			break;
		break;
		case "S":
			changeRole(message.member, cargosElo[1], cargosElo[0]);
			message.reply(pontos+", tierS"+msgAttlvl);
			(top10ELO[0]).add({"n":nickLegivel,"p":Number(eloPontos[1]).toFixedNumber(2)});
			topEloDesatualizado[0] = true;
			break;

		case "A+":
			changeRole(message.member, cargosEloP[0], cargosEloP[1]);
			message.reply(pontos+", tierA+");
			break;
		break;
		case "A":									
			if(message.member.roles.has(cargosElo[0])){
				setTimeout(function(){ 
					message.member.removeRole(cargosElo[0]).catch(err => console.log(err)).then( () => 
						{												
							changeRole(message.member, cargosElo[0], cargosElo[1]);
							message.reply(pontos+", tierA"+msgAttlvl);

						}
					);
				}, 1700);	
			}else{
				changeRole(message.member, cargosElo[2], cargosElo[1]);
				message.reply(pontos+", tierA"+msgAttlvl);
			}

			//(top10ELO[1]).add({"n":nickLegivel,"p":Number(eloPontos[1]).toFixedNumber(2)});
			//topEloDesatualizado[1] = true;
		break;
		case "B":
			changeRole(message.member, cargosElo[1], cargosElo[2]);
			message.reply(pontos+", tierB"+msgAttlvl);
		break;
		case "C":
			changeRole(message.member, cargosElo[2], cargosElo[3]);
			message.reply(pontos+", tierC"+msgAttlvl);
		break;
		default:
			message.reply(pontos+" não elegivel para tier ainda (minimo: 33,84) - atualizei o nick");
		break;
	}
}

function changeRoleMention(message,roleID){	
	var membro = message.mentions.members.array()[0];
	
	setTimeout(function(){ 
		membro.addRole(roleID).catch(err => null);
	}, 1700);
	//for(var membro of membros){
	//	changeRole(membro, '', 'roleID');
	//}
}

function getRoleID(message){	
	if(message.author == reifelUser){
		var mentionRole = message.content;		
		message.reply(mentionRole.substring(mentionRole.indexOf("@")));
	}
}

function callDebug(e, funcao, usuario){
	try{	
		var info = usuario+" "+funcao+" - ";
		if(e) debug.send(info+e);
		if(e.message) debug.send(info+e.message.substring(0,2000-info.length));
	}catch(e2){
	}
}


function cropReadImg(message, url,w,h,c, callback, arrayID){ //c = [cropLeft, cropTop, cropRight, cropBottom] in px
			/*
					___TOP___
				left|	   <-|right
					---bot---
			*/
	
			if(h<720) {print(message, "erro: print de baixa qualidade, resoluções permitidas: 720p ou mais ( _ x 720)"); return;}
						
			var formato = url;
			formato = formato.substring(formato.lastIndexOf(".")+1);
			options.imageFormat = "image/"+formato;
			
			Jimp.read(url)
				  .then(compressImg => {
					var cropLeft = c[0], cropTop=c[1], cropWidthSize=c[2], cropHeightSize=c[3];
					compressImg
					  //.resize(1360, 768) // resize
					  //.quality(40) // set JPEG quality
					  .greyscale() // set greyscale
					  .crop(cropLeft,cropTop,cropWidthSize,cropHeightSize)
					  //.crop(360,70,700,70)
					  //.write('teste.jpg'); // save
					  ;
					  compressImg.getBase64(Jimp.AUTO, (err, res) => {						
						parseImageFromBase64(res, options)
						  .then( function (parsedResult){				  
								  callback(JSON.parse(parsedResult).ParsedResults[0].ParsedText.split("\r\n"), message, url, arrayID)
								 }
							).catch(err => {
								e => null(err);
							  }); 
					  });


					  
				  })
				  .catch(err => {
					e => null(err);
				  });
}


//similar words
function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

//fim-similar words

function giveRoleSimilar(message,cargoPT, cargoEN, read, role, url){	
	var cargoSimilar = Math.max( similarity(cargoPT, read), similarity(cargoEN, read) );
	if(cargoSimilar > 0.55) {
		setTimeout(function(){ 
			message.member.addRole(role).catch(err => null);			
			try{message.react(reactEmoji).catch(e=>null);}catch(e){}
		}, 1700);
	}else{
		debug.send("CARGO NAO SIMILAR:\r\n"+url+"\r\n"+read+" "+cargoSimilar+" "+cargoEN+" "+cargoPT);
		try{message.react(reactEmojiX).catch(e=>null);}catch(e){}		
	}
}

function cargosimg(parsedResult, message, url, arrayID){ //arrayID => [stringCargoPT, stringCargoEN, role]
	var nick = getNickConhecidoApexAMS(message);
	var confirmacaoUsuario = similarity(nick, parsedResult[0]);
	if(confirmacaoUsuario==0) {message.reply("erro na leitura, aguarde updates e melhorias, garanta que:\r\n(você sozinho no lobby, com modo ranked selecionado, mostrando 100% da tela: incluindo moedas, desafios, e amigos online)"); return;}
	if(confirmacaoUsuario < 0.6){
		debug.send("nao confirmou usuario:\r\n"+url+quebraLinha+parsedResult);
		message.reply(" esse print "+url+"\r\nnão parece ser você ou está fora do padrão (você sozinho no lobby, com modo ranked selecionado, mostrando 100% da tela: incluindo moedas, desafios, e amigos online)");
		return;
	}	
	var ajuste = 2;
	if(parsedResult.length > 5) ajuste = 3;
	giveRoleSimilar(message, arrayID[0], arrayID[1], parsedResult[parsedResult.length-ajuste], arrayID[2], url);
	
}

function sendAD(message){	
	message.channel.send(randomADS()).catch(e => null);
}

function setActivity(txt){
	client.user.setPresence({
		game: {
			//name: "com "+client.guilds.array().length +"|dono:Reifel#5047"
			name: txt,
			url: "https://www.twitch.tv/reifel",
			type: "STREAMING"
		}
	});
}

//const barra55="▃▃▃▃▃", barra45="▃▃▃▃▁", barra35="▃▃▃▁▁", barra25="▃▃▁▁▁", barra15="▃▁▁▁▁", barra05="▁▁▁▁▁";
const barra55="💣💣💣💢", barra45="💣💣💢🔥", barra35="💣💢🔥🔥", barra25="💢🔥🔥🔥", barra15="💢🔥🔥🔥", barra05="🔥🔥🔥🔥";
const rtcred="ReifelTracker, carga ";
//const userBarra55 = rtcred+barra55, userBarra45 = rtcred+barra45, userBarra35 = rtcred+barra35, userBarra25 = rtcred+barra25, userBarra15 = rtcred+barra15, userBarra05 = rtcred+barra05;
const userBarraArray = [barra05, barra15, barra25, barra35, barra45, barra55];
const ativBarra55 = barra55+"creditado "+atividade, ativBarra45= barra45+" creditado "+atividade,ativBarra35= barra35+" creditado "+atividade, ativBarra25= barra25+" creditado "+atividade, ativBarra15= barra15+" creditado "+atividade, ativBarra05= barra05+" creditado "+atividade;
function atualizarVisualCredito(){
	var porcentCred = (credito > 0) ? (credito/44).toFixed(0)+"%" : "0%";
	if(credito>credBase[4]){
		if((client.user.username).indexOf(barra55)==-1){
			//client.user.setUsername(userBarra55);
			return (rtcred+porcentCred+userBarraArray[5]);
			setActivity(ativBarra55);
		}		
	}else if(credito>credBase[3]){		
		if((client.user.username).indexOf(barra45)==-1){
			return (rtcred+porcentCred+userBarraArray[4]);
			setActivity(ativBarra45);
		}
	} else if(credito>credBase[2]){		
		if((client.user.username).indexOf(barra35)==-1){
			return (rtcred+porcentCred+userBarraArray[3]);
			setActivity(ativBarra35);
		}
	} else if(credito>credBase[1]){
		if((client.user.username).indexOf(barra25)==-1){
			return (rtcred+porcentCred+userBarraArray[2]);
			setActivity(ativBarra25);
		}
	} else if(credito>credBase[0]){		
		if((client.user.username).indexOf(barra15)==-1){
			return (rtcred+porcentCred+userBarraArray[1]);
			setActivity(ativBarra15);
		}
	} else{
		return (rtcred+porcentCred+userBarraArray[0]);
		setActivity(ativBarra05);
	}
}


const ticketRankedEmoji='🎟', autoFila='♻';
var currentReactionsRanked, autofilaReactions, autoFilaUsers, countInterest = 0;
function aguardarReacao(msgReacted){
	msgReacted.react(ticketRankedEmoji).catch(e=>null);
	msgReacted.react(autoFila).catch(e=>null);
	msgReacted.react(reactEmojiX).catch(e=>null);
	
	const filter = (reaction, user) => user.id != '373443049818161153' && reaction.emoji.name === ticketRankedEmoji;
	msgReacted.awaitReactions(filter, { maxUsers: 60, time: 900000 })
	  .then(collected => {
				currentReactionsRanked = msgReacted.reactions.get(ticketRankedEmoji);
				autofilaReactions = msgReacted.reactions.get(autoFila);
				var removeAutoFila = msgReacted.reactions.get(reactEmojiX);
				if(removeAutoFila!=null){					
					for(var i of removeAutoFila.users){
						var index = autoFilaUsers.indexOf(i);			
						if (index !== -1) {
							autoFilaUsers.splice(index, 1);
						}
					}
				}
		
				countInterest = 0;
				if(currentReactionsRanked!=null) countInterest += currentReactionsRanked.count;
		
				if(autofilaReactions!=null) {
					for(var i of autofilaReactions.users){
						if(!autoFilaUsers.includes(i)) autoFilaUsers.push(i);
					}
					countInterest += autoFilaUsers.length;
				}
		
				if(collected.size > 50 || countInterest > 50){
					var msgUsersMention="";
					var u = collected.get(ticketRankedEmoji).users;
					msgReacted.clearReactions();
					for(var i of u){
					  if(i[1].bot === false) msgUsersMention+=i[1];					  
					}
					
					if(msgUsersMention!="") {
						msgReacted.channel.send(msgUsersMention).then(mentionMsg => mentionMsg.delete(10000)).catch(e => null);
					}
					
				}else{
					if(collected.size!=0) msgReacted.clearReactions();
				}
				
				aguardarReacao(msgReacted);
			}
		)
	  .catch(e=>null);
}


const cargosRanksOnline = ['595930566847627265','595930566482984961', '595930565690261535'];
function atualizarCargosRanksOnline(guildEscolhida, reaction){
	var onlinesCargosRanks = [];
	for(var i =0; i<3; i++){
		onlinesCargosRanks[i] = guildEscolhida.members.filter(member => member.presence.status != 'offline' && member.roles.has(cargosRanksOnline[i]) && (member.roles.has("626231397312364555") == false) );
	}
	var partidas = ((onlinesCargosRanks[0].size+onlinesCargosRanks[1].size+onlinesCargosRanks[2].size)/60).toFixed(0);
	var msgOnlines = "<<quantidade ONLINE NO MOMENTO>>\nreaja :recycle: para atualizar a cada 30 min\ndiamante: "+onlinesCargosRanks[2].size+"\nplatina: "+onlinesCargosRanks[1].size+"\nouro: "+onlinesCargosRanks[0].size+"\ndaria para "+((onlinesCargosRanks[0].size+onlinesCargosRanks[1].size+onlinesCargosRanks[2].size)/60).toFixed(0)+" partidas full de brasileiros";
		
	client.channels.get("617882572743245863").fetchMessage('624424320919404544')
	  .then(message2 => {
		  message2.edit(msgOnlines);
	} )
	  .catch(e => null);
	
	
	if(partidas > 2){
		var n="";
		for(var k of onlinesCargosRanks[2]){
			n += k[1].toString()+" ";
		}		
		reaction.message.channel.send(n).then(mentionMsg => mentionMsg.delete(30000)).catch(e => null);
		
		n="";		
		for(var k of onlinesCargosRanks[1]){		
			n += k[1].toString()+" ";
		}		
		reaction.message.channel.send(n).then(mentionMsg => mentionMsg.delete(30000)).catch(e => null);
		
		n="";		
		for(var k of onlinesCargosRanks[0]){		
			n += k[1].toString()+" ";
		}
		reaction.message.channel.send(n).then(mentionMsg => mentionMsg.delete(30000)).catch(e => null);
	}
	
}

/*
//evitar memory leak ao editar varios usuarios, fazer then apos editar e chamar pra editar o proximo
function removerSlow(iterator, index, tipo){
	var proximo = iterator.next();
	if(proximo == undefined) return;
	switch(tipo){
		case 0:
		try{
			(proximo.value[1]).removeRoles([cargosRanksOnline[1], cargosRanksOnline[0]]).then(removerSlow(iterator, index+1, tipo));
			console.log("removi");
		}catch(e){
			console.log(e);
		}
		break;
		case 1:
		try{
			(proximo.value[1]).removeRole(cargosRanksOnline[0]).then(removerSlow(iterator, index+1, tipo));
		}catch(e){
			console.log(e);
		}
		break;
	}
}
function removerCargosExcedentes(guildEscolhida){
	var onlinesCargosRanks = [];
	for(var i =0; i<3; i++){
		onlinesCargosRanks[i] = guildEscolhida.members.filter(member => member.roles.has(cargosRanksOnline[i]));
	}
	removerSlow(onlinesCargosRanks[2].entries(), 0, 0);
	
	
	removerSlow(onlinesCargosRanks[1].entries(), 0, 1);]
}
*/

/*
//preparando para creditar automatico
site = "https://www.catarse.me/reifeltracker";
try{
	request(site, function (error, response, body) {
		try{
			var text = body;
			if(text == undefined) throw false; //crash logs
			//console.log(text);
			text = text.substring(text.indexOf("data-stats"));
			text = text.replace(/&quot;/gm,"");
			const token = "pledged:";
			text = text.substring(text.indexOf(token)+token.length);
			text = text.substring(0,text.indexOf(","));
			text = Number(text);
			console.log(text);



		}catch(e){return;}
	});
}catch(e){
			//print(message,e);
}
*/


//coletar todos tier
/*var tierSA = message.guild.members.filter(member => member.roles.has("562423267894231072") || member.roles.has("622443382538502144"));
var k ="";
for(var i of tierSA) k+=i[1].nickname+"\n";
console.log(k);
return;
*/

//batch check array nicks
	/*
		site = "https://apex.tracker.gg/profile/pc/"+parametroUsado;
		request(site, function (error, response, body) {
			try{
				var text = body;

				text = text.substring(text.indexOf('imp_Overview')+15);
				text = text.substring(0,text.indexOf('};')+1);
				text = JSON.parse(text);

				dano = text.damage.value;
				kills = text.kills.value;
				level = text.level.value;


				if(level < 85) {console.log(parametroUsado+" level insuficiente, minimo 85"); throw false;}
				//if(kills===undefined) kills = 0;
				var eloPontos = getEloKL(level,kills,0,dano);
				var pontos = eloPontos[0];
				switch(pontos){
					case "S":
					case "A":
						console.log("OK - "+parametroUsado+" "+pontos+" "+eloPontos[2]);
					break;

					default:
						console.log(parametroUsado+" "+pontos+": "+eloPontos[1]);
						break;
				}

			}catch(e){
			}
		});
	*/
function similar_text (first, second) {
    // Calculates the similarity between two strings  
    // discuss at: http://phpjs.org/functions/similar_text

    if (first === null || second === null || typeof first === 'undefined' || typeof second === 'undefined') {
        return 0;
    }

    first += '';
    second += '';

    var pos1 = 0,
        pos2 = 0,
        max = 0,
        firstLength = first.length,
        secondLength = second.length,
        p, q, l, sum;

    max = 0;

    for (p = 0; p < firstLength; p++) {
        for (q = 0; q < secondLength; q++) {
            for (l = 0;
            (p + l < firstLength) && (q + l < secondLength) && (first.charAt(p + l) === second.charAt(q + l)); l++);
            if (l > max) {
                max = l;
                pos1 = p;
                pos2 = q;
            }
        }
    }

    sum = max;

    if (sum) {
        if (pos1 && pos2) {
            sum += this.similar_text(first.substr(0, pos2), second.substr(0, pos2));
        }

        if ((pos1 + max < firstLength) && (pos2 + max < secondLength)) {
            sum += this.similar_text(first.substr(pos1 + max, firstLength - pos1 - max), second.substr(pos2 + max, secondLength - pos2 - max));
        }
    }

    return sum;
}



function calculoKM(mensagemDado, dados, dadosOnline, currTime){
	var kd = ((2.6*dadosOnline.kills)+(dadosOnline.dano/175));
	//console.log(dadosOnline);
	//console.log(kd);
	
	var deltaKD = kd;
	if(dados.kd) {
		deltaKD = (kd-dados.kd);
		if(deltaKD < 10) {
			dados.ti = currTime;
			mensagemDado.edit(JSON.stringify(dados)); //atualiza o tempo pro atual
			return; //se nao teve mudanca expressiva nao faz nada
		}
	}
	
	
	var dif;
	
	if(dados.sem){
		dif = (currTime - dados.sem);
		dif = dif/60; //fica em minutos reais
		
		//se ja passou uma semana
		if(dif > 10080){ //10080 minutos, (24*60 * 7)
			//reseta a performace
			dados.sem = currTime;	
			dados.ti = currTime;
			dados.kd = kd;
			dados.km = false;
		}
	}else{
		dados.sem = currTime;
	}
	
	if(dados.ti){
		//se ja tem um tempo inicial
		dif = (currTime - dados.ti);
		dif = dif/60; //converter de segundos para minutos
		
		if(dif < 10){ //nao se passaram 10 min
			throw false;
		}else{
			dados.ti = currTime;
		}
		
		//se ja passou 6 hrs
		if( dif > 360) {
			//reseta o ponto inicial
			dados.ti = currTime;
			dados.kd = kd;
			
		}else{
			var novoKDmin = (deltaKD/dif);
			if(dados.km){
				dados.km = ((dados.km + novoKDmin) /2);
			}else{
				dados.km = novoKDmin;
			}
			
			//console.log(dados.km);
			//km = (km + (kills/dif)) /2
			
		}
		
	}else{
		dados.ti = currTime;
		dados.kd = kd;
	}
	
	
	mensagemDado.edit(JSON.stringify(dados));
	return dados.km;
}

function padraoConsultaDadosOnline(callback, parametroUsado){
		var site = "https://apex.tracker.gg/profile/pc/"+parametroUsado;
		request(site, function (error, response, body) {
			try{
				var text = body;
							
				text = text.substring(text.indexOf('imp_Overview')+15);
				text = text.substring(0,text.indexOf('};')+1);
				text = JSON.parse(text);
				
				dano = text.damage.value;
				kills = text.kills.value;
				level = text.level.value;
				

				//if(level < 85) {console.log(parametroUsado+" level insuficiente, minimo 85"); throw false;}
				
				var dados={};
				dados.kills = kills;
				dados.dano = dano;
				callback(dados);

			}catch(e){
			}
		});
}

//timestamp
/*
function convertMinEpoch(min){
	return (86400*min)/1440;
}
*/

function executarComandoKM(currTime, userId){
	channelBuscaDM.fetchMessages()
	.then(messages => {

		try{
			var elemento = messages.filter(m => m.content.lastIndexOf(userId,14) !== -1);
			elemento = elemento.first();

			if(elemento == undefined){ //nao cadastrado					
				channelBuscaDM.send('{\n"id":"'+userId+'"\n}');
				executarComandos(message, comando, args, isDM, nickConhecido);
				return;
			}

			var dados = JSON.parse(elemento.content);

			if(dados.nick) parametroUsado = dados.nick;
			else dados.nick=parametroUsado;

			var callbackConsultaCalculoKM = function (dadosOnline){

				try{
					var km = calculoKM(elemento, dados, dadosOnline, currTime);
					try{message.react(reactEmoji).catch(e=>null);}catch(e){}
					if(km) message.reply(km.toFixed(2));
				}catch(e){
					//nao se passou 10 min
					//callDebug(e, "km", message.author);
					message.reply("aguarde pelo menos 10min");									
				}
			}

			padraoConsultaDadosOnline( callbackConsultaCalculoKM, parametroUsado );
		}catch(e){
			switch(e.message){
				case "parametroUsado is not defined":
					message.reply("nao cadastrado, envie o comando com o nick para cadastrar");
				break;
			}
		}

		}
	)
	.catch(e => null);
}
