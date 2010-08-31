Function.prototype.bind = function(self){
    var fn = this;
    return function(){
	return fn.apply(self, arguments);
    };
};

Function.prototype.require = function(name, args){
    var fn = this;

    return function(){
	if(!this["_"+name+"Called"]){
	    this[name].apply(this,args);
	    this["_"+name+"Called"] = true;
	}
	return fn.apply(this, arguments);
    }
};

//////////////////////////////////////////////////

var Lair = {};

// Dependency injection for document.createElement
Lair.create = function(){
    return document.createElement.apply(document, arguments);
};

Lair.field = function(klass, name, defaultValue){
    klass.prototype[name] = function(value){
	if(value === undefined){
	    if(this["_"+name] === undefined){
		if(typeof defaultValue === "function"){
		    return defaultValue.apply(this,[]);
		} else {
		    return defaultValue;
		}
	    } else {
		return this["_"+name];
	    }
	} else {
	    this["_"+name] = value;
	    return this;
	}
    };
};

//////////////////////////////////////////////////

Lair.Map = function(options){
    this.layers = [];
    this.images = new Lair.ImageSet();
};

Lair.field(Lair.Map, "id");
Lair.field(Lair.Map, "container", function(){return $("#"+this.id());});

Lair.Map.prototype.prepare = function(){
    this.el = $(Lair.create("div"));
    this.el.css("position","relative");
    this.el.css("width","100%");
    this.el.css("height","100%");
    this.container().append(this.el);

    var canvas = $(Lair.create("canvas"));
    canvas.attr("width", this.width());
    canvas.attr("height", this.height());
    this.el.append(canvas);
    this.canvas = canvas[0];
};

Lair.Map.prototype.add = function(layer){
    this.layers.push(layer);
    layer.map = this;
    layer.setup(this.el);
    return layer;
}.require("prepare");

Lair.Map.prototype.draw = function(){
    this.images.ready(function(){
	    var el = this.el;
	    $.each(this.layers, function(){this.draw(el);});
	}.bind(this));
}.require("prepare");

Lair.Map.prototype.image = function(src){
    return this.images.image(src);
};

Lair.Map.prototype.width = function(){
    return this.el.width();
};

Lair.Map.prototype.height = function(){
    return this.el.height();
};

//////////////////////////////////////////////////

Lair.ImageSet = function(){
    this.images = {};
    this.loaded = 0;
    this.numImages = 0;
};

Lair.ImageSet.prototype.image = function(src){
    return this.images[src];
};

Lair.ImageSet.prototype.add = function(src){
    if(this.images[src]){return;} // Skip duplicates
    this.numImages++;
    var img = new Image();

    this.images[src] = img;
    img.onload = function(){
	this.loaded++;
	if(this.loaded === this.numImages){
	    if(this.whenReady){
		this.whenReady();
	    }
	}
    }.bind(this);

    img.src = src;

    return this;
};

Lair.ImageSet.prototype.ready = function(whenReady){
    if(this.loaded === this.numImages){
	whenReady();
    } else {
	this.whenReady = whenReady;
    }
};

//////////////////////////////////////////////////

Lair.Background = function(){};

Lair.field(Lair.Background, "image");
Lair.field(Lair.Background, "x", 0);
Lair.field(Lair.Background, "y", 0);

Lair.Background.prototype.setup = function(el,ready){
    this.map.images.add(this.image());
};

Lair.Background.prototype.draw = function(el){
    var ctx = this.map.canvas.getContext("2d");
    ctx.drawImage(this.map.image(this.image()),this.x(),this.y());
};

Lair.Background.prototype.position = function(x, y){
    return [this.x(x), this.y(y)];
};

//////////////////////////////////////////////////

Lair.Tiles = function(options){
    this.width = options.width || options.size;
    this.height = options.height || options.size;
    this.image = options.image;
    this.data = options.data || 0;

    this.tiles = [];
};

Lair.Tiles.prototype.setup = function(el){
    this.maxx = this.map.width() / this.width;
    this.maxy = this.map.height() / this.height;
    this.map.images.add(this.image);
};

Lair.Tiles.prototype.draw = function(el){
    var ctx = this.map.canvas.getContext("2d");
    for(var x = 0 ; x < this.maxx ; x++){
	for(var y = 0 ; y < this.maxy ; y++){
	    var source = this.tile(this.at(x, y));

	    if(source){
		ctx.drawImage(this.map.image(this.image),
			      source[0], source[1],
			      this.width, this.height,
			      x*this.width, y*this.height,
			      this.width, this.height);
	    }
	}
    }
};

Lair.Tiles.prototype.at = function(x, y){
    if(this.data instanceof Array){
	return this.data[x + y * this.maxx];
    }else if(this.data instanceof Function){
	return (this.data.bind(this))(x, y);
    }else {
	return this.data;
    }
};

/**
   Tiles in tilesheets are addressed as numbers read l-r, like so:
   0 1 2 3
   4 5 6 7...

   If you pass in a negative number or null, null will be returned (and nothing will be drawn)
 */
Lair.Tiles.prototype.tile = function(num){
    if(num === null ||
       num === undefined ||
       num < 0){
	return null;
    }

    // Number of tiles in a row on the tilesheet
    var row = this.map.image(this.image).width / this.width;

    return [this.width * (num % row),
	    this.height * Math.floor(num / row)];
};
