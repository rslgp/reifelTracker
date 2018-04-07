const Discord = require("discord.js");
const client = new Discord.Client();
//https://pag.ae/bhvP5V8
//const boleto2="[R$2](https://pagseguro.uol.com.br/checkout/nc/payment/booklet/print.jhtml?c=e35c01fa539ab49ab07c2afd06f17f21f16c594c8cf4577a9e61a8fdcc953250282409d05eefafe8&w=C)"
//,boleto5="[R$5](https://pagseguro.uol.com.br/checkout/nc/payment/booklet/print.jhtml?c=1debf73b859a7b18aab243adc62c5a3a425b25c07ffbc043caed93ee9e8bf26d0495de22902485ee&w=C)"
//,boleto10="[R$10](https://pagseguro.uol.com.br/checkout/nc/payment/booklet/print.jhtml?c=bac28f71c7909b1df5c418ada540d312894d191e1c15191816c26a31898ddfda0b2c02e0d7adc562&w=C)"
//;
//const boletosPreConfig = boleto2+" - "+boleto5+" - "+boleto10+" - dia máx.: 07/03";
//const boletosPreConfig = "Patrocinado por: **Anuncie/divulgue aqui** - pm: Reifel#5047";
const boletosPreConfig = "";

const tabelaPreco = '**Mensalidade do bot ReifelTracker**\r\nDepende da quantidade de membros do seu server no discord\r\n\r\nmembros -------- reais por mês\r\n1 a 100             -------- R$ 15\r\n100 a 350       -------- R$ 20\r\n351 a 500        -------- R$ 30\r\nmaior q 501      -------- R$ 35\r\nmaior q 1800   -------- R$ 45\r\n\r\nDá direito a 3 cargos, instalação grátis e só paga quando estiver funcionando, os preços são para usar o bot do jeito que ele é na última atualização dele, com no máximo pequenas adaptações\r\n--\r\npara grandes modificações e alterações é cobrado serviço de mão de obra por fora da mensalidade\r\n----\r\n**plano econômico: R$ 15 por mês** independente do tamanho do servidor para usar apenas o comando !t\r\n**TRATAR COM:** @Reifel#5047 <@195731919424585728>. Não envie mensagem por aqui, envie para reifel';

const apoio = "";
//"\r\n\r\ndá like pro fix da epic na escada q gira sozinha -> [clique aqui](https://accounts.epicgames.com/login/customized?regSubheading=Register&productCss=https%3A%2F%2Fwww.epicgames.com%2Ffortnite%2FssoAsset%2Ffortnite-custom.css&response_type=code&state=https%3A%2F%2Fwww.epicgames.com%2Ffortnite%2Fforums%2Fbugs-issues%2Fbug-reports%2F191591-stair-rotates-randomicaly-priorize-to-front-camera-and-only-rotate-if-pressed-r&client_id=52b63176173444eb8291b0dd60586e04&productName=fortnite&loginSubheading=Sign+In)";

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

//CALABOCA VUE -- comentar em caso de debug, se precisar
console.log = function log()
{
  
} 
//FIM-CALABOCA*/

//security approach num1
eval = function(args){
	return;
}
//fim security

//trocar o token
client.login(process.env.BOT_TOKEN);

//versao 1.0
const message = new Discord.Message();
const Browser = require('zombie');
Browser.silent = true;
const creditos = "> criado por Reifel#5047 <", /*separador=" | ",*/ quebraLinha="\r\n", doacao=": **[Doações aqui](http://reifeltracker.ml/)**\r\n(*boleto / cartão de crédito/ depósito*)"+apoio;

//tratando casos de erro
const errorNickNaoEncontrado="nick não encontrado",
errorNuncaGanhouSquad="nunca ganhou squad", errorFortnitetracker=", --ERRO--, possíveis causas: escreveu o nick errado, jogador não joga no PC, o site fortnitetracker está caindo ou com problemas", errorNaoUsarProprioNick="ei! eu sei qm é vc \:thinking:, da proxima nao escreve o nick, escreve o comando sem dizer seu nick";
;

const siteFortniteTracker = "https://fortnitetracker.com/profile/pc/", siteStormShield = "https://www.stormshield.one/pvp/stats/";

