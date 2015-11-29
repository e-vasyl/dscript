
///// CLASSES
var VRect= function(x, y, w, h, onDraw, onDown, onMove){
	return {
		_x: x,
		_y: y,
		_w: w,
		_h: h,
		_onDraw: onDraw,
		_onDown: onDown,
		_onMove: onMove,
		getPos: function(){return {x:this._x, y:this._y};},
		setPos: function(x, y){this._x=x; this._y =y;},
		getSize: function(){return {w:this._w, h:this._h};},
		isInside: function(x,y){
			return ((x >= this._x) && (x <= (this._x + this._w))) &&
				((y >= this._y) && (y <= (this._y + this._h)));
			
		},
		onDraw: function(img){
			if(this._onDraw){this._onDraw(this, img, this._x, this._y, this._w,this._h);}
    	},
		onXYFunc:function(f,x,y){if(f){f(this, x,y);}},
		onDown: function(x,y){this.onXYFunc(this._onDown, x,y);},
		onMove: function(x,y){this.onXYFunc(this._onMove, x,y);}
		
	};
};

var VDrawManager = function(FPS, img){
	var res={
		_invalidated: true,
		_img:img,
		_objs:[],
		addObject: function(o){this._objs[this._objs.length]=o;},
		doDraw:function(){
			if(this._invalidated){
				this._invalidated = false;
				//Fill image with solid white. 
				this._img.SetColor("#ffffffff"); 

				/*for(var i=0; i< POI.length; i++){
					POI[i].onDraw(this._img);
				}*/
       var img = this._img;

				this._objs.map(function(i){i.onDraw(img);});
				
			}
		},
		invalidate:function(){
			this._invalidated = true;
		},
		doOnTouchDown:function(x,y){
			this._objs.map(function(i){
				if (i.isInside(x, y)) i.onDown(x, y);
			});
		},
		doOnTouchMove:function(x,y){
			this._objs.map(function(i){
				if (i.isInside(x, y)) i.onMove(x, y);
			});
		}
	};
	setInterval(function(){res.doDraw();}, 1000/FPS);
	return res;
};

var MGR;
//Called when application is started. 
function OnStart() 
{ 
	//Create a layout with objects vertically centered. 
	lay = app.CreateLayout( "Linear", "FillXY" );	 

	
	
	//Create a blank image. 
	img2  = app.CreateImage( "rect1.png", 1,1);
	imgStar = app.CreateImage("star1.png", 1,1);
	imgStarF = app.CreateImage("starF.png", 1,1);
	imgStarE = app.CreateImage("starE.png", 1,1);
	imgFly = app.CreateImage("fly1.png", 1,1);
	
	img = app.CreateImage( null, 1.0, 1.0 ); 
	img.SetTouchable(true);
  img.SetOnTouchDown(cbTouchDown); 
  img.SetOnTouchUp(cbTouchUp); 
  img.SetOnTouchMove(cbTouchMove); 
	lay.AddChild( img ); 

	//Add layout to app.	 
	app.AddLayout( lay ); 
    MGR = VDrawManager(30, img);
	 
	var clrF = function(t, x,y){img.SetColor('#FFFFCCCC'); MGR.invalidate();};
	var drwF = function(t,img, x,y,w,h){img.DrawImage(imgFly, x,y, w, h, 0);};
	var mvF = function(t, x,y){t.setPos(x-0.05,y-0.05); MGR.invalidate();};
	MGR.addObject( new VRect(0.0, 0.0, 0.1, 0.1, drwF,clrF,mvF) );
	//Draw our picture. 
	//DrawPicture();
} 


var startp = null;
function cbTouchDown(ev)
{ 
	var x = ev.x[0];
	var y = ev.y[0];
	MGR.doOnTouchDown(x,y);
	startp = {x:ev.x[0], y:ev.y[0]};
}
function cbTouchUp(ev)
{ 
	var x = ev.x[0];
	var y = ev.y[0];
}
function cbTouchMove(ev)
{
	var x = ev.x[0];
	var y = ev.y[0];
	//img.SetPaintColor( "#ff444444"  ); 
	//img.DrawRectangle( x,y, x+0.1, y+0.1 ); 
	MGR.doOnTouchMove(x,y);	
    //img.SetPaintColor( "#ff0000ff"  );
	//img.DrawLine(startp.x, startp.y, ev.x[0], ev.y[0] ); 
	
	startp = {x:x, y:y};
}
/*
function DrawPicture() 
{ 
	//Fill image with solid white. 
	img.SetColor( "#ffffffff" ); 
	//POI[0].onDraw();
	//Set drawing color to blue 
	//format is (#alpha:red:green:blue) in hex. 
	img.SetPaintColor( "#ff0000ff"  ); 
	 
	//Draw a tiny point (single pixel) in 
	//the center of the image. 
	img.DrawPoint( 0.5, 0.5 ); 
		 
	//Draw diagonal line. 
	img.SetLineWidth( 2.5 ); 
	img.SetPaintColor( "#ff0000ee"  ); 
	img.DrawLine( 0.6, 0.2, 0.7, 0.95 ); 
	 
	//Draw circle with radius 0.1 of image width. 
	img.SetPaintColor( "#ff992299"  ); 
	img.DrawCircle( 0.2, 0.2, 0.1 ); 

	//Draw some red text. 
	img.SetTextSize( 24 ); 
	img.SetPaintColor( "#ffff0000"  ); 
	img.DrawText( "Hello World", 0.1, 0.8 ); 
	 
	//Draw translucent rectangle. 
	img.SetPaintColor( "#22444444"  ); 
	img.DrawRectangle( 0.22, 0.7, 0.9, 0.88 ); 
	 
	//Draw un-filled circle. 
	img.SetPaintStyle( "Line" ); 
	img.SetPaintColor( "#ff00aa00" ); 
	img.DrawCircle( 0.3, 0.5, 0.05 ); 
} 
*/



