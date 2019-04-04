const Discord = require("discord.js");
const client = new Discord.Client();

const JSONbig = require('json-bigint');

const tabelaPreco = '**Mensalidade do bot ReifelTracker**\r\nDepende da quantidade de membros do servidor no discord\r\n\r\nExperimente por 7 dias e só paga se quiser continuar\r\nMensalidade:\r\nmembros -------- reais por mês\r\n1 a 85            -------- R$ 8\r\n86 a 250        -------- R$ 15\r\n251 a 650       -------- R$ 18\r\nmaior que 650      -------- R$ 22\r\n\r\n**Forma de pagamento**: boleto, transferência bancária (banco do brasil), depósito, paypal (+12% do preço pela taxa do paypal)\r\n**Dá direito a** 3 cargos (nomes customizáveis: Lendário, Épico, Raro)(representando kd ou winrate), instalação grátis e só paga quando estiver funcionando, os preços são para usar o bot do jeito que ele é na última atualização dele, com no máximo pequenas adaptações. Se não quiser mais, o bot é desinstalado e tem opção de remover as modificações feitas pelo bot (voltar ao que era antes).\r\n\r\n**plano econômico: R$ 16 por mês** independente do tamanho do servidor para usar apenas o comando !t\r\n**TRATAR COM:** @Reifel#5047 <@195731919424585728>. Não envie mensagem por aqui, envie para reifel';

const apoio = "", txt1MudarNick='winrate: **', txt2MudarNick='kd: **',txt3MudarNick='**, ', trackerTag="☂", espaco=" ", ftParam="?old=1", pfxCom1='!', pfxCom2='.', pfxCom3='c', reactEmoji='✔';

const usersPremium=['195731919424585728', '377626570816487449'];

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

//versao 1.1
const message = new Discord.Message();
const Browser = require('zombie');
Browser.silent = true;
Browser.waitDuration='6s'; //cloudflare
Browser.headers = {"Authorization":"1bx8rK3kQ_RAlyUv0jKN4NA3cEv7nAeQmDr5htoHDxg"}; //ativar backup 3

var Jimp = require("jimp");
//[apoia.se/reifel](https://apoia.se/reifel) - (*boleto | cartão de crédito - qlqr valor*)
const rodape = "dono:Reifel#5047 !comandos| !queroessebot", /*separador=" | ",*/ quebraLinha="\r\n", doacao=": use em outro !discord"+apoio;

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

var mempeak=0;
var ativarsuspender=false;
var suspensos = [];

var todosDias, diaHoje, liberarDiaExtra, barraApoio;

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
				  .catch(console.error);	
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
			client.users.get(guild.ownerID).send("Não Autorizado por Reifel\r\n"+tabelaPreco);
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

									}).then(role => rolesCriadas[0] = role.id).catch(console.error);

									guild.createRole({
										name: 'Épico',
										color: 'PURPLE',
										hoist: true, 
										managed: true,
										mentionable: true
									}).then(role => rolesCriadas[1] = role.id).catch(console.error);		

									guild.createRole({
										name: 'Raro',
										color: 'BLUE',
										hoist: true, 
										managed: true,
										mentionable: true
									}).then(role => {rolesCriadas[2] = role.id; salvarFrees(guild.id,rolesCriadas);}).catch(console.error);
								}catch(e){};
				} )
				  .catch(console.error);
				  
			
			client.users.get(guild.ownerID).send("para permitir cargos utilizar o bot va em:\r\nconfigurações do servidor >> cargos >> arraste reifeltracker pra cima\r\ne coloque acima dos cargos que vão utilizar o bot.\r\nvc pode renomear os cargos, se precisar de suporte, envie mensagem para Reifel#5047");
			
			//client.user.setPresence({
			//	game: {
			//		name: "com "+client.guilds.array().length +" |.discord"
			//	}
			//}); 
	
});

