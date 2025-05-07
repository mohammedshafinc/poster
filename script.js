let cropper;

document.getElementById("imageUpload").addEventListener("change", function (event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function () {
    const img = document.getElementById("uploadedImage");
    img.src = reader.result;

    img.onload = () => {
      if (cropper) {
        cropper.destroy(); // Destroy previous cropper if it exists
      }

      cropper = new Cropper(img, {
        viewMode: 1,
        background: false,
        zoomable: true,
        scalable: false,
        dragMode: 'move',
        autoCrop: false
      });
    };
  };

  if (file) {
    reader.readAsDataURL(file);
  }
});

function zoomIn() {
  if (cropper) {
    cropper.zoom(0.1);
  }
}

function zoomOut() {
  if (cropper) {
    cropper.zoom(-0.1);
  }
}

document.getElementById("downloadBtn").addEventListener("click", function () {
  const certificate = document.getElementById("certificate");
  const posterFrame = document.querySelector(".poster-frame");

  const loadingMsg = document.createElement("div");
  loadingMsg.textContent = "Generating high-quality image...";
  loadingMsg.style.position = "fixed";
  loadingMsg.style.top = "50%";
  loadingMsg.style.left = "50%";
  loadingMsg.style.transform = "translate(-50%, -50%)";
  loadingMsg.style.background = "rgba(0,0,0,0.7)";
  loadingMsg.style.color = "white";
  loadingMsg.style.padding = "15px 20px";
  loadingMsg.style.borderRadius = "8px";
  loadingMsg.style.zIndex = "9999";
  document.body.appendChild(loadingMsg);

  const originalStyles = {
    overflow: posterFrame.style.overflow,
    borderRadius: posterFrame.style.borderRadius,
    transform: certificate.style.transform,
    width: certificate.style.width,
    height: certificate.style.height
  };

  posterFrame.style.overflow = "visible";
  posterFrame.style.borderRadius = "0";
  certificate.style.transform = "none";

  const pixelRatio = window.devicePixelRatio || 1;
  const scaleFactor = Math.max(pixelRatio * 2, 5);

  setTimeout(() => {
    html2canvas(certificate, {
      scale: scaleFactor,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: null,
      imageTimeout: 0,
      onclone: function (clonedDoc) {
        const clonedCertificate = clonedDoc.getElementById("certificate");
        if (clonedCertificate) {
          clonedCertificate.style.fontSmoothing = "antialiased";
          clonedCertificate.style.webkitFontSmoothing = "antialiased";
          clonedCertificate.style.mozOsxFontSmoothing = "grayscale";

          const textElements = clonedCertificate.querySelectorAll('p, h1, h2, h3, h4, h5, span, div');
          textElements.forEach(el => {
            el.style.textRendering = "optimizeLegibility";
          });

          const images = clonedCertificate.querySelectorAll('img');
          images.forEach(img => {
            img.style.imageRendering = "pixelated";
            img.setAttribute('crossorigin', 'anonymous');
          });
        }
      }
    }).then(canvas => {
      posterFrame.style.overflow = originalStyles.overflow;
      posterFrame.style.borderRadius = originalStyles.borderRadius;
      certificate.style.transform = originalStyles.transform;
      certificate.style.width = originalStyles.width;
      certificate.style.height = originalStyles.height;

      document.body.removeChild(loadingMsg);

      const imgData = canvas.toDataURL("image/png", 1.0);

      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        const byteString = atob(imgData.split(',')[1]);
        const mimeType = imgData.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([ab], { type: mimeType });
        const blobUrl = URL.createObjectURL(blob);

        const newTab = window.open();
        if (newTab) {
          newTab.document.write(`
            <html>
              <head>
                <title>Your Certificate</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                  body { margin: 0; padding: 10px; text-align: center; background: #f0f0f0; }
                  img { max-width: 100%; height: auto; }
                  .download-btn { 
                    display: block; margin: 20px auto; padding: 10px 20px; 
                    background: #007bff; color: white; border: none; 
                    border-radius: 5px; font-size: 16px; cursor: pointer;
                  }
                </style>
              </head>
              <body>
                <h3>Long-press on image to save</h3>
                <img src="${blobUrl}" alt="Certificate" />
                <button class="download-btn" id="dlBtn">Download Certificate</button>
                <script>
                  document.getElementById('dlBtn').addEventListener('click', function() {
                    const link = document.createElement('a');
                    link.href = '${blobUrl}';
                    link.download = 'participation-certificate.png';
                    link.click();
                  });
                </script>
              </body>
            </html>
          `);
        } else {
          const link = document.createElement("a");
          link.download = "participation-certificate.png";
          link.href = imgData;
          link.click();
        }
      } else {
        const link = document.createElement("a");
        link.download = "participation-certificate.png";
        link.href = imgData;
        link.click();
      }
    }).catch(err => {
      console.error("Error generating image:", err);
      document.body.removeChild(loadingMsg);
      posterFrame.style.overflow = originalStyles.overflow;
      posterFrame.style.borderRadius = originalStyles.borderRadius;
    });
  }, 300);
});
