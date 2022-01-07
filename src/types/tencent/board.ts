// 白板初始化参数，详见https://cloud.tencent.com/document/product/1137/40000
import { EventEmitter } from 'events';
import { IWhiteBoard } from "../common"
export interface AddTransCodeFileParams {
    url: string,	//文件转码结果的url
    title: string,	//文件转码结果的title，也可以自定义
    pages: string | number,	//文件转码结果总页数
    resolution:	string,	//文件转码结果文件分辨率
}

export interface BoardInfo {
    boardId: string
    backgroundColor: string
    backgroundUrl: string
}

export interface FileInfo {
    boardInfoList: BoardInfo[]
    currentPageIndex: number
    currentPageStep: number
    downloadURL: string
    fid: string
    pageCount: number
    platform: string
    progress: number
    ratio: string
    scale: number
    status: number
    timestamp: number
    title: string
    type: number
    uid: string
    fileType: number
} 

export interface BoardElement {
    boardId: string
    elementId: string
    type: number
    url: string
}

export declare class TencentBoard extends EventEmitter {
    constructor(boardParams: IWhiteBoard);
    init(): void;
    addSyncData(data: any): void;
    getCurrentFile(): string;
    getBoardAudioList(): BoardElement[];
    syncAndReload(): void;
    setDataSyncEnable(enable: boolean): void;
    setSyncAudioStatusEnable(enable: boolean): void;
    refresh(): void;
    addVideoFile(url: string): string;
    switchFile(fileId: string): void;
    pauseVideo(): void;
    showVideoControl(show: boolean): void;
    seekVideo(item: number): void;
    removeElement(id: string): boolean;
    setDrawEnable(enable: boolean): void;
    addTranscodeFile(config: AddTransCodeFileParams): string;
    deleteFile(fileId: string): void;
    getFileInfo(fileId: string): FileInfo;
    getBoardScale(): number;
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
    addBoard(): string;
    setAudioVolume(elementId: string, volume: number): void;
    seekAudio(elementId: string, volume: number): void;
    pauseAudio(elementId: string): void;
    muteAudio(elementId: string, muted: boolean): void;
    playAudio(fileId: string): void;
    addAudioElement(url: string): string;
    muteVideo(muted: boolean): void;
    getFileInfoList(): FileInfo[];
    setSyncAudioStatusEnable(enable: boolean): void;
    setBoardScale(scale: number): void;
    setSyncVideoStatusEnable(enable: boolean): void;
}