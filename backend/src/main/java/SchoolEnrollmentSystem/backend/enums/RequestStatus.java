package SchoolEnrollmentSystem.backend.enums;

public enum RequestStatus {
    SENT, // initial status when the request is created
    ACCEPTED, // when the request is accepted by the principal
    CONFIRMED, // when the request is confirmed by the parent (one possible final state)
    CANCELED, // when the request is canceled by the parent before the principal accepts it (one possible final state)
    REJECTED, // when the request is rejected by the principal (one possible final state)
    DECLINED, // when the request is declined by the parent after the principal accepts it (one possible final state)
}
