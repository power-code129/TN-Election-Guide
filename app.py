"""
Tamil Nadu & Indian Election Guide — FastAPI Backend
Free Google Services only:
  - Google Gemini API free tier (AI Studio, no billing required)
  - Google Fonts (served via frontend)
Author: Priyanka Gandhi A | B.E ECE | Avinashilingam Institute
"""

import os
import re
import time
import logging
from contextlib import asynccontextmanager
from typing import Optional
from collections import defaultdict

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, field_validator

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("tn_election_guide")

# ---------------------------------------------------------------------------
# Rate limiting (in-memory — no paid Redis needed)
# ---------------------------------------------------------------------------
RATE_LIMIT_REQUESTS = int(os.getenv("RATE_LIMIT_REQUESTS", "30"))
RATE_LIMIT_WINDOW = int(os.getenv("RATE_LIMIT_WINDOW", "60"))
_rate_store: dict[str, list[float]] = defaultdict(list)


def _check_rate_limit(client_ip: str) -> bool:
    now = time.time()
    window_start = now - RATE_LIMIT_WINDOW
    _rate_store[client_ip] = [t for t in _rate_store[client_ip] if t > window_start]
    if len(_rate_store[client_ip]) >= RATE_LIMIT_REQUESTS:
        return False
    _rate_store[client_ip].append(now)
    return True


# ---------------------------------------------------------------------------
# FREE Google Gemini API (AI Studio — no billing, 1,500 req/day free)
# Get your FREE key at: https://aistudio.google.com/app/apikey
# Free tier limits: 15 RPM, 1M tokens/min, 1500 requests/day
# ---------------------------------------------------------------------------
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = "gemini-1.5-flash"          # Free tier model
GEMINI_API_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    f"{GEMINI_MODEL}:generateContent"
)
GEMINI_SYSTEM = (
    "You are ElectionGuide AI — a friendly, neutral educational assistant helping "
    "Indian citizens, especially Tamil Nadu residents, understand elections. "
    "Cover: ECI, EPIC/Voter ID, EVM, VVPAT, Lok Sabha, Rajya Sabha, Tamil Nadu "
    "Assembly elections (234 seats), Panchayat/Municipal elections (TNSEC), "
    "Model Code of Conduct, District Election Officer, voter registration (Form 6), "
    "voter list search (electoralsearch.eci.gov.in), and counting process. "
    "Keep responses under 200 words. Be factual and non-partisan. "
    "Never discuss specific candidates, parties, or give political opinions."
)


