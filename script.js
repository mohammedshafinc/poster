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
document.getElementById("downloadBtn").addEventListener("click", function () {
  const certificate = document.getElementById("certificate");
  const posterFrame = document.querySelector(".poster-frame");

  // Save original styles
  const originalStyles = {
    overflow: posterFrame.style.overflow,
    borderRadius: posterFrame.style.borderRadius,
    transform: certificate.style.transform,
    width: certificate.style.width,
    height: certificate.style.height
  };

  // Temporarily disable clipping styles
  posterFrame.style.overflow = "visible";
  posterFrame.style.borderRadius = "0";
  certificate.style.transform = "none";

  // Use a higher scale based on devicePixelRatio for mobile clarity
  const scaleFactor = window.devicePixelRatio || 2;

  html2canvas(certificate, {
    scale: scaleFactor, // Make use of screen DPR
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
    onclone: function (clonedDoc) {
      const clonedCertificate = clonedDoc.getElementById("certificate");
      if (clonedCertificate) {
        clonedCertificate.style.fontSmoothing = "antialiased";
        clonedCertificate.style.webkitFontSmoothing = "antialiased";
        clonedCertificate.style.mozOsxFontSmoothing = "grayscale";
      }
    }
  }).then(canvas => {
    // Restore styles
    Object.assign(posterFrame.style, {
      overflow: originalStyles.overflow,
      borderRadius: originalStyles.borderRadius
    });
    Object.assign(certificate.style, {
      transform: originalStyles.transform,
      width: originalStyles.width,
      height: originalStyles.height
    });

    // Save as high-quality PNG
    const link = document.createElement("a");
    link.download = "participation-certificate.png";
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
  }).catch(err => {
    console.error("Download error:", err);
    // Restore styles even on error
    Object.assign(posterFrame.style, {
      overflow: originalStyles.overflow,
      borderRadius: originalStyles.borderRadius
    });
  });
});
