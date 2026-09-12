# 🛡️ Cybersecurity Architecture & Security Controls Documentation

### Project: Vibarua Marketplace
**Domain:** Secure Software Development Lifecycle (SSDLC) & Application Security (AppSec)  
**Target Audience:** Project Presentation, Technical Defense, and Academic Review  
**Framework Alignment:** OWASP Top 10 (2021) & NIST Cybersecurity Framework (CSF)

---

## Executive Summary
This document provides a comprehensive technical specification of all defensive cybersecurity mechanisms engineered into the **Vibarua Marketplace** web application. Built according to defense-in-depth principles, the system incorporates identity protection, input validation, cryptographic storage, rate-limiting, secure file upload pipelines, centralized audit logging, role-based access control, and proactive sensitive credential redaction.

---

## 1. Identity & Access Management (IAM)

### 🔑 User Authentication & Stateful Access Gate
- **Mechanism:** Secure credential-based authentication using email and password via `/api/auth/login`.
- **Pre-Authentication Account Standing Check:** Prior to issuing an authorization token, the backend inspects the user's account state:
  - If `user.isBlocked === true` or `user.isActive === false`, authentication is actively terminated with an HTTP `403 Forbidden` response.
  - Automatically records a security warning audit log (`LOGIN_FAILED` with reason `Account suspended`) while preventing token creation.

### 🔒 Cryptographic Password Security
- **Implementation:** Salted password hashing via `bcryptjs` with cryptographically secure pseudo-random salt generation.
- **Work Factor:** Salt cost factor configured to **10 rounds**, providing computational resistance against modern GPU/ASIC offline password cracking.
- **Threats Mitigated:**
  - Plaintext credential exposure
  - Rainbow table lookups
  - Offline dictionary and brute-force attacks in the event of database exfiltration
- **Field Projection:** Database queries systematically exclude the password hash (`.select('-password')`), guaranteeing that password hashes are never serialized over HTTP or exposed to client-side state.

### 👤 Role-Based Access Control (RBAC) & Least Privilege
- **Authorization Tiers:** Three distinct roles: `client`, `worker`, and `admin`.
- **Route-Level Enforcement:** Implemented via higher-order middleware `authorize('admin')`.
- **Privilege Separation:** Administrative endpoints (`/api/admin/*`) strictly reject client or worker sessions with `403 Forbidden`, mitigating Broken Object Level Authorization (BOLA) and privilege escalation vulnerabilities.

### 🎫 JWT Authorization & Live Database State Verification
- **Token Mechanism:** Stateless JSON Web Tokens signed using HMAC-SHA256 (`HS256`) with a 30-day validity window.
- **Live State Verification:** Standard stateless JWT architectures suffer from "token linger" vulnerability (tokens remain valid even after an admin bans a user until token expiry). In this system, the `protect` middleware cross-references the decoded token with the live MongoDB record on **every authenticated request**:
  - Validates user existence in the database.
  - Asserts `user.isBlocked === false` and `user.isActive !== false`.
- **Security Guarantee:** When an administrator suspends or deactivates a user, all active sessions and existing tokens are **immediately neutralized** across the platform without waiting for JWT token expiration.

---

## 2. Input Validation, Data Sanitization & Type Enforcement

### 🛡️ Server-Side Schema Validation & Type Constraints (Mongoose)
Authoritative server-side validation rejecting invalid, malformed, or malicious data payloads before reaching database storage:
- **Normalization (`lowercase: true`):** Normalizes email addresses to lowercase, preventing case-sensitivity authentication bypasses and duplicate account spoofing (e.g., `User@domain.com` vs `user@domain.com`).
- **Whitespace Sanitization (`trim: true`):** Automatically trims leading/trailing whitespace across all text fields (full name, email, bio, profession, comments), neutralizing whitespace manipulation attacks.
- **Length Boundaries:** Enforces minimum password length (`minlength: 6`) and maximum string length limits (`maxlength: 500` on bio and review comments), preventing buffer stuffing and database payload exhaustion.
- **Strict Value Enumeration (Whitelisting):** Restricts user roles to `['client', 'worker', 'admin']` and review ratings to numeric values between `1` and `5`. Any unexpected value triggers a Mongoose validation rejection.
- **Numeric Range Guards:** Restricts experience to `min: 0` and rating calculations to `min: 0, max: 5`, eliminating negative integer manipulation.

