package com.odysseus.backend.service;

import com.odysseus.backend.domain.*;
import com.odysseus.backend.dto.DataReadinessResult;
import com.odysseus.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DataReadinessService {

    private final SubjectRepository subjectRepository;
    private final FacultyRepository facultyRepository;
    private final RoomRepository roomRepository;
    private final BatchRepository batchRepository;
    private final SubjectOfferingRepository offeringRepository;
    private final AcademicCalendarRepository calendarRepository;
    private final CollegeTimeslotRepository timeslotRepository;
    private final NepCreditRuleRepository nepRuleRepository;

    public DataReadinessResult checkDataReadiness() {
        List<String> issues = new ArrayList<>();

        // 1. NEP Credit Rules Check
        List<NepCreditRule> activeRules = nepRuleRepository.findByActiveTrue();
        if (activeRules.isEmpty()) {
            issues.add("No active NEP Credit Rule configured. Please configure credit-to-hours conversion rules.");
        }

        // 2. Subjects Check
        List<Subject> activeSubjects = subjectRepository.findByActiveTrue();
        if (activeSubjects.isEmpty()) {
            issues.add("No active subjects found in the system.");
        } else {
            for (Subject s : activeSubjects) {
                if (s.getCalculatedWeeklyHours() <= 0) {
                    issues.add("Subject [" + s.getSubjectCode() + " - " + s.getSubjectName() + "] has zero calculated weekly hours.");
                }
                if (s.isRequiresLab()) {
                    if (s.getLabDuration() == null || s.getLabDuration() < 2) {
                        issues.add("Subject [" + s.getSubjectCode() + "] requires lab but lab duration is invalid (must be >= 2 continuous periods).");
                    }
                }
            }
        }

        // 3. Faculty Check
        List<Faculty> activeFaculty = facultyRepository.findByActiveTrue();
        if (activeFaculty.isEmpty()) {
            issues.add("No active faculty members found in the system.");
        } else {
            for (Faculty f : activeFaculty) {
                if (f.getMaxWeeklyLoad() == null || f.getMaxWeeklyLoad() <= 0) {
                    issues.add("Faculty [" + f.getName() + " (" + f.getEmployeeId() + ")] has invalid or zero maximum weekly load.");
                }
                if (f.getEligibleSubjects().isEmpty()) {
                    issues.add("Faculty [" + f.getName() + "] has no eligible subjects assigned.");
                }
            }
        }

        // 4. Rooms Check
        List<Room> activeRooms = roomRepository.findByActiveTrue();
        if (activeRooms.isEmpty()) {
            issues.add("No active rooms found in the system.");
        } else {
            boolean hasLabRoom = activeRooms.stream().anyMatch(r -> "LAB".equalsIgnoreCase(r.getRoomType()));
            boolean requiresLabRoom = activeSubjects.stream().anyMatch(Subject::isRequiresLab);
            if (requiresLabRoom && !hasLabRoom) {
                issues.add("Lab subjects exist but no active room of type LAB is available.");
            }
            for (Room r : activeRooms) {
                if (r.getCapacity() == null || r.getCapacity() <= 0) {
                    issues.add("Room [" + r.getRoomCode() + "] has invalid capacity.");
                }
            }
        }

        // 5. Batches Check
        List<Batch> activeBatches = batchRepository.findByActiveTrue();
        if (activeBatches.isEmpty()) {
            issues.add("No active student batches/sections found.");
        } else {
            for (Batch b : activeBatches) {
                if (b.getStrength() == null || b.getStrength() <= 0) {
                    issues.add("Batch [" + b.getBatchName() + "] has invalid strength.");
                }
            }
        }

        // 6. Subject Offerings Check
        List<SubjectOffering> activeOfferings = offeringRepository.findByActiveTrue();
        if (activeOfferings.isEmpty()) {
            issues.add("No subject offerings mapped between batches and subjects.");
        } else {
            for (Batch b : activeBatches) {
                boolean batchHasOffering = activeOfferings.stream().anyMatch(o -> o.getBatch().getId().equals(b.getId()));
                if (!batchHasOffering) {
                    issues.add("Batch [" + b.getBatchName() + "] has no subject offerings assigned.");
                }
            }

            for (SubjectOffering o : activeOfferings) {
                Subject subject = o.getSubject();
                boolean facultyEligible = activeFaculty.stream().anyMatch(f -> f.getEligibleSubjects().contains(subject));
                if (!facultyEligible) {
                    issues.add("Subject [" + subject.getSubjectCode() + " - " + subject.getSubjectName() + "] offered to Batch [" + o.getBatch().getBatchName() + "] has no eligible faculty member available.");
                }
            }
        }

        // 7. Academic Calendar & Timeslots Check
        List<AcademicCalendar> activeCalendars = calendarRepository.findByActiveTrue();
        if (activeCalendars.isEmpty()) {
            issues.add("No active academic calendar configured.");
        }

        List<CollegeTimeslot> activeTimeslots = timeslotRepository.findByActiveTrue();
        long teachingTimeslots = activeTimeslots.stream().filter(t -> !t.isBreak() && !t.isLunch()).count();
        if (teachingTimeslots == 0) {
            issues.add("No active teaching timeslots configured in college schedule.");
        }

        boolean isReady = issues.isEmpty();
        String summary = isReady 
                ? "Data readiness validation passed successfully. Master data is valid and ready for Person B's scheduler."
                : issues.size() + " data validation issue(s) found. Please resolve them before running the timetable generator.";

        return DataReadinessResult.builder()
                .ready(isReady)
                .issueCount(issues.size())
                .issues(issues)
                .summaryMessage(summary)
                .build();
    }
}
