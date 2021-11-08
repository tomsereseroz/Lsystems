let context = document.getElementById('mainCanvas').getContext('2d');
let boundingRectangle = document.getElementById('mainCanvas').getBoundingClientRect();
let width = boundingRectangle.width;
let height = boundingRectangle.height;

context.canvas.width = width;
context.canvas.height = height;

/*
symbols:
1 - draw line segment
0 - draw line segment ending in leaf
[ - push position and rotate theta degrees
] - pop position and rotate -theta degrees
+/- - increment/decrement size
Binary tree rules:
1 -> +11-
0 -> 1[0]0
*/

let theta = Math.PI/8;
let scale = 50;

function setContextPosition(position){
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.translate(position.x,position.y);
    context.rotate(position.theta);
}

function symOne(position){//draw line segment
    setContextPosition(position);
    context.beginPath();
    context.moveTo(0,0);
    context.strokeStyle = "brown";
    context.lineTo(0,scale+1);
    context.stroke();
    position.x -= Math.sin(position.theta)*scale
    position.y += Math.cos(position.theta)*scale;
}

function symZero(position){//draw line segment ending in leaf
    setContextPosition(position);
    context.beginPath();
    context.moveTo(0,0); 
    context.strokeStyle = "green";
    context.lineTo(0,scale);
    context.stroke();
    //context.strokeStyle = "green";
    context.translate(0,scale);
    context.moveTo(0,0);
    context.beginPath();
    context.arc(0,0,3,0,2*Math.PI);
    context.fillStyle = "green";
    context.fill();
    position.x -= Math.sin(position.theta)*scale
    position.y += Math.cos(position.theta)*scale;
}

function symPlus(position){
    position.size = position.size+5;
    context.lineWidth = position.size;
}

function symMinus(position){
    position.size = position.size-5;
    context.lineWidth = position.size;
}

function symBracket(queue,position){
    let pos2 = {... position};
    queue.push(pos2);
    position.theta += theta;
}

function symCloseBracket(queue){
    position = queue.pop();
    position.theta -= theta;
}

let position = {};
let queue = [];
position.size = 1;

reset();

context.lineWidth = position.size;

function parseString(string){
    for(let i=0; i<string.length; i++){
        switch(string[i]){
            case '1':
                symOne(position);
                break;
            case '[':
                symBracket(queue,position);
                break;
            case ']':
                symCloseBracket(queue);
                break;
            case '0':
                symZero(position);
                break;
            case '+':
                symPlus(position);
                break;
            case '-':
                symMinus(position);
                break;
            default:
                break;
        }
    }
}

function iterateString(string){
    let newstring = '';
    for(let i=0; i<string.length; i++){
        switch(string[i]){
            case '1':
                newstring += '+11-';
                break;
            case '0':
                newstring += '1[0]0';
                break;
            default:
                newstring += string[i];
                break;
        }
    }
    return newstring;
}

let string = '0';
parseString(string);

function reset(){
    context.setTransform(1,0,0,1,0,0)
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    position = {};
    queue = [];
    position.x = width/2;
    position.y = 0.9*height;
    position.theta = Math.PI;
    position.size = 1;
}

let generation = 0;

window.onkeydown = (event)=>{
    generation++;
    scale = scale/1.5;
    string = iterateString(string);
    reset();
    parseString(string);
    console.log(string);
    console.log(generation)
    if(generation>7){
        location.reload();
    }
};