### 📱 Client-Side Form Validation & Real-Time Strength Metering
- **Interactive Password Strength Meter:** Evaluates passwords against 6 criteria (length &ge; 8, length &ge; 12, uppercase letters, lowercase letters, numbers, and special symbols) with real-time visual color feedback.
- **Confirmation Matching:** Validates password confirmation equality prior to network dispatch (`password === confirmPassword`).
- **Input Bounds:** HTML5 input types (`type="email"`, `type="number"`) and native field constraints.

### 🔍 Query Parameter Sanitization & Boundary Handling
- **Safe Integer Parsing:** Query parameters for pagination are defensively parsed with strict fallback limits (`parseInt(req.query.page) || 1`, `parseInt(req.query.limit) || 10`) preventing NaN or infinite pagination queries.
- **Search Sanitization:** Administrative user and audit searches sanitize user input strings before regex evaluation.

---

## 3. Threat Mitigation & Defensive Architecture

### 🚦 Multi-Tiered Rate Limiting & DoS / Brute-Force Defense
Engineered using `express-rate-limit` with tiered thresholds mapped to endpoint risk profiles:

1. **Authentication Limiter (`authLimiter`):**
   - **Threshold:** Maximum **5 requests per 15-minute window** per IP address on `/api/auth/login` and `/api/auth/register`.
   - **Threats Mitigated:** Automated credential stuffing, password spraying, and brute-force attacks.
2. **General API Limiter (`generalLimiter`):**
   - **Threshold:** Maximum **100 requests per 15-minute window** per IP applied globally to `/api/*`.
   - **Threats Mitigated:** Layer-7 Denial of Service (DoS), resource exhaustion, and rapid automated API scraping.
3. **Automated Threat Event Trigger:**
   - Exceeding the authentication rate limit triggers an automatic audit entry (`RATE_LIMIT_EXCEEDED`) recording the offending IP address, User-Agent, HTTP method, and requested endpoint for forensic analysis.

---

## 4. Secure File Uploads & Media Handling

### ☁️ Cloud-Isolated File Uploads & MIME Whitelisting
Prevents file upload vulnerabilities, Remote Code Execution (RCE), and server filesystem compromise:
- **Strict Extension / Format Whitelist:** Only image formats are accepted (`['jpg', 'jpeg', 'png', 'gif', 'webp']`). Executable extensions (`.exe`, `.php`, `.sh`, `.js`, `.py`, `.html`) are strictly rejected.
- **Decoupled Cloud Storage:** Uploaded media is streamed directly to Cloudinary CDN storage rather than stored on the local web server filesystem, completely eliminating **Local File Inclusion (LFI)** and web shell attacks.
- **Image Re-encoding & Neutralization:** Images undergo server-side transformation (`{ width: 500, height: 500, crop: 'fill', quality: 'auto' }`). Re-encoding strips embedded EXIF metadata payloads, malicious polyglot scripts, and ImageTragick exploits.
- **Multer Error Boundary:** Dedicated error handling middleware intercepts file size and upload exceptions gracefully without crashing the server process.

---

## 5. Account Integrity, Suspension & Soft Deactivation

### 🛡️ Administrative Account Suspension (Block / Unblock)
- **Granular Control:** Administrators can immediately toggle account suspension (`isBlocked: Boolean`, `blockReason: String`).
- **Forensic Accountability:** Persists the `blockedAt` timestamp and the administrative actor's ID (`blockedBy`).
- **Self-Lockout Prevention:** Enforces hardcoded logic preventing administrators from suspending or deactivating their own accounts (`req.userId === id`), eliminating administrative lockout attacks or operational errors.

### 🗄️ Soft Deactivation / Soft Deletion (Forensic Integrity & Non-Repudiation)
- **Principle:** Accounts are deactivated (`isActive: false`) rather than permanently purged (`findByIdAndDelete`).
- **Cybersecurity & Compliance Value:**
  - **Preserves Forensic Audit Trails:** Ensures historical audit logs, reviews, and job requests maintain referential integrity.
  - **Non-Repudiation:** Malicious actors cannot erase evidence of illicit platform activity or policy violations by attempting account deletion.

---

## 6. Security Auditing, Accountability & Sensitive Data Redaction

