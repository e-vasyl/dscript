
function nullf(){}
function ImgDelegate(onDraw, onDown){
    return {onDown:onDown,
    onDraw:onDraw};
}
function ImgDelegateIdx(idx){
    if (arguments.length < 1) return null;
    var name = (idx >=0 &&idx<img_n.length)?img_n[idx]:null;
    var image = app.CreateImage(name, 1, 1);
    if (!name){
        image.SetColor("#ffFFFFFF");
    }
    function ddraw (img){img.DrawImage(image,0,0,1,1,0);};
    return ImgDelegate(ddraw, nullf);
}
function ImgDelegateCompose(imd1, imd2){
    if (arguments.length < 2) return null;
    function f1(img){imd1.onDraw(img);imd2.onDraw(img);};
    function f2(evt){imd2.onDown(evt);imd1.onDown(evt);};
    var res = ImgDelegate(f1, f2);
    res.decompose = function(){return [imd1, imd2];};
    return res;
}
function ImgDelegateVector(/*VECTOR OF DELEGATES*/){
    if (arguments.length <1) return null;
    var state = {idx:0, 
                 ids:arguments, 
                 get:function(){return this.ids[this.idx];},
                 set:function(i){if(i>=0 && i<this.ids.length){this.idx=i;}},
				 next:function(){this.idx=(this.idx+1)%this.ids.length;
				                 return this.get();}
                 };
    function f1(img){state.get().onDraw(img);};
    function f2(evt){state.get().onDown(evt);};
    var res = ImgDelegate(f1, f2);
    res.decompose = function(){return state.ids;};
    res.change = function(i){state.set(i);};
    return res;
}
function ImgDelegateRect(onDown){
	function drawRect(img){
    	img.SetPaintColor("#FFC0C0C0");
    	img.SetPaintStyle("Line");
    	img.SetLineWidth(5);
		var ex = 0.03; var ey = 0.07;
		img.DrawRectangle(0+ex,0+ey, 1-ex,1-ey);
	};
	return ImgDelegate(drawRect, onDown);
}
function genDrawFly(angle)
{
    var c=0.5;
    var s=(angle&2)?-1:1;
    var z=(angle&1)?0:1;
    function Z(a,b){return z?a:b;};
    
    var t1a=c;      var t1b=c-s*0.2; var t1c=c+s*0.2;
    var t2a=c-s*0.1;var t2b=c+s*0.2; var t2c=c;
    var t3a=c+s*0.2;var t3b=c+s*0.25;var t3c=c-s*0.05;var t3d=c+s*0.05;

    var x1a=Z(t1a,t1b);var y1a=Z(t1b,t1a);
    var x1b=Z(t1a,t1c);var y1b=Z(t1c,t1a);
    var x2a=Z(t2a,t2c);var y2a=Z(t2c,t2a);
    var x2b=Z(t2b,t2c);var y2b=Z(t2c,t2b);
    var x3a=Z(t3a,t3c);var x3aa=Z(t3b,t3c);var y3a=Z(t3c,t3a);var y3aa=Z(t3c,t3b);
    var x3b=Z(t3a,t3d);var x3bb=Z(t3b,t3d);var y3b=Z(t3d,t3a);var y3bb=Z(t3d,t3b);
    return function(img){
    ////img.SetColor("#ff0000");
    img.SetPaintColor("#FF000000");
    img.SetPaintStyle("Line");
    img.SetLineWidth(5);
    img.DrawCircle(x1a, y1a, 0.15);
    img.DrawCircle(x1b, y1b, 0.15);
    img.SetPaintStyle("Fill");
    img.DrawCircle(x2a, y2a, 0.15);
    img.DrawCircle(c,   c,   0.15);
    img.DrawCircle(x2b, y2b, 0.15);
    img.SetPaintColor("#FF00ff00");
    img.DrawLine(x3a, y3a, x3aa, y3aa);
    img.DrawLine(x3b, y3b, x3bb, y3bb);
    };
}
var img_n=[
    "fly1.png",     // 0
    "run1.png",
    "restart1.png", // 2
    "pause1.png",
    "starF.png",    // 4
    "starE.png",
    "arrowL2.png",  // 6
    "arrowR2.png",
    "arrowGo.png",  // 8
    "star1.png",
    "rect2.png",    //10
    "stop1.png",    //11
    //"", //12
];
/*
function addImg(idx, x,y, w,h)
{
    var width=height=0.1;
    if(arguments.length >= 5){width=w; height=h;}
    if(typeof(idx) != typeof(0))
    {return null;}
    var name = (idx >=0 &&idx<img_n.length)?img_n[idx]:null;
    var res = app.CreateImage(name, width, height);
    if (idx == 0)
    {
        res.DrawLine(0,0, 1,1);
    }
    if (!name){
        res.SetColor("#ffFFFFFF");
    }
    if(arguments.length >= 3)
        res.SetPosition(x, y);
    layAbs.AddChild(res);
    return res;
}
function addImg2(idx, x,y, f){
    var res = addImg(idx, x,y);
    res.SetTouchable(true);
    res.SetOnTouchDown(f);
    return res;
}
*/
var prog_pos={x:0.7, y:0.6};
var prog_len=0;
var prog_max=9;
var prog=[];
var prog_int=[];
var field=[];

