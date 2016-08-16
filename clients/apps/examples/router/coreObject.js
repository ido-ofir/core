
window.__coreObject = {
    "core": {
        "config": {
            "dev": {
                "ws": "ws://localhost:8001"
            }
        },
        "router": {
            "animation": {
                "name": "koko",
                "duration": 600
            },
            "home": "/first",
            "map": [
                {
                    "name": "first",
                    "component": "first",
                    "defaultChild": "second",
                    "children": [
                        {
                            "name": "second",
                            "component": "second",
                            "children": []
                        },
                        {
                            "name": "third",
                            "component": "third",
                            "children": []
                        }
                    ]
                },
                {
                    "name": "second",
                    "component": "second",
                    "defaultChild": "first",
                    "children": [
                        {
                            "name": "first",
                            "component": "first",
                            "children": []
                        },
                        {
                            "name": "third",
                            "component": "third",
                            "children": []
                        }
                    ]
                }
            ],
            "hash": "",
            "encodeURI": false
        },
        "templates": [],
        "views": [],
        "collections": [],
        "forms": [
            {
                "name": "otherForm",
                "inputs": {
                    "name": {
                        "type": "string",
                        "label": "Name",
                        "value": "bbbbb",
                        "required": true,
                        "validations": []
                    },
                    "lastName": {
                        "label": "Last Name",
                        "type": "array",
                        "value": [
                            "four"
                        ],
                        "validations": [
                            "max:8",
                            "phone"
                        ],
                        "options": [
                            "one",
                            "two",
                            "three"
                        ]
                    }
                }
            }
        ],
        "styles": [
            {
                "name": "box",
                "id": "abc",
                "body": {
                    "position": "absolute",
                    "background": "{background.primary}"
                }
            }
        ],
        "language": {
            "key": "en"
        },
        "theme": {
            "font": "Noto Sans",
            "palletes": [
                {
                    "name": "primary",
                    "pallete": {
                        "normal": "#a5d6a7",
                        "hover": "#37474f",
                        "active": "#607d8b",
                        "disabled": "#c3c7ca"
                    }
                },
                {
                    "name": "secondary",
                    "pallete": {
                        "normal": "#0099cc",
                        "hover": "#03a9f4",
                        "active": "#42a5f5",
                        "disabled": "#b2e0f0"
                    }
                },
                {
                    "name": "success",
                    "pallete": {
                        "normal": "#68bd49",
                        "hover": "#49a42f",
                        "active": "#8bc34a",
                        "disabled": "#d1ebc8"
                    }
                },
                {
                    "name": "error",
                    "pallete": {
                        "normal": "#82b1ff",
                        "hover": "#c63836",
                        "active": "#f06292",
                        "disabled": "#f3cbcb"
                    }
                }
            ],
            "colors": {
                "primary": "#374650",
                "secondary": "#0099cc",
                "success": "#68bd49",
                "error": "#d75452",
                "text": "#9ba2a7",
                "border": "#ddd",
                "lightBorder": "#eee",
                "default": "#ffffff"
            },
            "backgrounds": {
                "primary": "#fafafa",
                "secondary": "#E8E9EA",
                "highlight": "#f0f5f8"
            },
            "hovers": {
                "primary": "#212C34",
                "secondary": "#005ca3",
                "success": "#49a42f",
                "error": "#c63836",
                "text": "#5f6b73"
            },
            "active": {
                "primary": "#2c3942",
                "secondary": "#0099cc",
                "success": "#49a42f",
                "error": "#c63836",
                "text": "#f0f5f8"
            },
            "inactive": {
                "primary": "#c3c7ca",
                "secondary": "#b2e0f0",
                "success": "#d1ebc8",
                "error": "#f3cbcb"
            },
            "shadow": "0px 0px 12px -4px rgba(0,0,0,1)",
            "padding": {
                "small": "4px"
            }
        }
    },
    "stuff": "abcd"
};