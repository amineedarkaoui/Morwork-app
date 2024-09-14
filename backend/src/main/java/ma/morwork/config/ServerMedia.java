package ma.morwork.config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class ServerMedia {
    @Value("${server.ip-address}")
    private String ipAddress;
    @Value("${server.port}")
    private String port;
    public String serveMedia(String name) {
        return "http://" + ipAddress + ":" + port + "/media/" + name;
    }

    public String addRandomSequence(String name) {
        String[] parts = name.split("\\.");
        String randomSequence = UUID.randomUUID().toString();
        String firstSequence = randomSequence.split("-")[0];
        return parts[0] + "-" + firstSequence + "." + parts[parts.length-1];
    }
}
