import { InitParams, ICommonCustomMsg, InitLiveParams } from "./common"

export interface IReplyVote {
    id: number,
    submitOptions: string,
}

export interface IPrivateChatItem {
    userName: string,
    userId?: number,
    roleType?: number,
    roomId?: string,
    nick?: string,
}

export interface PlayParams {
    view: HTMLElement,
    playUrl: string
}

export declare class Player {
    constructor(liveParams: InitParams, IMCommonCustomMsg: ICommonCustomMsg);
    // init(liveParams: InitParams, IMCommonCustomMsg: ICommonCustomMsg): void
    on(onFun: string, callBack: (data?: any, data1?: any)=>void): void
    enterRoom(teacherId: number): Promise<any>
    joinGroup(onoff: boolean): void
    sendPublicChat(dataContent: string, banType: number, chatType?: number): Promise<any>
    sendPrivateTeacher(dataContent: string, banType: number, chatType?: number): Promise<any>
    sendPrivateChat(userInfo: IPrivateChatItem, dataContent: string, banType: number, chatType?: number): Promise<any> | void
    sendQuestion(dataContent: string): Promise<any> //发起提问
    replayVote(userId: number, answer: IReplyVote): Promise<any>  // 提交答题
    destroy(): void //销毁
    stopPlay(): void
    startPlay(playUrl: string): void
    joinRoom(liveParams: PlayParams): void
    quitGroup(): void
    replyQuestion(reply: any): Promise<any>
    publicQuestion(id: string): Promise<any>
    cancelQuestionPublic(params: any): Promise<any>
    allBanChat(): Promise<any>
    allUnBanChat(): Promise<any>
    banChat(userId: number): Promise<any>
    banDeleteChat(userId: number): Promise<any>
    unBanChat(userId: number): Promise<any>
    deleteChat(id: number): Promise<any>
    addAnnouncement(dataContent: string): Promise<any>
    kickOutLiveRoom(userId: number): Promise<any>
}