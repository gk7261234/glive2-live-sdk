import { EventEmitter } from 'events';
export interface  ScreenCaptureSourceInfo{
    sourceId: string
    sourceName:	 string
    thumbBGRA: any
    iconBGRA: any
    thumbImage?: string
    isMinimizeWindow:	boolean
    type: number
}
export interface DeviceInfo {
    deviceId: string
    deviceName: string
}
export interface InitLiveParams {
    sdkAppId: number,
    userId: string,
    userSig: string,
    roomId: number,
    streamId: string,
}
export declare class TencentTrtc extends EventEmitter {
    startPublishing(streamId: string, type?: number): void;
    stopPublishing(): void;
    setDefaultStreamRecvMode?(autoRecvAudio: boolean, autoRecvVideo: boolean): void;
    muteLocalVideo?(mute: boolean): void;
    startRemoteView(userId: string, view: HTMLElement, streamType?: number): void;
    openCamera(view: HTMLElement, resolution?: number): void;
    closeCamera(): void;
    openMicrophone(): void;
    closeMicrophone(): void;
    /**
     * @desc 摄像头列表
     * @returns { DeviceInfo[] } 设备列表
     */
    getCameraList(): DeviceInfo[]
    /**
     * @desc 设置要使用的摄像头
     * @param { string } 设备id
     */
    setCurrentCamera(deviceId: string): void
    /**
     * @desc 麦克风列表
     * @returns { DeviceInfo[] } 设备列表
     */
    getMicphoneList(): DeviceInfo[]
    /**
     * @desc 设置要使用的麦克风
     * @param { string } 设备id
     */
    setCurrentMicphone(micId: string): void


    /**
     * @desc 设置系统当前麦克风设备的静音状态
     * @param { boolean } mute true 静音 false 取消静音
     */
    setCurrentMicphoneMute(mute: boolean): void

    /**
     * @desc 获取系统当前麦克风设备是否静音
     * @returns { boolean } true 静音 false 取消静音
     */
    getCurrentMicphoneMute(): boolean

    /**
     * @desc 获取扬声器列表
     * @returns { DeviceInfo[] } 设备列表
     */
    getSpeakerList(): DeviceInfo[]
    setCurrentSpeaker(speakerId: string): void
    setCurrentSpeakerMute(mute: boolean): void
    getCurrentSpeakerMute(): boolean

    /**
     * @desc 设置美颜、美白、红润效果级别
     * @param { enum@TRTCBeautyStyle }	style 美颜风格，光滑或者自然，光滑风格磨皮更加明显，适合娱乐场景。
     * @param { number } beauty 美颜级别，取值范围0 - 9，0表示关闭，1 - 9值越大，效果越明显
     * @param { number } white 美白级别，取值范围0 - 9，0表示关闭，1 - 9值越大，效果越明显
     * @param { number } ruddiness 红润级别，取值范围0 - 9，0表示关闭，1 - 9值越大，效果越明显，该参数 windows 平台暂未生效
     */
    setBeautyStyle(style: number, beauty: number, white: number, ruddiness: number): void
    startCameraTest(dom: HTMLElement): void
    stopCameraTest(): void
    startMicphoneTest(interval: number): void
    stopMicphoneTest(): void
    startSpeakerTest(testAudioFilePath: string): void
    stopSpeakerTest(): void
    destroy(): void;
    exitRoom(): void;
    selectScreenCaptureTarget(type: number, sourceId: string, sourceName: string): void;
    startScreenShare(view?: HTMLElement): void;
    setScreenShareTranscodingConfig(roomId: string, mixUsersArray: any[]): void;
    stopScreenShare(): void;
    setMixTranscodingConfig(roomId: string, mixUsersArray: any[]): void;
    cancelMixTranscodingConfig(): void;
    stopRemoteView(userId: string): void;
    enterRoom(liveParams: InitLiveParams): void;
    setCurrentSpeakerVolume(volume: number): void;
    setLocalViewFillMode(isFileMode: boolean): void;
    getScreenCaptureSources():  ScreenCaptureSourceInfo[];
}