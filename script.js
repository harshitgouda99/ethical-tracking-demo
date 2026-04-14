let stream; // global reference

async function startDemo() {
  stream = await navigator.mediaDevices.getUserMedia({ video: true });

  const video = document.getElementById("video");
  video.srcObject = stream;

  // auto capture after 2 seconds
  setTimeout(() => capturePhoto(), 2000);
}

function capturePhoto() {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);

  // STOP CAMERA 🔴
  stopCamera();

  // send photo
  canvas.toBlob(blob => {
    const formData = new FormData();
    formData.append("photo", blob);
    formData.append(
      "subject",
      document.getElementById("subject").value
    );

    fetch("/submit", {
      method: "POST",
      body: formData
    });
  });
}

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    document.getElementById("video").srcObject = null;
  }
}
