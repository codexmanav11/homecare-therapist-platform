package com.unfazed.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "availabilities")
public class Availability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "therapist_id", nullable = false)
    private Therapist therapist;

    private String dayOfWeek;
    private String startTime;
    private String endTime;
    private Integer bufferMinutes;
    private Integer slotDurationMinutes;
    private Boolean isOverride;
    private String specificDate;
    private Boolean isBlocked;

    public Availability() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Therapist getTherapist() { return therapist; }
    public void setTherapist(Therapist therapist) { this.therapist = therapist; }
    public String getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(String dayOfWeek) { this.dayOfWeek = dayOfWeek; }
    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }
    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }
    public Integer getBufferMinutes() { return bufferMinutes; }
    public void setBufferMinutes(Integer bufferMinutes) { this.bufferMinutes = bufferMinutes; }
    public Integer getSlotDurationMinutes() { return slotDurationMinutes; }
    public void setSlotDurationMinutes(Integer slotDurationMinutes) { this.slotDurationMinutes = slotDurationMinutes; }
    public Boolean getIsOverride() { return isOverride; }
    public void setIsOverride(Boolean isOverride) { this.isOverride = isOverride; }
    public String getSpecificDate() { return specificDate; }
    public void setSpecificDate(String specificDate) { this.specificDate = specificDate; }
    public Boolean getIsBlocked() { return isBlocked; }
    public void setIsBlocked(Boolean isBlocked) { this.isBlocked = isBlocked; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Availability a = new Availability();
        public Builder id(Long id) { a.id = id; return this; }
        public Builder therapist(Therapist t) { a.therapist = t; return this; }
        public Builder dayOfWeek(String dow) { a.dayOfWeek = dow; return this; }
        public Builder startTime(String st) { a.startTime = st; return this; }
        public Builder endTime(String et) { a.endTime = et; return this; }
        public Builder bufferMinutes(Integer bm) { a.bufferMinutes = bm; return this; }
        public Builder slotDurationMinutes(Integer sdm) { a.slotDurationMinutes = sdm; return this; }
        public Builder isOverride(Boolean io) { a.isOverride = io; return this; }
        public Builder specificDate(String sd) { a.specificDate = sd; return this; }
        public Builder isBlocked(Boolean ib) { a.isBlocked = ib; return this; }
        public Availability build() { return a; }
    }
}
