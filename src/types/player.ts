import { EventEmitter } from 'events';
import { InitParams, ICommonCustomMsg } from "./common"

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

export declare class Player extends EventEmitter {
    constructor(liveParams: InitParams, IMCommonCustomMsg: ICommonCustomMsg);
    enterRoom(teacherId: number): Promise<any>
    sendPrivateTeacher(dataContent: string, banType: number, chatType?: number): Promise<any>
    sendQuestion(dataContent: string): Promise<any> //发起提问
    replayVote(userId: number, answer: IReplyVote): Promise<any>  // 提交答题
    destroy(): void //销毁
    stopPlay(): void
    startPlay(playUrl: string): void
    joinRoom(liveParams: PlayParams): void
    quitGroup(): void
    publicQuestion(id: string): Promise<any>
    cancelQuestionPublic(params: any): Promise<any>
}