client.on('ready', () => {
	client.channels.get("459432939898273798").fetchMessage('483646835710361622')
			  .then(message => {
					try{
						var obj =  JSON.parse(message.content);
						todosDias = obj["todosDias"];
						liberarDiaExtra= obj["liberarDiaExtra"];
						atualizarBarraApoio(obj["progresso"]);						
					}catch(e){}
			} )
			  .catch(console.error);
			  
	client.channels.get("459432939898273798").fetchMessage('479842842899120134')
			  .then(message => {
					try{
					var obj =  JSON.parse(message.content);
					suspensos = obj["suspenso"];
					if(suspensos.length!=0)ativarsuspender=true;				
					}catch(e){}
			} )
			  .catch(console.error);
	
	client.channels.get("459432939898273798").fetchMessage('461722127205269505')
			  .then(message => {
					try{
					var obj =  JSON.parse(message.content);
					discAutorizados = obj["discords"];
					salasAutorizadas = obj["salas"];
										
					}catch(e){}
			} )
			  .catch(console.error);
			  
	client.channels.get("459432939898273798").fetchMessage('502436327258718208')
				  .then(message2 => {
						var obj = JSONbig.parse(message2.content);
						frees = obj;
				} )
				  .catch(console.error);
	
	client.channels.get("459432939898273798").fetchMessage('559897722296205324')
				  .then(message2 => {
						if(Number(message2.content)==0) aprendizadoPausado = false;
						else aprendizadoPausado = true;
				} )
				  .catch(console.error);
	
	try{
		client.user.username="ReifelTracker";
		client.user.setUsername("ReifelTracker");
	}catch(e){}
	salaRank = client.channels.get("368505848667832321");	
	salaVotem = client.channels.get("413597195846156299");	
	salaAposta = client.channels.get("416769967690743819");
	reifelUser = client.users.get('195731919424585728');
	//client.user.setActivity("interessados: https://u.nu/reifelcontato |Reifel#5047 |.queroessebot", { type: 'WATCHING', url:'https://www.twitch.tv/reifel'});
	
	client.user.setPresence({
			game: {
				//name: "com "+client.guilds.array().length +"|dono:Reifel#5047"
				name: "me contrata: www.u.nu/reifelcontato |Reifel#5047| +info em assistir >>",
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

client.on('message', message => {
	if(message.author.bot) return; //ignora poupar processamento bot
	
	var parametroUsado = "", nickLegivel="", site="";
	if(message.channel.id==555030723527049237) {try{aprendizado(message);}catch(e){} return;}
	if(message.channel.id==559100608666271754) if(typeof message.member.voiceChannel == 'undefined') {message.member.send("apenas quem está na scrim"); message.delete(); return;} //limitar streamers em scrim ams
	if(message.channel.id==546932004931895317||message.channel.id==551441598697963541) {
		var attch = (message.attachments).array();
		if(attch.length == 0) {message.delete(); return;}
		var membro = message.member;
		var copia = message;
		
		try{
		nickLegivel=parametroUsado = getNickConhecidoApexAMS(copia);
				var variavelVisita = Browser.visit(attch[0].url, function (e, browser) {
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
			
			variavelVisita=null;
		}catch(e){message.delete();}
		
	}	
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
	
	
	//stats
	client.channels.get("459432939898273798").fetchMessage('558602381558939658')
				  .then(message2 => {
						var obj = JSONbig.parse(message2.content);
						//var obj = {};
						if(obj[message.guild.id+""])  {obj[message.guild.id+""].qtd += 1;}
						else {obj[message.guild.id+""] = {"qtd":1, "nome":message.guild.name}; }
						message2.edit(JSON.stringify(obj));
				} )
				  .catch(console.error);	
	//fim-stats
	
		
	//dividindo cada palavra da mensagem em um array de palavras
	var args = message.content.slice(1).trim().split(/ +/g);
	//console.log(args);
	var comando = args[0];
	comando = comando.toLowerCase();
	switch(comando){ //so responder a nossos comandos, poupar cpu
		case "t":
		case "ti":
		case "alt":
		case "alt2":
		case "alt3":
		case "lvl":
		case "lvl2":
		case "elo":
		case "vitoria":
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
		case "prefab":
		case "verificar":
		case "debug":			
		case "db":		
		case "add":		
		case "new":		
		case "rem":
		case "clientes":		
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
	//31/out
	//if(ativarsuspender){
	//	if(suspensos.includes(idGuild)) {suspenso(message);return;}
	//}
	
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
				var variavelVisita = Browser.visit(site, function (e, browser) {				
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
					
					try{
						browser.deleteCookies();
						browser.tabs.closeAll(); browser.window.close(); browser.destroy();					
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
				var variavelVisita = Browser.visit(site, function (e, browser) {
					try{					
						var text = browser.html();
						padraoAtualizarNome(message,nickLegivel,text,site);
					}catch(e){
						try{ //tentar atualizar usando outro site
							var site = siteFortniteScout+parametroUsado;
							var variavelVisita2 = Browser.visit(site, function (e, browser) {					
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
								
								try{
									browser.deleteCookies();
									browser.tabs.closeAll(); browser.window.close(); browser.destroy();					
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
						browser.tabs.closeAll(); browser.window.close(); browser.destroy();					
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
				var variavelVisita = Browser.visit(site, function (e, browser) {				
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
				variavelVisita=null;
			}catch(e){}
		break;
			
		case "troquei":
			var nick = message.member.nickname;
			var winrate = nick.substring(0,nick.indexOf(trackerTag)-1);
			site = siteFortniteTracker+parametroUsado+ftParam;
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
						
				try{
					browser.deleteCookies();
					browser.tabs.closeAll(); browser.window.close(); browser.destroy();					
				}catch(e){
					
				}
				}catch(e){}
			});
			variavelVisita=null;
		break;
			
		case "modificar":
		if(message.author==reifelUser){}else {if(!message.channel.permissionsFor(message.member).has("ADMINISTRATOR")) {print(message,"Sem permissão");return;}}
		
		var nick = parametroUsado.substring(parametroUsado.indexOf("=")+1);
		site = siteFortniteTracker+nick+ftParam;
			try{
				var variavelVisita = Browser.visit(site, function (e, browser) {				
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
				variavelVisita=null;
			}catch(e){}
		
		break;

		case "vs":
		if(!( usersPremium.includes(message.author.id) )) return;
		var jsonSquadPA,jsonSquadPB;
		
		var players = parametroUsado.split("%20x%20");
				
		site = siteFortniteTracker+players[1]+ftParam;
		
		try{
			var variavelVisita = Browser.visit(site, function (e, browser) {				
						try{
							var text1 = browser.html();
							
							try{
								jsonSquadPB = getJsonSquad(text1);
								//console.log(jsonSquad);
								text1=null;
								
								site = siteFortniteTracker+players[0]+ftParam;
								try{
									var variavelVisita2 = Browser.visit(site, function (e, browser2) {				
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
												
												try{
													browser2.deleteCookies();
													browser2.destroy();					
												}catch(e){
													
												}
									});
									variavelVisita2=null;
								}catch(e){}
							}catch(e){		
								//console.log("error search");
								throw false;
							}
						}catch(e){
							console.log(e.message);
							print(message, nickLegivel + errorFortnitetracker);
						}
						
						try{
							browser.deleteCookies();
							browser.tabs.closeAll(); browser.window.close(); browser.destroy();					
						}catch(e){
							
						}
			});
			variavelVisita=null;
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
				var variavelVisita = Browser.visit(site, function (e, browser) {				
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
				variavelVisita=null;
			}catch(e){}
		break;
		
		case "alt2":
			site = siteFortniteStatsCOM+parametroUsado;
			try{
				var variavelVisita = Browser.visit(site, function (e, browser) {				
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
				variavelVisita=null;
			}catch(e){}
		break;
		
		case "alt":
			site = siteFortniteScout+parametroUsado;
			try{
				var variavelVisita = Browser.visit(site, function (e, browser) {				
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
				variavelVisita=null;
			}catch(e){}
		break;
			
		case "att":
			print(message,"o comando att foi desativado, confira a sala att-level para atualizar o nick");
			return;
			break;
		case "r":
			//message.author.send("devido a sobrecarga na origin o comando r foi desativado, solicite sala no servidor para atualizar com arquivo");
			message.author.send("devido a sobrecarga na origin o comando r foi desativado, use o comando .lvl a cada 3 níveis");
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
				if(args[1] !== undefined) message.author.send(errorNaoUsarProprioNick);
			}catch(e){
				//caso nao tenha guarda chuva, mantem o nick como arg
			}
			site = "https://apex.tracker.gg/profile/pc/"+parametroUsado;
			try{
				var variavelVisita = Browser.visit(site, function (e, browser) {				
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
				variavelVisita=null;
			}catch(e){}
		break;
			
		case "mudei":
			site = "http://api.apexlegendsstatus.com/bridge?platform=PC&auth=0V7bLm3DwwImSEr9ruFI&player="+parametroUsado;
			try{
					var level;
				request(site, function (error, response, body) {
					var text = body;
					
					var data = JSON.parse(text.substring(text.indexOf("{"), text.lastIndexOf("}")+1));
					if(data == undefined) {message.reply("tente novamente mais tarde");return;}
					level = data.global.level;

						var levelatual;
						var nome = message.member.nickname;
						if(nome.indexOf('★') == (nome.length-1))
							levelatual = nome.substring(nome.lastIndexOf(' ',nome.length-3)+1,nome.length-2);
						else
							levelatual = nome.substring(0,nome.indexOf(' '));
						if( (parseInt(levelatual) + 20) >= parseInt(level) ) { 
							switch(message.guild.id){
							case '542501711860727848':
								mudarNick(message, padraoNickApex(levelatual,nickLegivel));
							break;
								
							case '550108927698927626':
								mudarNick(message, padraoNickApexAMS(levelatual,nickLegivel));
							break;
							
							case '542501242916700181':
								mudarNick(message, padraoNickApexAMS(levelatual,nickLegivel));
							break;
						}
						}else{
							//reifelUser.send(nickLegivel+"win%: "+parseFloat(winrKD[0])- (parseFloat(winrate) + 2.4) );
							print(message, "não posso trocar seu nick, pois demorou muito tempo com nick desatualizado, peça a algum moderador");
						}
				});
			}catch(e){
						//print(message,e);
			}
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
		}catch(e){/*nick nao conhecido*/}
		/*	
		site = "https://www.apexlegendsapi.com/api/v1/player?platform=pc&name="+parametroUsado;
			try{
				var variavelVisita3 = Browser.visit(site, function (e, browser) {	
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
			try{
				var variavelVisita3 = Browser.visit(site, function (e, browser) {				
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
							var cargosEloP = ['562939565329874954', '562939565388726285'];
							var cargosElo = ['562423267894231072', '562423268292689920', '562423268511055892'];
							switch(eloPontos[0]){
								case "S+":
									changeRole(message.member, cargosEloP[1], cargosEloP[0]);
									message.reply(pontos+", tierS+");
									break;
								break;
								case "S":
									changeRole(message.member, cargosElo[1], cargosElo[0]);
									message.reply(pontos+", tierS");
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
													message.reply(pontos+", tierA");
												}
											);
										}, 1700);	
									}else{
										changeRole(message.member, cargosElo[2], cargosElo[1]);
										message.reply(pontos+", tierA");
									}

									break;
								case "B":
									changeRole(message.member, cargosElo[1], cargosElo[2]);
									message.reply(pontos+", tierB");
									break;
								default:
									message.reply(pontos+" não elegivel para tier ainda (minimo: 33,84)");
									break;
							}

					}catch(e){
						//console.log(e);
					}
					try{
						browser.deleteCookies();
						browser.tabs.closeAll(); browser.window.close(); browser.destroy();					
					}catch(e){

					}
				});	
				variavelVisita3=null;
			}catch(e){}
			
						
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
					try{
						browser.deleteCookies();
						browser.tabs.closeAll(); browser.window.close(); browser.destroy();					
					}catch(e){

					}
				});	
				variavelVisita3=null;
			}catch(e){}	*/
		break;
			
		case "dk":
			site = "https://apex.tracker.gg/profile/pc/"+parametroUsado;
			try{
				var variavelVisita3 = Browser.visit(site, function (e, browser) {				
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
					try{
						browser.deleteCookies();
						browser.tabs.closeAll(); browser.window.close(); browser.destroy();					
					}catch(e){

					}
				});	
				variavelVisita3=null;
			}catch(e){}	
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
								console.error(err);
							  }); 
					  });


					  
				  })
				  .catch(err => {
					console.error(err);
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
				if(args[1] !== undefined) message.author.send(errorNaoUsarProprioNick);
			}catch(e){
				//caso nao tenha guarda chuva, mantem o nick como arg
				if(args[1] == undefined) message.author.send("faltou colocar espaço o seu nick da origin no comando .lvl");
			}
			site = "https://apex.tracker.gg/profile/pc/"+parametroUsado;
			try{
				var variavelVisita = Browser.visit(site, function (e, browser) {				
					//var level,wins,winP,kd,kills,selector;	
					var level;
					try{
						var text = browser.html();
						text = text.substring(text.indexOf('"playerId": "'));
						text = "[{"+text.substring(0,text.indexOf(']'))+"]";
						text = JSON.parse(text);	
						level = text[0].level.value;
						
						if(capUpdate(message, level)) return;
						
						level = [level, level];
						
						
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
								padraoRankWinApex(message, message.member, nickLegivel, level, ["550153057653227541", "550153058030583820", "550153058613723156","550153494045261837"], [150,100,60,30], "Continua onde está, os niveis atuais são: 150+, 100+, 60+, 30+");
								
								var posicaoGuardaChuva = -1;
								try{
									posicaoGuardaChuva = message.member.nickname.indexOf("★");		
								}catch(e){

								}
								//if(posicaoGuardaChuva!==-1)return;
								mudarNick(message, padraoNickApexAMS(level[0],nickLegivel));
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
								
						}
					}catch(e){
						//site alternativo
						site = "https://apextab.com/api/search.php?platform=pc&search="+parametroUsado;
						try{ //tentar atualizar usando outro site
							var variavelVisita2 = Browser.visit(site, function (e, browser) {					
								var winP, selector;	
								try{
									var text = browser.html(); //pega o id profile
									var a = JSON.parse(text.substring(text.indexOf('{'), text.lastIndexOf('}')+1));										
									var level = a.results[0].level;	
									a = null;
									
									if(capUpdate(message, level)) return;
									
									level = [level, level];
									
									switch(message.guild.id){
										case '542501711860727848':
											padraoRankWinApex(message, message.member, nickLegivel, level, ["550497864023932943","547963888256286732","547959283116146718", "547959283141312525"],[150,100,60,30], "Continua onde está, os niveis atuais são: 150+, 100+, 60+, 30+");
											//mudarNick(message, padraoNickApex(level[0],nickLegivel));
										break;

										case '550108927698927626': //ams scrims
											padraoRankWinApex(message, message.member, nickLegivel, level, ["550133503208062995", "550118715056848937","550118715337736210"], [150,100,60,30], "Continua onde está, os niveis atuais são: 150+, 100+, 60+, 30+");
											//mudarNick(message, padraoNickApexAMS(level[0],nickLegivel));
										break;

										case '542501242916700181': //ams
											padraoRankWinApex(message, message.member, nickLegivel, level, ["550153057653227541", "550153058030583820", "550153058613723156","550153494045261837"], [150,100,60,30], "Continua onde está, os niveis atuais são: 150+, 100+, 60+, 30+");

											var posicaoGuardaChuva = -1;
											try{
												posicaoGuardaChuva = message.member.nickname.indexOf("★");		
											}catch(e){

											}
											if(posicaoGuardaChuva!==-1)return;

											mudarNick(message, padraoNickApexAMS(level[0],nickLegivel));
										break;
											
											
										case '292028288178847744': //mago academy
											padraoRankWinApex(message, message.member, nickLegivel, level, ["559835221730525195","559835222024126476","559835222313664515"],[150,100,60], "Continua onde está, os niveis atuais são: 150+, 100+, 60+");
											mudarNick(message, padraoNickApex(level[0],nickLegivel));
										break;
									}
							
						}catch(e){
							//print(message,errorNickNaoEncontrado);
							//return;
						}	
						try{
							browser.deleteCookies();
							browser.tabs.closeAll(); browser.window.close(); browser.destroy();					
						}catch(e){

						}
						});
						variavelVisita2=null;
					}catch(e){
						//print(message, "erro");
						//site alternativo2
						site = "https://www.apexlegendsapi.com/api/v1/player?platform=pc&name="+parametroUsado;
						try{
							var variavelVisita3 = Browser.visit(site, function (e, browser) {				
								var level;	
								try{
									var text = browser.html();
									var data = JSON.parse(text.substring(text.indexOf("{"), text.lastIndexOf("}")+1));
									level = data["level"];
									
									if(capUpdate(message, level)) return;
									
									level = [level,level]; //gambiarra
									
									switch(message.guild.id){
										case '542501711860727848':
											padraoRankWinApex(message, message.member, nickLegivel, level, ["550497864023932943","547963888256286732","547959283116146718", "547959283141312525"],[150,100,60,30], "Continua onde está, os niveis atuais são: 150+, 100+, 60+, 30+");
											//mudarNick(message, padraoNickApex(level[0],nickLegivel));
										break;

										case '550108927698927626': //ams scrims
											padraoRankWinApex(message, message.member, nickLegivel, level, ["550133503208062995", "550118715056848937","550118715337736210"], [150,100,60,30], "Continua onde está, os niveis atuais são: 150+, 100+, 60+, 30+");
											//mudarNick(message, padraoNickApexAMS(level[0],nickLegivel));
										break;

										case '542501242916700181': //ams
											padraoRankWinApex(message, message.member, nickLegivel, level, ["550153057653227541", "550153058030583820", "550153058613723156","550153494045261837"], [150,100,60,30], "Continua onde está, os niveis atuais são: 150+, 100+, 60+, 30+");

											var posicaoGuardaChuva = -1;
											try{
												posicaoGuardaChuva = message.member.nickname.indexOf("★");		
											}catch(e){

											}
											if(posicaoGuardaChuva!==-1)return;

											mudarNick(message, padraoNickApexAMS(level[0],nickLegivel));
										break;
									}
								}catch(e){
									
								}
								try{
									browser.deleteCookies();
									browser.tabs.closeAll(); browser.window.close(); browser.destroy();					
								}catch(e){

								}
							});	
							variavelVisita3=null;
						}catch(e){}						
						
					}
						//fim site alternativo
						
						
						//print(message,"ops: esqueceu do nick ou trocou? se nao, os dados estao offline, tente dps de 30s");
						
					}
					//var resultado = formatarMsg(winP,kd,wins,kills,'--');
					//msgPadraoBot(message, resultado, site, nickLegivel);
				});	
				variavelVisita=null;
			}catch(e){}
		break;
			
			
		case "semana":
			message.author.send("Certo! avisei ao Reifel que vc quer semana gratis, ele vai mandar msg pra vc jaja pra comecar a instalação, se quiser adiantar: cria uma sala reifeltracker no discord q vai usar e manda um convite pro @Reifel#5047 <@195731919424585728> que ele instala");
			reifelUser.send(message.author+" quer semana gratis");
		break;
		case "queroessebot":
		case "discord":
		case "tbquero":
			message.author.send(tabelaPreco);
			reifelUser.send(message.author+" futuro cliente");
		break;
		
		case "convitegratis":			
			message.author.send(conviteFreeLink);
			reifelUser.send(message.author+" ta usando free");
		break;
		
		case "rank":
			
			try{
				nickLegivel=parametroUsado = getNickConhecido(message);
				parametroUsado=encodeURI(parametroUsado);
				if(args[1] !== undefined) print(message,errorNaoUsarProprioNick);
			}catch(e){
				//caso nao tenha guarda chuva, mantem o nick como arg
			}
			
		site = siteFortniteTracker+parametroUsado+ftParam;
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
				var variavelVisita = Browser.visit(site, function (e, browser) {				
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

					try{
						browser.deleteCookies();
						browser.tabs.closeAll(); browser.window.close(); browser.destroy();					
					}catch(e){

					}
				});
				variavelVisita=null;
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
						var variavelVisita = Browser.visit(Attachment[0].url, function (e, browser) {
							var text = browser.text();
							text= text.substring(text.indexOf('localClientPlayerCachedLevel "')+30);
							text= text.substring(0,text.indexOf('"'));
							console.log(text);
						});
					
					variavelVisita=null;
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
			
			var channelBusca = client.channels.get("459432939898273798");			
			//channelBusca.send('{ "name":"Rafael", "count":30}');
			
			channelBusca.fetchMessage('459435742351982618')
			  .then(message => editarJSON(message) )
			  .catch(console.error);
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
			  .catch(console.error);
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
			  .catch(console.error);
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
			  .catch(console.error);
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
			message.guild.leave();
			message.delete();
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
					var text = body;
					var data = JSON.parse(text.substring(text.indexOf("{"), text.lastIndexOf("}")+1));
					if(data.realtime.isInGame){
						print(message,"em partida");
					}else{
						print(message,"no lobby");
					}
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
				  .catch(console.error);
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
					  .catch(console.error);
					
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
					  .catch(console.error);
				break;
				case "pausarprints":
					aprendizadoPausado=true;
					print(message,"prints pausado");

					client.channels.get("459432939898273798").fetchMessage('559897722296205324')
					  .then(message2 => {
							message2.edit("0");
					} )
					  .catch(console.error);
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
			  .catch(console.error);
		break;
		*/
		
		case "help":
		case "comandos":
			//print(message, helpMessage);
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

				}).then(role => rolesCriadas[0] = role.id).catch(console.error);

				message.guild.createRole({
					name: 'Épico',
					color: 'PURPLE',
					hoist: true, 
					managed: true,
					mentionable: true
				}).then(role => rolesCriadas[1] = role.id).catch(console.error);		

				message.guild.createRole({
					name: 'Raro',
					color: 'BLUE',
					hoist: true, 
					managed: true,
					mentionable: true
				}).then(role => print(message,"'"+rolesCriadas[0]+"', '"+rolesCriadas[1]+"', '"+role.id+"'")).catch(console.error);
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
				var variavelVisita2 = Browser.visit(site, function (e, browser) {					
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
					
					try{
						browser.deleteCookies();
						browser.tabs.closeAll(); browser.window.close(); browser.destroy();					
					}catch(e){
						
					}
				});
				variavelVisita2=null;
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
});
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
		var variavelVisita = Browser.visit(site, function (e, browser) {
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
				print(message,sucessoWinRateAtualizado+espaco+refreshRealizados+"ª das "+refreshRealizadosMAX);
				
			}
      }, refreshTEMPO);
}

function mudarNick(message, novoNick, extra=""){
	message.member.setNickname( novoNick ).then(user => message.reply(extra+`atualizei`)).catch(err => message.reply(`Não consegui atualizar, mas seria: `+novoNick));
}

function mudarNickSilencioso(message, novoNick, extra=""){
	message.member.setNickname( novoNick ).then(user => message.member.send(extra+`atualizei`)).catch(err => message.reply(`Não consegui atualizar, mas seria: `+novoNick));
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
		}).catch(console.error);
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
			message.author.send("Você precisa de mais nível para registrar o rank (26+)");
		}
		
		//usuario.setNickname( padraoNick(winrKD[0],nickLegivel) ).then(usuario.setNickname( padraoNick(winrKD[0],nickLegivel) )).then(user => message.reply("kd: **"+winrKD[1]+`**, atualizei winrate \:umbrella2:`)).catch(err => console.log(err));	
}

const capLevel=3;
function capUpdate(message, level){
	try{
		try{message.react(reactEmoji);}catch(e){}
		var levelSite = parseInt(level);
		if(levelSite==60 || levelSite==61 || levelSite==100 || levelSite==101 ) return false; //liberar se tiver esses niveis
		
		var nome = message.member.nickname;
		var levelatual;
		if(nome.indexOf('★') == (nome.length-1))
			levelatual = nome.substring(nome.lastIndexOf(' ',nome.length-3)+1,nome.length-2);
		else
			levelatual = nome.substring(0,nome.indexOf(' '));
		var atual = parseInt(levelatual);
		if( (levelSite - atual) < capLevel) {message.author.send("aguarde sem atualizar até o level:"+(atual+capLevel)); return true;}
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
								console.error(err);
							  }); 
					  });					  
				  })
				  .catch(err => {
					console.error(err);
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
				  .catch(console.error);	
	   
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
				  .catch(console.error);
}


function getEloKL(level,kills=0,matches=0,dano=0){
	var ratio = 3.6;
	var kl = (((2.6*kills)+(dano/175))/level);
	//var kpm=0;
	//if(matches!=0) kpm = (kills/matches);	
	var msgComplemento = " kill+KillDano/lvl";
	if(kl >= 19*ratio){
		//if(kpm > 4.8) return ["S+",kl,kl+" "+kpm];
		return ["S",kl,kl.toFixed(2)+msgComplemento];
	}else if(kl >= 11.8*ratio) {
		//if(kpm > 2) return ["A+",kl,kl+" "+kpm];
		return ["A",kl+"",kl.toFixed(2)+msgComplemento];
	}
	else if(kl >= 9.4*ratio){
		return ["B",kl+"",kl.toFixed(2)+msgComplemento];
	}
	else return ["C",kl+"",kl.toFixed(2)+msgComplemento];
}

function getEloMatches(level,kills=0,matches){
	var kpm = (kills/matches);
	var resultado=0;
	//var nerf = 0.58;
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
	
	var tierS = 55, tierA = 37, tierB = 10, tierAtual = r/10; 
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
