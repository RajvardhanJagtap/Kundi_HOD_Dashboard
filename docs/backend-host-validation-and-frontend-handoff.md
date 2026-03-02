# Backend Host Validation & Frontend Handoff

Date: 2026-03-02
Backend Host: `http://41.186.188.90:2000`
API Base Used for Checks: `http://41.186.188.90:2000/api/v1`

## 1) Validation Summary

- Connectivity to hosted backend is **working**.
- Most business endpoints returned **401 Unauthorized** without token, which is expected for protected routes.
- Auth endpoints are reachable and returned **400 Bad Request** for invalid payloads:
  - `POST /auth/login` => `400`
  - `POST /auth/refresh` => `400`
- `OPTIONS /auth/login` returned `200` and exposed CORS allow-origin for local frontend (`http://localhost:3000`).

## 2) Frontend Configuration (Required)

Set these environment variables in frontend runtime:

```env
NEXT_PUBLIC_API_URL=http://41.186.188.90:2000/api/v1
NEXT_PUBLIC_API_BASE_URL=http://41.186.188.90:2000/api/v1
```

Notes:
- Default fallback in `lib/api.ts` now points to the new host.
- If using proxy mode for transcript/PDF flows, ensure `NEXT_PUBLIC_USE_PROXY=true` and Next API proxy routes are enabled.

## 3) Endpoint Inventory Used by Frontend

### Auth
- `POST /auth/login`
- `POST /auth/refresh`

### Academics / Users
- `GET /academics/academic-years`
- `GET /academics/semesters`
- `GET /academics/semesters/academic-year/{academicYearId}`
- `GET /users/department/{departmentId}/lecturers`
- `GET /academics/modules/department/{departmentId}/active`
- `GET /academics/module-assignments/department/{departmentId}/groups?academicYearId={academicYearId}`
- `POST /academics/module-assignments`
- `PUT /academics/module-assignments/{moduleAssignmentId}/transfer?assignmentId={assignmentId}&newLecturerId={newLecturerId}&reason={reason}`
- `GET /academics/module-assignments/my-department?semesterId={semesterId}`
- `GET /academics/module-assignments/{id}`
- `GET /academics/module-assignments/instructor/{instructorId}`
- `GET /academics/module-assignments/academic-year/{academicYearId}`
- `GET /academics/module-assignments/semester/{semesterId}`
- `PUT /academics/module-assignments/{moduleId}/deadline`
- `PUT /academics/module-assignments/bulk-deadline-update`
- `GET /academics/timetable-slots/hod/department-slots/weekly`
- `GET /academics/timetable-slots/hod/department-slots/day/{DAY}`
- `GET /academics/timetable-slots/hod/department-slots/monthly?year={year}&month={month}`
- `GET /academics/groups/department/{departmentId}?academicYearId={academicYearId}`
- `GET /academics/student-enrollments/group/{groupId}?semesterId={semesterId}`

### Grading / Marks / Sheets / Transcripts
- `GET /grading/group-readiness/my-department?semesterId={semesterId}`
- `GET /grading/marks-submission/module/{moduleId}/submission-details`
- `POST /grading/marks-submission/module/{moduleId}/create-submissions`
- `POST /grading/marks-submission/module/{moduleId}/hod/approve-overall`
- `POST /grading/marks-submission/module/{moduleId}/hod/approve-cat`
- `POST /grading/marks-submission/module/{moduleId}/hod/approve-exam`
- `GET /grading/group-submissions/submit-to-dean`
- `POST /grading/group-submissions/submit-to-dean`
- `GET /grading/student-marks/module/{moduleId}/generateModuleMarkSheetExcel`
- `POST /grading/student-marks/module/{moduleId}/submit-to-dean`
- `POST /grading/student-marks/module/{moduleId}/publish`
- `GET /grading/student-marks/module/{moduleId}/export-excel`
- `PUT /grading/student-marks/module/{moduleId}`
- `GET /grading/student-marks/module/{moduleId}/statistics`
- `GET /grading/groups?academicYearId={academicYearId}`
- `GET /grading/overall-sheets/generate-year-summary-sheet/{academicYearId}/group/{groupId}/excel`
- `GET /grading/overall-sheets/generate-year-combined-sheet/{academicYearId}/group/{groupId}/excel`
- `GET /grading/overall-sheets/generate-year-regular-sheet/{yearId}/group/{groupId}/excel`
- `GET /grading/overall-sheets/generate-repeaters-summary-sheet/{yearId}/group/{groupId}/excel`
- `GET /grading/overall-sheets/generate-year-retake-sheet/{yearId}/group/{groupId}/excel`
- `GET /grading/progressive-reports/student/{studentId}/academic-year/{academicYearId}/pdf`

## 4) Expected Frontend Behavior

- Without access token: expect `401` on protected routes.
- With valid access token (Bearer): protected routes should return domain responses (`200`/`201` etc.).
- For PDF and file endpoints, frontend should request with auth and handle `blob` response types.

## 5) Recommended Quick Smoke Test for Frontend Team

1. Login from UI and confirm tokens are set (`accessToken`, `refreshToken`).
2. Load Academic Years and Semesters.
3. Open Module Assignments list (`my-department` endpoint).
4. Open Timetable weekly view.
5. Open one transcript PDF.
6. Try one marks action (`submit-to-dean` or `approve-overall`) with authorized user role.
