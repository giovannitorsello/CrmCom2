export JAVA_HOME=/media/torsello/WorkDisk/IDE_Programmi_SviluppoSoftware/java/jdk8/
export ANDROID_SDK_ROOT=/media/torsello/WorkDisk/IDE_Programmi_SviluppoSoftware/Android/SDK/
export PATH=$PATH:${ANDROID_SDK_ROOT}/emulator/



##### Start emulator once time#########
pid_emulator=`ps -Al | grep "emulator" | awk 'BEGIN{FS=" "}{print $4}'`
if [ az $pid ]
then
	${ANDROID_SDK_ROOT}/emulator/emulator -avd Pixel_3a_API_29 &
fi


npm run cordova-serve-android
#cordova build
#cordova emulate android

