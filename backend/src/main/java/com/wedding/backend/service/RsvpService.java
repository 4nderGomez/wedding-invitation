package com.wedding.backend.service;

import com.wedding.backend.entity.Rsvp;
import com.wedding.backend.entity.Guest;
import com.wedding.backend.repository.RsvpRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class RsvpService {
    
    private final RsvpRepository rsvpRepository;

    RsvpService(RsvpRepository rsvpRepository) {
        this.rsvpRepository = rsvpRepository;
    }

    public Rsvp saveRsvp(Rsvp rsvp) {
        //Normalizar datos
        rsvp.setEmail(rsvp.getEmail().toLowerCase().trim());
        rsvp.setPhone(rsvp.getPhone().trim());

        //Comprobando email no sea duplicado
        Optional<Rsvp> existing = rsvpRepository.findByEmail(rsvp.getEmail());
        if(existing.isPresent()) {
            throw new RuntimeException("Este correo ya fue registrado");
        }

        //Validación de minimo un invitado
        if(rsvp.getGuests() == null || rsvp.getGuests().isEmpty()) {
            throw new RuntimeException("Debe agregar al menos un invitado");
        }

        //Relacion de guests con rsvp
        if(rsvp.getGuests() != null) {
            for(Guest g: rsvp.getGuests()) {

                //Validacón del tipo
                if(!g.getType().equals("adult") && !g.getType().equals("kid"))
                    throw new RuntimeException("Tipo de invitado invalido");

                //Validar nombre
                if(g.getName().trim().isEmpty() || g.getLastname().trim().isEmpty())
                    throw new RuntimeException("Nombre y apellido son obligatorios");


                g.setRsvp(rsvp);
            }
        }

        //Asignacion de la fecha automaticamente
        rsvp.setCreatedAt(LocalDateTime.now());

        return rsvpRepository.save(rsvp);
    }
}
