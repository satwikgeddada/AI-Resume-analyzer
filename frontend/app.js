const API_BASE = "http://localhost:8080";

// DOM Elements
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const fileInfo = document.getElementById('file-info');
const filenameDisplay = document.getElementById('filename-display');
const analyzeBtn = document.getElementById('analyze-btn');
const loader = document.getElementById('loader');
const uploadSection = document.getElementById('upload-section');
const resultsSection = document.getElementById('results-section');
const resetBtn = document.getElementById('reset-btn');
const themeToggle = document.getElementById('theme-toggle');
const downloadPdfBtn = document.getElementById('download-pdf-btn');
const saveSummaryBtn = document.getElementById('save-summary-btn');
const errorBox = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const errorClose = document.getElementById('error-close');

let currentFile = null;
let charts = {};
let lastAnalysisData = null;

// Theme Logic
//themeToggle.onclick = () => {
  //  document.body.classList.toggle('light-mode');
    //themeToggle.innerText = document.body.classList.contains('light-mode') ? "☀️" : "🌙";
    //localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
//};

//if (localStorage.getItem('theme') === 'light') {
  //  document.body.classList.add('light-mode');
    //themeToggle.innerText = "☀️";
//}

// File Selection
dropZone.onclick = () => fileInput.click();
fileInput.onchange = (e) => handleFile(e.target.files[0]);

function handleFile(file) {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx') {
        alert("Please upload a PDF or DOCX file.");
        return;
    }
    currentFile = file;
    filenameDisplay.innerText = `Selected: ${file.name}`;
    fileInfo.classList.remove('hidden');
    dropZone.classList.add('hidden');
    analyzeBtn.disabled = false;
}

// Upload and Analyze
analyzeBtn.disabled = true;
analyzeBtn.onclick = async () => {
    if (!currentFile) {
        showError("Please upload a file before analyzing.");
        return;
    }

    loader.classList.remove('hidden');
    errorBox.classList.add('hidden');
    analyzeBtn.disabled = true;

    try {
        const formData = new FormData();
        formData.append('file', currentFile);
        formData.append('job_description', document.getElementById('jd-input').value);

        const response = await fetch(`${API_BASE}/analyze`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.detail || "Server error occurred during analysis.");
        }

        if (data.error) {
            throw new Error(data.error);
        }

        lastAnalysisData = data;
        displayResults(data);

    } catch (err) {
        showError(err.message);
    } finally {
        loader.classList.add('hidden');
        analyzeBtn.disabled = false;
    }
};

function showError(msg) {
    errorText.innerText = msg;
    errorBox.classList.remove('hidden');
    loader.classList.add('hidden');
    analyzeBtn.disabled = false;
}

errorClose.onclick = () => {
    errorBox.classList.add('hidden');
    loader.classList.add('hidden');
    dropZone.classList.remove('hidden');
    fileInfo.classList.add('hidden');
    currentFile = null;
    fileInput.value = "";
    analyzeBtn.disabled = true;
};

function displayResults(data) {
    loader.classList.add('hidden');
    uploadSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');

    // Text Content
    document.getElementById('score-number').innerText ='ATS Score - ' + data.ats_score;
    document.getElementById('hiring-verdict').innerText = data.hiring_verdict;
    document.getElementById('summary-text').innerText = data.summary;
    document.getElementById('presence-tips').innerText = data.online_presence;

    // Skills Tags
    document.getElementById('current-skills').innerHTML = data.technical_skills.current_skills.map(s => `<span>${s}</span>`).join('');
    document.getElementById('missing-skills').innerHTML = data.technical_skills.missing_skills.map(s => `<span>${s}</span>`).join('');

    // Insights
    document.getElementById('strengths-list').innerHTML = data.strengths.map(s => `<li>${s}</li>`).join('');
    document.getElementById('weaknesses-list').innerHTML = data.weaknesses.map(s => `<li>${s}</li>`).join('');

    // Roadmap
    const recContainer = document.getElementById('recommendations-container');
    recContainer.innerHTML = `
        <p><strong>Suggested Roles:</strong> ${data.career_recommendations.suggested_roles.join(', ')}</p>
        <p style="margin-top:1rem"><strong>Certifications:</strong> ${data.career_recommendations.certifications.join(', ')}</p>
        <p style="margin-top:1rem"><strong>Actionable Fixes:</strong></p>
        <ul>${data.improvements.map(i => `<li>${i}</li>`).join('')}</ul>
    `;

    // Charts
    initCharts(data);
}

