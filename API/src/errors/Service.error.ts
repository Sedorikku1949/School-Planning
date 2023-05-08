export enum ServiceErrorCodes {
    BAD_URL
}

export default class ServiceError extends Error {

    constructor(message: string, public code: ServiceErrorCodes, public status: number) {
        super(message);

        this.code = code;
        this.status = status;
    }
}