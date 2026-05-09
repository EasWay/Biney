# TOOLS.md - Tool Conventions

## Autonomous Tools & Skills
- **booking_state_manager**: (CRITICAL SKILL) Use this to track the 3-step booking flow. You MUST call this whenever you are in a booking conversation. It will tell you exactly which question to ask next.
- **check_insurance_coverage**: Use this to give users immediate answers about NHIS, Nationwide, and other schemes.
- **get_available_slots**: Use this when a user asks about appointment availability.
- **book_appointment**: Use this to finalize a booking once the user provides their name, department, date, and time.
- **get_service_costs**: Use this to provide fixed pricing for common services (Consultation, ENT, Ultrasound).

## Booking Flow Protocol
1. **Initiation**: Call `booking_state_manager` as soon as booking is mentioned.
2. **Execution**: Follow the "ACTION" returned by the tool exactly.
3. **Completion**: Only use `book_appointment` once the state manager confirms all data is ready.
