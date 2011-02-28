Doc = Base.extend({
	beans: true,

	initialize: function(canvas) {
		if (canvas && canvas instanceof HTMLCanvasElement) {
			this.canvas = canvas;
			this.size = new Size(canvas.offsetWidth, canvas.offsetHeight);
		} else {
			this.size = Size.read(arguments) || new Size(1024, 768);
			this.canvas = document.createElement('canvas');
			this.canvas.width = this.size.width;
			this.canvas.height = this.size.height;
		}
		this.bounds = new Rectangle(new Point(0, 0), this.size);
		this.ctx = this.canvas.getContext('2d');
		Paper.documents.push(this);
		this.activate();
		this.layers = [];
		this.activeLayer = new Layer();
		this.currentStyle = null;
		this.symbols = [];
		this.views = [new DocumentView(this)];
		this.activeView = this.views[0];
	},

	getCurrentStyle: function() {
		return this._currentStyle;
	},

	setCurrentStyle: function(style) {
		this._currentStyle = new PathStyle(this, style);
	},

	activate: function() {
		Paper.activateDocument(this);
	},

	redraw: function() {
		if (this.canvas) {
			// Initial tests conclude that clearing the canvas using clearRect
			// is always faster than setting canvas.width = canvas.width
			// http://jsperf.com/clearrect-vs-setting-width/7
			var view = this.activeView;
			var bounds = view.bounds;
			this.ctx.clearRect(0, 0, this.size.width + 1, this.size.height + 1);
			this.ctx.save();
			view.matrix.applyToContext(this.ctx, true);
			for (var i = 0, l = this.layers.length; i < l; i++) {
				this.layers[i].draw(this.ctx, {});
			}
			this.ctx.restore();
		}
	}
});
