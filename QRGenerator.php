<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/lib/phpqrcode/qrlib.php';

class QRGenerator
{
	public static function generateQR()
	{
		try {
			if ($_SERVER['REQUEST_METHOD'] != 'POST') {
				http_response_code(405);
				die;
			}

			$payload = json_decode(file_get_contents('php://input'), true);

			if (empty($payload['content'])) {
				throw new Exception('QR content is required');
			};

			$QRcode =  self::convertToQRCode($payload['content']);

			if (!$QRcode) {
				throw new Exception('failed to convert to QR code');
			};
			echo json_encode(['QRcode' => $QRcode]);
		} catch (\Exception $e) {
			echo json_encode(['error' => $e->getMessage()]);
		}
	}


	private static function convertToQRCode($inputContent)
	{
		try {
			if (empty($inputContent)) return false;

			$contentArr = QRcode::text($inputContent);

			$contentStr  = join('<br>', $contentArr);

			$QRcode = strtr($contentStr, array(
				'0' => '<span style="color:white;">&#9608;&#9608;</span>',
				'1' => '&#9608;&#9608;'
			));

			$QRcode = "<span style='font-family:monospace;'>$QRcode</span>";

			return $QRcode;
		} catch (\Exception $e) {
			echo $e->getMessage();
			return false;
		}
	}
}

QRGenerator::generateQR();