function onDownDef(ev)
{
	var from = ev.source;
	if(from.hasattr("def")){
		var evt = {
			src:from, 
			x:ev.x[0], 
			y:ev.y[0],
			};
		from.def.onDown(evt);
	}
}
function placeImage(x,y, w,h)
{
    var width=height=0.1;
    if (arguments.length >= 4){width=w; height=h;}
    var res = app.CreateImage(null, width, height);
    res.SetColor("#00FFFFFF");
    if (arguments.length >= 2){res.SetPosition(x, y);}
    layAbs.AddChild(res);
    return res;
}
function addImgDef(x,y,imgDlgt)
{
	var res = placeImage(x,y);
	res.def = imgDlgt;
	imgDlgt.onDraw(res);
    res.SetTouchable(true);
    res.SetOnTouchDown(onDownDef);
    return res;
}

function onDown0(ev){
    
    addToProg(0);

if(x){x.onDraw(field[0]);}};
function onDown1(ev){addToProg(1);};
function onDown2(ev){addToProg(2);};
function onDown3(ev){addToProg(3);};
function onDownD(ev){
    if(prog_len>0)
    {
        prog_len--;
        //prog[prog_len].SetVisibility("Hide");
        //prog[prog_len] = null;
    }
}
function cmd2img(cmd){
    if (cmd==0)return 8;
    if (cmd==1)return 6;
    if (cmd==2)return 7;
    if (cmd==3)return 9;
}
function ij2len(i,j, cols){
	return i + j*cols;
}
function len2ij(l, cols){
	return {i: l%cols, j: Math.floor(l/cols)};
}
function len2pos(l, x0,y0,cols){
	var ij = len2ij(l, cols);
    var xx= x0 + 0.1 * ij.i;
    var yy= y0 + 0.1 * ij.j;
    return {x:xx, y:yy};
}
function addToProg(cmd){
    if(prog_len >= prog_max){
        app.ShowPopup("no space left","ERROR");
        return;
    }
    var i_idx = cmd2img(cmd);
    var i_pos = len2pos(prog_len, prog_pos.x, prog_pos.y, 3);
    //prog[prog_len] = addImg2(i_idx, i_pos.x, i_pos.y , onDownD);
    prog_int[prog_len] = cmd;
    prog_len++;
}

function createRectFld(x_pos, y_pos, cols, rows, defImgDelegate){
    var dd = defImgDelegate;
	if(arguments.length < 5) dd = ImgDelegateRect(nullf);
	var res = [];
	var l = 0;
    for(var i = 0; i<rows; i++){
        for(var j=0; j<cols; j++){
            var x=x_pos + j*0.1;
            var y=y_pos + i*0.1;
            res[l] = addImgDef(x,y, dd);
			l++;
        }
    }
	return res;
}

function createMenu(){
	var def = ImgDelegateVector(
		ImgDelegateIdx(8),
		ImgDelegateIdx(6),
		ImgDelegateIdx(7),
		ImgDelegateIdx(9)
	);
    var res = createRectFld(0.2,0.0, 4, 1, def);
	app.ShowPopup(''+def.onDraw,"ERR");
	res[0].def.change(0);
	res[1].def.change(1);
	res[2].def.change(2);
	res[3].def.change(3);

    /*var mg = addImg2(8, 0.2, 0.0, onDown0);
    var ml = addImg2(6, 0.3, 0.0, onDown1);
    var mr = addImg2(7, 0.4, 0.0, onDown2);
    var me = addImg2(9, 0.5, 0.0, onDown3);
	*/
}
function createControls(){
    createRectFld(0.8, 0, 2,2, 0.1);
    /*var cg = addImg2(1, 0.8, 0, doRun);
    var cs = addImg(11, 0.9, 0);
    var cp = addImg(2, 0.8, 0.1);
    var cr = addImg(3, 0.9, 0.1);
	*/
}

function createProg(){
    createRectFld(prog_pos.x, prog_pos.y, 3, 3);
}
function createField(){
    createRectFld(0, 0.2, 5, 5);
    //field[0] = addImg(0, 0, 0.2);
}

function doRun()
{
    var x = 0;
    var y = 0.2;
    var dx = 0.1;
    var dy = 0;
    for(var i = 0; i < prog_len;i++)
    {
        var c = prog_int[i];
        if(c == 0){
            x = x + dx;
            y = y + dy;
            field[0].SetPosition(x, y);
        }
        if(c == 1){
            var t = dx;
            dx = (dy>0.02)?dy:-dy;
            dy = -t;
            //field[0].SetAngle(90);
        }
        if(c == 2){
            var t = dx;
            dx = (dy>0.02)?-dy:dy;
            dy = t;
        }
    }
}
var x;
//Called when application is started.
function OnStart()
{
    //Create a layout with objects vertically centered.
    lay = app.CreateLayout( "Linear", "VCenter,FillXY" );
    //Create an absolute layout so we can position objects.
    layAbs = app.CreateLayout( "Absolute" );
    lay.AddChild(layAbs);
    //
    //bkg = addImg(-1, 0,0, 1,1);
	var bkg = placeImage(0,0, 1,1);
	bkg.SetPaintStyle("Fill");
	bkg.SetColor("ffFFFFFF");
	bkg.DrawRectangle(0,0, 1,1);

    createMenu();
    createControls();
    createProg();
    createField();
    //
	
    x = ImgDelegateVector(
		ImgDelegate(genDrawFly(0), nullf),
		ImgDelegate(genDrawFly(1), nullf),
		ImgDelegate(genDrawFly(2), nullf),
		ImgDelegate(genDrawFly(3), nullf));
		x = ImgDelegateRect(nullf);
        //Add layout to app.    
    app.AddLayout( lay );
}
