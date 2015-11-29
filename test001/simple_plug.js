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
	this.drawLine = function(gl, x1,y1, x2,y2, width){
		        var a  = 0.0;
				var la = 0.0;
				var dx = x2-x1;
				var dy = y2-y1;
				var r = Math.sqrt(dx*dx + dy*dy);
				if (Math.abs(r) > 1e-5)
				{
					a =Math.asin(dy / r);
					la = a*180/Math.PI;
				}
				var cx = r*(1-Math.cos(a));
				var startx = x1 - cx/4; 
				var starty = y1 + dy /2;
				if (dx < 0)
				{
					startx = x2  - cx/4;
					//starty = y1 + dy /2;
					la = 180-la;
				}
				gl.DrawImage(this.img2, startx, starty, r - cx/2, width, la); 
		
	};
	this.drawLine2 = function(gl, x1,y1, x2,y2, width){
				var dx = x2-x1;
				var dy = y2-y1;
				var mx = (x1 + x2) /2;
				var my = (y1 + y2) /2;
		        if (Math.abs(dy) < width)
				{
					var startx = Math.min(x1, x2);
					gl.DrawImage(this.img2, startx, my, Math.abs(dx), width, 0);
				}else{
					var k1= 0.6;
					var k2=1.2;
					var ka = ((dy <0)^(dx < 0)) ? (6):(-6);
					var kk = (dy <0) ? (width):(width);
					var kk2 = Math.abs(kk);
					var leny = Math.abs(dy) * k1;
					var starty = Math.min(y1, y2) + leny/k2;
					var startx_ = mx - leny /2;
					if (Math.abs(dx) < width){
						gl.DrawImage(this.img2, startx_, starty, leny, width, 90);
					}else{
						var startx = Math.min(x1, mx+kk);
						//var starty = Math.min(y1, y2)+leny/k2;
						var endx   = Math.min(mx+kk, x2);
						gl.DrawImage(this.img2, startx, y1, Math.abs(dx)/2-kk2, width, 0);
						gl.DrawImage(this.img2, startx_, starty, leny, width, 90+ka);
						gl.DrawImage(this.img2, endx, y2, Math.abs(dx)/2-kk2, width, 0);
					}
				}		
	};
	this.drawLineI = function(gl, i){
		this.drawLine(gl, 
		              this.droids[i-1].x + this.droidWidth,
		              this.droids[i-1].y + this.droidHeight/2,
		              this.droids[i].x,
		              this.droids[i].y + this.droidHeight/2,
		              this.droidHeight/10);
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
				this.drawLineI(gl,i);

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
		if(this.droidActive && this.droidActive.idx == 0)
		{
			var d = this.droids[0];
			this.droids[this.count]={x:d.x+this.droidWidth, y:d.y};
			this.count++;
			//this.droidActive = null;
		}
	};
	this.cbUp = function(x, y){
		this.droidActive = null;
	};
	this.cbMove = function(x, y){
		var t = this.droidActive;
		if (!t) return;
		var idx = t.idx;
	  	this.droids[ idx ].x = x - t.dx;
  		this.droids[ idx ].y = y - t.dy;
	};

	return this;
};
obj();
