PATH=$PATH:/opt/node-v14.17.0-linux-x64/bin
export JAVA_HOME="/home/torsello/SviluppoSoftware/IDE/java/jdk8"
export ANDROID_HOME="$HOME/SviluppoSoftware/Android/Sdk"
export ANDROID_SDK_ROOT="$HOME/SviluppoSoftware/Android/Sdk/"
export PATH=$PATH:$ANDROID_SDK_ROOT/tools; PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools


#export JAVA_HOME=/media/torsello/WorkDisk/IDE_Programmi_SviluppoSoftware/java/jdk8/
export PATH=$PATH:${ANDROID_SDK_ROOT}/emulator/
export HOSTNAME=127.0.0.1
#quasar build -m cordova -T android 
#-t mat

##### Start emulator once time#########
pid_emulator=`ps -Al | grep "emulator" | awk 'BEGIN{FS=" "}{print $4}'`
if [ az $pid ]
then
	${ANDROID_SDK_ROOT}/emulator/emulator -avd Nexus6API30 &
fi


quasar dev -m cordova -T android