const winsStormShieldPath="body > div.container.pvp > div:nth-child(1) > div.col-12.col-md-8 > div:nth-child(1) > div:nth-child(4) > div > div.post > div:nth-child(2) > div:nth-child(2) > a > div.istat__value";

const comandoErrado = "comando invalido";


var refreshAuto = [];
var refreshTamanho = 0;
var refreshRealizados=0;
var refreshRealizadosMAX = 4;
var refreshMAXSTACK=13;
var refreshTEMPO=1800000;//30min 1800000

var interval, refreshIsRunning=0;
//var readySimultaneoContador;

const helpMessage = "comandos disponiveis (inicie com ! ou .):\r\n**!queroessebot** - envia uma mensagem privada com a tabela de preço para rodar esse bot no seu servidor\r\n**!t nick** - (consulta nick do fortnite de alguem)\r\n**!up seuNick** - (atualizar winrate do seu nick)\r\n(desativado)**!auto seuNick** - (atualiza o seu winrate sozinho a cada 30 min, apos "+refreshRealizadosMAX+" atualizacoes todas as "+refreshMAXSTACK+" vagas ficam livres)\r\n**!alt seuNick** - (acessa tracker em site alternativo caso o fortnitetracker esteja bug ou off)\r\n**!rank** - sobe de patente caso atingiu win% e kd\r\n**!arma nomeArma** - registra a sua arma principal de preferência\r\n**!ideia msg** - envia uma ideia nova pro bot ou sugestao de melhoria do que já existe\r\n**!novavotacao @mencionar** - comando para inserir novo player a votacao\r\n**!apostar @mencionar , @mencionar, ...** - iniciar aposta nos player citados";

const errorUsuarioRegistrado = "usuario ja esta registrado", errorRefreshLotado="fila atualizacao lotada", 
sucessoRegistro=" conseguiu se registrar", chamadaFilaLIVRE=">> a fila de atualizar win % automatica esta LIVRE <<", sucessoWinRateAtualizado="atualizei os win % de vcs";

var salaRank,salaVotem,salaAposta, reifelUser;

var TAG = "";
var cooldownUser = [];

client.on('ready', () => {
	client.user.username="reifelTracker";
	client.user.setUsername("reifelTracker");
	salaRank = client.channels.get("368505848667832321");	
	salaVotem = client.channels.get("413597195846156299");	
	salaAposta = client.channels.get("416769967690743819");
	reifelUser = client.users.get('195731919424585728');
});

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

