const mqttConfig = {
    "enabled": true,
    "port": 1883,
    "clientsMax": 50,
    "users": [
        {
            "username": "shelly_user",
            "password": "change_me_strong"
        }
    ],
    "acl": [
        {
            "username": "shelly_user",
            "publish": [
                "shellies/+/emeter/+/+",
                "shellies/+/online",
                "shellies/+/announce"
            ],
            "subscribe": []
        }
    ]
}

export { mqttConfig }
