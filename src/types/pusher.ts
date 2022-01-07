import { BaseLive, InitParams, ICommonCustomMsg, InitLiveParams } from "./common"
import { TencentTrtc } from './tencent/trtc';
export interface IAnswerStatus {
    questionOptions: string, // 题目选项
    answerType: number, // 题目类型 1：单选 2：多选 3：判断题
    timeLimit: number, // 答题时间 1：30s、2：60s、3：2min、4：5min
    answerRestTime?: number, // 剩余时间（秒）
    visible?: boolean, // 弹窗展示
    correctOptions?: string, // 正确选项
    userAnswer?: string, // 用户提交的答案
    answerCreateTime?: string, // 问题创建时间
    questionId?: number, // 题目id
    id?: number, // 题目id 
}

export interface IPrivateChatItem {
    userName: string,
    userId?: number,
    roleType?: number,
    roomId?: string,
    nick?: string,
}

export declare class Pusher extends BaseLive {
    rtcWrapper: TencentTrtc
    constructor(imParams: InitParams, commonCustomMsg: ICommonCustomMsg);
    init(liveParams: any, IMCommonCustomMsg: ICommonCustomMsg): void
    sendPrivateTeacher(dataContent: string, banType: number, chatType?: number): Promise<any>
    startLive(): Promise<any>   // 开始上课
    endLive(needSendMsg: boolean): Promise<any> | void     // 结束上课
    startVote(message: IAnswerStatus): Promise<any> // 发布答题
    endVote(id: number): Promise<any> // 结束答题
    voteStatistics?(): Promise<any> //答题统计
    logout?(): Promise<any> //登出
    destroy?(): void //销毁
    startRemoteView(_userId: string, _view: HTMLElement): void
    stopRemoteView(_userId: string): void
    closeScreenShare(params: any): Promise<Boolean>
    sendOpenCamera(): Promise<any>
    setCurrentMicphoneMute(mute: boolean): void
    closeCamera(): void
    sendTXWhiteBoardMessage(roomId: string, data: any): Promise<any>
    openCamera(view: HTMLElement): void
    sendCloseCamera(): Promise<any>
    joinRoom(liveParams: InitLiveParams): void
    destroyTRTCInstance(): void
    exitRoom(): void
    startPublishing(): void
    setScreenShareTranscodingConfig(mixUsersArray: any[]): void
    setMicphoneMute(mute: boolean): void
    setMixTranscodingConfig(mixUsersArray: any[]): void
    cancelMixTranscodingConfig(): void
    closeLiveRoom(): Promise<any>
    closeStatistics(): Promise<any>
    setAudioMute(mute: boolean): void
    sendQuestion(id: string): Promise<any>
    setPic(pic: string): Promise<any>
    setVideo(): Promise<any>
    closeMP3(audioId: string): Promise<any>
    setLecturerPermission(userId: string): Promise<any>
    setDocumentPermission(userId: string): Promise<any>
    selectScreenCaptureTarget(type: number, sourceId: string, sourceName: string): void
    startScreenShare(view?: HTMLElement): Promise<boolean>
}