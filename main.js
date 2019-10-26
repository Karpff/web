var canvas = document.getElementsByTagName("canvas")[0];
canvas.width = innerWidth;
canvas.height = innerHeight;
var c = canvas.getContext('2d');

function getDistance(x1,y1,x2,y2)
{
  return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}

function getDistanceFromCenter(x,y)
{
  return getDistance(x,y,canvas.width/2,canvas.height/2);
}

function getAngle(x1,y1,x2,y2)
{
  return Math.atan2(y2-y1,x2-x1)*180/Math.PI;
}

function getAngleFromCenter(x,y)
{
  return getAngle(x,y,canvas.width/2,canvas.height/2);
}

var maxDistance = getDistanceFromCenter(0,0);
var distance = 50;

c.strokeStyle = "#FFFEFD";

class Line
{
  constructor(p1,p2)
  {
    this.p1 = p1;
    this.p2 = p2;
  }

  display()
  {
    let dist = getDistance(this.p1.x,this.p1.y,this.p2.x,this.p2.y);
    let ang = getAngle(this.p1.x,this.p1.y,this.p2.x,this.p2.y);
    c.beginPath();
    c.moveTo(this.p1.x+Math.cos(ang/180*Math.PI)*dist/5,this.p1.y+Math.sin(ang/180*Math.PI)*dist/5);
    c.lineTo(this.p2.x-Math.cos(ang/180*Math.PI)*dist/5,this.p2.y-Math.sin(ang/180*Math.PI)*dist/5);
    c.stroke();
  }
}

class Point
{
  constructor(x,y,angle,i,j)
  {
    this.initX = x;
    this.initY = y;
    this.x = this.initX;
    this.y = this.initY;
    this.angle = getAngleFromCenter(this.initX,this.initY);
    this.cycle = getDistanceFromCenter(this.initX,this.initY);
    this.static = 10;
    if(getDistanceFromCenter(this.initX,this.initY)==0)this.static = 0;
  }

  update()
  {
    this.cycle-=5;
    this.x = this.initX + Math.cos(this.angle/180*Math.PI)*Math.cos(this.cycle/180*Math.PI)*(getDistanceFromCenter(this.initX,this.initY)*70/maxDistance+this.static);
    this.y = this.initY + Math.sin(this.angle/180*Math.PI)*Math.cos(this.cycle/180*Math.PI)*(getDistanceFromCenter(this.initX,this.initY)*70/maxDistance+this.static);
    this.display();
  }

  display()
  {
    c.beginPath();
    c.arc(this.x,this.y,3,0,Math.PI*2);
    c.fill();
  }
}

var points = [];
for(let i=-7;i<8;i++)
{
  let row = [];
  for(let j=-7;j<8;j++)
  {
    row.push(new Point(canvas.width/2+i*distance+j%2*distance/2,canvas.height/2+j*distance))
  }
  points.push(row);
}

var lines = [];
for(let i=0;i<points.length;i++)
{
  for(let j=0;j<points[0].length;j++)
  {
    if(points[i-1])lines.push(new Line(points[i][j],points[i-1][j]));
    if(points[i][j-1])lines.push(new Line(points[i][j],points[i][j-1]));
    if(j<=points[0].length/2)
    {
      if(j%2!=0)
      {
        if(points[i+1])if(points[i+1][j-1])lines.push(new Line(points[i][j],points[i+1][j-1]));
      }
      else
      {
        if(points[i-1])if(points[i-1][j-1])lines.push(new Line(points[i][j],points[i-1][j-1]));
      }
    }
    else
    {
      if(j%2!=0)
      {
        if(points[i-1])if(points[i-1][j-1])lines.push(new Line(points[i][j],points[i-1][j-1]));
      }
      else
      {
        if(points[i+1])if(points[i+1][j-1])lines.push(new Line(points[i][j],points[i+1][j-1]));
      }
    }
  }
}

function animate()
{
  c.fillStyle = "#191919";
  c.fillRect(0,0,canvas.width,canvas.height);
  c.fillStyle = "#FFFEFD";
  for(let i=0;i<lines.length;i++)
  {
    lines[i].display();
  }
  for(let i=0;i<points.length;i++)
  {
    for(let j=0;j<points[0].length;j++)
    {
      points[i][j].update();
    }
  }
  window.requestAnimationFrame(animate);
}
animate();
