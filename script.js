const startBtn = document.getElementById("start-btn");
const video = document.getElementById("video");
const countdown = document.getElementById("countdown");
const canvases = [
  document.getElementById("photo1"),
  document.getElementById("photo2"),
  document.getElementById("photo3")
];
const downloadBtn = document.getElementById("download-btn");

startBtn.addEventListener("click", async () => {
  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("camera-view").classList.remove("hidden");

  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;

  takePhotosWithCountdown();
});

async function takePhotosWithCountdown() {
  for (let i = 0; i < 3; i++) {
    await showCountdown(3);
    capturePhoto(canvases[i]);
    triggerFlash();
  }

  video.srcObject.getTracks().forEach(track => track.stop());

  document.getElementById("camera-view").classList.add("hidden");
  document.getElementById("filmstrip").classList.remove("hidden");
  downloadBtn.classList.remove("hidden");

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-GB");
  document.getElementById("date").textContent = formattedDate;
}

function showCountdown(seconds) {
  return new Promise(resolve => {
    let count = seconds;
    countdown.textContent = count;
    const interval = setInterval(() => {
      count--;
      if (count === 0) {
        clearInterval(interval);
        countdown.textContent = "";
        resolve();
      } else {
        countdown.textContent = count;
      }
    }, 1000);
  });
}

function capturePhoto(canvas) {
  const context = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.filter = "sepia(1)";
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
}

function triggerFlash() {
  const flash = document.getElementById("flash");
  flash.style.opacity = "1";
  setTimeout(() => {
    flash.style.opacity = "0";
  }, 100);
}

downloadBtn.addEventListener("click", () => {
  const captureArea = document.getElementById("film-frame");

  downloadBtn.classList.add("hidden");

  setTimeout(() => {
    html2canvas(captureArea, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#000' 
    }).then(canvas => {
      downloadBtn.classList.remove("hidden");

      const link = document.createElement("a");
      link.download = "filmstrip.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }).catch(error => {
      console.error("Error capturing filmstrip:", error);
      downloadBtn.classList.remove("hidden");
      alert("Failed to download. Please try again.");
    });
  }, 100);
});
