[
    {"id": 0, "company": "", "techasset": ""},
    {
        "id": 1,
        "company": "WIFINECOM SRL",
        "techasset": "VDSL2",
        "type": "Router",
        "vendor": "TP-Link-D-Link",
        "model": "generic",
        "mac": "00:00:00:00:00:00",
        "ipv4": "0.0.0.0",
        "ipv6": "0000:0000:0000:0000:0000:0000",
        "propDeviceStructure": {
            "firmware_version": "0.0",
            "ppoe": {
            "username": "00000",
            "password": "00000",
            "network": "0.0.0.0",
            "ip": "0.0.0.0"
            },
            "bandwith" : {
                "download_min": "",
                "download_max": "",
                "upload_min": "",
                "upload_max": ""
            }
        } 
    },
    {
        "id": 1,
        "company": "WIFINECOM SRL",
        "techasset": "WIFI",
        "type": "Router",
        "vendor": "Mikrotik",
        "model": "generic",
        "mac": "00:00:00:00:00:00",
        "ipv4": "0.0.0.0",
        "ipv6": "0000:0000:0000:0000:0000:0000",
        "propDeviceStructure": {
            "firmware_version": "0.0",
            "wifi": {
            "ssid": "WIFINETCOM",
            "password": "00000",
            "mac": "",
            "ip": ""
            },
            "bandwith" : {
                "download_min": "",
                "download_max": "",
                "upload_min": "",
                "upload_max": ""
            }
        } 
    }
]