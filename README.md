# 📄 AI Resume Analyzer

An intelligent, AI-powered career assistant designed to bridge the gap between job seekers and Applicant Tracking Systems (ATS). This tool leverages Google's Gemini API to provide deep insights, skill gap analysis, and professional optimization tips for resumes.

---

## 🚀 Features

- **🎯 Intelligent ATS Scoring**: Get a quantifiable match score against specific job descriptions.
- **🛠 Skill Gap Analysis**: Automatically identifies current strengths and required missing skills.
- **💡 Actionable Insights**: Specific, targeted feedback on formatting, keyword optimization, and clarity.
- **📊 Interactive Visualization**: Dashboard featuring Doughnut charts for scores and Radar charts for skills balance.
- **📄 Professional Reporting**: Export your resume analysis as a clean, formatted PDF or a quick text summary.

---

## 🏗 Technology Stack

- **Backend**: Python, FastAPI, Google Generative AI (Gemini)
- **Frontend**: Vanilla JavaScript, Chart.js, HTML5, CSS3 (Glassmorphism UI)
- **Utilities**: PyPDF2, python-docx, python-dotenv

---

## 🛠 Getting Started

### Prerequisites
- Python 3.9+
- A Google Gemini API Key

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/ai-resume-analyzer.git
   cd ai-resume-analyzer
   ```

2. **Configure the Environment**:
   - Create a `.env` file in the project root:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Backend Setup**:
   ```bash
   cd backend
   python -m venv venv
   # Activate virtual environment
   .\venv\Scripts\activate  # Windows
   pip install -r requirements.txt
   ```

4. **Launch**:
   - Run the backend: `python main.py`
   - Open `frontend/index.html` in your web browser.

---

## ⚙️ Configuration
In `backend/main.py`, ensure the `UPLOAD_DIR` points to an absolute path valid for your environment:
```python
UPLOAD_DIR = "C:/Users/username/filename/backend/uploads"
```

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.

