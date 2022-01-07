
import { EventEmitter } from 'events';
import EraserImg from "../../../assets/icon/eraser.png"
import { TencentBoard as BoardClass, AddTransCodeFileParams, FileInfo, BoardElement } from "../../../types/tencent/board"
import { IWhiteBoard } from '../../../types/common';
declare var window: Window & {
    TEduBoard: any,
}
export class TencentBoard extends EventEmitter implements BoardClass {
    _teduBoard: any;
    boardParams!: IWhiteBoard
    constructor(boardParams: IWhiteBoard){
        super()
        this.boardParams = boardParams;
    }

    init(){
        if (this._teduBoard) {
            this._teduBoard.destroy();
        }
        this._teduBoard = new window.TEduBoard(this.boardParams);
        // 授权视频文件播放
        window.TEduBoard.applyVideoPermission();
        window.TEduBoard.hasVideoPermission();
        // 设置当前白板页宽高比
        this._teduBoard.setBoardRatio('16:9');
        // 设置白板开启数据同步
        this._teduBoard.setDataSyncEnable(true);
        //白板初始化事件
        this._teduBoard.on(window.TEduBoard.EVENT.TEB_INIT, () => {
            this.emit('init');
        });
         // 监听白板错误事件
        this._teduBoard.on(window.TEduBoard.EVENT.TEB_ERROR, (code: any, msg: any) => {
            this.emit('error', code);
            console.log(code,msg)
        });
        // 监听白板告警事件
        this._teduBoard.on(window.TEduBoard.EVENT.TEB_WARNING, (code: any, msg: any) => {
            console.log(code,msg)
        });
        // 监听新增白板事件
        this._teduBoard.on(window.TEduBoard.EVENT.TEB_ADDBOARD, (boardIds: string[], fileId: string) => {
            this.emit('initalAddBoard', boardIds);
        });
        this._teduBoard.on(window.TEduBoard.EVENT.TEB_SYNCDATA, (data: any) => {
            this.emit('TEB_SYNCDATA', data);
        });
        this._teduBoard.on(window.TEduBoard.EVENT.TEB_HISTROYDATA_SYNCCOMPLETED, (data: any) => {
            this.emit('historyFiles');
        })
        this._teduBoard.on(window.TEduBoard.EVENT.TEB_GOTOBOARD, (data: any) => {
            const scale = this._teduBoard.getBoardScale();
            this.emit('getCurrentBoardScale', scale || 125);
        })
        this._teduBoard.on(window.TEduBoard.EVENT.TEB_SWITCHFILE, (data: any) => {
            const scale = this._teduBoard.getBoardScale();
            this.emit('getCurrentBoardScale', scale || 100);
        })
        this._teduBoard.on(window.TEduBoard.EVENT.TEB_OPERATE_CANREDO_STATUS_CHANGED, (enable: boolean) => {
            this.emit('canredo', enable);
        })
        this._teduBoard.on(window.TEduBoard.EVENT.TEB_OPERATE_CANUNDO_STATUS_CHANGED, (enable: boolean) => {
            this.emit('canundo', enable);
        })
        this._teduBoard.on(window.TEduBoard.EVENT.TEB_AUDIO_STATUS_CHANGED, (data: any) => {
            this.emit('audioStatusChanged', data);
        })
        this._teduBoard.on(window.TEduBoard.EVENT.TEB_VIDEO_STATUS_CHANGED, (data: any) => {
            this.emit('videoStatusChanged', data);
        })
        this._teduBoard.on(window.TEduBoard.EVENT.TEB_SWITCHFILE, (fileId: string) => {
            this.emit('switchFile', fileId);
        })
    }

    // 是否同步本地音频操作状态到远端
    setSyncAudioStatusEnable(enable: boolean) {
        this._teduBoard?.setSyncAudioStatusEnable(enable);
    }

    // 是否同步本地视频操作状态到远端
    setSyncVideoStatusEnable(enable: boolean) {
        this._teduBoard?.setSyncVideoStatusEnable(enable);
    }

    // 刷新当前页白板
    refresh() {
        this._teduBoard?.refresh();
    }

    // 同步本地发送失败的数据到远端并刷新本地数据
    syncAndReload() {
        this._teduBoard?.syncAndReload();
    }

