Function.prototype.bind = function(self){
    var fn = this;
    return function(){
	return fn.apply(self, arguments);
    };
};

//////////////////////////////////////////////////

var Lair = {};

// Dependency injection for document.createElement
Lair.create = function(){
    return document.createElement.apply(document, arguments);
};

//////////////////////////////////////////////////

Lair.Map = function(options){
    this.id = options.id;
    this.container = $("#"+this.id);

    this.el = $(Lair.create("div"));
    this.el.css("position","relative");
    this.el.css("width","100%");
    this.el.css("height","100%");
    this.container.append(this.el);

    var canvas = $(Lair.create("canvas"));
    canvas.attr("width", this.width());
    canvas.attr("height", this.height());
    this.el.append(canvas);
    this.canvas = canvas[0];

    this.layers = [];
    this.images = [];
    this.loadedImages = {};
};

Lair.Map.prototype.add = function(layer){
    this.layers.push(layer);
    layer.map = this;
    layer.setup(this.el);
    return layer;
};

Lair.Map.prototype.draw = function(){
    if(this.ready){
	var el = this.el;
	$.each(this.layers, function(){this.draw(el);});
    }else{
	this.loadImages(this.draw.bind(this));
    }
};

Lair.Map.prototype.loadImages = function(after){
    var toLoad = this.images.length;
    var map = this;

    $.each(this.images, function(index, src){
	    var img = new Image();
	    img.onload = function(){
		map.image(src, img);
		toLoad--;
		if(toLoad === 0){
		    map.ready = true;
		    after();
		}
	    };
	    img.src = src;
	});
};

Lair.Map.prototype.image = function(name, image){
    if(image){
	this.loadedImages[name] = image;
    }
    return this.loadedImages[name];
};

Lair.Map.prototype.width = function(){
    return this.el.width();
};

Lair.Map.prototype.height = function(){
    return this.el.height();
};

//////////////////////////////////////////////////

Lair.Background = function(options){
    this.image = options.image;

    this.x = options.x || 0;
    this.y = options.y || 0;
};

Lair.Background.prototype.setup = function(el,ready){
    this.map.images.push(this.image);
};

Lair.Background.prototype.draw = function(el){
    this.position();
    var ctx = this.map.canvas.getContext("2d");
    ctx.drawImage(this.map.image(this.image),this.x,this.y);
};

Lair.Background.prototype.position = function(x, y){
    this.x = x || this.x;
    this.y = y || this.y;
    return [this.x, this.y];
};

//////////////////////////////////////////////////

Lair.Tiles = function(options){
    this.width = options.width || options.size;
    this.height = options.height || options.size;
    this.image = options.image;

    this.tiles = [];
};

Lair.Tiles.prototype.setup = function(el){
    this.maxx = this.map.width() / this.width;
    this.maxy = this.map.height() / this.height;
    this.map.images.push(this.image);
};

Lair.Tiles.prototype.draw = function(el){
    var ctx = this.map.canvas.getContext("2d");
    for(var x = 0 ; x < this.maxx ; x++){
	for(var y = 0 ; y < this.maxy ; y++){
	    ctx.drawImage(this.map.image(this.image),
			  32, 0,
			  this.width, this.height,
			  x*this.width, y*this.height,
			  this.width, this.height);
	}
    }
};