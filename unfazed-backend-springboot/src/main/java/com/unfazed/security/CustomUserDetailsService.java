package com.unfazed.security;

import com.unfazed.entity.Therapist;
import com.unfazed.repository.TherapistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private TherapistRepository therapistRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Therapist therapist = therapistRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Therapist not found with email: " + email));

        return new User(therapist.getEmail(), therapist.getPasswordHash(), Collections.emptyList());
    }
}
