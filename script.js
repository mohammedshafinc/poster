document.getElementById("imageUpload").addEventListener("change", function(event) {
    const reader = new FileReader();
    reader.onload = function(){
      document.getElementById("uploadedImage").src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
  });
  
  document.getElementById("downloadBtn").addEventListener("click", function() {
    html2canvas(document.getElementById("certificate")).then(canvas => {
      const link = document.createElement("a");
      link.download = "participation-poster.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  });
  