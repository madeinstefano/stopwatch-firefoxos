String.prototype.padLeft = function (num, ch) {
  var
    re = new RegExp(".{" + num + "}$"),
    pad = "";
  do {
    pad += ch;
  }while(pad.length < num);
  
  return re.exec(pad + this)[0];
};

(function (){

  var
    canvas,
    ctx,
    wrapper,
    visibleParts = 2,
    hourPart,
    minutePart,
    secondPart,
    milliPart,
    startingTime,
    stoppingTime,
    started = false,
    clockInterval;
  
  function getFontSizeFactor(){
    if (visibleParts === 2){
      return 4;
    }else if (visibleParts === 3){
      return 6;
    }else if (visibleParts === 4){
      return 8;
    }
  }
  
  function getFontSizeFactorForSmallPart(){
    if (visibleParts === 2){
      return 8;
    }else if (visibleParts === 3){
      return 10;
    }else if (visibleParts === 4){
      return 12;
    }
  }
  
  function formatTime(time){
    var ms = Math.floor(time % 1000 / 10);
    console.log(ms);
    var s = Math.floor((time / 1000) % 60);
    var m = Math.floor((time / 60000) % 60);
    var h = Math.floor((time / 360000) % 60);
    return {
      hour:h,
      minute:String(m).padLeft(2,'0'),
      second:String(s).padLeft(2,'0'),
      millis:String(ms).padLeft(2,'0')
    };
  }
  
  function updateUI(time){
    var chronoTime = formatTime(time);
    milliPart.textContent = chronoTime.millis;
    secondPart.textContent = chronoTime.second;
    minutePart.textContent = chronoTime.minute;
    hourPart.textContent = chronoTime.hour;
    if (time >= 60000){
      if (visibleParts === 2){
        visibleParts = 3;
        minutePart.style.display = 'inline-block';
        setFontSize();
      }
      if (visibleParts === 3 && time >= 360000){
        visibleParts = 4;
        hourPart.style.display = 'inline-block';
        setFontSize();
      }
    }
  }
   
   
  function start(){
    started = true;
    startingTime = stoppingTime > 0 
      ? startingTime + (new Date().getTime() - stoppingTime)
      : new Date().getTime();
    
    clockInterval = setInterval(function (){
      updateUI(new Date().getTime() - startingTime);
    },10);
  }
  
  function stop(){
    started = false;
    stoppingTime = new Date().getTime();
    clearInterval(clockInterval);
  }
  
  function reset(){
  }
  
  
    
  function setFontSize(){
    
    var largeSize = (wrapper.offsetWidth / getFontSizeFactor()) + 'px';
    var smallSize = (wrapper.offsetWidth / getFontSizeFactorForSmallPart()) + 'px';
    hourPart.style.fontSize = largeSize;
    minutePart.style.fontSize = largeSize;
    secondPart.style.fontSize = largeSize;
    milliPart.style.fontSize = smallSize;
  }

  window.addEventListener('DOMContentLoaded', function (){
    
    canvas = document.getElementById('ring');
    hourPart = document.getElementById('hour-part');
    secondPart = document.getElementById('second-part');
    minutePart = document.getElementById('minute-part');
    milliPart = document.getElementById('mili-part');
    ctx = canvas.getContext('2d');
    wrapper = document.getElementById('stopwatch-wrapper');

    canvas.width = wrapper.offsetWidth;
    canvas.height = wrapper.offsetHeight;
    
    ctx.beginPath();
    var x              = canvas.width / 2;               // x coordinate
    var y              = canvas.height / 2;               // y coordinate
    var radius         = canvas.height / 2 - canvas.height/10;                    // Arc radius
    var startAngle     = 0;                     // Starting point on circle
    var endAngle       = 2 * Math.PI; // End point on circle
    var anticlockwise  = false; // clockwise or anticlockwise

    
    ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);

    ctx.lineWidth = 5;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    
    setFontSize();
    
    wrapper.addEventListener('click', function (){
      if (started){
        stop();
      }else{
        start();
      }
    }, false);
  }, false);

}());