const avisoLiveOn="eae! a Live ta on :)) twitch.tv/reifel";
var avisoLiveOnHorario;
const followers = ["96dps", "alelg27", "alm_a03", "andrerocha2511", "antoniogerson", "argentabryan", "azuzinho123", "barbosarj", "batatatwitcha", "benguinha", "bhgameplays", "biasmadafaka", "bielzim223", "biiagianni", "blasmadafaka", "borgodd", "botwu", "bozo126", "brunocarlan", "burgair", "bzhx", "caiohms", "call_strom", "cattkn", "cauamandraga", "cazinskye", "cogwhistle", "colb_elite", "columbina", "correiakk", "crshadowzzd", "cyanide_poison", "davir34", "deadlikeimearnhardt", "deathsavage_", "delfim88", "dmtrafaaa", "doggamerbrr", "domineiter", "dravenisbroken", "duskyzao", "duuuuh_", "edacata", "enejoita", "erianxxt", "erzatv1", "expecial_light", "ezeey_", "factor77", "fatihtkale", "fefeugreen", "ffninja", "fofenho", "foliao543", "fucious07", "gabrielnogas", "gabussauro", "galudaoo", "gamerplay000", "garamirezyt", "gaygsygsvs", "gersonplays", "gigozubu", "goldenngamergg", "gotalitu", "grayguitar", "grutz", "guilhermealfenas", "guilhermemoralll", "gusa08", "gustavo010206", "gustavopegorin", "hacknux", "hazir157", "holykat_", "hugonm", "hy4z", "iazulmarinho", "iceonice", "ileoox", "imunleqit12345", "inst34d", "itsspdrr", "itzbrennoh", "jbfortnite0o", "jbplay00", "jebrugo", "jesseferreiradavid", "jhonniehue", "jijuzuda", "joao45620", "joaobombadill", "joaobpb", "joaopedrotwd123", "joaosemsobrenom", "joao_flubm", "jose08victor", "jrbellon", "kaaiioo12", "kaczorex00777", "kaena1", "kaka01052005", "kalapus", "kauanrs", "kaueeszzz", "keiroga", "kevinntc_", "kongz_star", "krushem761", "kumma", "lacolombina", "lari", "lazorken", "leehunterz", "lekdoguinho", "leleofps1", "leojobim", "leozinrasta", "lethalfiness", "lhiel", "llhawkblack", "lmythsl", "loosebr", "lordhigor3", "luannnz", "lucaasroxy1", "lucaosxd", "lucasbr0501", "luizcarlos741", "marechal401", "mariobigode", "martos441", "matsigui", "matthcrf", "matzeras", "mdg_swagger", "megazzero", "meneguccii", "midnesscsgo", "miewhaba", "miguel_alv32", "miwo55", "mrmycke", "mrwaguinho", "mtadeuz", "namoratozy", "nasesikej", "nether1_", "newmity", "nicoedu", "nicolas_sempai", "ninjadfps", "oiieusougokuuu", "olek0707pt", "orerevo", "orfell5", "overlocked", "p4n4sonic", "painmandara", "pandasincero", "parkkman", "pedrogalixx", "pedrohfhg", "pedrolimas11", "pedronkz", "peterparker_4g", "pguede", "phzeera1337", "play_salve_112", "poste9", "quecalordapoha", "raelsz", "raind4k1ng", "raulcent", "refluxlt", "remx28", "rhuly15", "riialo", "ripyouall", "rogatkagaming", "rskaliburb", "rudyhimself", "rxpeppa", "ryanpatric4555", "s2stole", "santt", "scifi404", "senterppppp", "seuexemplo_", "shagnakam_", "sk0pattack", "skaf12345", "skgm666", "slingy0", "spnnng0d", "spray_arg", "sstylerr97", "swagman4778", "sxxmarvs", "taiobatv00", "taizun22", "tarsisfventura", "tenkwait", "thelfps", "thiagoortukz", "thronezilla", "tiagoparantes10", "tonhaotv", "tsumiki220", "twitchtigger", "uns3en_7", "uvbloo", "virti", "vitinhoisgod", "voiceew", "voltagexking_yt", "wtg_mojito", "xeeezo", "xinbinha2468", "xisquedelhenapan", "y3ux", "yosteferson", "zecapiranha", "zeneth44", "zfearz", "zhades9", "zrewtor", "zslym", "zyanyz","nemesiisss_"];

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
		}, Math.ceil(((Math.random()*3000)+2000)));
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
						}*/
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
		*/
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
			if(user.username == 'reifel'){
				var d = new Date();
				var horaAtual = Number(d.getHours());
				horaAtual = horaAtual < 3 ? 21 + horaAtual :  horaAtual - 3;
				avisoLiveOnHorario=avisoLiveOn+" hoje dia "+d.getDate()+" abriu de "+horaAtual+"h (now)";
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
		site = siteFortniteTracker+nick;
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
						
						msgTwitch( "Números em Squad de "+nickLegivel+": "+search(jsonSquad,nick,'t') );
						
					}catch(e){};
		});		
		break;
		
		
	}
});
clientTwitch.on('connected', function(channel, user, message, self){
	msgTwitch( "estou vivo, reifel");
});
//fim-twitch

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
		
		case "398566083101196298": //fortnite da depressaum killerbr - pago 15 mes 03
			if(message.channel.id!=419295377808818177) return;
		break;
		
		//case "397143937057554433": //fps
		//break;
		
		//case "325413143943577601"://pai
		//	if(message.channel.id!=410482990091862036) return; //se nao for no tracker ignora a msg (poupa processamento)
			//console.log(message.guild.roles);
		//break;
		
		case '313195845761761281'://galera gamer - pago 20 mes 02
			if(message.channel.id!=410811452232826892) return;
			if(message.author.bot){ //batalha de bots
				if(message.author.id==373443049818161153) return; //eh o reifeltracker
				message.member.removeRole('313213175824777219').catch(err => console.log(err)); //remove o cargo admin
				message.channel.overwritePermissions(message.author, {READ_MESSAGES: false, ADMINISTRATOR:false}).catch(console.error); //impede de ler futuras msgs				
				print(message,"Este canal de texto é pequeno demais para dois bots meu chapa, vá para outro");
			}
		break;
		
		case '377628278627893248': //most wanted mwd ninja - pago 20 mes 03
			if(message.channel.id!=428883305874718731) return;
			//console.log(message.guild.roles);
		break;
		
		default:
			message.owner.send("Não Autorizado por Reifel\r\n"+tabelaPreco); message.guild.leave(); console.log("sai"); return;
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
	if(cooldownUser.indexOf(message.member.id) !== -1 ){print(message,"você está em cooldown");return;}
	else{
		cooldownUser.push(message.member.id);
		setTimeout(
		function remove() {
			const index = cooldownUser.indexOf(message.member.id);
			
			if (index !== -1) {
				cooldownUser.splice(index, 1);
			}
		}, 5000);
	}
	//fim anti
	
		
	//dividindo cada palavra da mensagem em um array de palavras
	var args = message.content.slice(1).trim().split(/ +/g);
	//console.log(args);
	var comando = args[0];
	comando = comando.toLowerCase();
	switch(comando){ //so responder a nossos comandos, poupar cpu
		case "t":
		case "alt":
		case "up":
		case "help":
		case "comandos":
		case "ranking":
		case "rank":
		case "arma":
		case "ideia":
		case "queroessebot":
		case "novavotacao":
		case "apostar":
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
			
			site = siteFortniteTracker+parametroUsado;
			//crawler
			try{
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
						day7elem = browser.queryAll("body > div.container.content-container > div:nth-child(1) > script:nth-child(11)");
						
						var j7 = day7elem[0].textContent;
						day7elem=null;
						var j8 = j7.split("}");
						d7kd = j8[13].split(":")[2].replace(/(\r\n|\n|\r|\"| )/gm,"");
						d7WinRate = j8[15].split(":")[2].replace(/(\r\n|\n|\r|\"| )/gm,"");
						d7WinRate = d7WinRate.slice(0,-1);
						
						d7Texto="\r\n7dias: win%: **"+d7WinRate+"** kd: **"+d7kd+"**";
						
						}catch(e){
							print(message,  "sem 7dias de "+nickLegivel+"dessa vez :(");
						}
						msgPadraoBot( message, search(jsonSquad,nickLegivel)+d7Texto, site, creditos, nickLegivel );
						//imbutir up aqui, pois agr so atualiza se for maior
						if(proprionick) {							
							var winrKD = up(jsonSquad);
							var posPercent = message.member.nickname.indexOf("%");
							var winrNome;
							if(posPercent!=-1){
								winrNome= message.member.nickname.substring(0,posPercent);
								if(Number(winrNome)<Number(winrKD[0])) {message.member.setNickname( padraoNick(winrKD[0],nickLegivel) ).then(user => message.reply("kd: **"+winrKD[1]+`**, atualizei winrate \:umbrella2:`)).catch(err => console.log(err));}
								
							}else{
								posPercent = message.member.nickname.indexOf("☂");
								winrNome= message.member.nickname.substring(0,posPercent);
								if(Number(winrNome)<Number(winrKD[1])) {message.member.setNickname( padraoNickKD(winrKD[1],nickLegivel) ).then(user => message.reply("winrate: **"+winrKD[0]+`**, atualizei kd \:umbrella2:`)).catch(err => console.log(err));}
								
							}
							//else {message.reply(winrKD[0]+" é o valor no site logo é a mesma winrate ou uma menor, não atualizei");}										
						}
					}catch(e){
						console.log(e.message);
						print(message, nickLegivel + errorFortnitetracker);
					}
					
					try{
						browser.deleteCookies();
						browser.destroy();					
					}catch(e){
						
					}
				});
				variavelVisita=null;
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
			try{
				var variavelVisita = Browser.visit(site, function (e, browser) {
					try{					
						var text = browser.html();
						padraoAtualizarNome(message,nickLegivel,text,site);
					}catch(e){
						try{ //tentar atualizar usando outro site
							var site = siteStormShield+parametroUsado;
							var variavelVisita2 = Browser.visit(site, function (e, browser) {					
								var winP;	
								try{							
									winP = padraoAlt(browser,6);
									winP = winP.slice(0, -1);//remover char porcentagem
								}catch(e){
									print(message,errorNickNaoEncontrado);
									return;
								}			
								message.member.setNickname( padraoNick(winP,nickLegivel) ).then(user => message.reply(`atualizei winrate \:umbrella2:`)).catch(err => console.log(err));	
								
								try{
									browser.deleteCookies();
									browser.destroy();					
								}catch(e){
									
								}
							});
							variavelVisita2=null;
						}catch(e){
							print(message, nickLegivel + errorFortnitetracker);						
						}
					}
					try{
						browser.deleteCookies();
						browser.destroy();					
					}catch(e){
						
					}
				});	
				variavelVisita=null;
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
			try{
				var variavelVisita = Browser.visit(site, function (e, browser) {				
					var wins,winP,kd,kills;	
					try{				
						kills = padraoAlt(browser,1);				
						wins = padraoAlt(browser,0);
						kd = padraoAlt(browser,2);

						winP = padraoAlt(browser,6);
						winP = winP.slice(0, -1);//remover char porcentagem
					}catch(e){
						print(message,"comando alt esta instavel (so funciona na segunda tentativa ou indefinido)");
						return;
					}
					
					
					//console.log(wins+" "+kd+" "+winP+" "+kills);
					
					//var resultado = ">> "+nickLegivel+" Squad <<\r\nWins: "+ wins +separador+"Win %: "+ winP +separador+"Kills: "+ kills +separador+ "K/d: "+kd;
					var resultado = formatarMsg(winP,kd,wins,kills,'--');
					msgPadraoBot(message, resultado, site, creditos, nickLegivel);
				});	
				variavelVisita=null;
			}catch(e){}
		break;
		
		case "queroessebot":
			message.author.send(tabelaPreco);
		break;
		
		case "ranking":
		case "rank":
			
			try{
				nickLegivel=parametroUsado = getNickConhecido(message);
				parametroUsado=encodeURI(parametroUsado);
				if(args[1] !== undefined) print(message,errorNaoUsarProprioNick);
			}catch(e){
				//caso nao tenha guarda chuva, mantem o nick como arg
			}
			
		site = siteFortniteTracker+parametroUsado;
		try{
			var variavelVisita = Browser.visit(site, function (e, browser){
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
							message.member.setNickname( padraoNickKD(winrKD[1],nickLegivel) ).then(message.member.setNickname( padraoNickKD(winrKD[1],nickLegivel) )).then(user => message.reply("winrate: **"+winrKD[0]+`**, atualizei kd \:umbrella2:`)).catch(err => console.log(err));
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
								message.member.setNickname( padraoNick(winrKD[0],nickLegivel) ).then(message.member.setNickname( padraoNick(winrKD[0],nickLegivel) )).then(user => message.reply("kd: **"+winrKD[1]+`**, atualizei winrate \:umbrella2:`)).catch(err => console.log(err));
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
								if(message.member.roles.has(desconhecido)) message.member.removeRole(desconhecido).then(message.member.removeRole(desconhecido)).then(message.member.setNickname( padraoNick(winrKD[0],nickLegivel) )).catch(err => console.log(err));
								message.member.setNickname( padraoNick(winrKD[0],nickLegivel) ).then(message.member.setNickname( padraoNick(winrKD[0],nickLegivel) )).then(user => message.reply("kd: **"+winrKD[1]+`**, atualizei winrate \:umbrella2:`)).catch(err => console.log(err));
							}catch(e){
								
							}
						break;
						
						case '313195845761761281'://galera gamer
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
						break;
						
						case '398566083101196298': //fortnite da depressaum
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
						break;
						
						case '377628278627893248': //most wanted
							const mwdRaro='420326919758807060', mwdEpico='420326972045000715', mwdLendario='420326999064707082',continuaOndeEstamwd = "continua onde está,\r\Lendário - kd >= 3\r\Epico - kd >= 2\r\nRaro >= 1";
							if(winrKD[1]>=3){
								if(message.member.roles.has(mwdLendario)) {print(message,"você está na patente máxima");return;}
								changeRole(message.member, mwdEpico, mwdLendario);	
								print(message,"Parabéns! Você agora é <@&420326999064707082> \:trophy: \:ok_hand:");
							}else if(winrKD[1]>=2){
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
						break;
					}
					
				}catch(e){					
					//console.log("error rank2");
				}
			});	
			variavelVisita=null;
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
			reifelUser.send(nickLegivel);
		break;
		
		case "debug":
			//console.log(message);
			var indice = message.member.nickname.indexOf("☂")+2;
			console.log(message.member.nickname.substring(indice));
		break;
		
		case "help":
		case "comandos":
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

function search(jsonSquad,nick,plataforma){ //plataforma discord ou twitch	
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
				resultado = "[ "+jsonSquad[winP].value+"% de Win Rate] --- [ "+ jsonSquad[kd].value +" de kills antes de morrer] --- [ "+ jsonSquad[wins].value +" de Win] --- [ " + jsonSquad[kills].value +" no total de Kills] --- [ Nota(TRN): "+ valorTrn+" de 5000]";
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
	const valorTrn = (trn*0.02).toFixed(2);
	const p1 = "Win %: **"+winP+"** \t/\t Kd: **"+kd+"**"
	,p2 = "Wins: "+wins+" / Kills: "+kills
	,p3 = "Wins: "+wins+rightJustify(p2,p1.length-7,' ')+" \t/\t Kills: "+kills
	,p4 = "Nota(TRN): **"+valorTrn+"** de __100__";
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
		//cap new accounts
		if(jsonSquad[matches].ValueInt < 36){ //no data to build trusty sample
			retorno[0] = (jsonSquad[winP].ValueDec * 0.2).toFixed(2)+"*";
		}
		//old accounts or ok winrate
		if(jsonSquad[matches].ValueInt > 250){ //pessoas de conta antiga ou pessoas q sao novas e tem winrate aceitavel
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
				description: text+quebraLinha+randomDonate(),
				title: "Perfil Squad de "+nick,
				url:site,
				footer: {text:"!QueroEsseBot "+rodape+" !comandos"}
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
	message.guild.members.get(refreshAuto[i].member).setNickname( padraoNick(winRate, refreshAuto[i].nickLegivel) ).then( forRecusivo(message, i+1) ).catch(err => console.log(err));
}
//fim ForRecursivo - stack update

function setWinRateNick(message, site, i){
	try{
		var variavelVisita = Browser.visit(site, function (e, browser) {
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
		
		variavelVisita=null;
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
				print(message,sucessoWinRateAtualizado+" "+refreshRealizados+"ª das "+refreshRealizadosMAX);
				
			}
      }, refreshTEMPO);
}
//"☂ "
function padraoNick(winrate, nick){
	return winrate+"% ☂"+TAG+" "+nick;
}

function padraoNickKD(kd, nick){
	return kd+" ☂"+TAG+" "+nick;
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
	switch(message.guild.id){
		case "313195845761761281": //galera gamer
		case "368240657816354836": //bro
			var winrNome = message.member.nickname.substring(0,message.member.nickname.indexOf("%"));
			if(Number(winrNome)<Number(winrKD[0])) {message.member.setNickname( padraoNick(winrKD[0],nickLegivel) ).then(user => message.reply("kd: **"+winrKD[1]+`**, atualizei winrate \:umbrella2:`)).catch(err => console.log(err));}
			else {message.reply(" não atualizei, pois no site está: "+winrKD[0]);}
		break;
					
		case "325413143943577601"://pai
		case "398566083101196298"://depressaum
		case "377628278627893248"://mwd
			message.member.setNickname( padraoNickKD(winrKD[1],nickLegivel) ).then(user => message.reply("winrate: **"+winrKD[0]+`**, atualizei kd \:umbrella2:`)).catch(err => console.log(err));	
			//console.log(message.guild.roles);
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

function padraoAlt(browser,id) {
	var elem;
	if(id===0){
		elem = browser.queryAll(winsStormShieldPath);		
	}else{
		elem = browser.queryAll("body > div.container.pvp > div:nth-child(1) > div.col-12.col-md-8 > div:nth-child(1) > div:nth-child(4) > div > div.post > div:nth-child(3) > div:nth-child("+id+") > div > a > div.stat__value");
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
function randomDonate(){
	const reduzirMsgDonate = Math.ceil(msgDonate.length*1.2);
	const index = Math.floor(Math.random() * (msgDonate.length+reduzirMsgDonate));
	if(index >= msgDonate.length) return "";
	else return quebraLinha+msgDonate[index]+doacao;
}
