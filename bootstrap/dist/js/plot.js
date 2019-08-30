var node;
var parameter;
var array=new Array;
var name;
var clock;

$(document).ready(function(){
  // Some simple loops to build up data arrays.
  $(".nav-tabs a").click(function(){
        $(this).tab('show');
    });
    $('.nav-tabs a').on('show.bs.tab', function(){
        //alert('The new tab is about to be shown.');
    });
    $('.nav-tabs a').on('shown.bs.tab', function(){
        //alert('The new tab is now fully shown.');
        this.id="name";
        clearPlot();
        clearPage();
        begin();
    });
    $('.nav-tabs a').on('hide.bs.tab', function(e){
        //alert('The previous tab is about to be hidden.');
    });
    $('.nav-tabs a').on('hidden.bs.tab', function(){
        //alert('The previous tab is now fully hidden.');
        this.id=""; 

    });
});

function clearPage(){
  var list=document.getElementById('nodes_list');
  while(list.hasChildNodes()){
    list.removeChild(list.firstChild);
  }
}

function begin(){
  console.log("dentro begin");
  node="0";
  clearInterval(clock);
  name=document.getElementById('name').firstChild.nodeValue;
  console.log("name: "+name);

  var nodes_list=document.getElementById('nodes_list');
  
  var li=document.createElement('li');
  li.setAttribute("class","list-group-item"); 
  var but=document.createElement('button');
  but.setAttribute("id", "node_"+0);
  but.setAttribute("value", 0);
  but.appendChild(document.createTextNode("All"));
  but.addEventListener('click', clickHandler, false);
  li.appendChild(but);
  nodes_list.appendChild(li);

  $.getJSON("../collectmapping.json",function(data){
          // load the raw data into the particle system as is (since it's already formatted correctly for .merge)
          var nodes = data.nodes
          $.each(nodes, function(name, info){
            var li=document.createElement('li');
            li.setAttribute("class","list-group-item"); 
            var but=document.createElement('button');

            but.setAttribute("id", "node_"+parseInt(name+1));
            but.setAttribute("value", parseInt(name+1));
            but.appendChild(document.createTextNode("Node "+parseInt(name+1)));
            but.addEventListener('click', clickHandler, false);
            li.appendChild(but);
            nodes_list.appendChild(li);
          })
        });
  parameter=document.getElementById('parameter').firstChild.nodeValue;
  //console.log("node: "+node+" parameter: "+parameter);
  getValues.init(0);
  ajaxHandler();
}

function ajaxHandler(){
  //window.alert("dentro ajax");
  setInterval("getValues.init(0)", 60000);
}

function clickHandler(e){
  console.log("dentro clickHandler");
  node=this.value;
  parameter=document.getElementById('parameter').firstChild.nodeValue;
  console.log("node: "+this.value+" parameter: "+parameter);
  getValues.init(0);
  ajaxHandler();
}

function clearPlot(){
  var plot=document.getElementById('plot');
  while(plot.hasChildNodes()){
    plot.removeChild(plot.firstChild);
  }
}


function createPlot(dati){
  array= new Array();
  var unit;
  if(node==0)
    var i=1;
  else var i=node;
  var index=0;
  while(dati[i]!=null){
    console.log("dentro while");
    array[index]=new Array();
    var j=0;
    unit=dati[i][j][0];
    while(dati[i][j]!=null){
      array[index][j]=new Array();
      if(dati[i][j]!=unit){
        console.log("dentro if");
        array[index][j][0]=dati[i][j][1];
        array[index][j][1]=dati[i][j][2];
      } 
      console.log("dati: "+dati[i][j]);
      j++;
    }
    index++;
    i++;
     
  }
  console.log("unit: "+unit);
  console.log("array: "+array);


  console.log("dentro createPlot");
  var plot=document.getElementById('plot');
  while(plot.hasChildNodes()){
    plot.removeChild(plot.firstChild);
  }
  console.log("prima del plot");
  var plot1 = $.jqplot('plot',array,
    {  
      // Set default options on all series, turn on smoothing.
      axes:{
        xaxis:{
          label: 'Time',
          renderer:$.jqplot.DateAxisRenderer,
          tickRenderer: $.jqplot.CanvasAxisTickRenderer,
          numberTicks: 7,
        },
        yaxis:{
          label: 'Values('+unit+')',
          labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
          numberTicks: 6
        }
        
      },
      legend:{
        show: true
      },
      seriesDefaults: {
          rendererOptions: {
              smooth: true
          },

      },
      // Series options are specified as an array of objects, one object
      // for each series.
      series:[]
    }
  );
}

  