import { RoleType, IMEventCode, IMEventName } from '../../constants/enum';
import { TencentTrtc } from '../tencent';
import { InitParams, ThirdSupplier, ICommonCustomMsg, InitLiveParams } from "../../types/common";
import { Pusher, IAnswerStatus } from '../../types/pusher';
import { BaseLive } from "../common"

export class PusherClient extends BaseLive implements Pusher {
    readonly roleType = RoleType.TEACHER
    rtcWrapper!: TencentTrtc
    constructor(initParams: InitParams, commonCustomMsg: ICommonCustomMsg){
        super()
        !!initParams && this.init(initParams, commonCustomMsg)
    }
    init(initParams: InitParams, commonCustomMsg: ICommonCustomMsg){
        const { imParams, thirdName } = initParams;
        this._initIm(imParams, commonCustomMsg, initParams.roomId, thirdName?.im);
        this._initRtc(thirdName?.live);
        this._bindEvent();
    }

    private _initRtc(thirdSupplier?: ThirdSupplier){
        switch(thirdSupplier){
            case ThirdSupplier.TX :
                this.rtcWrapper = new TencentTrtc();
                break;
            default :
                this.rtcWrapper = new TencentTrtc();
                break;
        }
    }

    /**
     *  进入房间
     * @param { HTMLElement } view  渲染视频的容器
     * @param { InitLiveParams } liveParams 进入房间参数
     */
    joinRoom(liveParams: InitLiveParams){
        this.rtcWrapper.enterRoom(liveParams);
        this.im.sendPublicMessage(this._roomId,{cmd: IMEventCode.ENTER_LIVE_ROOM});
    }
    
    openCamera(view: HTMLElement){
        this.rtcWrapper.openCamera(view);
    }
    openMicrophone(){
        this.rtcWrapper.openMicrophone();
    }

    closeCamera(){
        this.rtcWrapper.closeCamera();
    }
    closeMicrophone(){
        this.rtcWrapper.closeMicrophone();
    }

    destroyTRTCInstance() {
        this.rtcWrapper.destroy();
    }

    // 退出房间
    exitRoom() {
        this.rtcWrapper.exitRoom();
    }
    /**
     *  开始直播推流
     */
    startLive(){
        // this.rtcWrapper.closeCamera();
       return  this.im.sendPublicMessage(this._roomId,{cmd: IMEventCode.START_CLASS});
    }
    startPublishing(){
        this.rtcWrapper.startPublishing(this._roomId, 0);
    }

    /**
     *  结束直播推流
     */
    endLive(needSendMsg: boolean){
        this.rtcWrapper.closeCamera();
        this.rtcWrapper.closeMicrophone();
        this.rtcWrapper.stopPublishing();
        if (needSendMsg) return this.im.sendPublicMessage(this._roomId, {cmd: IMEventCode.END_CLASS});
    }

    /**
     * @desc 设置系统当前麦克风设备的静音状态
     * @param { boolean } mute true 静音 false 取消静音
     */
    setCurrentMicphoneMute(mute: boolean){
        this.rtcWrapper.setCurrentMicphoneMute(mute);
    }

    /**
     * 关闭直播间
     */
    closeLiveRoom() {
        return this.im.sendPublicMessage(this._roomId, {cmd: IMEventCode.CLOSE_LIVE_ROOM});
    }

    setAudioMute(mute: boolean){
        this.setCurrentMicphoneMute(mute);
        this.setMicphoneMute(mute);
        mute ? this.startMute() : this.closeMute();
    }

    /**
     * 开/关麦克风
     * @param mute 
     */
    setMicphoneMute(mute: boolean){
        if(mute){
            this.rtcWrapper.closeMicrophone();
        }else {
            this.rtcWrapper.openMicrophone();
        }
        
    }


    /**
     * 私聊老师
     * @param dataContent
     * @param banType 
     * @param chatType 
     */
    sendPrivateTeacher(dataContent: string, banType: number, chatType?: number){
        const data: any = {
            dataContent,
            cmd: IMEventCode.SEND_PRIVATE_MESSAGE_TEACHER
        }
        console.log("send data", data)
        if (chatType) {
            data['dataJson'] = JSON.stringify({banType, chatType});
        } else {
            data['dataJson'] = JSON.stringify({banType});
        }
        return this.im.sendPublicMessage(this._roomId, data);
    }

    /**
     *  发布答题
     */
    startVote(message: IAnswerStatus){
        return this.im.sendPublicMessage(this._roomId, {dataJson: JSON.stringify(message), cmd: IMEventCode.START_VOTE});
    }

    /**
     * 结束答题
     */
    endVote(id: number){
        return this.im.sendPublicMessage(this._roomId, {cmd: IMEventCode.END_VOTE, dataJson: JSON.stringify({id})});
    }

    /**
     * 关闭统计结果
     */
    closeStatistics() {
        return this.im.sendPublicMessage(this._roomId, {cmd: IMEventCode.CLOSE_STATISTICS});
    }

    /**
     * 公开问答
     */
    sendQuestion(id: string) {
        return this.im.sendPublicMessage(this._roomId, {dataJson: JSON.stringify({id}), cmd: IMEventCode.SEND_QUESTION});
    }