    /**
     * 设置白板是否开启数据同步
     * @param enable 是否开启
     */
    setDataSyncEnable(enable: boolean) {
        this._teduBoard?.setDataSyncEnable(enable);
    }

    /**
     * 添加视频文件
     * @param url (视频文件地址url，只支持https协议的视频文件url, 目前仅支持mp4格式文件)
     * @returns 文件 ID
     */
    addVideoFile(url: string): string {
        return this._teduBoard?.addVideoFile(url);
    }

    /**
     * 添加音频元素
     * @param url (音频文件地址url)
     * @returns 元素ID
     */
    addAudioElement(url: string): string {
        return this._teduBoard?.addElement(window.TEduBoard.TEduBoardElementType.TEDU_BOARD_ELEMENT_GLOBAL_AUDIO, url);
    }

    // 播放视频
    playVideo() {
        this._teduBoard?.playVideo();
    }

    // 暂停视频
    pauseVideo() {
        this._teduBoard?.pauseVideo();
    }

    /**
     * 视频静音
     * @param muted 是否需要静音 true：静音 false： 不静音
     */
    muteVideo(muted: boolean) {
        this._teduBoard?.muteVideo(muted);
    }

    /**
     * 视频跳转到指定位置
     * @param time (播放进度，单位秒)
     */
    seekVideo(time: number) {
        this._teduBoard?.seekVideo(time);
    }

    /**
     * 播放音频
     * @param elementId (添加音频元素返回值元素 ID)
     */
    playAudio(elementId: string) {
        this._teduBoard?.playAudio(elementId);
    }

    /**
     * 音频是否静音
     * @param elementId (添加音频元素返回值元素 ID)
     * @param muted 是否需要静音 true：静音 false： 不静音
     */
    muteAudio(elementId: string, muted: boolean) {
        this._teduBoard?.muteAudio(elementId, muted);
    }

    /**
     * 暂停音频
     * @param elementId (添加音频元素返回值元素 ID)
     */
    pauseAudio(elementId: string) {
        this._teduBoard?.pauseAudio(elementId);
    }

    /**
     * 视频跳转到指定位置
     * @param elementId (添加音频元素返回值元素 ID)
     * @param progress (音频进度)
     */
    seekAudio(elementId: string, progress: number) {
        this._teduBoard?.seekAudio(elementId, progress);
    }

    /**
     * 设置音频音量
     * @param elementId (添加音频元素返回值元素 ID)
     * @param volume (音频音量，取值范围[0-1])
     */
    setAudioVolume(elementId: string, volume: number) {
        this._teduBoard?.setAudioVolume(elementId, volume);
    }

    /**
     * 隐藏和显示视频控制栏
     * 全局控制项，对所有视频文件有效
     * @param show (是否显示视频控制栏)
     */
    showVideoControl(show: boolean) {
        this._teduBoard?.showVideoControl(show);
    }

    addBoard(): string {
        return this._teduBoard?.addBoard();
    }

    // 设置白板是否允许涂鸦
    setDrawEnable(enable: boolean) {
        this._teduBoard?.setDrawEnable(enable);
        if (!enable) this.setMouse();
    }

    addSyncData(data: any) {
        this._teduBoard?.addSyncData(data);
    }

    // 设置画笔,文本颜色
    setBrushColor(color: string) {
        this._teduBoard?.setBrushColor(color);
        this._teduBoard?.setTextColor(color);
    }

    // 设置画笔粗细
    setBrushThin(thin: number) {
        const ele = document.querySelector('.tx_board_canvas_box');
        let result = Math.floor(thin * 10000 / (ele?.clientHeight || 640));
        this._teduBoard?.setBrushThin(result);
    }

    // 设置文本大小
    setTextSize(size: number) {
        const ele = document.querySelector('.tx_board_canvas_box');
        let result = size * 10000 / (ele?.clientHeight || 640);
        this._teduBoard?.setToolType(window.TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_TEXT);
        this._teduBoard?.setTextStyle(window.TEduBoard.TEduBoardTextStyle.TEDU_BOARD_TEXT_STYLE_NORMAL);
        this._teduBoard?.setTextSize(result);
    }

