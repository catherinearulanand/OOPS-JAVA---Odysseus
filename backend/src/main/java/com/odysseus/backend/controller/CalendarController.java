package com.odysseus.backend.controller;

import com.odysseus.backend.domain.AcademicCalendar;
import com.odysseus.backend.domain.CalendarHoliday;
import com.odysseus.backend.repository.AcademicCalendarRepository;
import com.odysseus.backend.repository.CalendarHolidayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/calendar")
@RequiredArgsConstructor
public class CalendarController {

    private final AcademicCalendarRepository calendarRepository;
    private final CalendarHolidayRepository holidayRepository;

    @GetMapping
    public ResponseEntity<List<AcademicCalendar>> getAllCalendars() {
        return ResponseEntity.ok(calendarRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<AcademicCalendar> createCalendar(@RequestBody AcademicCalendar calendar) {
        if (calendar.getHolidays() != null) {
            for (CalendarHoliday h : calendar.getHolidays()) {
                h.setCalendar(calendar);
            }
        }
        AcademicCalendar saved = calendarRepository.save(calendar);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AcademicCalendar> updateCalendar(@PathVariable Long id, @RequestBody AcademicCalendar calendar) {
        if (!calendarRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        calendar.setId(id);
        if (calendar.getHolidays() != null) {
            for (CalendarHoliday h : calendar.getHolidays()) {
                h.setCalendar(calendar);
            }
        }
        AcademicCalendar saved = calendarRepository.save(calendar);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/{calendarId}/holidays")
    public ResponseEntity<CalendarHoliday> addHoliday(@PathVariable Long calendarId, @RequestBody CalendarHoliday holiday) {
        return calendarRepository.findById(calendarId).map(calendar -> {
            holiday.setCalendar(calendar);
            CalendarHoliday saved = holidayRepository.save(holiday);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }
}
