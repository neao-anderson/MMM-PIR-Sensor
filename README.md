# Module: MMM-PIR-Sensor-Lite
This module manage monitor with PIR motion sensor (automatic standby when presence isn't detected).

Title, countdown and dectetion icon display may be enabled or disabled. 

[MagicMirror Project on Github](https://github.com/MichMich/MagicMirror)

## Installation:

In your terminal, go to your MagicMirror's Module folder:
```shell
cd ~/MagicMirror/modules
```

Clone this repository:
```shell
git clone https://github.com/grenagit/MMM-PIR-Sensor
```

Go to your MMM-PIR-Sensor-Lite's Module folder:
```shell
cd ~/MagicMirror/modules/MMM-PIR-Sensor
```

Install dependencies:
```shell
npm install
```

Configure the module in your config.js file.

## Update:

In your terminal, go to your MMM-PIR-Sensor-Lite's Module folder:
```shell
cd ~/MagicMirror/modules/MMM-PIR-Sensor
```

Incorporate changes from this repository:
```shell
git pull
```

Install dependencies:
```shell
npm install
```

## Configuration:

### Basic configuration

To use this module, add it to the modules array in the `config/config.js` file:
```javascript
modules: [
	{
		module: "MMM-PIR-Sensor",
		position: "top_right",
		config: {
			sensorPin: 2, // GPIO pin
		}
	}
]
```

### Options

The following properties can be configured:


| Option                       | Description
| ---------------------------- | -----------
| `sensorPin`                  | The [GPIO pin](https://pinout.xyz/) of the sensor. <br><br> This value is **REQUIRED**
| `title`                      | The title. It's hidden if `title: ""` <br><br> **Default value:** `Automatic Standby`
| `deactivateDelay`            | How often does the content needs to be fetched? (Milliseconds) <br><br> **Possible values:** `1000` - `86400000` <br> **Default value:** `15 * 60 * 1000` (15 minutes)
| `updateInterval`             | How often does the countdown needs to be updated? (Milliseconds) <br><br> **Possible values:**`0` - `5000` <br> **Default value:** `1000` (1 second)
| `animationSpeed`             | Speed of the update animation. (Milliseconds) <br><br> **Possible values:**`0` - `5000` <br> **Default value:** `1000` (1 second)
| `showCountDown`              | Show the countdown. <br><br> **Possible values:** `true` or `false` <br> **Default value:** `true`
| `showDetection `             | Show an icon at each presence detection. <br><br> **Possible values:** `true` or `false` <br> **Default value:** `true`
| `hoursLabel`                 | Hours label <br> **Default value:** `h`
| `minutesLabel`               | Minutes label <br> **Default value:** `m`
| `secondsLabel`               | Seconds label <br> **Default value:** `s`

### License

This module is licensed under the MIT License
