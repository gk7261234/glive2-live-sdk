import { RoleType, IMEventCode, IMEventName, ROLE_TYPE } from '../../constants/enum';
import { TencentIM } from '../tencent/im';
import { InitParams, ICommonCustomMsg, IWhiteBoard } from "../../types/common"
import { Player, IReplyVote, PlayParams } from "../../types/player"
import { BaseLive } from "../common"

declare var window: Window & {
    TXLivePlayer: any
}
export class PlayerClient extends BaseLive implements Player {
    roleType: RoleType = RoleType.STUDENT
    im!: TencentIM
    board!: IWhiteBoard
    livePlayer!: typeof window.TXLivePlayer
    _roomId!: string

    constructor(initParams: InitParams, commonCustomMsg: ICommonCustomMsg) {
        super();
        this.init(initParams, commonCustomMsg);
    }

    init(initParams: InitParams, commonCustomMsg: ICommonCustomMsg) {
        const { imParams, thirdName } = initParams;
        this._initIm(imParams, commonCustomMsg, initParams.roomId, thirdName?.im);
        this._initPlayer();
        this._bindEvent();
    }

    private _initPlayer() {
        this.livePlayer = new window.TXLivePlayer();
        // 设置视频流断连重连次数与每次重连间隔时间
        this.livePlayer.setConfig({
            connectRetryCount: 10,
            connectRetryDelay: 6
        });
        this.livePlayer.setPlayListener({
            onPlayEvent: (event: number, data: any) => {
                this.emit('live-play', event);
            }
        })
    }

    /**
     *  进入直播间
     */
    enterRoom(teacherId: number) {
        const data = {
            cmd: IMEventCode.ENTER_LIVE_ROOM,
            to: { id: teacherId }
        }
        return this.im.sendPrivateMessage(teacherId, data);
    }

    /**
     * 加入房间
     */
    joinRoom(playParmas: PlayParams) {
        this.livePlayer.setPlayerView(playParmas.view);
        this.livePlayer.setControls(false);
    }

    /**
     * 获取播放器 video 元素
     */
    getVideoElement() {
        return this.livePlayer.getVideoElement();
    }

    /**
     * 开始拉流
     */
    startPlay(playUrl: string) {
        this.livePlayer.startPlay(playUrl);
        this.livePlayer.setMute(false);
        this.livePlayer.setVolume(100);
    }

    /**
     * 停止拉流
     */
    stopPlay() {
        this.livePlayer.stopPlay();
    }

    /**
     * 私聊老师
     * @param dataContent
     * @param banType 
     * @param chatType 
     */
    sendPrivateTeacher(dataContent: string, banType: number, chatType?: number) {
        const data: any = {
            dataContent,
            cmd: IMEventCode.SEND_PRIVATE_MESSAGE_TEACHER,
            to: {
                id: 0,
                role: ROLE_TYPE.TEACHER,
                name: "老师",
            }
        }
        console.log("send data: ", data)
        if (chatType) {
            data['dataJson'] = JSON.stringify({ banType, chatType });
        } else {
            data['dataJson'] = JSON.stringify({ banType });
        }
        return this.im.sendPublicMessage(this._roomId, data);
    }

    /**
     *
     * 发送问题
     */
    sendQuestion(dataContent: string) {
        const data = {
            dataContent,
            cmd: IMEventCode.START_QUESTION,
        }
        return this.im.sendPublicMessage(this._roomId, data);
    }

    /**
     *  提交答题
     */

    replayVote(userId: number, answer: IReplyVote) {
        const data = {
            dataJson: answer,
            cmd: IMEventCode.SUBMIT_VOTE,
            to: { id: userId }
        }
        return this.im.sendPrivateMessage(userId, data);
    }

    /**
     * 公开问答
     */
    publicQuestion(id: string) {
        return this.im.sendPublicMessage(this._roomId, { dataJson: JSON.stringify({ id }), cmd: IMEventCode.SEND_QUESTION });
    }

    /**
     * 退出群组
     */
    quitGroup() {
        this.im.quitGroup();
    }

    _bindEvent() {
        for (let i in IMEventName) {
            const funName = IMEventName[i as keyof typeof IMEventName];
            this.im.on(funName, (evt: any) => {
                this.emit(funName, evt);
            })
        }
    }

    destroy() {
        this.livePlayer.destory()
    }
}