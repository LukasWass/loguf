import fetch from "node-fetch";

interface IResponse {
    success: boolean;
    message: string;
}

enum DataType {
    Event = 0,
    Exception = 1
}

interface IPublishData {
    timestamp: number;
    userId: string;
    type: DataType;
    event: string;
    properties: any;
}

export default class Loguf {
    private static uri: string = "";
    private static userId: string = "";
    private static debug: boolean = false;

    public static setDebug = (debug: boolean): void => {
        Loguf.debug = debug;
    }

    private static localDebugLog = (text: string, displayWarning?: boolean): void => {
        if (Loguf.debug) {
            console.log(`Loguf: ${text}`);

            if (displayWarning !== undefined && displayWarning)
                console.warn(`Loguf: ${text}`);
        }
    }

    public static setUri = (uri: string): void => {
        Loguf.uri = uri;
    }

    public static setUserId = (userId: string): void => {
        Loguf.localDebugLog(`logging for userId: ${userId}`);

        Loguf.userId = userId;
    }

    private static checkIfConnectionDataIsGood = (): boolean => {
        if (Loguf.uri.length < 1)
            Loguf.localDebugLog("uri needs to be set. Use SetUri().");

        if (Loguf.userId.length < 1)
            Loguf.localDebugLog("missing userId. Use SetUserId().");

        return (Loguf.uri.length > 0 && Loguf.userId.length > 0);
    }

    private static publishLog = async (data: IPublishData): Promise<void> => {
        if (Loguf.checkIfConnectionDataIsGood()) {
            Loguf.localDebugLog(`${data.type} - ${data.event}\t${(data.properties) && `properties: ${JSON.stringify(data.properties)}`}`);

            const res: IResponse = await (await fetch(Loguf.uri, {
                method: "POST",
                body: JSON.stringify(data)
            })).json();

            if (!res.success)
                Loguf.localDebugLog(`failed to publish log: ${res.message}`);
        }
    }

    public static event = async (event: string, properties?: any): Promise<void> => {
        const data: IPublishData = {
            timestamp: new Date().valueOf(),
            userId: Loguf.userId,
            type: DataType.Event,
            event: event,
            properties: properties
        };

        await Loguf.publishLog(data);
    }

    public static exception = async (event: string, properties?: any): Promise<void> => {
        const data: IPublishData = {
            timestamp: new Date().valueOf(),
            userId: Loguf.userId,
            type: DataType.Exception,
            event: event,
            properties: properties
        };

        await Loguf.publishLog(data);
    }
}