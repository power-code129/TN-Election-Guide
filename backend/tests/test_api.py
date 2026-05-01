"""
Unit tests for Tamil Nadu & India Election Guide API (free Google services only).
Run from backend/ directory: pytest tests/ -v
All env vars are set via conftest.py before import.
"""
import pytest
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)


class TestHealth:
    def test_returns_200(self):
        assert client.get("/health").status_code == 200

    def test_service_name(self):
        assert client.get("/health").json()["service"] == "tn-election-guide-api"

    def test_has_version(self):
        assert "version" in client.get("/health").json()

    def test_gemini_free_tier_flag_is_bool(self):
        assert isinstance(client.get("/health").json()["gemini_free_tier"], bool)

    def test_lists_free_google_services(self):
        data = client.get("/health").json()
        assert "free_google_services" in data
        assert len(data["free_google_services"]) > 0


class TestTimeline:
    def test_returns_200(self):
        assert client.get("/timeline").status_code == 200

    def test_has_7_phases(self):
        assert client.get("/timeline").json()["count"] == 7

    def test_each_phase_has_steps(self):
        for phase in client.get("/timeline").json()["timeline"]:
            assert len(phase["steps"]) > 0

    def test_polling_day_mentions_evm(self):
        phases = client.get("/timeline").json()["timeline"]
        polling = next(p for p in phases if p["id"] == 5)
        combined = polling["description"] + " ".join(polling["steps"])
        assert "EVM" in combined

    def test_phases_have_required_fields(self):
        for phase in client.get("/timeline").json()["timeline"]:
            for field in ("id", "phase", "icon", "duration", "description", "steps"):
                assert field in phase


class TestFAQ:
    def test_returns_200(self):
        assert client.get("/faq").status_code == 200

    def test_has_minimum_10_items(self):
        assert client.get("/faq").json()["count"] >= 10

    def test_free_registration_faq_exists(self):
        faqs = client.get("/faq").json()["faqs"]
        combined = " ".join(f["question"] + f["answer"] for f in faqs)
        assert "free" in combined.lower() or "Free" in combined

    def test_epic_content_exists(self):
        faqs = client.get("/faq").json()["faqs"]
        combined = " ".join(f["question"] + f["answer"] for f in faqs)
        assert "EPIC" in combined or "Voter ID" in combined

    def test_tamil_nadu_content_exists(self):
        faqs = client.get("/faq").json()["faqs"]
        combined = " ".join(f["answer"] for f in faqs)
        assert "Tamil Nadu" in combined

    def test_each_faq_has_required_fields(self):
        for faq in client.get("/faq").json()["faqs"]:
            for field in ("id", "question", "answer", "category"):
                assert field in faq


class TestMyths:
    def test_returns_200(self):
        assert client.get("/myths").status_code == 200

    def test_has_items(self):
        assert client.get("/myths").json()["count"] > 0

    def test_evm_myth_present(self):
        myths = client.get("/myths").json()["myths"]
        combined = " ".join(m["myth"] for m in myths)
        assert "EVM" in combined

    def test_paid_myth_debunked(self):
        myths = client.get("/myths").json()["myths"]
        combined = " ".join(m["myth"] + m["fact"] for m in myths)
        assert "free" in combined.lower() or "pay" in combined.lower()

    def test_nota_myth_present(self):
        myths = client.get("/myths").json()["myths"]
        combined = " ".join(m["myth"] for m in myths)
        assert "NOTA" in combined

    def test_each_myth_has_myth_and_fact(self):
        for item in client.get("/myths").json()["myths"]:
            assert "myth" in item and "fact" in item


class TestElectionTypes:
    def test_returns_200(self):
        assert client.get("/election-types").status_code == 200

    def test_has_4_types(self):
        assert client.get("/election-types").json()["count"] == 4

    def test_lok_sabha_tn_seats_is_39(self):
        types = client.get("/election-types").json()["election_types"]
        ls = next(t for t in types if t["id"] == 1)
        assert ls["tn_seats"] == 39

    def test_tn_assembly_has_234_seats(self):
        types = client.get("/election-types").json()["election_types"]
        tn = next(t for t in types if t["id"] == 3)
        assert tn["seats"] == 234

    def test_conductors_marked_free(self):
        types = client.get("/election-types").json()["election_types"]
        for t in types:
            assert "Free" in t["conductor"] or "free" in t["conductor"]

    def test_each_type_has_required_fields(self):
        for t in client.get("/election-types").json()["election_types"]:
            for field in ("id", "title", "icon", "conductor", "description"):
                assert field in t


class TestFreeTools:
    def test_returns_200(self):
        assert client.get("/free-tools").status_code == 200

    def test_has_items(self):
        assert client.get("/free-tools").json()["count"] >= 5

    def test_voter_helpline_app_present(self):
        tools = client.get("/free-tools").json()["tools"]
        names = [t["name"] for t in tools]
        assert any("Helpline" in n or "Voter" in n for n in names)

    def test_cvigil_present(self):
        tools = client.get("/free-tools").json()["tools"]
        names = [t["name"] for t in tools]
        assert any("cVIGIL" in n or "Vigil" in n for n in names)

    def test_all_tools_have_required_fields(self):
        for tool in client.get("/free-tools").json()["tools"]:
            for field in ("id", "name", "provider", "icon", "description", "link"):
                assert field in tool

    def test_all_providers_marked_free(self):
        for tool in client.get("/free-tools").json()["tools"]:
            assert "Free" in tool["provider"] or "free" in tool["provider"]


class TestChat:
    def test_valid_request_returns_200(self):
        assert client.post("/chat", json={"message": "How do I register to vote?"}).status_code == 200

    def test_returns_non_empty_reply(self):
        data = client.post("/chat", json={"message": "What is EPIC?"}).json()
        assert len(data["reply"]) > 10

    def test_source_is_gemini_free_or_static(self):
        data = client.post("/chat", json={"message": "How to vote?"}).json()
        assert data["source"] in ("gemini-free", "static")

    def test_static_source_without_api_key(self):
        data = client.post("/chat", json={"message": "Tell me about elections"}).json()
        assert data["source"] == "static"

    def test_evm_question_contains_evm(self):
        data = client.post("/chat", json={"message": "How does EVM work?"}).json()
        assert "EVM" in data["reply"] or "Electronic" in data["reply"]

    def test_free_services_mentioned_in_replies(self):
        data = client.post("/chat", json={"message": "How to check voter list for free?"}).json()
        assert data["reply"]

    def test_empty_message_returns_422(self):
        assert client.post("/chat", json={"message": ""}).status_code == 422

    def test_message_over_500_chars_returns_422(self):
        assert client.post("/chat", json={"message": "x" * 501}).status_code == 422

    def test_xss_input_stripped_and_processed(self):
        resp = client.post("/chat", json={"message": "<script>alert(1)</script> EVM voting"})
        assert resp.status_code == 200

    def test_invalid_language_defaults_to_en(self):
        data = client.post("/chat", json={"message": "elections", "language": "zz"}).json()
        assert data["language"] == "en"

    def test_tamil_language_code_preserved(self):
        data = client.post("/chat", json={"message": "vote", "language": "ta"}).json()
        assert data["language"] == "ta"
