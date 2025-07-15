#!/usr/bin/env ruby
# frozen_string_literal: true

# PXDevelopment License System - Ruby Version
# Bu script, Ruby uygulamaları için lisans kontrol sistemi sağlar.

require 'net/http'
require 'json'
require 'timeout'

data = []
lcnstatus = nil

def get_public_ip
  # Public IP adresini al
  begin
    Timeout.timeout(5) do
      response = Net::HTTP.get_response(URI('http://api.ipify.org/'))
      response.body.strip
    end
  rescue => e
    puts "IP alma hatası: #{e.message}"
    nil
  end
end

def perform_http_request(url)
  # HTTP isteği gönder
  begin
    Timeout.timeout(5) do
      uri = URI(url)
      request = Net::HTTP::Get.new(uri)
      request['Content-Type'] = 'application/json'
      
      response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == 'https') do |http|
        http.request(request)
      end
      
      response.body.strip
    end
  rescue => e
    puts "HTTP istek hatası: #{e.message}"
    nil
  end
end

def print_success_message
  # Başarılı lisans mesajını yazdır
  puts "
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
                    "
  
  puts "
                    [+]	   valid license | HIMURA ^0
                    [+]	   ||@everyone @here||
                    "
end

def check_license
  global lcnstatus
  
  loop do
    begin
      # IP adresini al
      user_ip = get_public_ip
      unless user_ip
        puts "IP adresi alınamadı!"
        lcnstatus = false
        break
      end
      
      url = "http://VDSIP:3000/check_ip?ip=#{user_ip}"
      
      # Lisans kontrolü
      response = perform_http_request(url)
      
      if response == "VALID"
        # Başarılı lisans
        print_success_message
        lcnstatus = true
      else
        lcnstatus = false
      end
      
      # 1 saniye bekle
      sleep(1)
      
      break if lcnstatus
      
    rescue => e
      puts "Lisans kontrol hatası: #{e.message}"
      lcnstatus = false
    end
  end
  
  unless lcnstatus
    loop do
      puts "\033[31m[License]\033[0m invalid license..."
      data << "invalid license"
      exit(1)
    end
  end
end

# Programı başlat
puts "🔐 Starting license check..."
check_license 