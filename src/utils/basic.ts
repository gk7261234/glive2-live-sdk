export function formatMsg(msg: any) {
    const data = JSON.parse(msg.payload.data || '{}');
    let dataJson;
    if (typeof data.dataJson === 'string') {
        dataJson = JSON.parse(data.dataJson || '{}');
    } else {
        dataJson = data.dataJson || {};
    }
    const result = {
        cmd: data?.cmd,
        id: dataJson?.id,
        userId: data?.from?.id,
        userName: data?.from?.name, // 用户名称
        userHeadImg: data?.from?.userHeadImg,
        roleType: data?.from?.role,
        groupId: data?.groupId, // 分组Id
        groupName: data?.groupName,
        content: data?.dataContent,
        roomId: data?.roomId,
        toUserId: data?.to?.id,
        toUserName: data?.to?.name,
        toRoleType: data?.to?.role,
        whiteBoardDataSync: data?.whiteBoardDataSync, // 同步白板数据
        answerStatus: dataJson, // 答题题目
        question: dataJson, // 问答
        statistics: dataJson, // 答题统计
        chatType: dataJson?.chatType, // 聊天类型
        privateList: dataJson, // 私聊列表
        teacherPic: dataJson?.teacherPic, // 视频区域为教师图片
        teacherPicInfo: dataJson, // 视频区域数据
        audioId: dataJson?.audioId,
        chatTime: "",
    }
    return result;
}