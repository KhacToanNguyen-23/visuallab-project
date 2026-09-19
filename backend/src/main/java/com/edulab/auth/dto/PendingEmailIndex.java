package com.edulab.auth.dto;

import java.io.Serializable;

public class PendingEmailIndex implements Serializable {
    private static final long serialVersionUID = 1L;

    private String token;
    private int resendCount;
    private long lastSentAt;

    public PendingEmailIndex() {}

    public PendingEmailIndex(String token, int resendCount, long lastSentAt) {
        this.token = token;
        this.resendCount = resendCount;
        this.lastSentAt = lastSentAt;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public int getResendCount() {
        return resendCount;
    }

    public void setResendCount(int resendCount) {
        this.resendCount = resendCount;
    }

    public long getLastSentAt() {
        return lastSentAt;
    }

    public void setLastSentAt(long lastSentAt) {
        this.lastSentAt = lastSentAt;
    }
}
