/**
 * a HUD container and child items
 */

game.HUD = game.HUD || {};

// We store all the game strings in here:
var TEXT_THINGS = {};

game.HUD.Container = me.ObjectContainer.extend({

	init: function() {
		// call the constructor
		this.parent();
		
		// persistent across level change
		this.isPersistent = true;
		
		// non collidable
		this.collidable = false;
		
		// make sure our object is always draw first
		this.z = Infinity;

		// give a name
		this.name = "HUD";
		
		var self = this;

		// add our child score object at the top left corner
		me.event.subscribe("SHOW_TEXT", function (name) {
			var txt = TEXT_THINGS[name];
			if (!txt) {
				console.log("WARN: Text thing '" + name + "' doesn't exist");
				return;
			}
			self.addChild(txt);
			txt.start();
		});
	}
});

game.HUD.GameNote = me.Renderable.extend({
	init: function(x, y, txt) {
		this.parent(new me.Vector2d(x, y), 10, 10); 
		
		var self = this;

		this.border = 8;

		this.text = txt;

		this.endmsg = "Press [space] to continue...";

		this.font = new me.Font("Arial", 20, "white");
		this.smallfont = new me.Font("Arial", 14, "white");

		this.floating = true;
	},

	start: function () {
		
		this.skippable = false;
		this.changed = false;
		this.showend = false;
		
		var self = this;

		setTimeout(function () {
			self.showend = true;
			self.changed = true;
			self.skippable = true;
		}, 1500);
	},

	/**
	 * update function
	 */
	update : function () {
		if (this.visible && this.skippable && me.input.isKeyPressed("space")) {
			this.visible = false;
			return true;
		}
		if (this.changed) {
			this.changed = false;
			return true;
		}
		return false;
	},

	/**
	 * draw the score
	 */
	draw : function (ctx) {
		if (! this.visible ) { return; }
		var txt = this.text.join("\n");
		var size = this.font.measureText(ctx, txt);

		ctx.fillStyle = "rgba(20,20,20,0.8)";
		ctx.fillRect(
			this.pos.x - this.border,
			this.pos.y - this.border,
			size.width + 2 * this.border,
			size.height + 20 + 14 + 2 * this.border
		);

		this.font.draw(ctx, txt, this.pos.x, this.pos.y);
		if (this.showend) {
			var y_skip = (this.text.length + 1) * 20;
			this.smallfont.draw(ctx, this.endmsg, this.pos.x, this.pos.y + y_skip);
		}
	}

});

/** 
 * a basic HUD item to display score
 */
game.HUD.ScoreItem = me.Renderable.extend({	
	/** 
	 * constructor
	 */
	init: function(x, y) {
		
		// call the parent constructor 
		// (size does not matter here)
		this.parent(new me.Vector2d(x, y), 10, 10); 
		
		// local copy of the global score
		this.score = -1;

		// make sure we use screen coordinates
		this.floating = true;
	},

	/**
	 * update function
	 */
	update : function () {
		// we don't do anything fancy here, so just
		// return true if the score has been updated
		if (this.score !== game.data.score) {	
			this.score = game.data.score;
			return true;
		}
		return false;
	},

	/**
	 * draw the score
	 */
	draw : function (context) {
		// draw it baby !
	}

});


TEXT_THINGS.intro = new game.HUD.GameNote(96,64, [
	"Hello,",
	"I need to meet with you.",
	"I can help with your...",
	"condition...",
	"I'm on the mountain for",
	"some reason.",
	"",
	"- Wizard"
]);

var todays_date = moment().format("MMM D, YYYY:");

TEXT_THINGS.health = new game.HUD.GameNote(96,64, [
	todays_date,
	"I have found that my",
	"immortal blood has a",
	"healing effect on the",
	"local mortals. More",
	"experiments needed...",
	"",
	"- Wierdo"
]);