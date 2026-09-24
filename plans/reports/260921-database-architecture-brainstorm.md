# Brainstorm: VisualLab Database Architecture

**Date:** 2026-09-21

## Ideas Explored
- Pure SQL Relational mapping for each lab item: Dismissed due to extreme complexity in handling dynamic numbers of varied entities. Save/Load logic would be a nightmare.
- Hybrid SQL + NoSQL (PostgreSQL + MongoDB): Considered due to industry standards (Tinkercad), but dismissed as overly complex DevOps overhead for a project of this scale.
- PostgreSQL + JSONB: Evaluated as the optimal approach. Keeps relational structures for LMS features while treating the lab state as a NoSQL document.

## User's Direction
The user recognized the severe limitations of saving dynamic physics labs using traditional relational tables. They agreed with the "Save File" concept (storing a massive JSON blob) and approved the single-database PostgreSQL approach using `JSONB` for simplicity and power. They were heavily influenced by how Tinkercad and NOBOOK manage their internal states.

## Open Questions
- Does the system need real-time multi-user syncing (like Google Docs) for teachers observing students, or is it strictly "Work offline -> Submit"?
- Will the Backend need to parse the JSONB to auto-grade logic (e.g. "Did they connect Pos to Neg?"), or is grading manual/out of scope?

## Risks
- Data loss if the client sends a malformed JSON payload upon save.
- Payload size growing too large if users spam millions of particles, potentially hitting HTTP payload limits or JSONB index limits (though unlikely for normal usage).
