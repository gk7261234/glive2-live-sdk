import { EventEmitter } from 'events';
import { RoleType, IMEventCode, IMEventName, ROLE_TYPE } from '../../constants/enum';
import { TencentIM } from '../tencent/im';
import { InitParams, ThirdSupplier, ICommonCustomMsg, ImParams, IWhiteBoard } from "../../types/common"
import { Player, IPrivateChatItem, IReplyVote, PlayParams } from "../../types/player"

declare var window: Window & {
    TXLivePlayer: any
}
export class PlayerClient extends EventEmitter implements Player {
    roleType: RoleType = RoleType.STUDENT
    im!: TencentIM
    board!: IWhiteBoard
    livePlayer!: typeof window.TXLivePlayer
    _roomId!: string

    constructor(initParams: InitParams, commonCustomMsg: ICommonCustomMsg) {
        super();
        this._roomId = initParams.roomId;
        this.init(initParams, commonCustomMsg);
    }

    init(initParams: InitParams, commonCustomMsg: ICommonCustomMsg) {
        const { imParams, thirdName } = initParams;
        this._initIm(imParams, commonCustomMsg, thirdName?.im);
        this._initPlayer();
        this._bindEvent();
    }
    private async _initIm(imParams: ImParams, commonCustomMsg: ICommonCustomMsg, thirdSupplier?: ThirdSupplier) {
        await new Promise((resolve, reject) => {
            switch (thirdSupplier) {
                case ThirdSupplier.TX:
                    this.im = new TencentIM(imParams, commonCustomMsg);
                    break;
                default:
                    this.im = new TencentIM(imParams, commonCustomMsg);
            }
            this.im.on('im-ready', () => {
                console.log('——————————————im组件加载成功————————————————')
                this.emit('im-ready')
                resolve(true)
            })
            this.im.on('im-error', (error) => {
                console.log('——————————————im组件加载失败————————————————')
                console.log(error)
                this.emit('im-error')
                reject('im组件初始化失败')
            })
            this.im.on('im-disconnected', (data) => {
                this.emit('im-disconnected', data);
            })
            this.im.on('joinStatus', (data) => {
                this.emit('joinStatus', data);
            })
        })
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
     * 发送公聊
     */
    sendPublicChat(dataContent: string, banType: number, chatType?: number,) {
        const data: any = {
            dataContent,
            cmd: IMEventCode.SEND_PUBLIC_MESSAGE,
        }
        if (chatType) {
            data['dataJson'] = JSON.stringify({ banType, chatType });
        } else {
            data['dataJson'] = JSON.stringify({ banType });
        }
        return this.im.sendPublicMessage(this._roomId, data);
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
     * 发送私聊
     */
    sendPrivateChat(userInfo: IPrivateChatItem, dataContent: string, banType: number, chatType?: number) {
        if (!userInfo?.userId) return;
        const data: any = {
            dataContent,
            cmd: IMEventCode.SEND_PRIVATE_MESSAGE,
            to: {
                id: userInfo.userId,
                name: userInfo.userName,
                role: userInfo.roleType
            }
        }
        if (chatType) {
            data['dataJson'] = JSON.stringify({ banType, chatType });
        } else {
            data['dataJson'] = JSON.stringify({ banType });
        }
        return this.im.sendPrivateMessage(userInfo.userId, data);
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
     * 回复问题
     */
    replyQuestion(reply: any) {
        let data = {
            dataContent: reply.message,
            cmd: IMEventCode.REPLY_QUESTION,
            dataJson: JSON.stringify({ id: reply.id })
        };
        return this.im.sendPublicMessage(this._roomId, data);
    }

    /**
     * 公开问答
     */
    publicQuestion(id: string) {
        return this.im.sendPublicMessage(this._roomId, { dataJson: JSON.stringify({ id }), cmd: IMEventCode.SEND_QUESTION });
    }

    /**
     * 取消公开问答
     */
    cancelQuestionPublic(params: any) {
        return this.im.sendPublicMessage(this._roomId, { dataJson: JSON.stringify(params), cmd: IMEventCode.CANCEL_QUESTION_PUBLIC });
    }

    /**
     * 全体禁言
     */
    allBanChat() {
        return this.im.sendPublicMessage(this._roomId, { cmd: IMEventCode.ALL_BAN_CHAT });
    }

    /**
     * 解除全体禁言
     */
    allUnBanChat() {
        return this.im.sendPublicMessage(this._roomId, { cmd: IMEventCode.ALL_UNBAN_CHAT });
    }

    /**
     * 聊天禁言
     */
    banChat(userId: number) {
        return this.im.sendPublicMessage(this._roomId, { to: { id: userId }, cmd: IMEventCode.BAN_CHAT });
    }

    /**
     * 聊天禁言并删除历史记录
     */
    banDeleteChat(userId: number) {
        return this.im.sendPublicMessage(this._roomId, { to: { id: userId }, cmd: IMEventCode.BAN_DELETE_CHAT });
    }

    /**
     * 解除禁言
     */
    unBanChat(userId: number) {
        return this.im.sendPublicMessage(this._roomId, { to: { id: userId }, cmd: IMEventCode.UNBAN_CHAT });
    }

    /**
     * 聊天删除
     */
    deleteChat(id: number) {
        return this.im.sendPublicMessage(this._roomId, { dataJson: JSON.stringify({ id }), cmd: IMEventCode.DELETE_CHAT });
    }

    /**
     * 新增公告
     */
    addAnnouncement(dataContent: string) {
        return this.im.sendPublicMessage(this._roomId, { dataContent, cmd: IMEventCode.ADD_ANNOUNCEMENT });
    }


    /**
     * 踢出直播间
     */
    kickOutLiveRoom(userId: number) {
        return this.im.sendPrivateMessage(userId, { to: { id: userId }, cmd: IMEventCode.KICK_OUT_LIVE_ROOM });
    }

    /**
     * 加入群聊
     */
    joinGroup(onoff: boolean) {
        this.im.joinGroup(onoff);
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