import { EventEmitter } from 'events';
import TIM from 'tim-js-sdk';
import { IMEventCode, ChatTypes, IMEventName, IMState } from '../../../constants/enum';
import { formatMsg } from '../../../utils/basic';
import {ICommonCustomMsg, ImParams } from '../../../types/common';
import { TencentIM as IM } from '../../../types/tencent/im';
export class TencentIM  extends EventEmitter implements IM{
    tim: any;
    commonCustomMsg: ICommonCustomMsg;
    timState: string;
    groupId: string;
    meetingGroupId?: string;
    constructor(imParams: ImParams, IMCommonCustomMsg: ICommonCustomMsg){
        super();
        this.init(imParams);
        this.commonCustomMsg = IMCommonCustomMsg;
        this.timState = IMState.NOT_READY;
        this.groupId = imParams.groupID;
        this.meetingGroupId = imParams.meetingGroupId;
    }
    init(imParams: ImParams){
        const { userId, SDKAppID, userSig } = imParams;
        this.tim = TIM.create({SDKAppID});
        this.tim.login({userID: userId, userSig});
        this.tim.setLogLevel(1);
        this.tim.on(TIM.EVENT.SDK_READY, () => {
            this.timState = IMState.READY;
            this.meetingGroupId && this.joinChatRoomGroup(true);
            this.emit(IMState.READY, 'waitApproval');
        });
        this.tim.on(TIM.EVENT.MESSAGE_RECEIVED, (data: any) => {
            for (let value of data.data) {
                const type = value.type;
                if (type && type === TIM.TYPES.MSG_CUSTOM) {
                    const message = formatMsg(value);
                    // 确认进入和接收的是同一直播间数据
                    if (message.roomId !== this.commonCustomMsg.roomId) return;
                    for(let i in IMEventCode) {
                        if (IMEventCode[i] === message.cmd) {
                            this.onMessage(IMEventName[i as keyof typeof IMEventName], message);
                            break;
                        }
                    }
                }
            }
        });
        this.tim.on(TIM.EVENT.SDK_NOT_READY, (evt:any) => {
            this.timState = IMState.NOT_READY;
            this.emit(IMState.NOT_READY, IMState.NOT_READY);
            this.emit('im-disconnected');
        });
        this.tim.on(TIM.EVENT.NET_STATE_CHANGE, (event: any) => {
            if (event === TIM.TYPES.NET_STATE_DISCONNECTED) {
                this.emit('im-disconnected');
            }  
        });
        this.tim.on(TIM.EVENT.ERROR, (evt:any) => {
            this.timState = IMState.ERROR;
            this.emit(IMState.ERROR, IMState.ERROR);
            this.emit('im-disconnected');
        });
        this.tim.on(TIM.EVENT.KICKED_OUT, () => {
            this.emit('im-disconnected', 'repeatLogin');
        });
    }

    getMessageHistory(){
        return []
    }
    /*
    * 发送公共消息
    * @params
    * userID:string //消息接收方的 userID
    * data:string //自定义消息的数据字段
    */
    sendTXWhiteBoardMessage(groupId:string, data:any) {
        if (this.timState !== IMState.READY){
            return Promise.reject(this.timState);
        }
        data = {...this.commonCustomMsg, ...data};
        // 创建消息实例，接口返回的实例可以上屏
        let message = this.tim.createCustomMessage({
            to: groupId,
            conversationType: ChatTypes.PUBLIC,
            priority: TIM.TYPES.MSG_PRIORITY_HIGH,  // 因为im消息有限频，白板消息的优先级调整为最高
            payload: {
                data: JSON.stringify(data),
                description: '',
                // extension: 'TXWhiteBoardExt'
            }
        });
        return new Promise((resolve, reject) => {
            this.tim.sendMessage(message).then((imResponse: any) => {
                // 发送成功
                console.log('sendMessage success:', imResponse);
                this.sendTXWhiteBoardMessageToMeeting(data);
                resolve(formatMsg(imResponse.data.message));
            }).catch(function(imError: any) {
                // 发送失败
                console.warn('sendMessage error:', imError);
                reject(imError);
            });
        });
    }

