import { LoggerInterface, LoggerLevelEnum } from './interfaces';
export declare class LoggerService implements LoggerInterface {
    private level?;
    constructor(level?: LoggerLevelEnum);
    log(message: string, args: [any]): void;
    warn(message: string, args: [any]): void;
    error(message: string, args: [any]): void;
    setLevel(level: LoggerLevelEnum): void;
}
