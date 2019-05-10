var w = 1000;
var h = 300;
var rt2 = Math.sqrt(2);
var countqubits = 0;
var keysize = 0;

function qubit(basis,state){
  this.basis=basis;
  this.state=state;
  this.measure = function(measurebasis){
    if(measurebasis==this.basis){
      return this.state;
    }
    else{
      return Math.floor(100*Math.random())%2;
    }
  }
}

function packet(x,y,state,basis){
  this.x=x;
  this.y=y;
  this.state=state;
  this.basis=basis;
  this.dC=new qubit(0,state);
  this.dH=new qubit(1,state);
  this.q=new qubit(basis,state);
  this.updatePos=function(dx){
    this.x+=dx;
  }
  this.renderPacket=function(){
    stroke(255);
    strokeWeight(3);
    ellipse(this.x,this.y-30,20,20);
    ellipse(this.x,this.y-10,20,20);
    ellipse(this.x,this.y+30,20,20);
    strokeWeight(2);
    if(this.state==0){
      line(this.x,this.y-20,this.x,this.y-40);
      line(this.x-10/rt2,this.y-10-10/rt2,this.x+10/rt2,this.y-10+10/rt2);
    }
    else if(this.state==1){
      line(this.x-10,this.y-30,this.x+10,this.y-30);
      line(this.x+10/rt2,this.y-10-10/rt2,this.x-10/rt2,this.y-10+10/rt2);
    }

    if(this.basis==0){
      if(this.state==0){
        line(this.x,this.y+20,this.x,this.y+40);
      }
      else if(this.state==1){
        line(this.x-10,this.y+30,this.x+10,this.y+30);
      }
    }
    else if(this.basis==1){
      if(this.state==0){
        line(this.x-10/rt2,this.y+30-10/rt2,this.x+10/rt2,this.y+30+10/rt2);
      }
      else if(this.state==1){
      line(this.x+10/rt2,this.y+30-10/rt2,this.x-10/rt2,this.y+30+10/rt2);
      }
    }
  }
}

function detector_emitter(x,y){
  this.x=x;
  this.y=y;
  this.basis = Math.floor(2*Math.random());
  this.updateBasis = function(){
    this.basis = Math.floor(2*Math.random());
  }
   this.renderBasis = function (){
    stroke(255);
    strokeWeight(4);
    if (this.basis==0){
      line(this.x,this.y-15,this.x,this.y+15);
      line(this.x-15,this.y,this.x+15,this.y);
    }
    else if (this.basis==1){
      line(this.x-15/rt2,this.y-15/rt2,this.x+15/rt2,this.y+15/rt2);
      line(this.x+15/rt2,this.y-15/rt2,this.x-15/rt2,this.y+15/rt2);
    }
  }
}


var a = new detector_emitter(w/9,h/2);
var b = new detector_emitter(8*w/9,h/2);
var p = [];
var key=" ";

function setup() {
  createCanvas(w, h);
  background(0);
  noFill();
  stroke(255,0,0);
  strokeWeight(5);

  frameRate(70);
  keyDisp = createDiv('');
  eff = createDiv('');
  p.push(new packet(a.x,a.y,Math.floor(100*Math.random())%2,a.basis));

  eff.html("Efficiency = 0%");
  keyDisp.html("Key =  "+key);

  time = createSlider(25, 750, 100);
  time.position(10,10);
  time.style('width', '500px');
}

function draw() {
  background(0);
  if(frameCount%Math.floor(time.value())==0){
    a.updateBasis();
    p.push(new packet(a.x,a.y,Math.floor(100*Math.random())%2,a.basis));
  }
  a.renderBasis();
  b.renderBasis();
  for(i=0;i<p.length;i++){
    p[i].renderPacket();
    p[i].updatePos(1);
  }
  if((p[0].x-b.x)*(p[0].x-b.x)+(p[0].y-b.y)*(p[0].y-b.y)<=2){
    countqubits++;
    if(b.basis==0){
      if(p[0].q.measure(0)!=p[0].dC.state){
        base = p[0].dH.basis;
        key=key+base;
        keyDisp.html("Key =  "+key);
        keysize++;
      }
    }
    else if(b.basis==1){
      if(p[0].q.measure(1)!=p[0].dH.state){
        base = p[0].dC.basis;
        key=key+base;
        keyDisp.html("Key =  "+key);
        keysize++;
      }
    }
    eff.html("Efficiency = "+Math.floor(100*keysize/countqubits)+"%");
    b.updateBasis();
    p.shift();
  }
}
