
/* Game namespace */
var game = {

	// an object where to store game information
	data : {
		health : 8
	},
	
	// We cache player position here, so other things can track it:
	player_x: 0,
	player_y: 0,

	// Player hands in `this` to update the cache:
	updatePlayerPos: function (x) {
		this.player_x = x.pos.x;
		this.player_y = x.pos.y;
	},
	
	// Run on page load.
	"onload" : function () {
		// Initialize the video.
		if (!me.video.init("screen", 480, 320, true, 'auto')) {
			alert("Your browser does not support HTML5 canvas.");
			return;
		}

		// add "#debug" to the URL to enable the debug Panel
		if (document.location.hash === "#debug") {
			window.onReady(function () {
				me.plugin.register.defer(debugPanel, "debug");
			});
		}

		// Initialize the audio.
		me.audio.init("mp3,ogg");

		// Set a callback to run when loading is complete.
		me.loader.onload = this.loaded.bind(this);

		// Load the resources.
		me.loader.preload(game.resources);

		// Initialize melonJS and display a loading screen.
		me.state.change(me.state.LOADING);
	},

	"showText" : function (name) {
		me.event.publish("SHOW_TEXT", [name.toLowerCase()]);
	},
	
	keysEnabled: false,

	enableKeys: function () {
		// Arrows:
		me.input.bindKey(me.input.KEY.LEFT,  "left");
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		me.input.bindKey(me.input.KEY.UP,    "jump", true);
		
		// WASD:
		me.input.bindKey(me.input.KEY.A, "left");
		me.input.bindKey(me.input.KEY.D, "right");
		me.input.bindKey(me.input.KEY.W, "jump", true);

		this.keysEnabled = true;
	},

	disableKeys: function () {
		me.input.unbindKey(me.input.KEY.LEFT);
		me.input.unbindKey(me.input.KEY.RIGHT);
		me.input.unbindKey(me.input.KEY.UP);
		me.input.unbindKey(me.input.KEY.A);
		me.input.unbindKey(me.input.KEY.D);
		me.input.unbindKey(me.input.KEY.W);

		this.keysEnabled = false;
	},

	// Run on game resources loaded.
	"loaded" : function () {
		me.state.set(me.state.MENU, new game.TitleScreen());
		me.state.set(me.state.PLAY, new game.PlayScreen());
		me.state.set(me.state.GAMEOVER, new game.GameOverScreen());
		me.state.set(me.state.GAME_END, new game.EndingScreen());

		me.entityPool.add("mainPlayer", game.PlayerEntity);
		me.entityPool.add("slug", game.SlugEntity);
		me.entityPool.add("spike", game.SpikeEntity);
		me.entityPool.add("bat", game.BatEntity);
		me.entityPool.add("spider", game.SpiderEntity);
		me.entityPool.add("fire", game.FireEntity);
		me.entityPool.add("spark", game.SparkEntity);
		me.entityPool.add("textTrigger", game.TextTriggerEntity);
		me.entityPool.add("triggerSummons", game.TriggerSummonEntity);
		me.entityPool.add("batWaker", game.BatWakerEntity);
		me.entityPool.add("shockWizard", me.ObjectEntity);
		me.entityPool.add("healthpotion", game.HealthPotionEntity);

		me.entityPool.add("immortalAsshole", game.ImmortalAssholeEntity);
		me.entityPool.add("magicAsshole", game.MagicAssholeEntity);
		me.entityPool.add("summonAsshole", game.SummonAssholeEntity);
		me.entityPool.add("fatAsshole", game.FatAssholeEntity);
		me.entityPool.add("confiscateDude", game.ConfiscateDudeEntity);
		me.entityPool.add("boss", game.BossEntity);
		me.entityPool.add("door", game.DoorEntity);
		me.entityPool.add("lastCoin", game.LastCoinEntity);
		me.entityPool.add("teleport", game.TeleportEntity);
		me.entityPool.add("gameEnder", game.GameEnderEntity);
		

		me.input.bindKey(me.input.KEY.SPACE, "space");
		this.enableKeys();

		// Start the game.
		me.state.change(me.state.PLAY);
	}
};
