const video = document.createElement("video");
const scannerBtn = document.getElementById("scannerBtn");
const stopBtn = document.getElementById("stopBtn");
const canvasElement = document.getElementById("canvas");
const canvas = canvasElement.getContext("2d");
const outputData = document.getElementById("outputData");

const openScanning = () => {
	scannerBtn.hidden = true;

	navigator.mediaDevices
		.getUserMedia({ video: { facingMode: "environment" } })
		.then((stream) => {
			video.srcObject = stream;
			video.setAttribute("playsinline", true);
			video.play();

			video.addEventListener("loadeddata", () => {
				stopBtn.hidden = false;
				requestAnimationFrame(tick);
			});
		})
		.catch((err) => {
			console.log("Can not access camera:", err);
		});
};

const stopScanning = () =>{

	const stream = video.srcObject;

    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }

	stopBtn.hidden = true;
	video.srcObject = null;
    scannerBtn.hidden = false;
	canvasElement.hidden = true;
}

const drawLine = (begin, end, color) => {
	canvas.beginPath();
	canvas.moveTo(begin.x, begin.y);
	canvas.lineTo(end.x, end.y);
	canvas.lineWidth = 5;
	canvas.strokeStyle = color;
	canvas.stroke();
};

const tick = () => {
	outputData.textContent = "";

	if (video.readyState === video.HAVE_ENOUGH_DATA) {
		canvasElement.hidden = false;

		const sx = 0;
		const sy = 0;

		canvasElement.height = video.videoHeight;
		canvasElement.width = video.videoWidth;

		canvas.drawImage(
			video,
			sx,
			sy,
			canvasElement.width,
			canvasElement.height
		);

		let imageData = canvas.getImageData(
			sx,
			sy,
			canvasElement.width,
			canvasElement.height
		);
		let qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
			inversionAttempts: "dontInvert",
		});

		if (qrCode) {
			const color = "#11b4f0";

			drawLine(
				qrCode.location.topLeftCorner,
				qrCode.location.topRightCorner,
				color
			);
			drawLine(
				qrCode.location.topRightCorner,
				qrCode.location.bottomRightCorner,
				color
			);
			drawLine(
				qrCode.location.bottomRightCorner,
				qrCode.location.bottomLeftCorner,
				color
			);
			drawLine(
				qrCode.location.bottomLeftCorner,
				qrCode.location.topLeftCorner,
				color
			);

			outputData.textContent = qrCode.data;
			outputData.hidden = false;
		} else {
			outputData.hidden = true;
		}

		requestAnimationFrame(tick);
	}
};
