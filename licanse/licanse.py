import requests
import time
import sys
import os

data = []
lcnstatus = None

def get_public_ip():
    """Public IP adresini al"""
    try:
        response = requests.get('http://api.ipify.org/', timeout=5)
        return response.text.strip()
    except Exception as e:
        print(f"IP alma hatası: {e}")
        return None

def perform_http_request(url):
    """HTTP isteği gönder"""
    try:
        response = requests.get(url, timeout=5, headers={'Content-Type': 'application/json'})
        return response.text.strip()
    except Exception as e:
        print(f"HTTP istek hatası: {e}")
        return None

def print_success_message():
    """Başarılı lisans mesajını yazdır"""
    print("""
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
                    """)
    
    print("""
                    [+]	   valid license | HIMURA ^0
                    [+]	   ||@everyone @here||
                    """)

def check_license():
    """Lisans kontrolü yap"""
    global lcnstatus
    
    while True:
        try:
            # IP adresini al
            user_ip = get_public_ip()
            if not user_ip:
                print("IP adresi alınamadı!")
                lcnstatus = False
                break
                
            url = f"http://VDSIP:3000/check_ip?ip={user_ip}"
            
            # Lisans kontrolü
            response = perform_http_request(url)
            
            if response == "VALID":
                # Başarılı lisans
                print_success_message()
                lcnstatus = True
            else:
                lcnstatus = False
            
            # 1 saniye bekle
            time.sleep(1)
            
            if lcnstatus is not None:
                break
                
        except Exception as e:
            print(f"Lisans kontrol hatası: {e}")
            lcnstatus = False
    
    if not lcnstatus:
        while True:
            print("\033[31m[License]\033[0m invalid license...")
            data.append("invalid license")
            sys.exit(1)

if __name__ == "__main__":
    print("🔐 Starting license check...")
    check_license() 