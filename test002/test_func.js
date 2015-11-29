function obj(){
	this.img = null;
	this.count = 10;
	this.droids = [];
	this.droidWidth = 0.0;
	this.droidHeight = 0.0;
	this.gl = null;
	this.init = function(glview, cb){
		this.gl = glview;
		this.img = glview.CreateImage( "/Sys/Img/Hello.png",  
                                       cb );
		this.droidWidth = 1.0 / this.count;
		this.droidHeight = 1.0 / this.count;
    	for (var i = 0; i < this.count; i++){
      		droids[i]={x: i*this.droidWidth, y: 0.0 };
    	}

	};
	this.draw = function(){
		if (!this.gl) return;
        for( var i = 0; i < this.count; i++ ){ 
            var angle = 0;
            //Draw the droid 
            this.gl.DrawImage(this.img,
			    this.droids[i].x, 
				this.droids[i].y,  
                this.droidWidth,
				this.droidHeight,  
                              angle ); 
        } 
		
	};
	//
	this.droidActive = null;
    this.cbDown = function (x, y){
  		this.droidActive = null;      
    	for (var i = 0; i< this.count; i++){
			var d = this.droids[i];
			var dx = x - d.x;
			var dy = y - d.y;
      		if((dx > 0 && dx < this.droidWidth)
      		 &&(dy > 0 && dy < this.droidHeight))
      		{
        		this.droidActive = {idx:i, dx:dx, dy:dy};
        		break;
       		}
    	}
	};
	this.cbUp = function(x, y){
		this.droidActive = null;
	};
	this.cbMove = function(x, y){
		if (!this.droidActive) return;
		var idx = this.droidActive.idx;
	  	this.droids[ idx ].x = x - droidActive.dx;
  		this.droids[ idx ].y = y - droidActive.dy;
	};

	return this;
};
obj();