    /**
     * 发送白板同步数据
     */
    sendTXWhiteBoardMessage(roomId: string, data: any) {
        return this.im.sendTXWhiteBoardMessage(this._roomId, {whiteBoardDataSync: data, cmd: IMEventCode.SET_DATA_SYNC_ENABLE, type: 'groupclass', roomId});
    }

    /**
     * 视频区域设为照片
     */
    setPic(pic: string) {
        return this.im.sendPublicMessage(this._roomId, {cmd: IMEventCode.SET_PIC, dataJson: JSON.stringify({teacherPic: pic})});
    }

    /**
     * 视频区域设为流
     */
    setVideo() {
        return this.im.sendPublicMessage(this._roomId, {cmd: IMEventCode.SET_VIDEO});
    }

    /**
     * 开启静音
     */
    startMute() {
        this.im.sendPublicMessage(this._roomId, {cmd: IMEventCode.START_MUTE});
    }

    /**
     * 关闭静音
     */
    closeMute() {
        this.im.sendPublicMessage(this._roomId, {cmd: IMEventCode.CLOSE_MUTE});
    }

    sendOpenCamera(){
        return this.im.sendPublicMessage(this._roomId, {cmd: IMEventCode.OPEN_CAMERA});
    }

    sendCloseCamera() {
        return this.im.sendPublicMessage(this._roomId, {cmd: IMEventCode.CLOSE_CAMERA});
    }
    /**
     * 设置屏幕共享窗口
     * @param type  桌面或者应用窗口
     * @param sourceId  
     * @param sourceName 
     */
    selectScreenCaptureTarget(type: number, sourceId: string, sourceName: string){
        this.rtcWrapper.selectScreenCaptureTarget(type, sourceId, sourceName)
    }
    /**
     * 开启屏幕共享
     */
    async startScreenShare(view?: HTMLElement): Promise<boolean> {

        return new Promise(async (resolve, reject) => {
            await this.im.sendPublicMessage(this._roomId, {cmd: IMEventCode.START_SCREEN_SHARE}).catch((err) => {
                resolve(false)
                console.error(err);
            });
            this.rtcWrapper.startScreenShare(view);
            this.emit('startScreenShare', true);
            resolve(true)
        })

        
        
    }
    /**
     * 主流合辅流
     */
    setScreenShareTranscodingConfig(mixUsersArray: any[]){
        this.rtcWrapper.setScreenShareTranscodingConfig(this._roomId, mixUsersArray )
    }
    

    /**
     * 关闭屏幕共享
     */
    async closeScreenShare(params: any): Promise<boolean>{
        return new Promise(async (resolve, reject) => {
            try {
                await this.im.sendPublicMessage(this._roomId, {cmd: IMEventCode.CLOSE_SCREEN_SHARE, dataJson: JSON.stringify(params)});
                this.rtcWrapper.stopScreenShare();
                setTimeout(() => {
                    this.emit('closeScreenShare', true);
                    resolve(true)
                },300)
            } catch(err) {
                resolve(false);
            }

        })
        
    }

    /**
     * 设置主讲权限
     */
    setLecturerPermission(userId: string){
        return this.im.sendPublicMessage(this._roomId, {cmd: IMEventCode.SET_LECTURE_PERMISSION, to: {id: +userId}});
    }

    /**
     * 设置文档权限
     */
    setDocumentPermission(userId: string){
        return this.im.sendPublicMessage(this._roomId, {cmd: IMEventCode.SET_DOCUMENT_PERMISSION, to: {id: +userId}});
    }

    /**
     * 设置主讲将老师流合流到主持人轨道
     */
    setMixTranscodingConfig(mixUsersArray: any[]){
        this.rtcWrapper.setMixTranscodingConfig(this._roomId, mixUsersArray);

    }
    cancelMixTranscodingConfig(){
        this.rtcWrapper.cancelMixTranscodingConfig()
    }

    /**
     * 拉取远端流
     */
    startRemoteView(userId: string, view: HTMLElement){
        this.rtcWrapper.startRemoteView(userId, view)
    }

    /**
     * 停止拉远端流
     */
    stopRemoteView(userId: string){
        this.rtcWrapper.stopRemoteView(userId)
    }

    /**
     * 关闭MP3
     */
    closeMP3(audioId: string) {
        return this.im.sendPublicMessage(this._roomId, {cmd: IMEventCode.CLOSE_MP3, dataJson: JSON.stringify({audioId})});
    }

    /**
     * @desc 响应事件回调
     * @param { IEvents } event 事件名
     * @param { any } args 扩展
     */

    private _bindEvent(){
        for ( let i in IMEventName){
            this.im.on(IMEventName[i as keyof typeof IMEventName], (errCode, errMsg) => {
                this.emit(IMEventName[i as keyof typeof IMEventName], errCode, errMsg)
            })
        }
        this.rtcWrapper.on('networkQuality', ( evt: any) => {
            this.emit('networkQuality', evt)
        })
        this.rtcWrapper.on('onSetMixTranscodingConfig', ( evt ) => {
            this.emit('onSetMixTranscodingConfig', evt)
        })
        this.rtcWrapper.on('onScreenCaptureStopped', (evt) => {
            this.emit('onScreenCaptureStopped', evt);
        })
    }

    /**
     * @desc 自定义事件回调
     * @param { IEvents } event 事件名
     * @param { any } args 扩展
     */
    fire(event: string, ...args: any){
        this.emit(event, args)
    }

}