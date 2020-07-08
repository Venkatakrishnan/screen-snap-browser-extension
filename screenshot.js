var $image = "";
function setScreenshotUrl(url) {
  $image = url;
  console.log($image);
  document.getElementById('target').src = url;
}

function setTabValue(params){
	document.getElementById('acc').innerHTML = params.acc;
	document.getElementById('funding').innerHTML = params.funding;
	document.getElementById('viewType').innerHTML = params.viewType;
	document.getElementById('prior').innerHTML = params.prior;
	document.getElementById('current').innerHTML = params.current;
}



document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('generatePDF').addEventListener('click', function(){
		var doc = new jsPDF();  

		var elem = document.getElementById("accStructrueTable");
		var res = doc.autoTableHtmlToJson(elem);
		doc.autoTable(res.columns, res.data);
		doc.addImage($image, 'JPEG', 0, 120, 210, 160);
		doc.save('sample-file.pdf');
	});
	
	document.getElementById('generatePPT').addEventListener('click', function(){
		var pptx=new PptxGenJS(); 
		pptx.tableToSlides('accStructrueTable'); 
		var slide = pptx.addSlide();
		slide.addImage({ path:$image, x:1, y:1, w:8.0, h:4.0 });
		pptx.writeFile();
	});
});

