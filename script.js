const BACKEND_URL = "https://your-backend.onrender.com"; // <- change this

let weightHistory = [];

const imageInput = document.getElementById("imageInput");
const uploadBtn = document.getElementById("uploadBtn");
const detectedWeightEl = document.getElementById("detectedWeight");
const saveBtn = document.getElementById("saveBtn");
const correctBtn = document.getElementById("correctBtn");

let currentWeight = null;

uploadBtn.onclick = async () => {
  const file = imageInput.files[0];
  if (!file) return alert("Please select an image");

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${BACKEND_URL}/upload`, {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  if (data.weight) {
    currentWeight = data.weight;
    detectedWeightEl.textContent = currentWeight;
    saveBtn.disabled = false;
    correctBtn.disabled = false;
  } else {
    alert("Failed to detect weight. Try again.");
  }
};

saveBtn.onclick = () => {
  if (currentWeight) {
    const date = new Date().toISOString().split("T")[0];
    weightHistory.push({ date, weight: currentWeight });
    updateChart();
    reset();
  }
};

correctBtn.onclick = () => {
  const manual = prompt("Enter the correct weight:");
  const num = parseFloat(manual);
  if (!isNaN(num)) {
    const date = new Date().toISOString().split("T")[0];
    weightHistory.push({ date, weight: num });
    updateChart();
    reset();
  }
};

function reset() {
  currentWeight = null;
  detectedWeightEl.textContent = "--";
  saveBtn.disabled = true;
  correctBtn.disabled = true;
  imageInput.value = null;
}

const ctx = document.getElementById("weightChart").getContext("2d");
const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [{
      label: "Weight (kg)",
      data: [],
      borderColor: "#007bff",
      fill: false,
      tension: 0.2
    }]
  },
  options: {
    scales: {
      x: { title: { display: true, text: "Date" }},
      y: { title: { display: true, text: "Weight (kg)" }}
    }
  }
});

function updateChart() {
  chart.data.labels = weightHistory.map(e => e.date);
  chart.data.datasets[0].data = weightHistory.map(e => e.weight);
  chart.update();
}
