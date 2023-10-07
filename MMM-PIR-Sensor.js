/* Magic Mirror
 * Module: MMM-PIR-Sensor
 *
 * Magic Mirror By Michael Teeuw https://magicmirror.builders
 * MIT Licensed.
 *
 * Module MMM-PIR-Sensor By Neao https://github.com/neao
 * MIT Licensed.
 */

Module.register("MMM-PIR-Sensor", {

	// 模块默认配置
	defaults: {
		sensorPin: 24, // RIR GPIO 引脚
		switchPin:25,  // 开关 GPIO 引脚
		ledPin:8,      // LED GPIO 引脚
		commandType: 'vcgencmd', // Type of command used
		hdmiPort: 'HDMI-1', // HDMI port for xrandr
		title: "Automatic Standby",
		rotation: 'normal',
		deactivateDelay: 5 * 60 * 1000, // 检测延迟5分钟
		updateInterval: 1000,            // 更新间隔1秒
		animationSpeed: 1000,            // 动画速度1秒
		showCountDown: true,             //显示倒计时
		showDetection: true,             //显示检测图标
		hoursLabel: 'h',
		minutesLabel: 'm',
		secondsLabel: 's',
		debugMode: false,
	},

	// 定义所需的样式
	getStyles: function() {
		return ["font-awesome.css"];
	},

	// 定义启动顺序
	start: function() {
		Log.info("Starting module: " + this.name);
	
		this.resetCountdown();

		this.loaded = false;   // 模块载入状态
		this.detected = false; // 检测状态
		this.sendSocketNotification("CONFIG", this.config);
	},

	// 覆盖 dom 生成器
	getDom: function() {
		var wrapper = document.createElement("div");

		if(this.config.sensorPin === 0) {
			wrapper.innerHTML = "Please set the <i>GPIO pin number</i> in the config for module: " + this.name + ".";
			wrapper.className = "dimmed light small";
			return wrapper;
		}
		
		if(!['vcgencmd', 'xrandr', 'xset'].includes(this.config.commandType)) {
			wrapper.innerHTML = "Please set <i>a command supported (vcgencmd, xrandr or xset)</i> in the config for module: " + this.name + ".";
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		if(!this.loaded) {
			wrapper.innerHTML = this.translate("LOADING");
			wrapper.className = "dimmed light small";
			return wrapper;
		}
		
		if(this.config.showCountDown) {
			if(this.config.title !== "") {
				var title = document.createElement("div");
				title.className = "light small";
				title.innerHTML = this.config.title;
				wrapper.appendChild(title);
			}

			var medium = document.createElement("div");
			medium.className = "medium";
			
			if(this.config.showDetection && this.detected) {
				var icon = document.createElement("span");
				icon.className = "fas fa-crosshairs bright";
				medium.appendChild(icon);
			}
			
			var spacer = document.createElement("span");
			spacer.innerHTML = "&nbsp;";
			medium.appendChild(spacer);
			
			var time = document.createElement("span");
			time.className = "bright";
			if(this.diffHours > 0) {
				time.innerHTML += this.diffHours + "<span class=\"dimmed small\">" + this.config.hoursLabel + "</span> ";
			}
			if(this.diffMinutes > 0) {
				time.innerHTML += this.diffMinutes + "<span class=\"dimmed small\">" + this.config.minutesLabel + "</span> " ;
			}
			time.innerHTML += this.diffSeconds + "<span class=\"dimmed small\">" + this.config.secondsLabel + "</span>";
			medium.appendChild(time);

			wrapper.appendChild(medium);
		}
		
		return wrapper;
	},

	// 使用 node_helper 接收 PIR 传感器数据
	socketNotificationReceived: function(notification, payload) {
		if(notification === "STARTED") {
			this.loaded = true;
			this.updateDom(this.config.animationSpeed);
			Log.info(this.name + ": PIR sensor start confirmed");
		} else if(notification === "USER_PRESENCE") {
			this.setIconTimeout();
			this.resetCountdown();
		} else if(notification === "POWER_ON") {
			Log.info(this.name + ": Turn on the monitor");
		} else if(notification === "POWER_OFF") {
			Log.info(this.name + ": Turn off the monitor");
		} else if(notification === "DEBUG") {
			Log.error(this.name + ": " + payload);
		}
	},

	// 将字符串的第一个字母大写
	capFirst: function (string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	},
	
	// 设置图标超时
	setIconTimeout: function() {
		this.detected = true;
		this.updateDom();
		clearTimeout(this.iconTimeout);
		
		var self = this;
		self.iconTimeout = setTimeout(function() {
				self.detected = false;
				self.updateDom();
		}, self.config.animationSpeed);
	},
	
	// 重置倒计时
	resetCountdown: function() {
		this.remainingTime = this.config.deactivateDelay;
		this.updateCountdown();
		
		clearInterval(this.countdownInterval);
		
		var self = this;
		self.countdownInterval = setInterval(function() {
			self.remainingTime -= self.config.updateInterval;
			self.updateCountdown();
			if(self.remainingTime <= 0) {
				clearInterval(self.countdownInterval);
			}
		}, self.config.updateInterval);
	},
	
	// 更新倒计时显示的变量
	updateCountdown: function() {
		this.diffHours = Math.floor((this.remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		this.diffMinutes = Math.floor((this.remainingTime % (1000 * 60 * 60)) / (1000 * 60));
		this.diffSeconds = Math.floor((this.remainingTime % (1000 * 60)) / 1000);
		
		this.updateDom();
	}

});
