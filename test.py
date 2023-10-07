#!/usr/bin/env python
#-- coding: utf-8 --

import time
import RPi.GPIO as GPIO
GPIO.setwarnings(False)

sensorPin = 24
switchPin = 25
ledPin = 8
lastMessures = 0
interval = 0.5

POWER = True

#处理按钮事件

def pirEventHandler(pin):
    print("USER_PRESENCE")
    GPIO.output(ledPin, POWER)
    time.sleep(1)
    GPIO.output(ledPin, 1)
    time.sleep(1)
    GPIO.output(ledPin, 0)
    time.sleep(1)
    GPIO.output(ledPin, (not POWER))
    time.sleep(1)


def switchEventHandler(pin):
    print("CLICK")
    global lastMessures
    global POWER
    curTimestamp = time.time()
    if (curTimestamp - lastMessures) > 0.5:
        lastMessures = curTimestamp
    else:
        print("DOUBLECLICK")
        POWER = not POWER
        if POWER:
            print("POWER_ON")
            GPIO.output(ledPin, 0)
        else:
            print("POWER_OFF")
            GPIO.output(ledPin, 1)
    




GPIO.setmode(GPIO.BCM)

GPIO.setup(sensorPin,GPIO.IN)
GPIO.setup(switchPin,GPIO.IN,pull_up_down=GPIO.PUD_UP)
GPIO.setup(ledPin,GPIO.OUT)


GPIO.add_event_detect(sensorPin,GPIO.RISING,callback=pirEventHandler, bouncetime=100)
GPIO.add_event_detect(switchPin,GPIO.FALLING,callback=switchEventHandler, bouncetime=100)


# turn off both LEDs
GPIO.output(ledPin,0)


# make the red LED flash
while True:
    time.sleep(1)


GPIO.cleanup()
