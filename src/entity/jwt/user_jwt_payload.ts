export enum UserJwtTokenType {
    REFRESH,
    ACCESS
}

export interface UserJwtPayload {
    userId: number,
    sessionId: number,
    role: string,
    type: UserJwtTokenType
}