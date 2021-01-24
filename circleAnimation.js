var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');
document.body.style.overflow = 'hidden';




//--------------------//
//-----INTERACTIVITY-----//
//--------------------//

var mouse = {
    x: undefined,
    y: undefined
};

window.addEventListener('mousemove',
    function (event) {
        mouse.x = event.x;
        mouse.y = event.y;

});

window.addEventListener('resize', 
    function(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
});


// Pause / Resume animation on mouse click
// This produces many, many errors in the console when c is set to null.
// A solution that pauses the animation loop likely exists
var running = true;
window.addEventListener('click',
    function () {
        if (running == true) {
            c = null;
            running = false;
        }
        else {
            c = canvas.getContext('2d');
            running = true;
        }
    });






//--------------------//
//-----ANIMATION-----//
//--------------------//
 
// animation works by refreshing the page a bunch of times.
// each time the page refreshes, the object will be moved a set amount of pixels over to simulate movement.

// create Circle constructor
function Circle(x, y, dx, dy, radius, pulse, dpulse, colorBorder, colorFill){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.originalDX = dx;
    this.originalDY = dy;
    this.colorBorder = colorBorder;
    this.colorFill = colorFill;
    this.opacity = Math.random();
    this.radius = radius;
    this.pulseRadius = radius;
    this.minPulseRadius = 2;
    this.pulse = pulse;
    this.dpulse = dpulse;
    this.accelUp = .2;
    this.accelDown = 0.02;
    this.touched = false;

    this.updateSpace = function(){
        // reverse velocity when the circles radius hits the edge of the screen
        if (this.x  + this.radius > innerWidth || this.x - this.radius < 0){
            this.dx = -this.dx;
        }
    
        if(this.y + this.radius > innerHeight || this.y - this.radius < 0){
            this.dy = -this.dy;
        }

        // define new position variables
        this.x += this.dx;
        this.y += this.dy;

        // interactions
        if (mouse.x - this.x < 30 && mouse.x - this.x > -30
            && mouse.y - this.y < 30 && mouse.y - this.y > -30) {
            this.touched = true;
            this.dx += Math.sign(this.dx) * this.accelUp;
            this.dy += Math.sign(this.dy) * this.accelUp;
        }
        else if(this.touched == true && Math.abs(this.dx) > Math.abs(this.originalDX)){
            this.dx -= Math.sign(this.dx) * this.accelUp;
        }
        else if(this.touched == true && Math.abs(this.dy) > Math.abs(this.originalDY)){
            this.dy -= Math.sign(this.dy) * this.accelUp
        }
        else if(Math.abs(this.dx) < Math.abs(this.originalDX) + this.accelUp || Math.abs(this.dx) > Math.abs(this.originalDX) - this.accelUp){
            this.touched = false;
        }

        
        this.updateRadius();
        this.draw();
    };

    this.updateRadius = function(){
        // reverse pulse velocity when it gets too big or too small
        if (this.pulseRadius > this.radius + this.pulse || this.pulseRadius < this.radius - this.pulse || this.pulseRadius < this.minPulseRadius){
            this.dpulse = -this.dpulse;
        }

        // define new radius
        this.pulseRadius += this.dpulse; 
    };

    this.draw = function(){
        c.beginPath();
        c.arc(this.x, this.y, this.pulseRadius, 0, Math.PI * 2, false);
        c.strokeStyle = this.colorBorder;
        c.fillStyle = this.colorFill
        c.globalAlpha = this.opacity;
        c.fill();
        c.stroke();
    };
}


function getRandomColor(){
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


var circleArray = [];

function init(){
    
    circleArray = [];

    for(let i = 0; i < 150; i++){
        // variables to be used in following equations
        var minRadius = 5;
        var maxRadius = 30;
        var minVelocity = 0.5;
        var maxVelocity = 1.5;
        var minPulse = 2;
        var maxPulse = 10;
        var minDPulse = 0.01;
        var maxDPulse = .3;

        // equations
        var radius = minRadius + Math.random() * maxRadius;
        var x = Math.random() * (innerWidth - radius * 2) + radius;
        var dx = (minVelocity * Math.sign((Math.random() - 0.5))) + (Math.random() - 0.5) * maxVelocity;
        var y = Math.random() * (innerHeight - radius * 2) + radius;
        var dy = (minVelocity * Math.sign((Math.random() - 0.5))) + (Math.random() - 0.5) * maxVelocity;
        var pulse = minPulse + Math.random() * maxPulse;
        dpulse = minDPulse + Math.random() * maxDPulse;

        // create circle object
        circleArray.push(new Circle(x, y, dx, dy, radius, pulse, dpulse, getRandomColor(), getRandomColor()));
    }
}


function animate(){
    requestAnimationFrame(animate);
    
    c.clearRect(0, 0, innerWidth, innerHeight); // clears a section of the canvas, so past frames do not show up
    for(var i = 0; i < circleArray.length; i++){
        circleArray[i].updateSpace();
    };
}

init();
animate();



//-----IDEA TO ADD-----//

// --when commenting out the clearRect function, so that the circle trails remain--//

// make a slider that will allow you to go back a cetain number of frames, or go 
// forwards a certain number of frames, or continue the animation from any of the frames

//-----IDEA FOR IMPLEMEMTING-----//

// stop animation at frame 'x' 
// create loop that starts at frame 'x - a' 
// and proceeds through 'x + a'
// store all data in these frames in a new array 

// may need to take 'screenshots' of the background of each frame 
// since there is no data stored in the circle object to define the trail 

// could also create a new constructor for tail data 
// to begin recording data when the slider loop begins

// may need to pre-render the frames from 'x' to 'x + a' 
// or render them live when the user uses the slider to 
// go forwards


//-----AN IDEA WITHIN AN IDEA?-----//

// before animation halts at frame 'x'
// add negative accelaration to each circle
// this way, the circles will come to a slow stop
// instead of immediately halting at frame 'x'

//-----HOW MANY IDEAS DEEP DOES THIS GO?!-----//

// make it so the user can stop, slide, and proceed the animation at will
// to do this, constantly be updating new data
// and expunging old data from the 'frame data' array