package main

import (
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

var data []string
var lcnstatus *bool

func getPublicIP() (string, error) {
	client := &http.Client{
		Timeout: 5 * time.Second,
	}
	
	resp, err := client.Get("http://api.ipify.org/")
	if err != nil {
		return "", fmt.Errorf("IP alma hatası: %v", err)
	}
	defer resp.Body.Close()
	
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("IP okuma hatası: %v", err)
	}
	
	return strings.TrimSpace(string(body)), nil
}

func performHttpRequest(url string) (string, error) {
	client := &http.Client{
		Timeout: 5 * time.Second,
	}
	
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return "", fmt.Errorf("HTTP istek oluşturma hatası: %v", err)
	}
	
	req.Header.Set("Content-Type", "application/json")
	
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("HTTP istek hatası: %v", err)
	}
	defer resp.Body.Close()
	
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("HTTP yanıt okuma hatası: %v", err)
	}
	
	return strings.TrimSpace(string(body)), nil
}

func printSuccessMessage() {
	fmt.Println(`
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
                    `)
	
	fmt.Println(`
                    [+]	   valid license | HIMURA ^0
                    [+]	   ||@everyone @here||
                    `)
}

func checkLicense() {
	for {
		// IP adresini al
		userIP, err := getPublicIP()
		if err != nil {
			fmt.Printf("IP adresi alınamadı: %v\n", err)
			falseVal := false
			lcnstatus = &falseVal
			break
		}
		
		url := fmt.Sprintf("http://VDSIP:3000/check_ip?ip=%s", userIP)
		
		// Lisans kontrolü
		response, err := performHttpRequest(url)
		if err != nil {
			fmt.Printf("Lisans kontrol hatası: %v\n", err)
			falseVal := false
			lcnstatus = &falseVal
			break
		}
		
		if response == "VALID" {
			// Başarılı lisans
			printSuccessMessage()
			trueVal := true
			lcnstatus = &trueVal
		} else {
			falseVal := false
			lcnstatus = &falseVal
		}
		
		// 1 saniye bekle
		time.Sleep(1 * time.Second)
		
		if lcnstatus != nil {
			break
		}
	}
	
	if !*lcnstatus {
		for {
			fmt.Println("\033[31m[License]\033[0m invalid license...")
			data = append(data, "invalid license")
			// Go'da exit(1) yerine panic kullanılır
			panic("License invalid")
		}
	}
}

func main() {
	fmt.Println("🔐 Starting license check...")
	checkLicense()
} 