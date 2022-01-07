import { EventEmitter } from 'events';
import { TencentIM } from '../tencent';
import { BaseLive as IBaseLive, ThirdSupplier, ICommonCustomMsg, ImParams, IPrivateChatItem } from "../../types/common";
import { IMEventCode } from '../../constants/enum';
export class BaseLive extends EventEmitter implements IBaseLive {
    im!: TencentIM
    _roomId!: string
    protected async _initIm(imParams: ImParams, commonCustomMsg: ICommonCustomMsg, roomId: string, thirdSupplier?: ThirdSupplier) {
        this._roomId = roomId;
        await new Promise((resolve, reject) => {
            switch (thirdSupplier) {
                case ThirdSupplier.TX:
                    this.im = new TencentIM(imParams, commonCustomMsg)
                default:
                    this.im = new TencentIM(imParams, commonCustomMsg)
            }
            this.im.on('im-ready', (joinGroupStatus) => {
                console.log('——————————————im组件加载成功————————————————')
                this.emit('im-ready', joinGroupStatus)
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

    /**
     * 加入群聊
     */
    joinGroup(onoff: boolean) {
        this.im.joinGroup(onoff);
    }

    /**
    * 发送公聊
    */
    sendPublicChat(dataContent: string, banType: number, chatType?: number) {
        const data: any = {
            dataContent,
            cmd: IMEventCode.SEND_PUBLIC_MESSAGE
        }
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
    sendPrivateChat(userInfo: IPrivateChatItem, dataContent: string, banType: number, chatType?: number){
        if (!userInfo?.userId) return;
        const data: any = {
            dataContent,
            cmd: IMEventCode.SEND_PRIVATE_MESSAGE,
            to: {
                id: userInfo.userId,
                name: userInfo.userName,
                role: userInfo.roleType
            }
        };
        if (chatType) {
            data['dataJson'] = JSON.stringify({banType, chatType});
        } else {
            data['dataJson'] = JSON.stringify({banType});
        }
        return this.im.sendPrivateMessage(userInfo.userId, data);
    }

    /**
     * 聊天删除
     */
    deleteChat(id: number) {
        return this.im.sendPublicMessage(this._roomId, {dataJson: JSON.stringify({id}), cmd: IMEventCode.DELETE_CHAT});
    }

    /**
     * 聊天禁言并删除历史记录
     */
    banDeleteChat(userId: number) {
        return this.im.sendPublicMessage(this._roomId, { to: { id: userId }, cmd: IMEventCode.BAN_DELETE_CHAT });
    }

    /**
     * 聊天禁言
     */
    banChat(userId: number) {
        return this.im.sendPublicMessage(this._roomId, { to: { id: userId }, cmd: IMEventCode.BAN_CHAT });
    }

    /**
     * 解除禁言
     */
    unBanChat(userId: number) {
        return this.im.sendPublicMessage(this._roomId, {to: {id: userId}, cmd: IMEventCode.UNBAN_CHAT});
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
      * 取消公开问答
      */
    cancelQuestionPublic(params: any) {
        return this.im.sendPublicMessage(this._roomId, {dataJson: JSON.stringify(params), cmd: IMEventCode.CANCEL_QUESTION_PUBLIC});
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
        return this.im.sendPrivateMessage(userId, {to: {id: userId}, cmd: IMEventCode.KICK_OUT_LIVE_ROOM});
    }
    

}