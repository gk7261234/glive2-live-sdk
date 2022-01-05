export enum RoleType {
    TEACHER = 'teacher',
    MANAGER = 'manager',
    STUDENT = 'student'
}

export enum ROLE_TYPE {
    TEACHER = 1, // 主讲老师
    ASSISTANT, // 助教
    HOST, // 主持人
    STUDENT, // 学员
}

export enum IMEventCode {
    START_VOTE = 10101, //新增答题
    END_VOTE = 10102, //结束答题
    SUBMIT_VOTE = 10103, //学生提交答题
    REAL_TIME_STATISTICS = 10104, // 答题实时统计
    STATISTICS_RESULT = 10105, //获取统计结果
    CLOSE_STATISTICS = 10106, //关闭答题结果
    SEND_PUBLIC_MESSAGE = 10201, // 公聊
    SEND_PRIVATE_MESSAGE = 10206, // 私聊
    BAN_CHAT = 10202, //聊天禁言
    BAN_DELETE_CHAT = 10203, //聊天禁言并删除历史记录
    UNBAN_CHAT = 10204, //解除禁言
    DELETE_CHAT = 10205, //聊天删除
    ALL_BAN_CHAT = 10207, //全体禁言
    ALL_UNBAN_CHAT = 10208, //解除全体禁言
    SEND_QUESTION = 10301, //公开问答
    START_QUESTION = 10302, //新增提问
    REPLY_QUESTION = 10303, //回复问题
    CANCEL_QUESTION_PUBLIC = 10304, //取消公开问答
    ADD_ANNOUNCEMENT = 10401, //新增公告
    ENTER_LIVE_ROOM = 10501, //进入直播间
    LEAVE_LIVE_ROOM = 10502, //离开直播间
    KICK_OUT_LIVE_ROOM = 10503, //踢出直播间
    START_CLASS = 10505, // 开始上课
    END_CLASS = 10506, // 结束上课
    PRIVATE_CHAT_LIST = 10507, //学生端私聊列表
    CLOSE_LIVE_ROOM = 10508, // 关闭直播间
    SET_LECTURE_PERMISSION = 10511, // 主讲
    SET_DOCUMENT_PERMISSION = 10512, // 文档权限
    SET_DATA_SYNC_ENABLE = 10601, //开启白板数据同步
    SET_PIC = 10602, // 视频区域设置为图片
    SET_VIDEO = 10603, // 视频区域设置为视频
    START_MUTE = 10604, // 开启静音
    CLOSE_MUTE = 10605, // 关闭静音
    OPEN_CAMERA = 10606,  // 开启摄像头
    CLOSE_CAMERA = 10607,  // 关闭摄像头
    START_SCREEN_SHARE = 10701, // 开启屏幕共享
    CLOSE_SCREEN_SHARE = 10702, // 关闭屏幕共享
    CONNECT_STREAM = 10801, // 推流
    DISCONNECT_STREAM = 10802, // 断流
    SEND_PRIVATE_MESSAGE_TEACHER = 10209, //私聊老师、助教
    CLOSE_MP3 = 10901, // 关闭MP3
}

export enum IMEventName {
    START_VOTE = 'startVote', //新增答题
    END_VOTE = 'endVote', //结束答题
    SUBMIT_VOTE = 'submitVote', //学生提交答题
    REAL_TIME_STATISTICS = 'realTimeStatistic', // 答题实时统计
    STATISTICS_RESULT = 'statisticsResult', //获取统计结果
    CLOSE_STATISTICS = 'closeStatistics', //关闭答题结果
    SEND_PUBLIC_MESSAGE = 'sendPublicMessage', // 公聊
    SEND_PRIVATE_MESSAGE = 'sendPrivateMessage', // 私聊
    BAN_CHAT = 'banChat', //聊天禁言
    BAN_DELETE_CHAT = 'banDeleteChat', //聊天禁言并删除历史记录
    UNBAN_CHAT = 'unbanChat', //解除禁言    
    DELETE_CHAT = 'deleteChat', //聊天删除
    SEND_QUESTION = 'sendQuestion', //公开问答
    START_QUESTION = 'startQuestion', //新增提问
    REPLY_QUESTION = 'replyQuestion', //回复问题
    CANCEL_QUESTION_PUBLIC = 'cancelQuestionPublic', //取消公开问答
    ADD_ANNOUNCEMENT = 'addAnnouncement', //新增公告
    ENTER_LIVE_ROOM = 'enterLiveRoom', //进入直播间
    LEAVE_LIVE_ROOM = 'leaveLiveRoom', //离开直播间
    KICK_OUT_LIVE_ROOM = 'kickOutLiveRoom', //踢出直播间
    START_CLASS = 'startClass', // 开始上课
    END_CLASS = 'endClass', // 结束上课
    ALL_BAN_CHAT = 'allBanChat', //全体禁言
    ALL_UNBAN_CHAT = 'allUnBanChat', //解除全体禁言
    PRIVATE_CHAT_LIST = 'privateChatList', //学生端私聊列表
    CLOSE_LIVE_ROOM = 'closeLiveRoom', // 关闭直播间
    SET_LECTURE_PERMISSION = 'setLecturePermission', // 主讲
    SET_DOCUMENT_PERMISSION = 'setDocumentPermission', // 文档权限
    SET_DATA_SYNC_ENABLE = 'setDataSyncEnable', //开启白板数据同步
    SET_PIC = 'setPic', // 视频区域设置为图片
    SET_VIDEO = 'setVideo', // 视频区域设置为视频
    START_MUTE = 'startMute', // 开启静音
    CLOSE_MUTE = 'closeMute', // 关闭静音
    OPEN_CAMERA = 'openCamera',  // 开启摄像头
    CLOSE_CAMERA = 'closeCamera',  // 关闭摄像头
    START_SCREEN_SHARE = 'startScreenShare', // 开启屏幕共享
    CLOSE_SCREEN_SHARE = 'closeScreenShare', // 关闭屏幕共享
    CONNECT_STREAM = 'connectStream', // 推流
    DISCONNECT_STREAM = 'disconnectStream', // 断流
    SEND_PRIVATE_MESSAGE_TEACHER = 'sendPrivateTeacher', // 私聊老师
    CLOSE_MP3 = 'closeMP3', // 关闭MP3
}


export enum ChatTypes{
    PUBLIC = 'GROUP',
    PRIVATE = 'C2C'
}

export enum MessageType {
    Image,
    Text
}


export  enum TRTCBeautyStyle {
    TRTCBeautyStyleSmooth , //光滑，适用于美女秀场，效果比较明显。
    TRTCBeautyStyleNature   //自然，磨皮算法更多地保留了面部细节，主观感受上会更加自然。
}


/**
 * @description 网络质量
    0：质量未知
    1：质量极好
    2：主观感觉和极好差不多，但码率可能略低于极好
    3：主观感受有瑕疵但不影响沟通
    4：勉强能沟通但不顺畅
    5：网络质量非常差，基本不能沟通
    6：网络连接已断开，完全无法沟通
 */
export enum NetworkQuality  {
  UNKNOWN,
  COOL,
  GOOD,
  SOSO,
  BAD,
  TOO_BAD,
  BREAK

}

export enum IMState {
    READY = 'im-ready',
    NOT_READY = 'im-not-ready',
    ERROR = 'im-error',
}

export enum ThirdSupplier {
    TX,
    GD
}