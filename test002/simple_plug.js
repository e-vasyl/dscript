function obj(){
	this.img = null;
	this.img2 =null;
	this.count = 10;
	this.droids = [];
	this.droidWidth = 0.0;
	this.droidHeight = 0.0;
	//this.gl = null;
	this.init = function(image, img2){
		//this.gl = glview;
		this.img = image;
		this.img2 = img2;
		this.droidWidth = 1.0 / this.count;
		this.droidHeight = 1.0 / this.count;
    	for (var i = 0; i < this.count; i++){
      		droids[i]={x: i*this.droidWidth, y: 0.0 };
    	}

	};
	this.draw = function(gl){
		//if (!this.gl) return;
        for( var i = 0; i < this.count; i++ ){ 
            var angle = 0;
            //Draw the droid 
            gl.DrawImage(this.img,
			    this.droids[i].x, 
				this.droids[i].y,  
                this.droidWidth,
				this.droidHeight,  
                              angle); 
            gl.DrawImage(this.img,
			    this.droids[i].x, 
				this.droids[i].y + this.droidHeight*9/20,  
                this.droidWidth/10,
				this.droidHeight/10,  
                              angle ); 
            gl.DrawImage(this.img,
			    this.droids[i].x+this.droidWidth*9/10, 
				this.droids[i].y + this.droidHeight*9/20,  
                this.droidWidth/10,
				this.droidHeight/10,  
                              angle );
							  
    		if(i > 0)
			{
				var la=0.0;
				var a =0.0;
				var dx = this.droids[i].x - this.droids[i-1].x - this.droidWidth;
				var dy = this.droids[i].y - this.droids[i-1].y;
				var r = Math.sqrt(dx*dx + dy*dy);
				if (Math.abs(r) > 1e-5)
				{
					a =Math.asin(dy / r);
					la = a*180/Math.PI;
				}
				var cx = r*(1-Math.cos(a));
				var startx = this.droids[i-1].x + this.droidWidth - cx/4; 
				var starty = this.droids[i-1].y + this.droidHeight/2 + dy /2;
				if (dx < 0)
				{
					startx = this.droids[i].x + - cx/4;
					starty = this.droids[i-1].y + this.droidHeight/2 + dy /2;
					la= 180-la;
				}
				gl.DrawImage(this.img2,
			    startx, starty,  
                r - cx/2,
				this.droidHeight/10,  
                              la ); 

			}
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
