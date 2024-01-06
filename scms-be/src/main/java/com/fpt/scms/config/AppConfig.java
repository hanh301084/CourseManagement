package com.fpt.scms.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Component
@EnableConfigurationProperties(AppConfig.class)
@ConfigurationProperties(prefix = "app")
@EnableTransactionManagement
public class AppConfig {
    private List<String> authorizedRedirectUris = new ArrayList<>();

    private String tokenSecret;

    private long tokenExpirationMsec;

    public AppConfig authorizedRedirectUris(List<String> authorizedRedirectUris) {
        this.authorizedRedirectUris = authorizedRedirectUris;
        return this;
    }

    public List<String> getAuthorizedRedirectUris() {
        return authorizedRedirectUris;
    }

    public void setAuthorizedRedirectUris(List<String> authorizedRedirectUris) {
        this.authorizedRedirectUris = authorizedRedirectUris;
    }

    public String getTokenSecret() {
        return tokenSecret;
    }

    public void setTokenSecret(String tokenSecret) {
        this.tokenSecret = tokenSecret;
    }

    public long getTokenExpirationMsec() {
        return tokenExpirationMsec;
    }

    public void setTokenExpirationMsec(long tokenExpirationMsec) {
        this.tokenExpirationMsec = tokenExpirationMsec;
    }

}