// Export Functions
downloadPdfBtn.onclick = async () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    const resultsGrid = document.querySelector('.results-grid');

    downloadPdfBtn.innerText = "Generating...";
    downloadPdfBtn.disabled = true;

    try {
        const canvas = await html2canvas(resultsGrid, {
            scale: 2,
            useCORS: true,
            backgroundColor: document.body.classList.contains('light-mode') ? '#f1f5f9' : '#0f172a',
            logging: false
        });

        const imgData = canvas.toDataURL('image/png');
        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        let position = 0;
        let leftHeight = pdfHeight;
        const pageHeight = doc.internal.pageSize.getHeight();

        while (leftHeight > 0) {
            doc.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
            leftHeight -= pageHeight;
            position -= pageHeight;
            if (leftHeight > 0) doc.addPage();
        }

        doc.save(`Resume_Analysis_${new Date().getTime()}.pdf`);
    } catch (err) {
        console.error("PDF Generation failed:", err);
        alert("Failed to generate PDF. Please try again.");
    } finally {
        downloadPdfBtn.innerText = "Download PDF Report";
        downloadPdfBtn.disabled = false;
    }
};

saveSummaryBtn.onclick = () => {
    if (!lastAnalysisData) return;

    const summaryContent = `
RESUME ANALYSIS SUMMARY
Generated on: ${new Date().toLocaleString()}
-------------------------------------------
ATS SCORE: ${lastAnalysisData.ats_score}/100
VERDICT: ${lastAnalysisData.hiring_verdict}

PROFESSIONAL SUMMARY:
${lastAnalysisData.summary}

KEY STRENGTHS:
${lastAnalysisData.strengths.map(s => `- ${s}`).join('\n')}

AREAS TO IMPROVE:
${lastAnalysisData.weaknesses.map(w => `- ${w}`).join('\n')}

RECOMMENDATIONS:
- Suggested Roles: ${lastAnalysisData.career_recommendations.suggested_roles.join(', ')}
- Certifications: ${lastAnalysisData.career_recommendations.certifications.join(', ')}

ONLINE PRESENCE TIPS:
${lastAnalysisData.online_presence}
    `;

    const blob = new Blob([summaryContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Resume_Summary_${new Date().getTime()}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
};

function initCharts(data) {
    // Destroy existing charts
    Object.values(charts).forEach(chart => chart.destroy());

    const isLight = document.body.classList.contains('light-mode');
    const textColor = isLight ? '#1e293b' : '#f8fafc';
    const gridColor = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)';

    // 1. ATS Score Doughnut
    charts.score = new Chart(document.getElementById('scoreChart'), {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [data.ats_score, 100 - data.ats_score],
                backgroundColor: ['#38bdf8', 'rgba(255,255,255,0.05)'],
                borderWidth: 0,
                circumference: 270,
                rotation: 225
            }]
        },
        options: {
            cutout: '80%',
            plugins: {
                tooltip: { enabled: false },
                legend: { display: false }
            },
            animation: { animateRotate: true, duration: 2000 }
        }
    });

    // 2. Skills Radar
    charts.radar = new Chart(document.getElementById('skillsRadarChart'), {
        type: 'radar',
        data: {
            labels: ['Technical', 'Leadership', 'Communication', 'Domain'],
            datasets: [{
                label: 'Score',
                data: Object.values(data.skills_balance),
                backgroundColor: 'rgba(56, 189, 248, 0.2)',
                borderColor: '#38bdf8',
                pointBackgroundColor: '#38bdf8'
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: { color: gridColor },
                    grid: { color: gridColor },
                    pointLabels: { color: textColor, font: { size: 12 } },
                    ticks: { display: false, max: 10 }
                }
            },
            plugins: { legend: { display: false } }
        }
    });

    // 3. Section Bar
    charts.bar = new Chart(document.getElementById('sectionBarChart'), {
        type: 'bar',
        data: {
            labels: ['Formatting', 'Keywords', 'Impact', 'Clarity'],
            datasets: [{
                data: Object.values(data.section_scores),
                backgroundColor: '#6366f1',
                borderRadius: 8
            }]
        },
        options: {
            indexAxis: 'y',
            scales: {
                x: { display: false, max: 10 },
                y: { 
                    grid: { display: false },
                    ticks: { color: textColor }
                }
            },
            plugins: { legend: { display: false } }
        }
    });
}

resetBtn.onclick = () => {
    resultsSection.classList.add('hidden');
    uploadSection.classList.remove('hidden');
    dropZone.classList.remove('hidden');
    fileInfo.classList.add('hidden');
    analyzeBtn.disabled = false;
    currentFile = null;
    fileInput.value = "";
    lastAnalysisData = null;
    errorBox.classList.add('hidden');
};
