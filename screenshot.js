var $image = "", croppedImage;
var jcrop_api, jcropped;

function setScreenshotUrl(url) {
  $image = url;
  document.getElementById('screenshotimage').src = url;
  $('#screenshotimage').Jcrop({
      onChange:   showCoords,
      onSelect:   showCoords,
      onRelease:  clearCoords
    },function(){
      jcrop_api = this;
    });
}

function setTabValue(params){
	document.getElementById('acc').innerHTML = params.acc;
	document.getElementById('funding').innerHTML = params.funding;
	document.getElementById('viewType').innerHTML = params.viewType;
	document.getElementById('prior').innerHTML = params.prior;
	document.getElementById('current').innerHTML = params.current;
}

function showCoords(c)
{
	$('#screenshotDone').show().css({position: 'absolute', top: parseInt(c.y2)+15, left: parseInt(c.x2)+15, 'z-index': '9999'})
	jcropped = c;
};

function clearCoords()
{
	$('#screenshotDone').hide();
	jcropped = {}
};
function pixeltomm(pixel){
	return ( pixel * 25.4 ) / 96;
}

document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('generatePDF').addEventListener('click', function(){
		var doc = new jsPDF();  

		var elem = document.getElementById("accStructrueTable");
		var res = doc.autoTableHtmlToJson(elem);
		doc.autoTable(res.columns, res.data);
		var canvas = document.getElementById('screenshotcanvas');
		var dataURL = canvas.toDataURL();
		
		doc.addImage(dataURL, 'JPEG', 0, 100, pixeltomm(canvas.width), pixeltomm(canvas.height));
		doc.save('sample-file.pdf');
	});
	
	document.getElementById('generatePPT').addEventListener('click', function(){
		var pptx=new PptxGenJS(); 
		pptx.tableToSlides('accStructrueTable'); 
		var slide = pptx.addSlide();
		var canvas = document.getElementById('screenshotcanvas');
		var dataURL = canvas.toDataURL();
		slide.addImage({ path:dataURL, x:1, y:1, w:8.0, h:4.0 });
		pptx.writeFile();
	});
	document.getElementById('screenshotConfirm').addEventListener('click', function(){
		var c = document.getElementById("screenshotcanvas");
		var ctx = c.getContext("2d");
		var img = document.getElementById("screenshotimage");
		ctx.canvas.height = jcropped.h
		ctx.canvas.width = jcropped.w
		ctx.drawImage(img, jcropped.x, jcropped.y, jcropped.w, jcropped.h, 10, 10, jcropped.w, jcropped.h );
		$('#accStructrueTable, #ignorePDF, #screenshotTable').show();
		$('#screenshotDone, #screenshotimage, .jcrop-holder').hide();
		
	});
});
