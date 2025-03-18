### I. ENVIRONMENT (on XAMPP):

- **Programing language version:** html5, JavaScript, PHP 8.4.3 (my version).
- **Type of web server:** Apache HTTP server with SSL/TLS.
- **Operating System (OS):** Window.
- **Libraries:**

	- jsQR library ([install link](https://github.com/cozmo/jsQR))
	- PHP QR Code library  ([install link](https://sourceforge.net/projects/phpqrcode/))
	
### II. Project Activity Flow:

- **Launching the QR Scanner:**
On the main page, the user taps the ***QR Code icon*** to open the scanning screen. Once activated, the ***QR Code icon*** is hidden, and a ***Close button*** appears.

- **Scanning the QR Code:**
The user aligns the QR Code within the camera view. When the QR Code is detected, it is highlighted with a light blue frame, and its decoded data is displayed above the scanning area.

- **Closing the Scanner:**
After scanning, the user taps the ***Close button*** to exit the scanning screen. This action hides the ***Close button*** and restores the ***QR Code icon*** on the main page.

- **Generating the QR Code:**
The user enters the desired content into the input field and presses the ***Generate button***. The generated QR Code is then displayed on the screen.

### III. Class
##### 1. QRGenerator Class 
- **Location:** QRGenerator.php
- **Purpose:** Generate a QR code and return HTML content to render it using ASCII characters.
- **Method:** 

|Method|Functionality|Argument|Return Value|Exception Type/Condition|Addition Information|Usage Examples|
| ------------ | ------------ | ------------ | ------------ | ------------ | ------------ | ------------ |
| generateQR() | Send a JSON response containing the QR code HTML content, or return an error if an exception is thrown.| `$inputContent` (String): the input content to using on the `convertToHTML() function` | |Type: Exception. <br> - Condition 1:  throw `QR content is required` if the `$inputContent` is empty. <br> - Condition 2: throw `failed to convert text content to html content` if the `$htmlContent` is `false`. |  | `QRGenerator::generateQR()($inputContent)` |
| convertToHTML() | Return the HTML content of the QR code after converting the `$inputContent`. | `$inputContent` (String): the input content to covert to html QR code | - Return `$htmlContent` if  `QRcode::text($inputContent)` successfully <br> - Return false if `$inputContent` is empty| Type: Exception. <br> Condition: Return exception if the `QRcode::text($inputContent)` is failed| | `QRGenerator::convertToHTML($inputContent)` |
---
##### 2. ScannerQR Class 
- **Location:** main.js
- **Purpose:** Scan QR codes using the user's device.	
- **Method:**

|Method|Functionality|Argument|Return Value|Exception Type/Condition|Addition Information|Usage Examples|
| ------------ | ------------ | ------------ | ------------ | ------------ | ------------ | ------------ |
| initEvents() | Specifying an event listener for a DOM element.| | |Type: Uncaught TypeError. <br> - Condition 1: `this.scannerBtn` is undefined <br> - Condition 2: `this.stopBtn` is undefined|  | `ScannerQR.initEvents()` |
| openScanning() | Request access to the camera. If granted, display the video stream from the camera. Then, call the `tick()` function to continuously scan the video.| | |- Type: DOMException: Permission denied.  Condition : The user denied the access permission <br> -Type: NotFoundError. Condition: No camera device found. <br> -Type: NotReadableError. Condition: The camera is in use by another application.|  | `ScannerQR::openScanning()` |
| stopScanning() | Stop the camera, clear the data on the screen, and hide the video and canvas.| | | | | `ScannerQR::stopScanning()` |
| drawLine() | draw a strange line from begin to the end on canvas| - canvas: The context object of the canvas (typically a CanvasRenderingContext2D) used to draw the line. <br> - bengin: The starting point for the line (usually an object with x and y coordinates). <br> - end: The ending point for the line (usually an object with x and y coordinates). <br> - color: The color used for drawing the line. | | | |`ScannerQR::drawLine(canvas, begin, end, color)` |
| tick() | - Places the image from the video onto the canvas. <br> - Retrieves the image data from the canvas. <br> -  Uses jsQR to decode the QR code from the image data.| | | | | `ScannerQR::tick()` |


##### 2. GenerateQR Class 
- **Location:** main.js
- **Purpose:** Generate a QR code from input content.
- **Method:**

|Method|Functionality|Argument|Return Value|Exception Type/Condition|Addition Information|Usage Examples|
| ------------ | ------------ | ------------ | ------------ | ------------ | ------------ | ------------ |
| initEvents() | Specifying an event listener for a DOM element.| | |Type: Uncaught TypeError. <br> Condition: `this.btn` is undefined|  | `generatorQR.initEvents()` |
| renderQR() | Retrieve the `content` value from the input field, call `fetchToGenerateQR(content)` to generate the QR code, and render it on the specified element.| | |Type: Uncaught TypeError. <br> Condition: `content` is undefined| | `generatorQR.renderQR()` |
| fetchToGenerateQR() | Send a request using the `POST` method with the `content` to the server. Check the response from the server and return the QR code HTML content.| | - Return `data.htmlContent` if  `response.ok == true` successfully <br> - Return false if `response.ok == false`| | | `generatorQR.fetchToGenerateQR()` |


### IV. References
- Guide to registering an SSL/TLS certificate on XAMPP. ([youtube link](https://www.youtube.com/watch?v=Mig9YPNiUZI))