async def _ask_gemini(message: str) -> Optional[str]:
    """Call Gemini free-tier API. Returns None on any failure → fallback used."""
    if not GEMINI_API_KEY:
        return None
    try:
        import httpx
        payload = {
            "system_instruction": {"parts": [{"text": GEMINI_SYSTEM}]},
            "contents": [{"parts": [{"text": message}]}],
            "generationConfig": {
                "maxOutputTokens": 300,
                "temperature": 0.4,
                "topP": 0.8,
            },
            "safetySettings": [
                {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
                {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            ],
        }
        async with httpx.AsyncClient(timeout=12.0) as client:
            resp = await client.post(
                f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
                json=payload,
            )
            resp.raise_for_status()
            data = resp.json()
            return data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as exc:
        logger.warning("Gemini free-tier call failed: %s", exc)
        return None


# ---------------------------------------------------------------------------
# India / Tamil Nadu Election Knowledge Base
# (Intelligent fallback — works with zero external dependencies)
# ---------------------------------------------------------------------------
ELECTION_KB: dict[str, str] = {
    "register": (
        "To register as a voter in India: (1) Visit voters.eci.gov.in or the Voter "
        "Helpline App (free). (2) Fill Form 6 for new registration. (3) Provide age proof "
        "(Aadhaar, birth certificate) and address proof. (4) A Booth Level Officer (BLO) "
        "will verify your details at home. (5) Receive your EPIC (Electoral Photo Identity "
        "Card / Voter ID) by post, or download the free e-EPIC digitally. "
        "Eligibility: Indian citizen, 18+ years, ordinarily resident."
    ),
    "epic": (
        "EPIC (Electoral Photo Identity Card) is the official free Voter ID issued by ECI. "
        "Apply via Form 6 at voters.eci.gov.in — completely free. "
        "Download your free e-EPIC (digital PDF) from the ECI portal. "
        "For lost/damaged card, apply for a free duplicate using Form 002. "
        "12 alternate IDs (Aadhaar, PAN, passport, etc.) also accepted at polling booths."
    ),
    "voter id": (
        "Your Voter ID (EPIC) is issued free by ECI. Apply online at voters.eci.gov.in "
        "using Form 6 at no cost. Submit age and address proof. A BLO verifies your "
        "application. Download free e-EPIC digitally or receive a physical card. "
        "In Tamil Nadu, check your registration free at elections.tn.gov.in."
    ),
    "voter list": (
        "Check Tamil Nadu voter list FREE: (1) electoralsearch.eci.gov.in — search by "
        "name, age, and constituency at no cost. (2) elections.tn.gov.in — Tamil Nadu "
        "CEO portal, free. (3) Free Voter Helpline App. (4) Call 1950 (free helpline). "
        "Draft rolls are published every January. Verify your name, photo, address, "
        "and polling booth — all free of charge."
    ),
    "evm": (
        "Voting in India uses free-to-use EVMs (Electronic Voting Machines): "
        "(1) Polling officer presses the Ballot Button on the Control Unit. "
        "(2) You press the Blue Button next to your chosen candidate on the Ballot Unit. "
        "(3) A beep confirms your vote. (4) The VVPAT machine prints a confirmation slip "
        "showing the candidate name and symbol — visible for 7 seconds. "
        "EVMs are made by BEL/ECIL, have no internet/Bluetooth, and are tamper-proof. "
        "No cost to vote — it is your free democratic right."
    ),
    "vvpat": (
        "VVPAT (Voter Verified Paper Audit Trail) is attached to every EVM at no cost "
        "to voters. After pressing your choice, a paper slip showing the candidate's name "
        "and party symbol is visible for 7 seconds, then drops into a sealed compartment. "
        "During counting, VVPAT slips from 5 randomly selected booths per assembly segment "
        "are verified against EVM counts for accuracy."
    ),
    "lok sabha": (
        "Lok Sabha is India's lower house of Parliament with 543 directly elected MPs. "
        "Tamil Nadu elects 39 Lok Sabha MPs. Elections every 5 years, fully free for "
        "citizens to participate. The party/alliance winning 272+ seats forms the Central "
        "Government. Conducted by ECI using EVM + VVPAT. Voter registration is free."
    ),
    "rajya sabha": (
        "Rajya Sabha is India's upper house (Council of States) with 245 members. "
        "Members are elected by State MLAs using Single Transferable Vote — not directly "
        "by citizens. Tamil Nadu sends 18 Rajya Sabha members with 6-year terms. "
        "One-third retire every 2 years. Rajya Sabha cannot be dissolved."
    ),
    "tamil nadu": (
        "Tamil Nadu Legislative Assembly (Vidhan Sabha) has 234 constituencies. "
        "Elections every 5 years — last held in 2021, next due in 2026. "
        "Party/alliance winning 118+ seats forms the Tamil Nadu Government. "
        "Key districts: Chennai (18 seats), Coimbatore, Madurai, Salem, Tiruchirappalli. "
        "Conducted free by ECI. Chief Electoral Officer (CEO) at elections.tn.gov.in."
    ),
    "panchayat": (
        "Tamil Nadu Panchayat and Municipal elections are conducted by TNSEC (Tamil Nadu "
        "State Election Commission) — free for citizens. Covers: Village Panchayats, "
        "Panchayat Unions, District Panchayats, Town Panchayats, Municipalities, and "
        "Corporations (Chennai, Coimbatore, Madurai, Tiruchirappalli, etc.). "
        "Reservations: 33-50% for women, SC/ST, and BC categories."
    ),
    "model code": (
        "Model Code of Conduct (MCC) is enforced free by ECI from election announcement "
        "to results. Key rules: (1) Government cannot announce new welfare schemes. "
        "(2) No use of government vehicles/officials for campaigning. "
        "(3) No hate speech or communal appeals. "
        "(4) Campaign silence 48 hours before polling. "
        "Report violations free to Returning Officer or call 1950."
    ),
    "count": (
        "Vote counting in India is free and transparent: "
        "(1) Held at a notified Counting Centre on ECI-announced date. "
        "(2) EVMs brought from strong rooms under security and CCTV. "
        "(3) Postal ballots counted first. "
        "(4) EVM results displayed round-by-round. "
        "(5) VVPAT slips from 5 random booths per assembly segment verified. "
        "(6) Returning Officer declares winner. Live results free at results.eci.gov.in."
    ),
    "result": (
        "After counting: (1) Returning Officers declare winners constituency-by-constituency. "
        "(2) Free live results at results.eci.gov.in. "
        "(3) For Lok Sabha: President invites majority leader to form government as PM. "
        "(4) For Tamil Nadu: Governor invites majority leader to become Chief Minister. "
        "(5) Cabinet sworn in at Raj Bhavan (Chennai) or Rashtrapati Bhavan (Delhi)."
    ),
    "district election officer": (
        "The District Election Officer (DEO) — usually the District Collector — manages "
        "elections at the district level for free: updating electoral rolls, setting up "
        "polling booths (including model booths and PwD-accessible booths), deploying "
        "police/paramilitary, managing EVM/VVPAT logistics, enforcing MCC, and overseeing "
        "counting centres. In Tamil Nadu, DEO reports to CEO at elections.tn.gov.in."
    ),
    "nomination": (
        "To contest an election in India: (1) Get nomination form from Returning Officer. "
        "(2) File within nomination period. (3) Submit Form 26 — affidavit of assets, "
        "liabilities, criminal record, educational qualifications. "
        "(4) Pay security deposit: ₹25,000 (Lok Sabha), ₹10,000 (State Assembly); "
        "half rate for SC/ST candidates. (5) Nomination scrutiny by RO. "
        "(6) Withdrawal allowed within notified period."
    ),
    "nota": (
        "NOTA (None Of The Above) is a free option on every EVM since 2013. "
        "It allows you to reject all candidates while still exercising your vote. "
        "Press the NOTA button (last option on the Ballot Unit) if you don't want "
        "to vote for any candidate. Note: Even if NOTA gets the most votes, the "
        "candidate with the next highest votes wins — NOTA does not trigger a re-election "
        "under current Indian law. Using NOTA is a valid, completely legal choice."
    ),
    "e-epic": (
        "e-EPIC is the free digital version of your Voter ID card. Download it at: "
        "(1) voters.eci.gov.in — free login with mobile number. "
        "(2) Voter Helpline App — free download on Android/iOS. "
        "The e-EPIC is a PDF stored on your phone and is accepted at polling booths "
        "as valid photo identity. No printing required. Completely free service by ECI."
    ),
    "helpline": (
        "Free election helplines in India: "
        "(1) 1950 — National Voter Helpline (free call, available in multiple languages). "
        "(2) voters.eci.gov.in — free online portal for all voter services. "
        "(3) Voter Helpline App — free Android/iOS app by ECI. "
        "(4) elections.tn.gov.in — free Tamil Nadu CEO portal. "
        "(5) cVIGIL App — free app to report MCC violations with photo/video evidence. "
        "All these services are provided free by the Government of India."
    ),
}


def _get_static_response(message: str) -> str:
    """Intelligent keyword-matching fallback — works with zero API calls."""
    msg = message.lower()
    for keyword, answer in ELECTION_KB.items():
        if keyword in msg:
            return answer
    return (
        "Great question about Indian elections! I can help you understand these topics — "
        "all free and accessible to every citizen: "
        "voter registration (Form 6 / free EPIC / e-EPIC), checking the voter list "
        "(free at electoralsearch.eci.gov.in), EVM and VVPAT voting, Lok Sabha elections, "
        "Tamil Nadu Assembly elections (234 seats), Panchayat/Municipal elections, "
        "Model Code of Conduct, District Election Officer's role, NOTA, vote counting, "
        "and results. Call the free Voter Helpline 1950 for any assistance. "
        "What would you like to know more about?"
    )


# ---------------------------------------------------------------------------
# Static data — India / Tamil Nadu specific
# ---------------------------------------------------------------------------
TIMELINE = [
    {
        "id": 1, "phase": "Voter Registration", "icon": "📋",
        "duration": "Ongoing — deadline ~30 days before polling",
        "description": (
            "Register FREE using Form 6 at voters.eci.gov.in or the free Voter Helpline App. "
            "BLO verifies at home and free EPIC (Voter ID) is issued. "
            "Download free e-EPIC digitally from ECI portal."
        ),
        "steps": [
            "Check eligibility: citizen, 18+, resident",
            "Fill Form 6 FREE at voters.eci.gov.in or Voter Helpline App",
            "Upload age proof + address proof (Aadhaar/Passport)",
            "BLO visits home for free field verification",
            "Receive free EPIC card or download free e-EPIC",
        ],
    },
    {
        "id": 2, "phase": "Election Announcement & MCC", "icon": "📢",
        "duration": "4–6 weeks before polling",
        "description": (
            "ECI announces schedule free via press conference and eci.gov.in. "
            "Model Code of Conduct (MCC) comes into force — no new government schemes, "
            "no misuse of official machinery."
        ),
        "steps": [
            "ECI announces polling dates (free public announcement)",
            "MCC enforced — no new welfare schemes by government",
            "Parties register manifestos with ECI",
            "Returning Officers issue formal notifications",
            "cVIGIL App activated for free MCC violation reporting",
        ],
    },
    {
        "id": 3, "phase": "Candidate Nomination", "icon": "🏛️",
        "duration": "5–7 day window",
        "description": (
            "Candidates file nomination with the Returning Officer along with Form 26 "
            "(affidavit), security deposit (₹25,000 LS / ₹10,000 Assembly), "
            "and party symbol allocation."
        ),
        "steps": [
            "Obtain nomination form from Returning Officer",
            "File Form 26 — affidavit of assets & criminal record",
            "Pay security deposit (half rate for SC/ST candidates)",
            "Scrutiny by Returning Officer",
            "Withdrawal period — final candidate list published free on ECI site",
        ],
    },
    {
        "id": 4, "phase": "Campaign Period", "icon": "🗣️",
        "duration": "2–3 weeks",
        "description": (
            "Candidates campaign through rallies, media, and social media within ECI expenditure "
            "limits. Ends 48 hours before polling (silence period). "
            "ECI's free cVIGIL App lets citizens report violations."
        ),
        "steps": [
            "Public rallies and corner meetings",
            "TV/radio debates and newspaper ads",
            "Social media campaigns (MCMC monitored by ECI)",
            "Expenditure monitored by election observers",
            "Silence period 48 hours before polls",
        ],
    },
    {
        "id": 5, "phase": "Polling Day", "icon": "🗳️",
        "duration": "7 AM – 6 PM",
        "description": (
            "Voters bring free EPIC or approved alternate ID to assigned polling booth. "
            "Polling officer verifies, applies indelible ink, and voter casts secret vote on EVM. "
            "Free VVPAT confirms your choice. Voting is a free democratic right."
        ),
        "steps": [
            "Bring free EPIC (e-EPIC) or any 1 of 12 approved photo IDs",
            "Polling officer checks electoral roll (free public register)",
            "Indelible ink applied to left index finger",
            "Press Blue Button on EVM for your choice",
            "VVPAT slip visible 7 seconds — vote confirmed free of charge",
        ],
    },
    {
        "id": 6, "phase": "Vote Counting", "icon": "🔢",
        "duration": "ECI-notified counting day",
        "description": (
            "EVMs from strong rooms moved to counting centre. Postal ballots counted first, "
            "then EVM rounds. VVPAT slips verified from 5 random booths per assembly segment. "
            "Free live results at results.eci.gov.in."
        ),
        "steps": [
            "EVMs moved from strong rooms under CCTV + security",
            "Postal ballots counted first",
            "EVM count displayed round-by-round",
            "VVPAT verification — 5 random booths per segment",
            "Returning Officer declares winner; free results at results.eci.gov.in",
        ],
    },
    {
        "id": 7, "phase": "Government Formation", "icon": "🏛️",
        "duration": "Days after results",
        "description": (
            "Majority party/alliance forms government. For Tamil Nadu: Governor invites CM; "
            "cabinet sworn in at Raj Bhavan. For Lok Sabha: President invites PM; "
            "cabinet sworn in at Rashtrapati Bhavan."
        ),
        "steps": [
            "Majority identified (118+ TN / 272+ LS)",
            "Governor/President invites majority leader",
            "Floor test if coalition required",
            "Cabinet ministers appointed and sworn in",
            "New government begins 5-year term",
        ],
    },
]

FAQS = [
    {
        "id": 1,
        "question": "Is voter registration free in India?",
        "answer": (
            "Yes, completely free. Register at voters.eci.gov.in or via the free Voter Helpline App "
            "(Android/iOS). Fill Form 6 online at no cost. A BLO visits your home for free verification. "
            "Your EPIC (Voter ID) is issued free, and the e-EPIC digital version is also free to download."
        ),
        "category": "Registration",
    },
    {
        "id": 2,
        "question": "How do I download my free e-EPIC (digital Voter ID)?",
        "answer": (
            "Visit voters.eci.gov.in and log in with your registered mobile number — completely free. "
            "Or use the free Voter Helpline App (download free on Android/iOS). The e-EPIC is a PDF "
            "you can store on your phone and is accepted at polling booths as valid photo identity. No cost."
        ),
        "category": "Voter ID / EPIC",
    },
    {
        "id": 3,
        "question": "How do I check my name in the Tamil Nadu voter list for free?",
        "answer": (
            "Free options: (1) electoralsearch.eci.gov.in — search free by name, age, constituency. "
            "(2) elections.tn.gov.in — Tamil Nadu CEO free portal. "
            "(3) Free Voter Helpline App (Android/iOS). (4) Call 1950 — free national voter helpline. "
            "(5) Check display rolls at your nearest government office."
        ),
        "category": "Voter List",
    },
    {
        "id": 4,
        "question": "Can I use Aadhaar instead of Voter ID at the polling booth?",
        "answer": (
            "Yes. ECI accepts 12 alternative photo IDs at polling booths — all free to obtain or already held: "
            "Aadhaar card, passport, driving licence, PAN card, MNREGA job card, bank/post office passbook "
            "with photo, service ID cards (Central/State govt), smart card by RGI, and others notified by ECI."
        ),
        "category": "Voting",
    },
    {
        "id": 5,
        "question": "What is the difference between Lok Sabha and TN Assembly elections?",
        "answer": (
            "Lok Sabha: 543 national constituencies; elects MPs; 272+ seats = Central Government. "
            "Tamil Nadu Assembly: 234 state constituencies; elects MLAs; 118+ seats = State Government. "
            "Both are free for citizens to vote in, use EVM+VVPAT, and are conducted by ECI. "
            "Both are held every 5 years."
        ),
        "category": "Types of Elections",
    },
    {
        "id": 6,
        "question": "How are Panchayat elections different in Tamil Nadu?",
        "answer": (
            "Tamil Nadu Panchayat and Municipal elections are conducted by TNSEC (Tamil Nadu State Election "
            "Commission) — not ECI. Free for citizens to vote. Covers village panchayats, panchayat unions, "
            "district panchayats, municipalities, and corporations. Women reservation: 33–50%. "
            "Check TNSEC free portal for local election info."
        ),
        "category": "Local Body",
    },
    {
        "id": 7,
        "question": "What free tools can I use to report election violations?",
        "answer": (
            "Free reporting tools by ECI: (1) cVIGIL App — free Android/iOS app to report MCC violations "
            "with photo/video, location tagged automatically. (2) 1950 Voter Helpline — free call. "
            "(3) PVMS (Postal Voting Management System) for postal ballot tracking. "
            "(4) Saksham App — free app for PwD voters to request assistance at booths."
        ),
        "category": "Free Tools",
    },
    {
        "id": 8,
        "question": "What if my EPIC is lost? How do I get a free replacement?",
        "answer": (
            "Apply for a free duplicate EPIC using Form 002 at voters.eci.gov.in — no charge. "
            "Alternatively, download the free e-EPIC (digital PDF Voter ID) from the same portal "
            "by verifying your registered mobile number. The e-EPIC is completely free and "
            "accepted at all polling booths."
        ),
        "category": "Voter ID / EPIC",
    },
    {
        "id": 9,
        "question": "What is NOTA and how do I use it?",
        "answer": (
            "NOTA (None Of The Above) is a free option on every EVM since 2013. It appears as the "
            "last option on the Ballot Unit. Press it if you don't want to vote for any candidate. "
            "Your vote is counted as NOTA and kept secret. Note: Even if NOTA gets the most votes, "
            "the candidate with the next highest count wins — NOTA doesn't trigger a re-election."
        ),
        "category": "Voting",
    },
    {
        "id": 10,
        "question": "What is the role of the District Election Officer in Tamil Nadu?",
        "answer": (
            "The DEO (usually the District Collector) manages all free election services at district level: "
            "updating electoral rolls, setting up polling booths (including free model booths and "
            "PwD-accessible booths), security deployment, EVM/VVPAT logistics, MCC enforcement, "
            "and counting centre operations. Reports to CEO Tamil Nadu at elections.tn.gov.in."
        ),
        "category": "Administration",
    },
]

MYTHS = [
    {
        "id": 1,
        "myth": "EVMs can be hacked or tampered remotely",
        "fact": (
            "India's EVMs have zero internet, Wi-Fi, Bluetooth, or network connectivity. "
            "Standalone machines made by BEL/ECIL under strict ECI supervision. "
            "Supreme Court and multiple technical expert committees confirmed their integrity. "
            "VVPAT provides a free paper audit trail that any party agent can witness."
        ),
    },
    {
        "id": 2,
        "myth": "One vote doesn't matter in Tamil Nadu",
        "fact": (
            "Several Tamil Nadu assembly constituencies have been decided by under 500 votes. "
            "In 2021 TN elections, multiple segments had margins under 1,000 votes. "
            "Your single free vote can be the deciding factor in your constituency."
        ),
    },
    {
        "id": 3,
        "myth": "You must pay or know someone to get a Voter ID",
        "fact": (
            "Voter registration and EPIC are completely free — no middlemen needed. "
            "Register free at voters.eci.gov.in or call the free 1950 helpline. "
            "A Booth Level Officer visits your home for free verification. "
            "Report any official asking for money to the free cVIGIL App or 1950."
        ),
    },
    {
        "id": 4,
        "myth": "Indelible ink can be washed off to vote twice",
        "fact": (
            "Indelible ink contains silver nitrate and penetrates beneath the skin — "
            "it cannot be washed off. Remains visible 2–4 weeks. "
            "Attempting to vote twice is a criminal offence under Section 171D IPC "
            "with up to 1 year imprisonment."
        ),
    },
    {
        "id": 5,
        "myth": "NOTA majority means the election is re-held",
        "fact": (
            "NOTA (None Of The Above) was introduced free on all EVMs in 2013. "
            "Even if NOTA gets the highest votes, the candidate with the next highest count wins. "
            "NOTA does not trigger a re-election under current Indian law — "
            "but it sends a strong message to political parties."
        ),
    },
]

INDIA_ELECTION_TYPES = [
    {
        "id": 1,
        "title": "Lok Sabha Elections",
        "subtitle": "Parliament of India — Lower House",
        "icon": "🏛️",
        "seats": 543,
        "frequency": "Every 5 years",
        "conductor": "ECI (Free)",
        "tn_seats": 39,
        "description": (
            "Lok Sabha is India's lower house with 543 directly elected MPs. "
            "Tamil Nadu elects 39 MPs. Free for all registered voters. "
            "Party/alliance winning 272+ seats forms the Central Government."
        ),
    },
    {
        "id": 2,
        "title": "Rajya Sabha Elections",
        "subtitle": "Council of States — Upper House",
        "icon": "🏅",
        "seats": 245,
        "frequency": "Biennial (1/3 retire every 2 years)",
        "conductor": "ECI (Free)",
        "tn_seats": 18,
        "description": (
            "Rajya Sabha members are elected by State MLAs using Single Transferable Vote "
            "— not directly by citizens. Tamil Nadu sends 18 members with 6-year terms. "
            "Cannot be dissolved. ECI conducts this free of charge."
        ),
    },
    {
        "id": 3,
        "title": "Tamil Nadu Assembly",
        "subtitle": "Vidhan Sabha — 234 Constituencies",
        "icon": "⚖️",
        "seats": 234,
        "frequency": "Every 5 years",
        "conductor": "ECI (Free)",
        "tn_seats": 234,
        "description": (
            "234 assembly constituencies in Tamil Nadu, each electing one MLA. "
            "Party/alliance winning 118+ seats forms the State Government. "
            "Last election: 2021. Next due: 2026. ECI conducts this free."
        ),
    },
    {
        "id": 4,
        "title": "Panchayat / Municipal",
        "subtitle": "Local Body — Urban & Rural Tamil Nadu",
        "icon": "🏘️",
        "seats": None,
        "frequency": "Every 5 years",
        "conductor": "TNSEC (Free)",
        "tn_seats": None,
        "description": (
            "Conducted free by TNSEC (Tamil Nadu State Election Commission). "
            "Covers Village Panchayats, Panchayat Unions, District Panchayats, "
            "Municipalities, and Corporations. Seat reservations for SC/ST, women (33-50%), and OBC."
        ),
    },
]

FREE_TOOLS = [
    {
        "id": 1,
        "name": "Voter Helpline App",
        "provider": "ECI (Free)",
        "icon": "📱",
        "description": "Official free ECI app — register, find booth, download e-EPIC, track status",
        "link": "https://play.google.com/store/apps/details?id=com.eci.citizen",
        "platform": "Android / iOS",
    },
    {
        "id": 2,
        "name": "cVIGIL App",
        "provider": "ECI (Free)",
        "icon": "📸",
        "description": "Report MCC violations with photo/video. Location auto-tagged. 100-minute resolution.",
        "link": "https://play.google.com/store/apps/details?id=in.nic.cvigil",
        "platform": "Android / iOS",
    },
    {
        "id": 3,
        "name": "Saksham App",
        "provider": "ECI (Free)",
        "icon": "♿",
        "description": "Free app for PwD voters — request wheelchair, assistance, and accessibility at booth",
        "link": "https://play.google.com/store/apps/details?id=in.gov.eci.saksham",
        "platform": "Android / iOS",
    },
    {
        "id": 4,
        "name": "voters.eci.gov.in",
        "provider": "ECI (Free)",
        "icon": "🌐",
        "description": "Register, check list, download free e-EPIC, update address — all free online",
        "link": "https://voters.eci.gov.in",
        "platform": "Web (Free)",
    },
    {
        "id": 5,
        "name": "1950 Voter Helpline",
        "provider": "ECI (Free Call)",
        "icon": "📞",
        "description": "Free national helpline for all election queries — multilingual, available during elections",
        "link": "tel:1950",
        "platform": "Phone (Free)",
    },
    {
        "id": 6,
        "name": "elections.tn.gov.in",
        "provider": "TN CEO (Free)",
        "icon": "🏛️",
        "description": "Tamil Nadu Chief Electoral Officer — free voter services, results, booth finder",
        "link": "https://elections.tn.gov.in",
        "platform": "Web (Free)",
    },
]


# ---------------------------------------------------------------------------
# App lifecycle
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(
        "TN Election Guide API starting. Gemini free tier: %s",
        "enabled" if GEMINI_API_KEY else "disabled (using static fallback — no API key needed)",
    )
    yield
    logger.info("TN Election Guide API shutting down.")


app = FastAPI(
    title="Tamil Nadu & India Election Guide API",
    description=(
        "Educational API for Indian and Tamil Nadu elections. "
        "Uses only FREE Google services (Gemini free tier, Google Fonts). "
        "Built by Priyanka Gandhi A | B.E ECE | Avinashilingam Institute."
    ),
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# Middleware
# ---------------------------------------------------------------------------
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000,http://localhost:8080,http://127.0.0.1:5173",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)


@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    if request.method == "POST":
        client_ip = request.headers.get("X-Forwarded-For", request.client.host)
        client_ip = client_ip.split(",")[0].strip()
        if not _check_rate_limit(client_ip):
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={"detail": "Too many requests. Please wait a moment."},
            )
    return await call_next(request)


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------
class ChatRequest(BaseModel):
    message: str
    language: Optional[str] = "en"

    @field_validator("message")
    @classmethod
    def validate_message(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Message cannot be empty.")
        if len(v) > 500:
            raise ValueError("Message too long (max 500 characters).")
        v = re.sub(r"[<>\"'`]", "", v)
        return v

    @field_validator("language")
    @classmethod
    def validate_language(cls, v: str) -> str:
        if v not in {"en", "ta", "hi", "fr", "es", "de", "pt", "ar"}:
            return "en"
        return v


class ChatResponse(BaseModel):
    reply: str
    source: str   # "gemini-free" | "static"
    language: str


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.get("/health", tags=["System"])
async def health():
    return {
        "status": "healthy",
        "service": "tn-election-guide-api",
        "version": "2.0.0",
        "gemini_free_tier": bool(GEMINI_API_KEY),
        "free_google_services": ["Gemini API free tier", "Google Fonts"],
    }


@app.get("/timeline", tags=["Content"])
async def get_timeline():
    return {"timeline": TIMELINE, "count": len(TIMELINE)}


@app.get("/faq", tags=["Content"])
async def get_faq():
    return {"faqs": FAQS, "count": len(FAQS)}


@app.get("/myths", tags=["Content"])
async def get_myths():
    return {"myths": MYTHS, "count": len(MYTHS)}


@app.get("/election-types", tags=["Content"])
async def get_election_types():
    return {"election_types": INDIA_ELECTION_TYPES, "count": len(INDIA_ELECTION_TYPES)}


@app.get("/free-tools", tags=["Content"])
async def get_free_tools():
    """Returns all free ECI tools and resources for voters."""
    return {"tools": FREE_TOOLS, "count": len(FREE_TOOLS)}


@app.post("/chat", response_model=ChatResponse, tags=["AI"])
async def chat(request: ChatRequest):
    """
    AI chat endpoint.
    First tries Gemini free tier (AI Studio, no billing required).
    Falls back to curated knowledge base if Gemini is unavailable.
    """
    logger.info("Chat (lang=%s): %s", request.language, request.message[:80])
    gemini_reply = await _ask_gemini(request.message)
    if gemini_reply:
        return ChatResponse(
            reply=gemini_reply.strip(),
            source="gemini-free",
            language=request.language,
        )
    return ChatResponse(
        reply=_get_static_response(request.message),
        source="static",
        language=request.language,
    )


# ---------------------------------------------------------------------------
# Error handlers
# ---------------------------------------------------------------------------
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled error: %s", exc, exc_info=True)
    return JSONResponse(status_code=500, content={"detail": "An internal error occurred."})
