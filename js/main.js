class ScannerQR {
	constructor(canvasId) {
		this.canvasElement = document.getElementById(canvasId);
		this.video = document.createElement("video");
		this.outputData = document.getElementById("outputData");
		this.scannerBtn = document.getElementById("scannerBtn");
		this.stopBtn = document.getElementById("stopBtn");
		this.initEvents();
	}

	initEvents() {
		this.scannerBtn.addEventListener("click", () => this.openScanning());
		this.stopBtn.addEventListener("click", () => this.stopScanning());
	}
	async openScanning() {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: "environment" },
			});

			this.scannerBtn.hidden = true;

			this.video.srcObject = stream;
			this.video.setAttribute("playsinline", true);
			this.video.play();

			this.video.addEventListener("loadeddata", () => {
				this.stopBtn.hidden = false;
				requestAnimationFrame(() => this.tick());
			});
		} catch (err) {
			console.log("Can not access camera:", err);
		}
	}

	stopScanning() {
		const stream = this.video.srcObject;

		if (stream) {
			const tracks = stream.getTracks();
			tracks.forEach((track) => track.stop());
		}
		this.outputData.textContent = "";
		this.outputData.style.backgroundColor = "unset";
		this.stopBtn.hidden = true;
		this.video.srcObject = null;
		this.scannerBtn.hidden = false;
		this.canvasElement.hidden = true;
	}

	drawLine(canvas, begin, end, color) {
		canvas.beginPath();
		canvas.moveTo(begin.x, begin.y);
		canvas.lineTo(end.x, end.y);
		canvas.lineWidth = 5;
		canvas.strokeStyle = color;
		canvas.stroke();
	}

	tick() {
		const canvas = this.canvasElement.getContext("2d");

		if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
			this.canvasElement.hidden = false;

			const sx = 0;
			const sy = 0;

			this.canvasElement.height = this.video.videoHeight;
			this.canvasElement.width = this.video.videoWidth;

			canvas.drawImage(
				this.video,
				sx,
				sy,
				this.canvasElement.width,
				this.canvasElement.height
			);

			let imageData = canvas.getImageData(
				sx,
				sy,
				this.canvasElement.width,
				this.canvasElement.height
			);
			let qrCode = jsQR(
				imageData.data,
				imageData.width,
				imageData.height,
				{
					inversionAttempts: "dontInvert",
				}
			);

			if (qrCode) {
				const color = "#11b4f0";

				this.drawLine(
					canvas,
					qrCode.location.topLeftCorner,
					qrCode.location.topRightCorner,
					color
				);
				this.drawLine(
					canvas,
					qrCode.location.topRightCorner,
					qrCode.location.bottomRightCorner,
					color
				);
				this.drawLine(
					canvas,
					qrCode.location.bottomRightCorner,
					qrCode.location.bottomLeftCorner,
					color
				);
				this.drawLine(
					canvas,
					qrCode.location.bottomLeftCorner,
					qrCode.location.topLeftCorner,
					color
				);

				if (qrCode.data) {
					this.outputData.textContent = qrCode.data;
					this.outputData.style.backgroundColor = "#ced5d9";
					this.outputData.hidden = false;
				}
			}

			requestAnimationFrame(() => this.tick());
		}
	}
}

class GenerateQR {
	constructor(qrID) {
		this.elementQR = document.getElementById(qrID);
		this.btn = document.getElementById("btn");
		this.initEvents();
	}

	initEvents() {
		this.btn.addEventListener("click", () => this.renderQR());
	}

	// Render QR code
	async renderQR() {
		const content = document.getElementById("content").value;
		if (!content) return;

		let QRcode = await this.fetchToGenerateQR(content);

		if (!QRcode) return;

		this.elementQR.innerHTML = QRcode;
		this.elementQR.hidden = false;
	}

	// Fetch QR code form server
	async fetchToGenerateQR(content) {
		try {
			let response = await fetch("/QRGenerator.php", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content }),
			});

			if (!response.ok) return false;

			let data = await response.json();

			return data.QRcode;
		} catch (err) {
			console.log(err);
		}
	}
}

document.addEventListener("DOMContentLoaded", () => {
	new ScannerQR("canvas");
	new GenerateQR("qr_code");
});
