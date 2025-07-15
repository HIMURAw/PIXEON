package com.pxdevelopment.license;

import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.Bukkit;
import org.bukkit.ChatColor;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.server.ServerLoadEvent;
import org.bukkit.scheduler.BukkitRunnable;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

public class LicensePlugin extends JavaPlugin implements Listener {
    
    private List<String> data = new ArrayList<>();
    private Boolean lcnstatus = null;
    private boolean isLicenseValid = false;
    
    @Override
    public void onEnable() {
        getLogger().info("🔐 Starting license check...");
        
        // Event listener'ı kaydet
        getServer().getPluginManager().registerEvents(this, this);
        
        // Lisans kontrolünü başlat
        startLicenseCheck();
    }
    
    @Override
    public void onDisable() {
        if (!isLicenseValid) {
            getLogger().warning("Plugin disabled due to invalid license!");
        }
    }
    
    @EventHandler
    public void onServerLoad(ServerLoadEvent event) {
        if (!isLicenseValid) {
            getLogger().severe("License is invalid! Server may not function properly.");
        }
    }
    
    private void startLicenseCheck() {
        new BukkitRunnable() {
            @Override
            public void run() {
                checkLicense();
            }
        }.runTaskAsynchronously(this);
    }
    
    private void checkLicense() {
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
                    isLicenseValid = true;
                } else {
                    lcnstatus = false;
                    isLicenseValid = false;
                }
                
                // 1 saniye bekle
                Thread.sleep(1000);
                
                if (lcnstatus != null) {
                    break;
                }
                
            } catch (Exception e) {
                getLogger().severe("License check error: " + e.getMessage());
                lcnstatus = false;
                isLicenseValid = false;
            }
        }
        
        if (!lcnstatus) {
            // Geçersiz lisans - plugin'i devre dışı bırak
            new BukkitRunnable() {
                @Override
                public void run() {
                    while (true) {
                        getLogger().severe(ChatColor.RED + "[License]" + ChatColor.RESET + " invalid license...");
                        data.add("invalid license");
                        
                        // Tüm oyuncuları kick et
                        Bukkit.getOnlinePlayers().forEach(player -> 
                            player.kickPlayer(ChatColor.RED + "License is invalid! Server is shutting down.")
                        );
                        
                        // Sunucuyu kapat
                        Bukkit.shutdown();
                    }
                }
            }.runTask(this);
        }
    }
    
    private String getPublicIP() throws Exception {
        URL url = new URL("http://api.ipify.org/");
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");
        connection.setConnectTimeout(5000);
        connection.setReadTimeout(5000);
        
        BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
        String ip = reader.readLine();
        reader.close();
        
        return ip;
    }
    
    private String performHttpRequest(String urlString) throws Exception {
        URL url = new URL(urlString);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setConnectTimeout(5000);
        connection.setReadTimeout(5000);
        
        BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
        String response = reader.readLine();
        reader.close();
        
        return response;
    }
    
    private void printSuccessMessage() {
        getLogger().info("""
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
        
        getLogger().info("""
                    [+]	   valid license | HIMURA ^0
                    [+]	   ||@everyone @here||
                    """);
    }
    
    // Lisans durumunu kontrol etmek için public method
    public boolean isLicenseValid() {
        return isLicenseValid;
    }
} 