    /**
     * 同步发一份白板数据到普通群，提供白板数据同步白板推流服务
     * @param groupId 
     * @param data 
     */
    sendTXWhiteBoardMessageToMeeting(data: any){
        if(!this.meetingGroupId) return;
        const copyMessage = this.tim.createCustomMessage({
            to: this.meetingGroupId,
            conversationType: ChatTypes.PUBLIC,
            priority: TIM.TYPES.MSG_PRIORITY_HIGH,  // 因为im消息有限频，白板消息的优先级调整为最高
            payload: {
                data: JSON.stringify(data.whiteBoardDataSync),
                description: '',
                extension: 'TXWhiteBoardExt'
            }
        })
        this.tim.sendMessage(copyMessage).catch((error: any) => {
            console.error('白板数据同步推流服务失败--', error)
        });
    }
    /*
    * 发送公共消息
    * @params
    * userID:string //消息接收方的 userID
    * data:string //自定义消息的数据字段
    */
    sendPublicMessage(groupId:string, data: ICommonCustomMsg) {
        if (this.timState !== IMState.READY){
            return Promise.reject(this.timState);
        }
        data = {...this.commonCustomMsg, ...data};
        // 创建消息实例，接口返回的实例可以上屏
        let message = this.tim.createCustomMessage({
            to: groupId,
            conversationType: ChatTypes.PUBLIC,
            payload: {
                data: JSON.stringify(data),
                description: '',
                extension: ''
            }
        });
        return new Promise((resolve, reject) => {
            this.tim.sendMessage(message).then((imResponse: any) => {
                // 发送成功
                console.log('sendMessage success:', imResponse);
                resolve(formatMsg(imResponse.data.message));
            }).catch(function(imError: any) {
                // 发送失败
                console.warn('sendMessage error:', imError);
                reject(imError);
            });
        });
    }
    /*
    * 发送私有消息
    * @params
    * userID:string //消息接收方的 userID
    * data:string //自定义消息的数据字段
    */
    sendPrivateMessage(userID: number, data: ICommonCustomMsg) {
        if (this.timState !== IMState.READY){
            return Promise.reject(this.timState);
        }
        data = {...this.commonCustomMsg, ...data};
        let to = userID;
        // 创建消息实例，接口返回的实例可以上屏
        let message = this.tim.createCustomMessage({
            to: to.toString(),
            conversationType: ChatTypes.PRIVATE,
            payload: {
                data: JSON.stringify(data),
                description: '',
                extension: ''
            }
        });
        return new Promise((resolve, reject) => {
            this.tim.sendMessage(message).then((imResponse: any) => {
                // 发送成功
                console.log('sendMessage success:', imResponse);
                resolve(formatMsg(imResponse.data.message));
            }).catch(function(imError: any) {
                // 发送失败
                console.warn('sendMessage error:', imError);
                reject(imError);
            });
        });
    }
    /**
     * 加入普通群聊
     */
     joinChatRoomGroup(onoff: boolean) {
        if (!onoff) return;
        const promise = this.tim.joinGroup({groupID: this.meetingGroupId, type: TIM.TYPES.GRP_MEETING});
        promise.then((imResponse: any) => {
            switch (imResponse.data.status) {
                case TIM.TYPES.JOIN_STATUS_WAIT_APPROVAL: // 等待管理员同意
                    break;
                case TIM.TYPES.JOIN_STATUS_SUCCESS: // 加群成功
                    console.log(imResponse.data.group); // 加入的群组资料
                    break;
                case TIM.TYPES.JOIN_STATUS_ALREADY_IN_GROUP: // 已经在群中
                    break;
                default:
                    break;
            }
        }).catch((imError: any) => {
            console.warn('joinGroup error:', imError); // 申请加群失败的相关信息
        });
    }
    /**
     * 加入直播群聊
     */
    joinGroup(onoff: boolean) {
        if (!onoff) return this.emit('joinStatus', 'joinSuccess');
        const promise = this.tim.joinGroup({groupID: this.groupId, type: TIM.TYPES.GRP_AVCHATROOM});
        promise.then((imResponse: any) => {
            switch (imResponse.data.status) {
                case TIM.TYPES.JOIN_STATUS_WAIT_APPROVAL: // 等待管理员同意
                    this.emit('joinStatus', 'waitApproval');
                    break;
                case TIM.TYPES.JOIN_STATUS_SUCCESS: // 加群成功
                    this.emit('joinStatus', 'joinSuccess');
                    console.log(imResponse.data.group); // 加入的群组资料
                    break;
                case TIM.TYPES.JOIN_STATUS_ALREADY_IN_GROUP: // 已经在群中
                    this.emit('joinStatus', 'joinSuccess');
                    break;
                default:
                    this.emit('joinStatus', 'joinFail');
                    this.emit('im-disconnected');
                    break;
            }
        }).catch((imError: any) => {
            this.emit('joinStatus', 'joinFail');
            this.emit('im-disconnected');
            console.warn('joinGroup error:', imError); // 申请加群失败的相关信息
        });
    }

    /**
     * 退出群组
     */
    quitGroup() {
        this.tim.quitGroup(this.groupId);
    }

    onMessage(eventName: string, ctx: any){
        this.emit(eventName, ctx);
    }

}