# 🗳️ TN Election Guide

### Tamil Nadu & Indian Election Education Platform   

🔗 **Live Demo:** https://election-guide-2026.web.app/

**Conducted by Hack2skill & PromptWars in collaboration with Google for Developers**

\

> **Google Services Challenge — Election Process Education**
> A 100% free, AI-powered educational platform that helps Tamil Nadu and Indian citizens
> understand the democratic election process — from voter registration to government formation.
> Built using only free Google services with optional support for scalable cloud deployment.

---

## 👩‍💻 Developer

| Field         | Details                                                                  |
| ------------- | ------------------------------------------------------------------------ |
| **Name**      | Priyanka Gandhi A                                                        |
| **Degree**    | B.E Electronics and Communication Engineering                            |
| **College**   | Avinashilingam Institute for Home Science and Higher Education for Women |
| **Challenge** | Google Services Challenge — Election Process Education                   |
| **Vertical**  | Civic Education & Democratic Participation                               |

---

## 🆓 Free Google Services Used

| Service                  | Tier             | Purpose             |
| ------------------------ | ---------------- | ------------------- |
| **Google Gemini API**    | Free (AI Studio) | AI chat assistant   |
| **Google Fonts**         | Free             | Typography          |
| **Google Analytics GA4** | Free             | User insights       |
| **Firebase Hosting**     | Free Spark Plan  | Frontend deployment |

---

## 📌 Chosen Vertical

**Election Process Education — Civic Education & Democratic Participation**

Focuses on helping first-time voters understand:

* Voter registration (Form 6, EPIC)
* EVM & VVPAT usage
* Election types (Lok Sabha, Assembly, Panchayat)
* Free government services available to all citizens

---

## 💡 Approach & Logic

### Architecture

User → React Frontend → FastAPI Backend → Gemini API / Fallback

### Decision Flow

1. Try **Gemini API (free tier)**
2. If unavailable → use **offline knowledge base**
3. Always return a meaningful response (no failures)

---

## 🔍 How the Solution Works

* Interactive election timeline
* AI-powered Q&A chatbot
* EVM/VVPAT guide
* FAQs and myth-busting
* Free government tools integration

---

## 🚀 Deployment Note

The frontend is deployed using **Firebase Hosting (Free Spark Plan)**:
https://election-guide-2026.web.app/

The backend is designed for container-based deployment using Docker and supports scalable platforms such as Cloud Run.

Due to billing constraints, live backend deployment is not enabled.
To ensure uninterrupted user experience, the system includes a **smart offline fallback mechanism** that provides accurate election information even when AI services are unavailable.

---

## 📋 Assumptions

* Gemini API key is optional
* Free tiers are sufficient
* Backend can run locally or on free hosting
* App remains functional without external APIs

---

## 🗂️ Project Structure

```
election-guide/
├── README.md
├── Dockerfile
├── firebase.json
├── .gitignore
├── .env.example
├── backend/
└── frontend/
```

---

## 🛠️ Local Setup

### Backend

```
cd backend
pip install -r requirements.txt
uvicorn app:app --reload
```

### Frontend

```
cd frontend
npm install
npm run dev
```

---

## 🧪 Testing

* 38 unit tests
* Covers all endpoints
* Includes edge cases and validation

---

## 🔐 Security

* Input validation
* Environment variables
* CORS protection
* Rate limiting

---

## ⚡ Efficiency

* Lazy loading
* Async APIs
* Lightweight frontend

---

## ♿ Accessibility

* Semantic HTML
* Keyboard navigation
* ARIA labels
* Dark mode support

---

## 📋 Submission Checklist

* [x] Public repository
* [x] Single branch
* [x] < 10 MB
* [x] Clean structure
* [x] README complete

---

## 🏛️ Official Election Resources

* https://eci.gov.in
* https://voters.eci.gov.in
* Helpline: 1950

---

*Built with ❤️ in Tamil Nadu, India 🇮🇳*
*Priyanka Gandhi A*
