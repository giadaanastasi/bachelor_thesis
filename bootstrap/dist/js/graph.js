//
//  main.js
//
//  A project template for using arbor.js
//
var sys;
(function($){

  var Renderer = function(canvas){
    var canvas = $(canvas).get(0)
    var ctx = canvas.getContext("2d");
    var gfx = arbor.Graphics(canvas)
    var particleSystem=null

    var that = {
      init:function(system){
        particleSystem = system
        particleSystem.screenSize(canvas.width, canvas.height) 
        particleSystem.screenPadding(80) // leave an extra 80px of whitespace per side
        
        // set up some event handlers to allow for node-dragging
        that.initMouseHandling()
      },
      
      redraw:function(){
        if(!particleSystem) return;

        ctx.fillStyle = "white"
        ctx.fillRect(0,0, canvas.width, canvas.height)
        
        particleSystem.eachEdge(function(edge, pt1, pt2){
          
          // draw a line from pt1 to pt2
          //console.log("dentro redraw: "+edge.data.value);
           if (edge.data.value>=0 && edge.data.value<4){
            ctx.strokeStyle = "green";
            console.log("dentro verde");
           }

            
          if (edge.data.value>3 && edge.data.value<8)
            ctx.strokeStyle = "orange"
          if (edge.data.value>7 && edge.data.value<11)
            ctx.strokeStyle = "red"
          ctx.lineWidth = 6
          ctx.beginPath()
          ctx.moveTo(pt1.x, pt1.y)
          ctx.lineTo(pt2.x, pt2.y)
          ctx.stroke()
        })

        particleSystem.eachNode(function(node, pt){

          // draw a rectangle centered at pt
          var w = 30
          ctx.fillStyle = "blue"
          label=node.name;
          ctx.fillRect(pt.x-w/2, pt.y-w/2, w,w)
          gfx.rect(pt.x-w/2, pt.y-10, w,18, 4, {fill:ctx.fillStyle})
          ctx.fillStyle="white"
          ctx.font="26px Helvetica"
          ctx.textAlign="center"
          ctx.fillText(label||"", pt.x, pt.y+4)
        })    			
      },
      
      initMouseHandling:function(){
        // no-nonsense drag and drop (thanks springy.js)
        var dragged = null;

        // set up a handler object that will initially listen for mousedowns then
        // for moves and mouseups while dragging
        var handler = {
          clicked:function(e){
            var pos = $(canvas).offset();
            _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)
            dragged = particleSystem.nearest(_mouseP);

            if (dragged && dragged.node !== null){
              // while we're dragging, don't let physics move the node
              dragged.node.fixed = true
            }

            $(canvas).bind('mousemove', handler.dragged)
            $(window).bind('mouseup', handler.dropped)

            return false
          },
          dragged:function(e){
            var pos = $(canvas).offset();
            var s = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)

            if (dragged && dragged.node !== null){
              var p = particleSystem.fromScreen(s)
              dragged.node.p = p
            }

            return false
          },

          dropped:function(e){
            if (dragged===null || dragged.node===undefined) return
            if (dragged.node !== null) dragged.node.fixed = false
            dragged.node.tempMass = 1000
            dragged = null
            $(canvas).unbind('mousemove', handler.dragged)
            $(window).unbind('mouseup', handler.dropped)
            _mouseP = null
            return false
          }
        }
        
        // start listening
        $(canvas).mousedown(handler.clicked);

      },
      
    }
    return that
  }  
  
  $(document).ready(function(){
    sys = arbor.ParticleSystem(1000, 600, 0.5) // create the system with sensible repulsion/stiffness/friction
    sys.parameters({gravity:true}) // use center-gravity to make the graph settle nicely (ymmv)
    sys.renderer = Renderer("#viewport") // our newly created renderer will have its .init() method called shortly by sys...

    console.log("dentro ready");
    getValues.init(1);
    ajaxHandlerGraph();
  })

})(this.jQuery);

function ajaxHandlerGraph(){
  setInterval("getValues.init(1)", 60000);
} 

//nodes from file collectmapping.json
//edges from database
function createGraph(edges){
  $.getJSON("../collectmapping.json",function(data){
          // load the raw data into the particle system as is (since it's already formatted correctly for .merge)
          var nodes = data.nodes
          $.each(nodes, function(name, info){
            sys.addNode(nodes.label);
          })
        })
    for(var i=0; i<edges.length; i++){
      sys.addEdge(edges[i][0], edges[i][1], {value: edges[i][2]});
       
}}