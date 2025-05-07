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
  
  document.getElementById("downloadBtn").addEventListener("click", function () {
    const posterFrame = document.querySelector(".poster-frame");
  
    // Save original styles
    const originalOverflow = posterFrame.style.overflow;
    const originalBorderRadius = posterFrame.style.borderRadius;
  
    // Temporarily disable clipping styles
    posterFrame.style.overflow = "visible";
    posterFrame.style.borderRadius = "0";
  
    // Wait briefly to let layout settle (optional but helpful)
    setTimeout(() => {
      html2canvas(document.getElementById("certificate"), {
        scale: 3, // Increase to 3x resolution (try 2 or 4 as needed)
        useCORS: true, // Enable if image sources are external and CORS is required
      }).then(canvas => {
        // Restore styles
        posterFrame.style.overflow = originalOverflow;
        posterFrame.style.borderRadius = originalBorderRadius;
  
        const link = document.createElement("a");
        link.download = "participation-poster.png";
        link.href = canvas.toDataURL("image/png", 1.0); // 1.0 = max quality
        link.click();
      });
    }, 200);
  });
  
  