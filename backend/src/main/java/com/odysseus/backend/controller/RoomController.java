package com.odysseus.backend.controller;

import com.odysseus.backend.domain.Room;
import com.odysseus.backend.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomRepository roomRepository;

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody Room room) {
        if (roomRepository.existsByRoomCode(room.getRoomCode())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Room code [" + room.getRoomCode() + "] already exists."));
        }
        Room saved = roomRepository.save(room);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRoom(@PathVariable Long id, @RequestBody Room room) {
        if (!roomRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        if (roomRepository.existsByRoomCodeAndIdNot(room.getRoomCode(), id)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Room code [" + room.getRoomCode() + "] is taken by another room."));
        }
        room.setId(id);
        Room saved = roomRepository.save(room);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoom(@PathVariable Long id) {
        return roomRepository.findById(id).map(r -> {
            r.setActive(false);
            roomRepository.save(r);
            return ResponseEntity.ok(Map.of("message", "Room deactivated successfully"));
        }).orElse(ResponseEntity.notFound().build());
    }
}
