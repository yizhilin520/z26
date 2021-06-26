
export interface StateType {
  username: string
  uid: string
  socket: any
  messages: Message[]
  onlineUsers: [],
  onlineCount: number
  userhtml: string
}

export interface Login {
  uid: string
  username: string
}

export interface SystemMessage {
  onlineCount: number
  onlineUsers: []
  message: Message
}

export interface Message {
  type: string
  username: string
  uid: string
  action: string
  msgId: string
  time: string
  messageType?: number
}

export interface UserMessage {
  message: Message
}


export interface Payload extends UserMessage, SystemMessage, Login { }

export interface ActionType {
  type: string
  payload: Payload
}

export interface EmitOnMsg {
  messageId: string,
  username: string,
  messageType: number,
  message: string
  userId: string
}