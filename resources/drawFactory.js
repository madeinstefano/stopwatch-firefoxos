/**
 * al canvas drawing here
 */
var DrawFactory = (function (){

  var
    ctx, canvas, x, y, radius, canvasWrapper,
    anticlockwise = false;
    
  function clearCanvas(){
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }
  
  function drawPath(color, startAngle, endAngle, width){
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.stroke();
  }
  
  function setCanvasSizes(){
    canvas.width = canvasWrapper.offsetWidth;
    canvas.height = canvasWrapper.offsetHeight;
    
    x = canvas.width / 2;
    y = canvas.height / 2;

    radius = ((canvas.height > canvas.width ? canvas.width : canvas.height) / 2) * 0.9;
  }
  
  return {
    init: function (){
    
      canvas = document.getElementById('ring');
      ctx = canvas.getContext('2d');
      canvasWrapper = document.getElementById('stopwatch-wrapper');
      setCanvasSizes();
      
    },
    
    refresh: function (){
      setCanvasSizes();
      this.drawStaticCircle();
    },
  
    drawStaticCircle: function (){
      drawPath('#fff', 0, Math.PI * 2, radius * 0.02);
    },
    
    drawProgressiveCircle: function (seconds, millis){
      clearCanvas();
      this.drawStaticCircle();
      var 
        ratio = ((seconds * 1000) + millis) / 60000,
        angle = ((ratio * 360) * (Math.PI / 180)) + (Math.PI * 1.5);
      drawPath('#F2243C', Math.PI * 1.5, angle, radius * 0.05);
    }
  };
}());