### 📝 Centralized Security Audit Logging (`AuditLog`)
A dedicated, immutable audit logging subsystem recording critical lifecycle and security events into MongoDB.
- **Tracked Actions:** `LOGIN_SUCCESS`, `LOGIN_FAILED`, `USER_REGISTERED`, `LOGOUT`, `ACCOUNT_BLOCKED`, `ACCOUNT_UNBLOCKED`, `ACCOUNT_DEACTIVATED`, `ACCOUNT_REACTIVATED`, `RATE_LIMIT_EXCEEDED`, `ADMIN_ACTION`.
- **Forensic Context Captured:** Actor User ID, real client IP address (supporting proxy/load-balancer headers via `x-forwarded-for`), User-Agent header, UTC timestamp, outcome status (`success`, `failure`, `warning`), and context metadata.
- **Compound Database Indexing:** Indexed on `(userId, timestamp)` and `(action, timestamp)` for high-performance forensic querying.
- **Append-Only Integrity:** Audit logs can only be created by system events; there are no public or administrative update/delete endpoints.

### 🔒 Automated Recursive Credential Redaction (`sanitizeDetails`)
- **Recursive Masking Engine:** Any data passed to the audit logger is recursively sanitized across all nested objects and arrays.
- **Key Redaction:** Any key matching `/password|token|jwt|secret|apiKey|auth|bearer|cookie|credential/i` is masked to `[REDACTED]`.
- **Signature Detection:** Identifies raw Bearer authorization strings and JWT signatures (`eyJ...`) and masks them to `[REDACTED_TOKEN]`.
- **Security Guarantee:** Guarantees that raw passwords, password hashes, and active session tokens are never persisted in logs, terminal outputs, or third-party monitoring services.

---

## 7. Network, Transport & Configuration Hardening

### 🌐 Strict CORS Origin Whitelisting
- CORS middleware restricts requests strictly to explicitly whitelisted frontend domains (`http://localhost:5173`, deployed Vercel URL) with `credentials: true`.
- Prevents unauthorized cross-origin requests from arbitrary malicious domains attempting cross-site API abuse.

### 🛡️ Information Leakage Prevention & Error Masking
- Generic authentication error messages ("Invalid credentials", "Server error") prevent user enumeration and conceal internal stack traces.

### 🔐 Secret Isolation & Environment Security
- All sensitive credentials (database connection strings, JWT secrets, Cloudinary API keys) are isolated in `.env` and kept out of version control via `.gitignore`.
- Explicit DNS resolution configuration (`8.8.8.8`, `8.8.4.4`) with IPv4 priority prevents DNS rebinding vulnerabilities during Atlas SRV queries.

---

## 📋 Master Cybersecurity Controls Matrix

| Security Control | Implementation Mechanism | Threat / Vulnerability Mitigated |
| :--- | :--- | :--- |
| **Input Validation & Sanitization** | Mongoose schema constraints (`lowercase`, `trim`, `minlength`, `maxlength`, strict `enums`, numeric ranges) | Injection attacks, unexpected data tampering, buffer stuffing, casing bypasses |
| **Password Hashing** | `bcryptjs` (Cost factor 10 rounds) + schema `.select('-password')` | Plaintext credential exposure, rainbow table lookups, database breach cracking |
| **Authentication & Session Tokens** | JWT (HMAC-SHA256) + Live database standing verification in `protect` | Unauthorized access, session hijacking, stale token lingering post-ban |
| **Role-Based Access Control (RBAC)** | Role segregation (`client`, `worker`, `admin`) via route middleware | Privilege escalation, Broken Object Level Authorization (BOLA) |
| **Brute-Force & DoS Mitigation** | `authLimiter` (5 req / 15 min) + `generalLimiter` (100 req / 15 min) | Credential stuffing, password spraying, automated dictionary attacks, Layer-7 DoS |
| **Secure File Uploads** | Extension whitelist (`jpg, png, webp`) + Cloudinary CDN + image re-encoding | Remote Code Execution (RCE), Local File Inclusion (LFI), web shells, EXIF malware |
| **Account Suspension** | Administrative block toggle + immediate token invalidation | Compromised/abusive account containment, terms enforcement |
| **Soft Deactivation** | Soft deletion pattern (`isActive: false`) preserving records | Evidence tampering, anti-forensics, loss of relational audit integrity |
| **Security Audit Logging** | Indexed, append-only `AuditLog` collection with IP & User-Agent | Lack of accountability, non-repudiation vulnerabilities |
| **Sensitive Data Redaction** | Recursive regex pattern matching in `sanitizeDetails()` | Log poisoning, sensitive credential leakage in server logs or monitoring |
| **Self-Lockout Protection** | Hardcoded check prohibiting admins from suspending/deactivating self | Administrative privilege suicide, management plane DoS |
| **CORS & Transport Hardening** | Whitelisted trusted origins + `.env` secret isolation + error masking | Cross-Origin data theft, credential leakage, user enumeration |
