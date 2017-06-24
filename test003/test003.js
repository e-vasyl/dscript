
function nullf(){}
function ImgDelegate(onDraw, onDown){
    return {onDown:onDown,
    onDraw:onDraw,
	redraw: function(img){
		img.SetColor("#00FFFFFF");
		onDraw(img);
		}};
}
function ImgDelegateIdx(idx, onDown){
    if (arguments.length < 1) return null;
    if (arguments.length < 2) onDown = nullf;
    var name = (idx >=0 &&idx<img_n.length)?img_n[idx]:null;
    var image = app.CreateImage(name, 1, 1);
    if (!name){
        image.SetColor("#ffFFFFFF");
    }
    function ddraw (img){
        //img.SetColor("#00FFFFFF");
		img.DrawImage(image,0,0,1,1,0);};
    return ImgDelegate(ddraw, onDown);
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
	var ids = arguments;
	var idsl=ids.length;
    var state = {idx:0, 
                 //ids:arguments, 
                 get:function(){return ids[this.idx];},
                 set:function(i){if(i>=0 && i<idsl){this.idx=i;}},
				 setdm:function(d){this.idx=(this.idx+d)%idsl;},
				 next:function(){this.setdm(+1);},
				 prev:function(){this.setdm(idsl-1);},
                 };
    function f1(img){state.get().onDraw(img);};
    function f2(evt){state.get().onDown(evt);};
    var res = ImgDelegate(f1, f2);
    res.decompose = function(){return ids;};
    res.change = function(i){state.set(i);};
	res.next = function(){state.next();};
	res.prev = function(){state.prev();};
    return res;
}
function ImgDelegateRect(onDown){
	function drawRect(img){
    	img.SetPaintColor("#FFC0C0C0");
    	img.SetPaintStyle("Line");
    	img.SetLineWidth(2);
		var d = 0.025;
		img.DrawRectangle(d, d, 1 - d, 1 - d);
	};
	return ImgDelegate(drawRect, onDown);
}
//
function Timer(cbFunc, timeout)
{
	return {
		_r: setInterval(cbFunc, timeout),
		stop: function(){clearInterval(this._r);}
	};
}
//
function genDrawFly(angle)
{
    var c=0.5;
    var s=(angle&2)?-1:1;
    var z=(angle&1)?0:1;
    function Z(a,b){return z?a:b;};
    
    var t1a=c;      var t1b=c-s*0.2; var t1c=c+s*0.2;
    var t2a=c-s*0.1;var t2b=c+s*0.2; var t2c=c;
    var t3a=c+s*0.2;var t3b=c+s*0.25;var t3c=c-s*0.06;var t3d=c+s*0.06;

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
*/
var prog_len=0;
var prog_max=9;
var prog=[];
var prog_int=[];
var field=[];
var fly=null;

function onDownDef(ev)
{
	//app.ShowPopup(""+hasattr(ev, "source"),"ERROR");
	var from = ev.source;        
	if(from.def){
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
    if (arguments.length >= 2){res.SetPosition(x, y);}
    layAbs.AddChild(res);
    return res;
}
function addImgDef(x,y,imgDlgt)
{
	var res = placeImage(x,y);
	res.def = imgDlgt;
	imgDlgt.redraw(res);
    res.SetTouchable(true);
    res.SetOnTouchDown(onDownDef);
    return res;
}
function composeImgDef(img, imgDlgt)
{
	var dlg_old = img.def;
    img.def = ImgDelegateCompose(imgDlgt,dlg_old);
	img.def.redraw(img);
	return dlg_old;
}
function decomposeImgDef(img)
{
	var dlg_old = img.def;
	if (dlg_old.decompose){
		var decomp = dlg_old.decompose();
		img.def = decomp[decomp.length-1];
		img.def.redraw(img);
	}
	return dlg_old;
}

function cmd2img(cmd){
    if (cmd==0)return 8;
    if (cmd==1)return 6;
    if (cmd==2)return 7;
    if (cmd==3)return 9;
}
function addToProg(cmd){
    if(prog_len >= prog_max){
        app.ShowPopup("no space left","ERROR");
        return;
    }
	var pl = prog_len;
	function onDel(ev){
		if (prog_len == pl+1){
			prog_len--;
			decomposeImgDef(ev.src);
		}
	}
    var dlgt = ImgDelegateIdx(cmd2img(cmd), onDel);

	composeImgDef(prog[prog_len], dlgt);
    prog_int[prog_len] = cmd;
    prog_len++;
}

function createRectFld(x_pos, y_pos, cols, rows, defImgDelegates){
    var dd = defImgDelegates;
	if(arguments.length < 5) dd = [ImgDelegateRect(nullf)];
	
	var res = [];
	var l = 0;
    for(var i = 0; i<rows; i++){
        for(var j=0; j<cols; j++){
            var x=x_pos + j*0.1;
            var y=y_pos + i*0.1;
            res[l] = addImgDef(x,y, dd[l%dd.length]);
			l++;
        }
    }
	return res;
}

function createMenu(){
	function hf(i, f){return ImgDelegateCompose(ImgDelegateIdx(i),
		                   ImgDelegateRect(f));};
	var buttons = [
		hf(8,function(){addToProg(0);}),
		hf(6,function(){addToProg(1);}),
		hf(7,function(){addToProg(2);}),
		hf(9,function(){addToProg(3);})
	];
    createRectFld(0.2, 0.0, 4, 1, buttons);
	return;
}
function createControls(){
	function hf(i, f){return ImgDelegateCompose(ImgDelegateIdx(i),
		                   ImgDelegateRect(f));};
	var buttons = [
		hf(1,function(){curr_state.start();}),
		hf(11,function(){curr_state.stop();}),
		hf(2,function(){initState();}),
		hf(3,function(){curr_state.step();})
	];
	
    createRectFld(0.8, 0.0, 2, 2, buttons);
}

function createProg(){
    prog = createRectFld(0.7, 0.6, 3, 3);
}
//////
var field_info={x:0, y:0.2, n:5, pos:[],
	ij: function(i, j){return i + j * this.n;},
	};
function delTarget(i, j){
	var l = field_info.ij(i, j);
	var k = field_info.pos.indexOf(l);
	if (k > -1)
	{
		decomposeImgDef(field[l]);
		field_info.pos[k] = [-1];
	}
}
function loadData()
{
	var txt = app.ReadFile("./fld01");
	field_info.targets = loadTargets(txt);
	field_info.fences = loadField(txt);
}
function loadTargets(txt){
	var res = [];
	if (!txt)
		return res;
		
	var l = txt.split(";");
	for (var i in l)
	{
		var p = l[i].split(",");
		var x = parseInt(p[0]);
		var y = parseInt(p[1]);
		res.push([x, y]);
	}
	return res;
}
function loadField(txt)
{
	return [];
}
function setTargets(){
	function addTarget(i, j){
		var l = field_info.ij(i, j);
		composeImgDef(field[l], ImgDelegateIdx(4));
		return l;
	}
	// clear targets
	for(var i = 0; i < field_info.pos.length; i++){
		var l = field_info.pos[i];
		if (l > -1){
			decomposeImgDef(field[l]);
		}
	}
	var res = [];
	for (var i in field_info.targets)
	{
		var x = field_info.targets[i][0];
		var y = field_info.targets[i][1];
		res += [addTarget(x, y)];
	}
	field_info.pos = res;
}
function createField(){
    field = createRectFld(field_info.x, field_info.y, 5, 5);
	//setTargets();
	
	var dlgt=ImgDelegateVector(
		ImgDelegate(genDrawFly(0), nullf),
		ImgDelegate(genDrawFly(1), nullf),
		ImgDelegate(genDrawFly(2), nullf),
		ImgDelegate(genDrawFly(3), nullf));
	fly = addImgDef(field_info.x, field_info.y, dlgt);
}

var curr_state={};
function canStep(x,y)
{
	if (x < 0 || y < 0 || x >= field_info.n || y >= field_info.n)
		return false;
	return true;
}
function nextRunStep()
{
	if (curr_state.i >= prog_len)
	{
		curr_state.stop();
		return;
	}
	
		var s=[[1, 0],[0, 1],[-1, 0],[0, -1]];
        var c = prog_int[curr_state.i];
        if(c == 0){
            var x = curr_state.x + s[curr_state.dir][0];
            var y = curr_state.y + s[curr_state.dir][1];
			if (canStep(x, y))
			{
        		curr_state.x = x;
    			curr_state.y = y;
				var xp = field_info.x + x * 0.1;
				var yp = field_info.y + y * 0.1;
    			fly.SetPosition(xp, yp);
			}
    	}
        if(c == 1){
            var t = curr_state.dx;
            curr_state.dir = (curr_state.dir + 3) % 4;
			fly.def.prev();
			fly.def.redraw(fly);	
        }
        if(c == 2){
            curr_state.dir = (curr_state.dir + 1) % 4;
			fly.def.next();
			fly.def.redraw(fly);	
        }
        if(c == 3){
            delTarget(curr_state.x, curr_state.y);	
        }
		
		curr_state.i++;
		//app.ShowPopup(curr_state.dir+"","LOG");
}
function initState()
{
	if (curr_state.t)
	{
		curr_state.stop();
	}
	setTargets();
    curr_state = {i:0, x:0, y:0, dir:0, 
		t: null,
		step:nextRunStep,
		start:function(){this.stop(); this.t = Timer(nextRunStep, 200);},
		stop:function(){if(this.t){this.t.stop(); this.t=null;}}
	};
	fly.SetPosition(field_info.x, field_info.y);
	fly.def.change(0);
	fly.def.redraw(fly);
}

//Called when application is started.
function OnStart()
{
    //Create a layout with objects vertically centered.
    lay = app.CreateLayout( "Linear", "VCenter,FillXY" );
    //Create an absolute layout so we can position objects.
    layAbs = app.CreateLayout( "Absolute" );
    lay.AddChild(layAbs);
    //
	var bkg = placeImage(0,0, 1,1);
	bkg.SetPaintStyle("Fill");
	bkg.SetColor("ffFFFFFF");
	bkg.DrawRectangle(0,0, 1,1);

	loadData();
	
    createMenu();
    createControls();
    createProg();
    createField();
	initState();
    //
    //Add layout to app.    
    app.AddLayout( lay );
}