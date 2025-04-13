import { useEffect, useRef } from "react";
import QrScanner from "qr-scanner";
import "./QrCodeScanner.css";

const QrCodeScanner = ({ openScanner }) => {
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);

  const closeScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
    }
    openScanner({action:false,url:''});
  };

  useEffect(() => {
    const videoElement = videoRef.current;

    const initScanner = async () => {
      try {
        const cameras = await QrScanner.listCameras();
        const preferredCamera = cameras.find((cam) =>
          cam.label.toLowerCase().includes("back")
        ) || cameras[0];

        qrScannerRef.current = new QrScanner(
          videoElement,
          (result) => {
            console.log("Scanned:", result.data);
            if (qrScannerRef.current) {
                qrScannerRef.current.stop();
                qrScannerRef.current.destroy();
            }
            openScanner({action:false,url:result.data});
          },
          {
            returnDetailedScanResult: true,
            highlightScanRegion: true,
            highlightCodeOutline: true,
          }
        );

        await qrScannerRef.current.start(preferredCamera?.id);
      } catch (error) {
        console.error("Camera init failed:", error);
        alert("Unable to access camera. Please allow permissions.");
        openScanner({action:false,url:''});
      }
    };

    initScanner();

    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
        qrScannerRef.current.destroy();
      }
    };
  }, [openScanner]);

  return (
    <div className="QrCodeScanner_main">
      <video ref={videoRef} className="QrCodeScanner_qrVideo" />
      <button className="QrCodeScanner_close_btn" onClick={closeScanner}>
        ❌
      </button>
    </div>
  );
};

export default QrCodeScanner;
