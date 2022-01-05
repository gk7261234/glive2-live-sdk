import { EventEmitter } from 'events';
import { RoleType, IMEventCode, IMEventName } from '../../constants/enum';
import { TencentIM, TencentTrtc } from '../tencent';
import { InitParams, ThirdSupplier, ICommonCustomMsg, ImParams, InitLiveParams } from "../../types/common";
import { Pusher, IAnswerStatus, IPrivateChatItem } from '../../types/pusher';

export class PusherClient extends EventEmitter implements Pusher {
    readonly roleType = RoleType.TEACHER
    rtcWrapper!: TencentTrtc
    im!: TencentIM
    _roomId!: string
    constructor(initParams: InitParams, commonCustomMsg: ICommonCustomMsg){
        super()
        !!initParams && this.init(initParams, commonCustomMsg)
    }
    init(initParams: InitParams, commonCustomMsg: ICommonCustomMsg){
        const { imParams, thirdName } = initParams;
        this._initIm(imParams, commonCustomMsg, thirdName?.im);
        this._initRtc(thirdName?.live);
        this._roomId = initParams.roomId;
        this._bindEvent();
    }

    private async _initIm(imParams: ImParams, commonCustomMsg: ICommonCustomMsg, thirdSupplier?: ThirdSupplier){
        await new Promise( ( resolve, reject ) => {
            switch(thirdSupplier){
                case ThirdSupplier.TX :
                    this.im = new TencentIM(imParams, commonCustomMsg)
                default :
                    this.im = new TencentIM(imParams,commonCustomMsg)
            }
            this.im.on('im-ready', (joinGroupStatus) => {
                console.log('——————————————im组件加载成功————————————————')
                this.emit('im-ready', joinGroupStatus)
                resolve( true )
            })
            this.im.on('im-error', (error) => {
                console.log('——————————————im组件加载失败————————————————')
                console.log(error)
                this.emit('im-error')
                reject( 'im组件初始化失败' )
            })
            this.im.on('im-disconnected', (data) => {
                this.emit('im-disconnected', data);
            })
            this.im.on('joinStatus', (data) => {
                this.emit('joinStatus', data);
            })
        })
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
     * 发送公聊
     */
    sendPublicChat(dataContent: string, banType: number, chatType?: number){
        const data: any = {
            dataContent,
            cmd: IMEventCode.SEND_PUBLIC_MESSAGE
        }
        if (chatType) {
            data['dataJson'] = JSON.stringify({banType, chatType});
        } else {
            data['dataJson'] = JSON.stringify({banType});
        }
        return this.im.sendPublicMessage(this._roomId, data);
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
     *
     * 发送私聊
     */
    sendPrivateChat(userInfo: IPrivateChatItem, dataContent: string, banType: number, chatType?: number){
        if (!userInfo?.userId) return;
        const data: any = {
            dataContent,
            cmd: IMEventCode.SEND_PRIVATE_MESSAGE,
            to: {
                id: userInfo.userId,
                name: userInfo.userName,
                role: userInfo.roleType
            }
        };
        if (chatType) {
            data['dataJson'] = JSON.stringify({banType, chatType});
        } else {
            data['dataJson'] = JSON.stringify({banType});
        }
        return this.im.sendPrivateMessage(userInfo.userId, data);
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
     * 回复问题
     */
    replyQuestion(reply: any) {
        let data = {
            dataContent: reply.message,
            cmd: IMEventCode.REPLY_QUESTION,
            dataJson: JSON.stringify({id: reply.id})
        };
        return this.im.sendPublicMessage(this._roomId, data);
    }

    /**
     * 公开问答
     */
    sendQuestion(id: string) {
        return this.im.sendPublicMessage(this._roomId, {dataJson: JSON.stringify({id}), cmd: IMEventCode.SEND_QUESTION});
    }

     /**
      * 取消公开问答
      */
    cancelQuestionPublic(params: any) {
        return this.im.sendPublicMessage(this._roomId, {dataJson: JSON.stringify(params), cmd: IMEventCode.CANCEL_QUESTION_PUBLIC});
    }

    /**
     * 全体禁言
     */
    allBanChat() {
        return this.im.sendPublicMessage(this._roomId, {cmd: IMEventCode.ALL_BAN_CHAT});
    }

    /**
     * 解除全体禁言
     */
    allUnBanChat() {
        return this.im.sendPublicMessage(this._roomId, {cmd: IMEventCode.ALL_UNBAN_CHAT});
    }

    /**
     * 聊天禁言
     */
    banChat(userId: number) {
        return this.im.sendPublicMessage(this._roomId, {to: {id: userId}, cmd: IMEventCode.BAN_CHAT});
    }

    /**
     * 聊天禁言并删除历史记录
     */
    banDeleteChat(userId: number) {
        return this.im.sendPublicMessage(this._roomId, {to: {id: userId}, cmd: IMEventCode.BAN_DELETE_CHAT});
    }

    /**
     * 解除禁言
     */
    unBanChat(userId: number) {
        return this.im.sendPublicMessage(this._roomId, {to: {id: userId}, cmd: IMEventCode.UNBAN_CHAT});
    }

    /**
     * 聊天删除
     */
    deleteChat(id: number) {
        return this.im.sendPublicMessage(this._roomId, {dataJson: JSON.stringify({id}), cmd: IMEventCode.DELETE_CHAT});
    }

    /**
     * 新增公告
     */
    addAnnouncement(dataContent: string) {
        return this.im.sendPublicMessage(this._roomId, {dataContent, cmd: IMEventCode.ADD_ANNOUNCEMENT});
    }


    /**
     * 踢出直播间
     */
    kickOutLiveRoom(userId: number) {
        return this.im.sendPrivateMessage(userId, {to: {id: userId}, cmd: IMEventCode.KICK_OUT_LIVE_ROOM});
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
     * 加入群聊
     */
    joinGroup(onoff: boolean) {
        this.im.joinGroup(onoff);
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