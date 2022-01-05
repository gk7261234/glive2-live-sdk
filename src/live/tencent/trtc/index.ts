import { EventEmitter } from 'events';
import { TRTCBeautyStyle } from '../../../constants/enum';
import { TencentTrtc as RTC, InitLiveParams } from '../../../types/tencent/trtc'
declare var window: Window & {
    trtcCloud: any,
    TRTRDefine: any
}
export class TencentTrtc extends EventEmitter implements RTC{
    private _trtc: any
    _appId!: number
    constructor(){
        super()
        this._trtc = window.trtcCloud;
        this._bindEvent();
    }
    enterRoom(params: InitLiveParams){
        let param = new window.TRTRDefine.TRTCParams();
        this._appId = params.sdkAppId;
        param.role = window.TRTRDefine.TRTCRoleType.TRTCRoleAnchor;
        param.sdkAppId = params.sdkAppId;
        param.userId = params.userId;
        param.userSig = params.userSig;
        param.roomId = params.roomId;
        param.streamId = params.streamId;
        param.userDefineRecordId = params.streamId;
        this._trtc.enterRoom(param,1);
        this.setVideoEncParam(window.TRTRDefine.TRTCVideoResolution.TRTCVideoResolution_1280_720, 1024);
    }
    exitRoom() {
        this._trtc.exitRoom();
    }
    destroy() {
        this._trtc.destroy();
    }
    muteLocalVideo(mute: boolean){
        this._trtc.muteLocalVideo(mute);
    }
    startPublishing(streamId: string, type?: typeof window.TRTRDefine.TRTCVideoStreamType){
        this._trtc.startPublishing(streamId, type || 0);
    }
    stopPublishing(){
        this._trtc.stopPublishing()
    }
    startRemoteView(userId: string, view: HTMLElement, streamType?: number){
        this._trtc.startRemoteView(userId, view, streamType);
    }

    stopRemoteView(userId: string, streamType?: number){
        this._trtc.stopRemoteView(userId, streamType);
    }
    openCamera(view: HTMLElement, resolution?: number){
        // this.trtc.setVideoEncoderParam({ resolution });
        this._trtc.startLocalPreview(view);
    }
    closeCamera(){
        this._trtc.stopLocalPreview();
    }

    openMicrophone(){
        this._trtc.startLocalAudio();
        this._trtc.muteLocalAudio(false);
    }
    closeMicrophone(){
        this._trtc.startLocalAudio();
        this._trtc.muteLocalAudio(true);
    }
    /**
    * @desc 摄像头列表
    * @returns { DeviceInfo[] } 设备列表
    */
    getCameraList(){

        return this._trtc.getCameraDevicesList();
    }
    /**
     * @desc 设置要使用的摄像头
     * @param { string } 设备id
     */
    setCurrentCamera(deviceId: string){

        this._trtc.setCurrentCameraDevice(deviceId);

    }
    /**
     * @desc 麦克风列表
     * @returns { DeviceInfo[] } 设备列表
     */
    getMicphoneList(){

        return this._trtc.getMicDevicesList()
    }
    /**
     * @desc 设置要使用的麦克风
     * @param { string } 设备id
     */
    setCurrentMicphone(micId: string){
        this._trtc.setCurrentMicDevice(micId)
    }


    /**
     * @desc 设置系统当前麦克风设备的静音状态
     * @param { boolean } mute true 静音 false 取消静音
     */
    setCurrentMicphoneMute(mute: boolean){
        this._trtc.setCurrentMicDeviceMute(mute)
    }

    /**
     * @desc 获取系统当前麦克风设备是否静音
     * @returns { boolean } true 静音 false 取消静音
     */
    getCurrentMicphoneMute(){

        return this._trtc.getCurrentMicDeviceMute()
    }

    /**
     * @desc 获取扬声器列表
     * @returns { DeviceInfo[] } 设备列表
     */
    getSpeakerList(){

        return this._trtc.getSpeakerDevicesList()
    }
    setCurrentSpeaker(speakerId: string){

        this._trtc.setCurrentSpeakerDevice(speakerId)
    }
    setCurrentSpeakerMute(mute: boolean){
        this._trtc.setCurrentSpeakerDeviceMute(mute)

    }
    getCurrentSpeakerMute(){
        return this._trtc.getCurrentSpeakerDeviceMute()
    }

    /**
     * @desc 设置美颜、美白、红润效果级别
     * @param { enum@TRTCBeautyStyle }	style 美颜风格，光滑或者自然，光滑风格磨皮更加明显，适合娱乐场景。
     * @param { number } beauty 美颜级别，取值范围0 - 9，0表示关闭，1 - 9值越大，效果越明显
     * @param { number } white 美白级别，取值范围0 - 9，0表示关闭，1 - 9值越大，效果越明显
     * @param { number } ruddiness 红润级别，取值范围0 - 9，0表示关闭，1 - 9值越大，效果越明显，该参数 windows 平台暂未生效
     */
    setBeautyStyle(style: TRTCBeautyStyle, beauty: number, white: number, ruddiness: number){
        this._trtc.setBeautyStyle(style, beauty, white, ruddiness)
    }
    startCameraTest(dom: HTMLElement){
        this._trtc.startCameraDeviceTest(dom)
    }
    stopCameraTest(){
        this._trtc.stopCameraDeviceTest()
    }
    startMicphoneTest(interval: number){
        this._trtc.startMicDeviceTest(interval)
    }
    stopMicphoneTest(){
        this._trtc.stopMicDeviceTest()
    }
    startSpeakerTest(testAudioFilePath: string){
        this._trtc.startSpeakerDeviceTest(testAudioFilePath)
    }
    setCurrentSpeakerVolume(volume: number){
        this._trtc.setCurrentSpeakerVolume(volume)
    }
    getCurrentSpeakerVolume(){
        return this._trtc.getCurrentSpeakerVolume();
    }
    stopSpeakerTest(){
        this._trtc.stopSpeakerDeviceTest()
    }

