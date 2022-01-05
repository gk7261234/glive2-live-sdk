export interface ImParams {
    SDKAppID: number,
    userId: string,
    userSig: string,
    groupID: string,
    meetingGroupId?: string, // 普通群id
}
export interface IEventMessage {
    cmd: string, //信令编号
    roomId: string, //直播间ID
    from: string, //发送者id
    text?: string, //消息文本内容
    file?: HTMLInputElement | File, //用于选择图片的 DOM 节点（Web）或者 File 对象（Web）,SDK 会读取其中的数据并上传图片
    data?: string,	//自定义消息的数据字段
    description?: string //自定义消息的说明字段
    extension?:	string	//自定义消息的扩展字段
}
export interface IEmiterMessage {
    to: number, //消息接收方的 userID 或 groupID
    conversationType: string, //会话类型，取值TIM.TYPES.CONV_C2C（端到端会话）或TIM.TYPES.CONV_GROUP（群组会话）
    payload: any, //消息内容
    priority?: string, //消息优先级
}
export interface IMessageFromInfo {
    id: number,
    name: string,
    role: number,
    userHeadImg: string
}
export interface IMessageToInfo {
    id: number,
    name?: string,
    role?: number,
}
export interface ICommonCustomMsg {
    cmd?: number, // 信令编号
    roomId?: string, // 直播间ID
    groupId?: string, // 分组ID
    groupName?: string, // 分组名称
    dataContent?: string, // 消息内容
    dataJson?: any, // 自定义json消息内容，例如{chatId: 213}
    from?: IMessageFromInfo, // 发送人信息
    to?: IMessageToInfo, // 接收人信息
}

export type IGetMessageHistory = () => IEventMessage[]
export type ISendMessage = (data: any) => void
export type IOnMessage = (eventName: string, ctx: IEventMessage) => void
export declare class TencentIM {
    constructor(imParams: ImParams, commonCustomMsg: ICommonCustomMsg);
    init(initParams: ImParams): void;
    on(onFun: string, callBack: (data?: any, data1?: any)=>void): void;
    getMessageHistory: IGetMessageHistory;
    sendPublicMessage(groupId: string, message: any): Promise<any>;
    sendPrivateMessage(userId: number, message: any): Promise<any>;
    onMessage: IOnMessage;
    joinGroup(onoff: boolean): void;
    quitGroup(): void;
    sendTXWhiteBoardMessage(roomId: string, data: any): Promise<any>;
}