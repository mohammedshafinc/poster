document.getElementById("imageUpload").addEventListener("change", function(event) {
    const reader = new FileReader();
    reader.onload = function(){
      document.getElementById("uploadedImage").src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
  });
  
  document.getElementById("imageUpload").addEventListener("change", function(event) {
    const reader = new FileReader();
    reader.onload = function() {
      document.getElementById("uploadedImage").src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
  });
  
  // Upload image and show it
document.getElementById("imageUpload").addEventListener("change", function(event) {
  const reader = new FileReader();
  reader.onload = function () {
    const img = document.getElementById("uploadedImage");
    img.onload = () => {
      // Ensure image is fully loaded before doing anything
      console.log("Image loaded and ready.");
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(event.target.files[0]);
});

// Download the poster with high quality
document.getElementById("imageUpload").addEventListener("change", function (event) {
  const reader = new FileReader();
  reader.onload = function () {
    const img = document.getElementById("uploadedImage");
    img.onload = () => {
      console.log("Image loaded and ready.");
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(event.target.files[0]);
});

document.getElementById("downloadBtn").addEventListener("click", function () {
  const certificate = document.getElementById("certificate");
  const posterFrame = document.querySelector(".poster-frame");

  // Save original styles
  const originalStyles = {
    overflow: posterFrame.style.overflow,
    borderRadius: posterFrame.style.borderRadius,
    transform: certificate.style.transform,
    width: certificate.style.width,
    height: certificate.style.height,
    aspectRatio: certificate.style.aspectRatio,
  };

  // Temporarily remove clipping and aspect ratio
  posterFrame.style.overflow = "visible";
  posterFrame.style.borderRadius = "0";
  certificate.style.transform = "none";
  certificate.style.aspectRatio = "auto";

  // Use html2canvas with fixed higher size for mobile clarity
  const scaleFactor = 3;
  html2canvas(certificate, {
    width: certificate.offsetWidth * scaleFactor,
    height: certificate.offsetHeight * scaleFactor,
    scale: scaleFactor,
    useCORS: true,
    backgroundColor: null,
    logging: false,
    onclone: function (clonedDoc) {
      const clonedCertificate = clonedDoc.getElementById("certificate");
      if (clonedCertificate) {
        clonedCertificate.style.fontSmoothing = "antialiased";
        clonedCertificate.style.webkitFontSmoothing = "antialiased";
        clonedCertificate.style.mozOsxFontSmoothing = "grayscale";
      }
    },
  })
    .then((canvas) => {
      // Optional: redraw onto fresh canvas for guaranteed clarity
      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = canvas.width;
      finalCanvas.height = canvas.height;
      const ctx = finalCanvas.getContext("2d");
      ctx.drawImage(canvas, 0, 0, finalCanvas.width, finalCanvas.height);

      // Restore original styles
      Object.assign(posterFrame.style, {
        overflow: originalStyles.overflow,
        borderRadius: originalStyles.borderRadius,
      });
      Object.assign(certificate.style, {
        transform: originalStyles.transform,
        width: originalStyles.width,
        height: originalStyles.height,
        aspectRatio: originalStyles.aspectRatio,
      });

      // Download high-quality PNG
      const link = document.createElement("a");
      link.download = "participation-certificate.png";
      link.href = finalCanvas.toDataURL("image/png", 1.0);
      link.click();
    })
    .catch((err) => {
      console.error("Error generating image:", err);
      // Restore styles even on error
      Object.assign(posterFrame.style, {
        overflow: originalStyles.overflow,
        borderRadius: originalStyles.borderRadius,
      });
    });
});