    // 设置直线样式
    setLineStyle() {
        this._teduBoard?.setToolType(window.TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_LINE);
    }

    // 设置椭圆绘制模式
    setOvalDrawMode() {
        this._teduBoard?.setToolType(window.TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_OVAL);
    }

    // 设置矩形绘制模式
    setRect() {
        this._teduBoard?.setToolType(window.TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_RECT);
    }

    // 设置画笔工具
    setPen() {
        this._teduBoard?.setToolType(window.TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_PEN);
    }

    // 设置鼠标工具
    setMouse() {
        this._teduBoard?.setToolType(window.TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_MOUSE);
        this._teduBoard?.setMouseToolBehavior({
            turnPage: {
              whiteBoard: false, // 普通白板点击可翻页
              h5PPT: false, // 动态ppt转码的文件点击可翻页
              imgPPT: false, // 静态ppt转码文件点击不可翻页
              imgFile: false, // 图片文件（addImagesFile接口添加的文件）点击不可翻页
            }
          })
    }

     // 设置手势
    setZoomDrag() {
        this._teduBoard?.setZoomCursorIcon({cursor: 'grab'}, {cursor: 'grab'});
        this._teduBoard?.setToolType(window.TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_ZOOM_DRAG);
    }

    // 设置橡皮擦
    setEraser() {
        this._teduBoard?.setCursorIcon(window.TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_ERASER, {
            cursor: 'url',
            url: EraserImg,
            offsetX: 6,
            offsetY: 6
        })
       this._teduBoard?.setToolType(window.TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_ERASER);
    }

    // 设置激光笔
    setLaser() {
        this._teduBoard?.setToolType(window.TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_LASER);
    }

    //清空当前白板页涂鸦
    clear() {
        this._teduBoard?.clear();
    }

    //撤销当前白板页上一次动作
    undo() {
        this._teduBoard?.undo();
    }

    //重做当前白板页上一次撤销
    redo() {
        this._teduBoard?.redo();
    }

    //跳转到指定白板页
    gotoBoard(boardId: string) {
        this._teduBoard?.gotoBoard(boardId);
    }

    /**
     * 设置当前白板页缩放比例
     */
     setBoardScale(scale: number) {
        this._teduBoard?.setBoardScale(scale);
    }

    // 切换文件
    switchFile(fileId: string) {
        this._teduBoard?.switchFile(fileId);
    }

    // 删除文件
    deleteFile(fileId: string) {
        this._teduBoard?.deleteFile(fileId);
    }

    // 文件转码
    applyFileTranscode(fileObj: any, config: any) {
        this._teduBoard?.applyFileTranscode(fileObj, config);
    }

    // 添加转码文件
    addTranscodeFile(config: AddTransCodeFileParams): string {
        return this._teduBoard?.addTranscodeFile(config, false);
    }

    // 课件上一页
    prevStep() {
        this._teduBoard?.prevStep();
    }

    // 课件下一页
    nextStep() {
        this._teduBoard?.nextStep();
    }

    // 获取当前文件 ID
    getCurrentFile(): string {
        return this._teduBoard?.getCurrentFile();
    }

    // 获取白板中上传的所有文件的文件信息列表
    getFileInfoList(): FileInfo[] {
        return this._teduBoard?.getFileInfoList();
    }

    // 获取白板中指定文件的文件信息
    getFileInfo(fileId: string): FileInfo {
        return this._teduBoard?.getFileInfo(fileId);
    }

    // 获取当前白板页缩放比例
    getBoardScale(): number {
        return this._teduBoard?.getBoardScale();
    }

    /**
     * 获取白板音频元素列表
     * Returns: elements 音频元素数组
     */
    getBoardAudioList(): BoardElement[] {
        const boardElementList = this._teduBoard?.getBoardElementList();
        return boardElementList?.filter((item: any) => item.type === window.TEduBoard.TEduBoardElementType.TEDU_BOARD_ELEMENT_GLOBAL_AUDIO);
    }

    /**
     * 删除白板元素
     * param: id(string) 元素id
     * Returns: 删除是否成功
     */
    removeElement(id: string): boolean {
        return this._teduBoard?.removeElement(id);
    }

}