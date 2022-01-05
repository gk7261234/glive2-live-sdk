// 白板初始化参数，详见https://cloud.tencent.com/document/product/1137/40000
import { IWhiteBoard } from "../common"
export interface IWhiteBoardProps {
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
    systemCursorEnable?: string, //是否启用原生系统光标，默认 false，该参数说明具体请看 setSystemCursorEnable 接口
    enableScaleTool?: boolean, //是否启用白板缩放移动工具的缩放功能，当设置为 false，切换到缩放移动工具时缩放功能不可用
    syncFps?: number, //信令同步频率，该值的允许范围为 [5, 20]，默认5帧
    proxyServer?: string, //是否为白板服务设置代理服务器，传入一个JSON格式字符串。白板服务类型可参考{@link TEduBoard.TEduBoardServiceType 服务类型}，JSON 格式可参考 setProxyServer 接口
}

export interface AddTransCodeFileParams {
    url: string,	//文件转码结果的url
    title: string,	//文件转码结果的title，也可以自定义
    pages: string | number,	//文件转码结果总页数
    resolution:	string,	//文件转码结果文件分辨率
}

export declare class TencentBoard {
    constructor(boardParams: IWhiteBoard);
    init(): void;
    on(onFun: string, callBack: (data?: any)=>void): void;
    addSyncData(data: any): void;
    getCurrentFile(): any;
    getBoardAudioList(): any;
    syncAndReload(): void;
    setDataSyncEnable(enable: boolean): void;
    setSyncAudioStatusEnable(enable: boolean): void;
    refresh(): void;
    addVideoFile(url: string): string;
    switchFile(fileId: string): void;
    pauseVideo(): void;
    showVideoControl(show: boolean): void;
    seekVideo(item: number): void;
    removeElement(id: string): any;
    setDrawEnable(enable: boolean): void;
    addTranscodeFile(config: AddTransCodeFileParams): string;
    deleteFile(fileId: string): void;
    getFileInfo(fileId: string): any;
    getBoardScale(): any;
    gotoBoard(boardId: string): void;
    redo(): void;
    undo(): void;
    clear(): void;
    setZoomDrag(): void;
    setLaser(): void;
    setEraser(): void;
    setMouse(): void;
    setRect(): void;
    setOvalDrawMode(): void;
    setLineStyle(): void;
    setPen(): void;
    setTextSize(textSize: number): void;
    setBrushThin(thin: number): void;
    setBrushColor(color: string): void;
    nextStep(): void;
    prevStep(): void;
    addBoard(): void;
    setAudioVolume(elementId: string, volume: number): void;
    seekAudio(elementId: string, volume: number): void;
    pauseAudio(elementId: string): void;
    muteAudio(elementId: string, muted: boolean): void;
    playAudio(fileId: string): void;
    addAudioElement(url: string): void;
    muteVideo(muted: boolean): void;
    getFileInfoList(): any;
    setSyncAudioStatusEnable(enable: boolean): void;
    setBoardScale(scale: number): void;
    setSyncVideoStatusEnable(enable: boolean): void;
}