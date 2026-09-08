package com.odysseus.backend.config;

import com.odysseus.backend.domain.*;
import com.odysseus.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final NepCreditRuleRepository nepCreditRuleRepository;
    private final CollegeTimeslotRepository timeslotRepository;
    private final AcademicCalendarRepository calendarRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedDefaultNepRule();
        seedCollegeTimeslots();
        seedAcademicCalendar();
    }

    private void seedUsers() {
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@odysseus.edu")
                    .password(passwordEncoder.encode("admin123"))
                    .role("ROLE_ADMIN")
                    .fullName("System Administrator")
                    .active(true)
                    .build();
            userRepository.save(admin);
        }

        if (!userRepository.existsByUsername("faculty")) {
            User facultyUser = User.builder()
                    .username("faculty")
                    .email("faculty@odysseus.edu")
                    .password(passwordEncoder.encode("faculty123"))
                    .role("ROLE_FACULTY")
                    .fullName("Sample Faculty")
                    .active(true)
                    .build();
            userRepository.save(facultyUser);
        }
    }

    private void seedDefaultNepRule() {
        if (nepCreditRuleRepository.count() == 0) {
            NepCreditRule rule = NepCreditRule.builder()
                    .ruleName("Default Institutional NEP Rule 2026")
                    .academicYear("2026-2027")
                    .program("B.Tech / Undergraduate")
                    .theoryHoursPerCredit(1.0)
                    .labHoursPerCredit(2.0)
                    .tutorialHoursPerCredit(1.0)
                    .active(true)
                    .build();
            nepCreditRuleRepository.save(rule);
        }
    }

    private void seedCollegeTimeslots() {
        if (timeslotRepository.count() == 0) {
            List<String> days = List.of("MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY");

            for (String day : days) {
                // P1: 08:15 - 09:05
                timeslotRepository.save(CollegeTimeslot.builder()
                        .dayOfWeek(day).periodNumber(1).periodLabel("P1")
                        .startTime(LocalTime.of(8, 15)).endTime(LocalTime.of(9, 5))
                        .isBreak(false).isLunch(false).active(true).build());

                // P2: 09:05 - 09:55
                timeslotRepository.save(CollegeTimeslot.builder()
                        .dayOfWeek(day).periodNumber(2).periodLabel("P2")
                        .startTime(LocalTime.of(9, 5)).endTime(LocalTime.of(9, 55))
                        .isBreak(false).isLunch(false).active(true).build());

                // BREAK: 09:55 - 10:10 (Non-teaching)
                timeslotRepository.save(CollegeTimeslot.builder()
                        .dayOfWeek(day).periodNumber(0).periodLabel("BREAK")
                        .startTime(LocalTime.of(9, 55)).endTime(LocalTime.of(10, 10))
                        .isBreak(true).isLunch(false).active(true).build());

                // P3: 10:10 - 11:00
                timeslotRepository.save(CollegeTimeslot.builder()
                        .dayOfWeek(day).periodNumber(3).periodLabel("P3")
                        .startTime(LocalTime.of(10, 10)).endTime(LocalTime.of(11, 0))
                        .isBreak(false).isLunch(false).active(true).build());

                // P4: 11:00 - 11:50
                timeslotRepository.save(CollegeTimeslot.builder()
                        .dayOfWeek(day).periodNumber(4).periodLabel("P4")
                        .startTime(LocalTime.of(11, 0)).endTime(LocalTime.of(11, 50))
                        .isBreak(false).isLunch(false).active(true).build());

                // P5: 11:50 - 12:40
                timeslotRepository.save(CollegeTimeslot.builder()
                        .dayOfWeek(day).periodNumber(5).periodLabel("P5")
                        .startTime(LocalTime.of(11, 50)).endTime(LocalTime.of(12, 40))
                        .isBreak(false).isLunch(false).active(true).build());

                // LUNCH: 12:40 - 13:30 (Non-teaching)
                timeslotRepository.save(CollegeTimeslot.builder()
                        .dayOfWeek(day).periodNumber(0).periodLabel("LUNCH")
                        .startTime(LocalTime.of(12, 40)).endTime(LocalTime.of(13, 30))
                        .isBreak(false).isLunch(true).active(true).build());

                // P6: 13:30 - 14:15
                timeslotRepository.save(CollegeTimeslot.builder()
                        .dayOfWeek(day).periodNumber(6).periodLabel("P6")
                        .startTime(LocalTime.of(13, 30)).endTime(LocalTime.of(14, 15))
                        .isBreak(false).isLunch(false).active(true).build());

                // P7: 14:15 - 15:00
                timeslotRepository.save(CollegeTimeslot.builder()
                        .dayOfWeek(day).periodNumber(7).periodLabel("P7")
                        .startTime(LocalTime.of(14, 15)).endTime(LocalTime.of(15, 0))
                        .isBreak(false).isLunch(false).active(true).build());

                // P8: 15:00 - 15:45
                timeslotRepository.save(CollegeTimeslot.builder()
                        .dayOfWeek(day).periodNumber(8).periodLabel("P8")
                        .startTime(LocalTime.of(15, 0)).endTime(LocalTime.of(15, 45))
                        .isBreak(false).isLunch(false).active(true).build());
            }
        }
    }

    private void seedAcademicCalendar() {
        // Targeted match (not a table-wide count()==0 guard): the Lesson Plan module's
        // own seeder (LessonPlanDataInitializer) also inserts an AcademicCalendar row,
        // and CommandLineRunner execution order across beans is not guaranteed. A blind
        // count()==0 check here would silently skip this placeholder Semester-5 demo
        // calendar whenever the other seeder happens to run first, since the table would
        // already be non-empty. Matching on this seeder's own (academicYear, semester)
        // keeps the two additive seeders mutually safe regardless of run order.
        boolean alreadySeeded = calendarRepository.findByActiveTrue().stream()
                .anyMatch(c -> "2026-2027".equals(c.getAcademicYear()) && Integer.valueOf(5).equals(c.getSemester()));
        if (!alreadySeeded) {
            AcademicCalendar calendar = AcademicCalendar.builder()
                    .academicYear("2026-2027")
                    .semester(5)
                    .startDate(LocalDate.of(2026, 8, 1))
                    .endDate(LocalDate.of(2026, 12, 20))
                    .SaturdayRule("ALL_HOLIDAY")
                    .SundayRule("ALL_HOLIDAY")
                    .active(true)
                    .build();

            CalendarHoliday holiday1 = CalendarHoliday.builder()
                    .holidayDate(LocalDate.of(2026, 8, 15))
                    .name("Independence Day")
                    .type("GOVERNMENT")
                    .description("National Holiday")
                    .calendar(calendar)
                    .build();

            CalendarHoliday holiday2 = CalendarHoliday.builder()
                    .holidayDate(LocalDate.of(2026, 10, 2))
                    .name("Gandhi Jayanti")
                    .type("GOVERNMENT")
                    .description("National Holiday")
                    .calendar(calendar)
                    .build();

            calendar.getHolidays().add(holiday1);
            calendar.getHolidays().add(holiday2);

            calendarRepository.save(calendar);
        }
    }
}