    setLocalViewFillMode(isFillmode: boolean){
        this._trtc.setLocalRenderParams({ rotation: 0, fillMode: 0,  mirrorType: isFillmode ? 2 : 1 });
    }

    getScreenCaptureSources(){
        return this._trtc.getScreenCaptureSources(120,68,120,68);
    }
    selectScreenCaptureTarget(type: number, sourceId: string, sourceName: string){
        this._trtc.selectScreenCaptureTarget(type, sourceId, sourceName, { left:0, right:0 , top:0, bottom:0 }, true, false)
    }
    setVideoEncParam(videoResolution: number, videoBitrate: number) {
        let opts = new window.TRTRDefine.TRTCVideoEncParam();
        opts.videoResolution = videoResolution;
        opts.minVideoBitrate = videoBitrate;
        opts.videoBitrate = videoBitrate;
        this._trtc.setVideoEncoderParam(opts);
    }
    /**
     * 开启屏幕共享
     * @param videw 渲染共享流的dom元素
     */
    startScreenShare(videw?: HTMLElement){
        let params = new window.TRTRDefine.TRTCVideoEncParam();
        params.enableAdjustRes = false;
        params.videoFps = 15;
        params.videoResolution = window.TRTRDefine.TRTCVideoResolution.TRTCVideoResolution_1920_1080;
        params.videoBitrate = 2048;
        this.setVideoEncParam(window.TRTRDefine.TRTCVideoResolution.TRTCVideoResolution_1920_1080, 2048);
        this._trtc.startScreenCapture(videw, 2, params);
    }
    /**
     * 停止屏幕共享
     */
    stopScreenShare(){
        this._trtc.stopScreenCapture();
        this.setVideoEncParam(window.TRTRDefine.TRTCVideoResolution.TRTCVideoResolution_1280_720,1024);
    }
    /**
     * 主流合屏幕共享流
     * 
     */
     setScreenShareTranscodingConfig( streamId: string, mixUsersArray: any[] ){
        let params = new window.TRTRDefine.TRTCTranscodingConfig();
        params.mode = window.TRTRDefine.TRTCTranscodingConfigMode.TRTCTranscodingConfigMode_Manual;
        let mixUsers = new window.TRTRDefine.TRTCMixUser();
        params.streamId = streamId;
        params.audioSampleRate =  48000;
        params.audioBitrate = 64;
        params.videoWidth = 1920;
        params.videoHeight = 1080;
        params.videoBitrate = 2048;
        params.videoFramerate = 15;
        params.videoGOP = 2;
        params.mixUsersArray = mixUsersArray.map(u => ({...mixUsers, ...u}));
        console.log(params,'setScreenShareTranscodingConfig')
        this._trtc.setMixTranscodingConfig(params);
     }

    /**
     *  主持人流合主讲流
     */
    setMixTranscodingConfig( streamId: string, mixUsersArray: any[]){
        let params = new window.TRTRDefine.TRTCTranscodingConfig();
        let mixUsers = new window.TRTRDefine.TRTCMixUser();
        let rect = new window.TRTRDefine.Rect(0, 0, 1280, 720);
        params.mode = window.TRTRDefine.TRTCTranscodingConfigMode.TRTCTranscodingConfigMode_Manual;
        params.streamId = streamId;
        params.audioSampleRate =  48000;
        params.audioBitrate = 64;
        params.videoWidth = 1280;
        params.videoHeight = 720;
        params.videoBitrate = 1024;
        params.videoFramerate = 15;
        params.videoGOP = 2;
        params.mixUsersArray = mixUsersArray.map(u => ({...mixUsers, rect, ...u}));
        console.log(params,'setMixTranscodingConfig')
        this._trtc.setMixTranscodingConfig(params);
    }
    cancelMixTranscodingConfig(){
        this._trtc.setMixTranscodingConfig(null)
    }
    /**
     * @desc 响应事件回调
     * @param { IEvents } event 事件名
     * @param { any } args 扩展
     */

    private _bindEvent(){
        this._trtc.on('onNetworkQuality', ( evt: any ) => {
            this.emit('networkQuality', evt)
        })
        this._trtc.on('onTestSpeakerVolume', ( evt: any) => {
        })
        this._trtc.on('onTestMicVolume', ( evt: any) => {
            this.emit('onTestMicVolume', evt);
        })
        // this._trtc.on('onSetMixTranscodingConfig', (errCode: number, errMsg: string) => {
        //     console.log('onSetMixTranscodingConfig', errCode, errMsg)
        //     this.emit('onSetMixTranscodingConfig', {errCode, errMsg})
        // })
        this._trtc.on('onScreenCaptureStarted', () => {
            console.log('onScreenCaptureStarted', '开启屏幕共享');
        })
        this._trtc.on('onScreenCaptureStopped', (reason: string) => {
            console.log('onScreenCaptureStopped', '屏幕共享已停止');
            this.emit('onScreenCaptureStopped', { reason })
        })
        this._trtc.on('onError', (errcode: any, errmsg: any) => {
            console.info('trtc_demo: onError :' + errcode + " msg" + errmsg);
        }); 
        this._trtc.on('onEnterRoom', (elapsed: any) => {
            console.info('trtc_demo: onEnterRoom elapsed:' + elapsed);
        });
        this._trtc.on('onExitRoom', (reason: any) => {
            console.info('onExitRoom: userenter reason:' + reason);
        });
    }

}