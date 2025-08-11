package com.odoo.Quickcourt.Auth.Entities;

import lombok.Getter;

@Getter
public enum UserRole {
    GUEST("Guest"),
    USER("User"),
    ADMIN("Admin");

    private final String displayName;

    UserRole(String displayName) {
        this.displayName = displayName;
    }
}
