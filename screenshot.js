var $image = "", croppedImage;
var jcrop_api, jcropped = {}, jcropList = [];

function setScreenshotUrl(url) {
  $image = url;
  document.getElementById('screenshotimage').src = url;
  createJcrop();
}

function createJcrop() {
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
	$('#screenshotDone').show().css({position: 'absolute', top: parseInt(c.y2)+15, left: parseInt(c.x2)-80, 'z-index': '9999'})
	jcropped = c;
};

function clearCoords()
{
	$('#screenshotDone').hide();
	jcropped = {}
};

function pixeltoinch(pixel){
	return ( pixel) / 96 ;
}

document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('generatePDF').addEventListener('click', function(){
		var HTML_Width = $("#screenshotcanvas").width();
		var HTML_Height = $("#screenshotcanvas").height();
		var top_left_margin = 15;
		var PDF_Width = HTML_Width+(top_left_margin*2);
		var PDF_Height = 250+(PDF_Width*1.5)+(top_left_margin*2);
		var canvas_image_width = HTML_Width;
		var canvas_image_height = HTML_Height;
		
		var totalPDFPages = Math.ceil(HTML_Height/PDF_Height)-1;
		
		
		var doc = new jsPDF('p', 'pt',  [PDF_Width, PDF_Height]);

		var elem = document.getElementById("accStructrueTable");
		var res = doc.autoTableHtmlToJson(elem);
		doc.autoTable(res.columns, res.data);
		var position = 250;
				
		$('#screenshotcanvas canvas').each(function(){
			var canvas = $(this)[0];
			var dataURL = canvas.toDataURL();
			doc.addImage(dataURL, 'JPEG', 10, position, canvas.width, canvas.height);
			
			position += canvas.height + 10
			console.log(position);
		});
		
		doc.save('export.pdf');
	});
	
	document.getElementById('generatePPT').addEventListener('click', function(){
		var pptx=new PptxGenJS(); 
		pptx.layout = "LAYOUT_WIDE";
		pptx.defineSlideMaster({
			title: "MASTER_SLIDE",
			bkgd: "#7b94d1",
			objects: [
				{ rect: { x: 0.2, y: 0.2, w: "98%", h: 0.5, fill: "F1F1F1" } },
				{ text: { text: "This is a powerpoint slide created with JavaScript", options: { x: 0.5, y: 0.2, w: "95%", h: 0.75, color: 'b3b3b3', fontSize: 12 } } },
				{ rect: {x: 0.2, y: 6.8, w: '98%', h: 0.5, fill: 'F1F1F1'}},
				{image: {x: 10, y: 6.8, w: 2.5, h: 0.5, path: 'assets/footer.png'}},
				{ text: { text: 'Slide: ', options: { x: 0.1, y: '93%', color: '333333', w: '95%' , fontSize: 16} } }
			],
			slideNumber: { x: 0.6, y: "92.5%", color:'333333', fontSize: 16 },
		});
		
		pptx.tableToSlides('accStructrueTable', { x:0.25, y:1.3, masterSlideName: "MASTER_SLIDE" }); 
		
		$('#screenshotcanvas canvas').each(function(){
			var canvas = $(this)[0];
			var dataURL = canvas.toDataURL();
			var slide = pptx.addSlide({ masterName: "MASTER_SLIDE" });
			var w1 = canvas.width > 1000 ? pixeltoinch(canvas.width) : pixeltoinch(canvas.width) // *1.5
			var h1 = canvas.width > 1000 ? pixeltoinch(canvas.height) : pixeltoinch(canvas.height)
			
			slide.addImage({ path:dataURL, x:0.25, y:0.8, w:w1, h:h1 });
			slide.addNotes('This is a powerpoint slide created with javascript code holding the image captured from Birst dashboards!');
		});
		
		let slide3 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
		slide3.addText("Thank you!", { x: 3.5, y: 3.0, w: 7.5, h: 1.0, color: "FFFFFF", fontSize: 48 });
	
		pptx.writeFile('export.pptx');
	});
	document.getElementById('screenshotConfirm').addEventListener('click', function(){
		
		jcropList.push(jcropped);
		$('#screenshotcanvas').html('');	
		$.each(jcropList, function(key, jcropi){
			console.log(key, jcropi);
			
			var newCanvas = $('<canvas/>',{
                   id: 'screenshotcanvas'+key              
                }).prop({
                    width: jcropi.w+20,
                    height: jcropi.h+20
                });
			$('#screenshotcanvas').append(newCanvas);
			
			$(newCanvas).css({'border': '1px solid #CCC', 'margin': '8px'});

			var ctx = $(newCanvas)[0].getContext("2d");
			var img = document.getElementById("screenshotimage");
			ctx.canvas.height = jcropi.h
			ctx.canvas.width = jcropi.w
			ctx.drawImage(img, jcropi.x, jcropi.y, jcropi.w, jcropi.h, 10, 10, jcropi.w+10, jcropi.h+10 );
			
			$('#accStructrueTable, #ignorePDF, #screenshotTable').show();
			jcrop_api.destroy();
			$('#screenshotDone, #screenshotimage').hide();
		});
		
	});
	
	document.getElementById('addSnip').addEventListener('click', function(){
		$('#accStructrueTable, #ignorePDF, #screenshotTable, #screenshotDone').hide();
		$('#screenshotimage').show();
		createJcrop();
	});
	
});
