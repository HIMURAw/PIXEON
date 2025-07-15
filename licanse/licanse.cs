using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace PXDevelopment.License
{
    public class LicenseChecker
    {
        private static List<string> data = new List<string>();
        private static bool? lcnstatus = null;
        private static readonly HttpClient httpClient = new HttpClient();
        
        static async Task Main(string[] args)
        {
            Console.WriteLine("🔐 Starting license check...");
            await CheckLicense();
        }
        
        public static async Task CheckLicense()
        {
            while (true)
            {
                try
                {
                    // IP adresini al
                    string userIp = await GetPublicIP();
                    if (string.IsNullOrEmpty(userIp))
                    {
                        Console.WriteLine("IP adresi alınamadı!");
                        lcnstatus = false;
                        break;
                    }
                    
                    string url = $"http://VDSIP:3000/check_ip?ip={userIp}";
                    
                    // Lisans kontrolü
                    string response = await PerformHttpRequest(url);
                    
                    if (response == "VALID")
                    {
                        // Başarılı lisans
                        PrintSuccessMessage();
                        lcnstatus = true;
                    }
                    else
                    {
                        lcnstatus = false;
                    }
                    
                    // 1 saniye bekle
                    await Task.Delay(1000);
                    
                    if (lcnstatus.HasValue)
                    {
                        break;
                    }
                    
                }
                catch (Exception e)
                {
                    Console.WriteLine($"License check error: {e.Message}");
                    lcnstatus = false;
                }
            }
            
            if (!lcnstatus.Value)
            {
                while (true)
                {
                    Console.WriteLine("\u001B[31m[License]\u001B[0m invalid license...");
                    data.Add("invalid license");
                    Environment.Exit(1);
                }
            }
        }
        
        private static async Task<string> GetPublicIP()
        {
            try
            {
                httpClient.Timeout = TimeSpan.FromSeconds(5);
                string ip = await httpClient.GetStringAsync("http://api.ipify.org/");
                return ip.Trim();
            }
            catch (Exception e)
            {
                Console.WriteLine($"IP alma hatası: {e.Message}");
                return null;
            }
        }
        
        private static async Task<string> PerformHttpRequest(string url)
        {
            try
            {
                httpClient.Timeout = TimeSpan.FromSeconds(5);
                httpClient.DefaultRequestHeaders.Add("Content-Type", "application/json");
                
                string response = await httpClient.GetStringAsync(url);
                return response.Trim();
            }
            catch (Exception e)
            {
                Console.WriteLine($"HTTP istek hatası: {e.Message}");
                return null;
            }
        }
        
        private static void PrintSuccessMessage()
        {
            Console.WriteLine(@"
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
                    ");
            
            Console.WriteLine(@"
                    [+]	   valid license | HIMURA ^0
                    [+]	   ||@everyone @here||
                    ");
        }
    }
} 