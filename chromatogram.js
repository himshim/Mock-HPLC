function generateChromatogram() {
	// Get user inputs
	var column = document.getElementById("column").value;
	var mobilePhase = document.getElementById("mobile-phase").value;
	var gradient = document.getElementById("gradient").value;
	var flowRate = parseFloat(document.getElementById("flow-rate").value);
	var injectionVolume = parseFloat(document.getElementById("injection-volume").value);
	
	// Calculate chromatogram parameters
	var peakWidth = 5.0; // seconds
	var peakSeparation = 10.0; // seconds
	var retentionFactor = 2.0;
	var kPrime = retentionFactor - 1.0;
	var columnVolume = 1.0; // mL
	var dwellTime = 0.005; // seconds
	
	// Calculate elution time for peaks
	var elutionTime1 = (columnVolume * kPrime * retentionFactor) / (flowRate * 60.0);
	var elutionTime2 = elutionTime1 + (peakWidth + peakSeparation) / (flowRate * 60.0);
	
	// Generate chromatogram data
	var time = 0.0;
	var data = [];
	while (time < elutionTime2 + dwellTime) {
		var concentration1 = 0.0;
		var concentration2 = 0.0;
		
		if (time > elutionTime1 && time < elutionTime1 + peakWidth) {
			concentration1 = (time - elutionTime1) / peakWidth;
		}
		
		if (time > elutionTime2 && time < elutionTime2 + peakWidth) {
			concentration2 = (time - elutionTime2) / peakWidth;
		}
		
		data.push([time, concentration1, concentration2]);
		
		time += dwellTime;
	}
	
	// Draw chromatogram on canvas
	var canvas = document.getElementById("chromatogram");
	var ctx = canvas.getContext("2d");
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	ctx.beginPath();
	ctx.moveTo(0, canvas.height);
	
	data.forEach(function(point) {
		var x = point[0] * canvas.width / (elutionTime2 + dwellTime);
		var y = canvas.height - (point[1] + point[2]) * canvas.height;
		
		ctx.lineTo(x, y);
	});
	
	ctx.lineTo(canvas.width, canvas.height);
	ctx.closePath();
	
	ctx.fillStyle = "#9fd9fb";
	ctx.fill();
	
	ctx.strokeStyle = "#333";
	ctx.stroke();
}
