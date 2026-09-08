# Merge Compatibility Assessment — `Lesson-plan` vs `features/admin-data-inputs` vs `main`

Assessed 2026-09-08. Verified by actually compiling/booting the merged codebase and
exercising the real REST API — not just checking for git text conflicts.

## Git-level compatibility

- `main` is still at its initial-scaffold commit (`6bf678d`) — it has never diverged.
- `features/admin-data-inputs` (`86400bd`) has not moved since `Lesson-plan` branched
  from it, so `Lesson-plan` is exactly `features/admin-data-inputs` + this module's
  commits (a strict superset, not a divergent branch).
- Trial merges (`git merge --no-commit --no-ff`, aborted immediately, no branch state
  changed) confirm:
  - `features/admin-data-inputs` → `main`: clean, no conflicts.
  - `Lesson-plan` → `main`: clean, no conflicts (101 files, purely additive).
- **Recommended merge order**: merge `features/admin-data-inputs` → `main` first (it's
  the foundation), then `Lesson-plan` → `main`. Since there's no divergence, merging
  `Lesson-plan` directly into `main` first would work too and produces an identical
  result — either order is safe.

## Logical/runtime compatibility (beyond git conflicts)

Checked and confirmed fine, no changes needed:
- `SecurityConfig`'s existing `anyRequest().authenticated()` catch-all already covers
  every new `/api/lesson-plan/**` endpoint without modification.
- `ProtectedRoute.jsx`'s `requiredRole` prop was extended to accept an array *or* the
  original single-string form — every existing route in `App.jsx` using the old
  single-string form (`"ROLE_ADMIN"`) still works unchanged.
- `Sidebar.jsx`'s full existing ADMIN navigation list is untouched; new items are
  appended under a new "Lesson Plan" section, plus a separate FACULTY-only nav branch.
- `LessonPlanDataInitializer`'s seeded `Faculty` (employeeId `CSE-LP-001`) and `Batch`
  (`CSE-3A`) don't collide with anything Person A's `DataInitializer` seeds (different
  table, different natural keys).

Two real discrepancies were found and fixed (both isolated to this branch; the
original `features/admin-data-inputs` branch was **not** modified):

### 1. JWT secret too short for HS256 out of the box
`application.yml`'s `jwt.secret` default (`change-this-local-secret`, 23 chars) is
below the 256-bit minimum `io.jsonwebtoken.security.Keys.hmacShaKeyFor` requires,
throwing `WeakKeyException` on every login attempt when the `JWT_SECRET` env var isn't
set — i.e. on a fresh clone with no environment configuration. `JwtTokenProvider.java`
already had a correctly-sized fallback string hardcoded as its own `@Value` default,
but that fallback never activated because Spring found the (too-short) property already
defined in `application.yml`. **Fix**: `application.yml`'s default now reuses that same
long secure string, so both files agree and a fresh clone logs in successfully with no
environment setup. Verified: booted with `JWT_SECRET` unset, logged in as `admin`,
received a valid signed token.

### 2. Two independent data seeders racing on the same table
`DataInitializer` (Person A) and `LessonPlanDataInitializer` (this module) are separate
Spring `CommandLineRunner` beans; Spring does not guarantee their execution order.
Person A's `seedAcademicCalendar()` guarded itself with a table-wide
`if (calendarRepository.count() == 0)`. Since this module's seeder also inserts into
`academic_calendars`, whichever seeder happened to run first would satisfy that count
check and silently prevent the *other* seeder's calendar from ever being created —
non-deterministically, depending on Spring's bean-initialization order on a given run.
Confirmed by observation: one boot produced only the Semester-III 2026-27 calendar
(this module's), a second boot after the fix produced both. **Fix**: changed
`seedAcademicCalendar()`'s guard to a targeted match on its own
`(academicYear="2026-2027", semester=5)` combination, mirroring the targeted-match
pattern `LessonPlanDataInitializer` already used — the two seeders are now mutually
safe regardless of which runs first. Verified: fresh boot now always yields both
calendars (`GET /api/admin/calendar` returns 2 rows), and lesson-plan generation still
succeeds end-to-end against either.

## Full-stack verification performed

- Backend: `mvnw compile` and a live `spring-boot:run` boot (JDK 21, required by
  `pom.xml`'s `<java.version>21</java.version>` — a portable Temurin 21 was fetched for
  this since only JDK 17 and JDK 25 were present locally; JDK 25 is known-incompatible
  with this project's Lombok version per Phase 2's notes). Exercised the real API:
  login (no `JWT_SECRET` set) → both calendars present → `POST /generate` → 200 with a
  fully populated `LessonPlanWithSessionsDto`.
- Frontend: `npm run build` (verified in Phase 3) — unaffected by these backend-only
  fixes, not re-run here.

## Verdict

**Both `features/admin-data-inputs` and `Lesson-plan` can be merged into `main`
cleanly**, in either order, with no unresolved conflicts and no known functional
discrepancies remaining as of this assessment.
