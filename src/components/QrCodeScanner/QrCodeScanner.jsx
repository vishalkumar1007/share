import { useCallback, useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import qrScannerWorkerUrl from "qr-scanner/qr-scanner-worker.min.js?url";
import "./QrCodeScanner.css";

QrScanner.WORKER_PATH = qrScannerWorkerUrl;

const QrCodeScanner = ({ openScanner }) => {
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const resultHandlerRef = useRef(openScanner);
  const fileRef = useRef(null);
  const startingRef = useRef(false);
  const [status, setStatus] = useState("Starting camera…");
  const [error, setError] = useState("");
  const [camera, setCamera] = useState("environment");

  useEffect(() => {
    resultHandlerRef.current = openScanner;
  }, [openScanner]);

  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;
    scannerRef.current = null;
    if (!scanner) return;
    try {
      await scanner.stop();
    } catch {
      /* ignore */
    }
    try {
      scanner.destroy();
    } catch {
      /* ignore */
    }
  }, []);

  const finish = useCallback(
    (value) => {
      stopScanner();
      resultHandlerRef.current({ action: false, url: value || "" });
    },
    [stopScanner]
  );

  const startScanner = useCallback(async () => {
    if (startingRef.current) return;
    startingRef.current = true;
    await stopScanner();
    setError("");
    setStatus("Requesting camera access…");

    try {
      if (!window.isSecureContext && location.hostname !== "localhost") {
        throw Object.assign(new Error("Camera needs HTTPS"), {
          name: "SecurityError",
        });
      }

      const hasCamera = await QrScanner.hasCamera();
      if (!hasCamera) {
        throw Object.assign(new Error("No camera found"), {
          name: "NotFoundError",
        });
      }

      // Wait a frame so the video element is mounted and sized
      await new Promise((resolve) => requestAnimationFrame(resolve));
      if (!videoRef.current) {
        throw new Error("Video element missing");
      }

      const scanner = new QrScanner(
        videoRef.current,
        (result) => {
          const data = typeof result === "string" ? result : result?.data;
          if (data) finish(data);
        },
        {
          preferredCamera: camera,
          returnDetailedScanResult: true,
          highlightScanRegion: true,
          highlightCodeOutline: true,
          maxScansPerSecond: 10,
          calculateScanRegion: (video) => {
            const smallest = Math.min(video.videoWidth, video.videoHeight);
            const scanSize = Math.round(0.72 * smallest);
            return {
              x: Math.round((video.videoWidth - scanSize) / 2),
              y: Math.round((video.videoHeight - scanSize) / 2),
              width: scanSize,
              height: scanSize,
            };
          },
        }
      );
      scannerRef.current = scanner;
      await scanner.start();
      setStatus("Point your camera at a Multiverse QR code");
    } catch (scanError) {
      await stopScanner();
      const name = scanError?.name || "";
      let message = "Could not start the camera. You can scan a QR image instead.";
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        message =
          "Camera access is blocked. Allow camera permission in the browser, then try again.";
      } else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
        message = "No camera was found on this device. Use “Scan QR image” instead.";
      } else if (name === "NotReadableError" || name === "TrackStartError") {
        message =
          "Camera is busy (another app may be using it). Close other camera apps and try again.";
      } else if (name === "SecurityError") {
        message = "Camera requires a secure page (HTTPS or localhost).";
      }
      setError(message);
      setStatus("");
    } finally {
      startingRef.current = false;
    }
  }, [camera, finish, stopScanner]);

  useEffect(() => {
    const timer = setTimeout(() => {
      startScanner();
    }, 80);
    return () => {
      clearTimeout(timer);
      stopScanner();
    };
  }, [startScanner, stopScanner]);

  const scanImage = async (file) => {
    if (!file) return;
    setError("");
    setStatus("Reading QR image…");
    try {
      const result = await QrScanner.scanImage(file, {
        returnDetailedScanResult: true,
      });
      finish(result?.data || result);
    } catch {
      setStatus("");
      setError("No readable QR code was found in that image.");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const toggleCamera = () => {
    setCamera((current) => (current === "environment" ? "user" : "environment"));
  };

  return (
    <section className="QrCodeScanner_main" aria-label="QR code scanner">
      <div className="QrCodeScanner_videoWrap">
        <video
          ref={videoRef}
          className="QrCodeScanner_qrVideo"
          muted
          playsInline
          autoPlay
        />
        <span className="QrCodeScanner_target" aria-hidden="true" />
      </div>
      {status ? <p className="QrCodeScanner_status">{status}</p> : null}
      {error ? <p className="QrCodeScanner_error">{error}</p> : null}
      <div className="QrCodeScanner_actions">
        <button type="button" className="QrCodeScanner_action" onClick={startScanner}>
          Try camera again
        </button>
        <button type="button" className="QrCodeScanner_action" onClick={toggleCamera}>
          Switch camera
        </button>
        <button
          type="button"
          className="QrCodeScanner_action"
          onClick={() => fileRef.current?.click()}
        >
          Scan QR image
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={(event) => scanImage(event.target.files?.[0])}
        />
      </div>
      <button
        className="QrCodeScanner_close_btn"
        type="button"
        onClick={() => finish("")}
      >
        Cancel
      </button>
    </section>
  );
};

export default QrCodeScanner;
