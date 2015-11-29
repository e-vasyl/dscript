//Initialise variables. 
var frameCounter = 0; 

function evalFile(name)
{
  var txt = app.ReadFile( name );
  if (txt) return eval(txt);
  return null;
}

//Called when application is started.
function OnStart()
{
    ddd= evalFile("simple_plug.js");
    //Set full screen game mode. 
    app.SetScreenMode( "Game" ); 
     
    //Create the main layout. 
    lay = app.CreateLayout( "Linear", "FillXY" ); 

    //Create a GLView and add it to main layout. 
    glview = app.CreateGLView( 1, 1, "Fast2d" );
    glview.SetBackColor( "#80ffffff" );
    glview.SetTouchable(true);
    glview.SetOnTouchDown(cbTouchDown); 
    glview.SetOnTouchUp(cbTouchUp); 
    glview.SetOnTouchMove(cbTouchMove); 
    lay.AddChild( glview ); 

    //Add the main layout to app. 
    app.AddLayout( lay ); 
    ///
	var img = glview.CreateImage( "/storage/emulated/0/fiinote_export/rect1.jpg");
	var img2 = glview.CreateImage( "/storage/emulated/0/fiinote_export/line2.jpg",  
                                       StartRendering );

	ddd.init(img, img2);  
}

function cbTouchDown(ev)
{ 
  ddd.cbDown(ev.x[0],ev.y[0]);
}
function cbTouchUp(ev)
{ 
  ddd.cbUp(ev.x[0],ev.y[0]);
}
function cbTouchMove(ev)
{
	ddd.cbMove(ev.x[0],ev.y[0]);
}
function StartRendering() 
{ 
    //Render at 30 frames per second 
    setInterval( DrawFrame, 1000/10); 
} 

function DrawFrame() 
{ 
	ddd.draw(glview);
     
    //Render the graphics 
    glview.Render(); 
     
    frameCounter++; 
}

