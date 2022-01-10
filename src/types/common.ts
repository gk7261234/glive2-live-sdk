import { EventEmitter } from 'events';
export interface ImParams {
    SDKAppID: number,
    userId: string,
    userSig: string,
    groupID: string,
    meetingGroupId?: string, // 普通群id
}

export enum ThirdSupplier {
    TX,
    GD
}

export type ThirdName = {
    im: ThirdSupplier
    board: ThirdSupplier
    live: ThirdSupplier
}

export interface InitParams {
    imParams: ImParams,
    roomId: string,
    thirdName?: ThirdName,
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

export interface InitLiveParams {
    sdkAppId: number,
    userId: string,
    userSig: string,
    roomId: number,
    streamId: string,
}

export interface IWhiteBoard {
    classId: string, //课堂 ID
    sdkAppId: number, //腾讯云应用的唯一标识
    userId: string, //用户名
    userSig: string, //登录鉴权信息
    ratio?: string, //默认白板宽高比（可传格式如“4:3”、“16:9”的字符串），默认值 "16:9"
    drawEnable?: boolean, //是否允许涂鸦，默认值 true
    textStyle?: number, //文本样式（0：常规；1：粗体；2：斜体；3：粗斜体），默认值 TEduBoard.TEduBoardTextStyle.TEDU_BOARD_TEXT_STYLE_NORMAL 文本样式
    textSize?: number, //文本大小，默认值 320，实际像素值取值(textSize * 白板的高度 / 10000)px
    textColor?: string, //文本颜色，默认值 #000000
    brushColor?: string, //画笔颜色，默认值 #ff0000
    brushThin?: number, //画笔粗细，默认值 100，实际像素值取值(brushThin * 白板的高度 / 10000)px
    toolType?: number, //白板工具，默认值 TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_PEN 工具类型
    globalBackgroundColor?: string, //全局背景色，默认值 #ffffff
    boardContentFitMode?: number, //内容自适应模式，默认值 TEduBoard.TEduBoardContentFitMode.TEDU_BOARD_CONTENT_FIT_MODE_NONE 白板内容自适应模式
    dataSyncEnable?: boolean, //是否启用数据同步，禁用后将导致本地白板操作不会被同步给远端，默认值 true
    scale?:	number, //白板默认缩放系数，实际缩放倍数为 scale/100，默认值 100
    preloadDepth?: number, //图片预加载深度，默认值 5，表示预加载当前页前后5页的图片
    progressEnable?: boolean, //是否启用 SDK 内置 Loading 图标，默认值 false
    progressBarUrl?: string, //自定义加载图标，在 progressEnable = true 时生效，支持 jpg、gif、png、svg
    systemCursorEnable?: boolean, //是否启用原生系统光标，默认 false，该参数说明具体请看 setSystemCursorEnable 接口
    enableScaleTool?: boolean, //是否启用白板缩放移动工具的缩放功能，当设置为 false，切换到缩放移动工具时缩放功能不可用
    syncFps?: number, //信令同步频率，该值的允许范围为 [5, 20]，默认5帧
    proxyServer?: string, //是否为白板服务设置代理服务器，传入一个JSON格式字符串。白板服务类型可参考{@link TEduBoard.TEduBoardServiceType 服务类型}，JSON 格式可参考 setProxyServer 接口
}

// 消息体
export interface ImResponseMsg {
    cmd?: number,
    id?: number,
    userId?: number,
    userName?: string, // 用户名称
    userHeadImg?: string,
    roleType?: number,
    groupId?: string, // 分组Id
    groupName?: string,
    content?: string,
    roomId?: string,
    toUserId?: number,
    toUserName?: string,
    toRoleType?: number,
    whiteBoardDataSync?: any, // 同步白板数据
    answerStatus?: any, // 答题题目
    question?: any, // 问答
    statistics?: any, // 答题统计
    chatType?: number, // 聊天类型
    privateList?: any, // 私聊列表
    teacherPic?: string, // 视频区域为教师图片
    teacherPicInfo?: any, // 视频区域数据
    audioId?: any,
    chatTime?: string,
}

export interface IPrivateChatItem {
    userName: string,
    userId?: number,
    roleType?: number,
    roomId?: string,
    nick?: string,
}

export declare class BaseLive extends EventEmitter {
    joinGroup(onoff: boolean): void
    sendPublicChat(dataContent: string, banType: number, chatType?: number): Promise<any>
    sendPrivateChat(userInfo: IPrivateChatItem, dataContent: string, banType: number, chatType?: number): Promise<any> | void
    deleteChat(id: number): Promise<any>
    banDeleteChat(userId: number): Promise<any>
    banChat(userId: number): Promise<any>
    unBanChat(userId: number): Promise<any>
    allBanChat(): Promise<any>
    allUnBanChat(): Promise<any>
    replyQuestion(reply: any): Promise<any>
    cancelQuestionPublic(params: any): Promise<any>
    addAnnouncement(dataContent: string): Promise<any>
    kickOutLiveRoom(userId: number): Promise<any>
} 

