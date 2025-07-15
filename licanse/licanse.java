import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

public class LicenseChecker {
    private static List<String> data = new ArrayList<>();
    private static Boolean lcnstatus = null;
    
    public static void main(String[] args) {
        checkLicense();
    }
    
    public static void checkLicense() {
        while (true) {
            try {
                // IP adresini al
                String userIp = getPublicIP();
                String url = "http://VDSIP:3000/check_ip?ip=" + userIp;
                
                // Lisans kontrolü
                String response = performHttpRequest(url);
                
                if ("VALID".equals(response)) {
                    // Başarılı lisans
                    printSuccessMessage();
                    lcnstatus = true;
                } else {
                    lcnstatus = false;
                }
                
                Thread.sleep(1000);
                
                if (lcnstatus != null) {
                    break;
                }
                
            } catch (Exception e) {
                System.err.println("License check error: " + e.getMessage());
                lcnstatus = false;
            }
        }
        
        if (!lcnstatus) {
            while (true) {
                System.out.println("\u001B[31m[License]\u001B[0m invalid license...");
                data.add("invalid license");
                System.exit(1);
            }
        }
    }
    
    private static String getPublicIP() throws Exception {
        URL url = new URL("http://api.ipify.org/");
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");
        
        BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
        String ip = reader.readLine();
        reader.close();
        
        return ip;
    }
    
    private static String performHttpRequest(String urlString) throws Exception {
        URL url = new URL(urlString);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");
        connection.setRequestProperty("Content-Type", "application/json");
        
        BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
        String response = reader.readLine();
        reader.close();
        
        return response;
    }
    
    private static void printSuccessMessage() {
        System.out.println("""
                    [+]
                    [+]
                    [+]    ooooooooo.   ooooooo  ooooo oooooooooo.
                    [+]    `888   `Y88.  `8888    d8'  `888'   `Y8b
                    [+]     888   .d88'    Y888..8P     888      888  .ooooo.  oooo    ooo
                    [+]     888ooo88P'      `8888'      888      888 d88' `88b  `88.  .8'
                    [+]     888            .8PY888.     888      888 888ooo888   `88..8'
                    [+]     888           d8'  `888b    888     d88' 888    .o    `888'
                    [+]    o888o        o888o  o88888o o888bood8P'   `Y8bod8P'     `8'
                    [+]
                    [+]
                    """);
        
        System.out.println("""
                    [+]	   valid license | HIMURA ^0
                    [+]	   ||@everyone @here||
                    """);
    }
}
