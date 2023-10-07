#!/usr/bin/env python
#-- coding: utf-8 --

#导入必要的库
import RPi.GPIO as GPIO
import time, argparse

#初始化变量
sensorPin = None
switchPin = None
ledPin = None
lastMessures = None
interval = None

POWER = True 



#获取参数
parser = argparse.ArgumentParser()
parser.add_argument("sensorPin", type=int, help="The pin of the PIR sensor.")
args = parser.parse_args()

sensorPin = args.sensorPin
switchPin = 25
ledPin = 8
lastMessures = time.time()
interval = 0.5

def pirEventHandler(pin):
    if POWER:
        print("USER_PRESENCE")
    # GPIO.output(ledPin, POWER)
    # time.sleep(0.5)
    # GPIO.output(ledPin, 1)
    # time.sleep(0.5)
    # GPIO.output(ledPin, 0)
    # time.sleep(0.5)
    # GPIO.output(ledPin, (not POWER))
    # time.sleep(0.5)


def switchEventHandler(pin):
    # print("CLICK")
    global lastMessures
    global POWER
    curTimestamp = time.time()
    if (curTimestamp - lastMessures) > interval:
        lastMessures = curTimestamp
    else:
        # print("DOUBLECLICK")
        POWER = not POWER
        if POWER:
            print("POWER_ON")
            GPIO.output(ledPin, 0)
        else:
            print("POWER_OFF")
            GPIO.output(ledPin, 1)
 


#配置GPIO
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)

GPIO.setup(sensorPin,GPIO.IN)
GPIO.setup(switchPin,GPIO.IN,pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(ledPin,GPIO.OUT)

GPIO.output(ledPin, 0)

GPIO.add_event_detect(sensorPin,GPIO.BOTH,callback=pirEventHandler, bouncetime=500)
GPIO.add_event_detect(switchPin,GPIO.FALLING,callback=switchEventHandler, bouncetime=100)

# 指示 PIR 传感器启动
print("PIR_START")

#脚本
try:
	time.sleep(2) #延迟2秒等传感器稳定
	
	#无限循环
	while True:

		# GPIO.output(ledPin, 1)
		# time.sleep(0.1)
		# GPIO.output(ledPin, 0)
		time.sleep(0.1)

finally:
	GPIO.cleanup()
