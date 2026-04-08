package com.odoo.Quickcourt.Auth.Config;


import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Component
@EnableScheduling
public class KeepAliveScheduler {

    private final RestTemplate restTemplate = new RestTemplate();
    @Value("${KEEP_ALIVE_URL}")
    private String url;
    // ⏱ Runs every 5 minutes
    @Scheduled(fixedRate = 5 * 60 * 1000)
    public void keepServiceAlive() {
        try {


            // OR your public URL when deployed
            // https://your-app.onrender.com/actuator/health

            String response = restTemplate.getForObject(url, String.class);
            log.info("Keep-alive ping successful: {}", response);

        } catch (Exception e) {
            log.error("Keep-alive ping failed", e);
        }
    }
}
