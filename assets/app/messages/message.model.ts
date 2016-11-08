export class Message {
    content: string;
    username: string;
    messageId?: number;
    userId?: number;

    constructor(content: string, username: string, messageId?: number, userId?: number) {
        this.content = content;
        this.username = username;
        this.messageId = messageId;
        this.userId = userId;
    }
}