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
    userId: string;
    type: DataType;
    event: string;
    properties: any;
}

export default class Loguf {
    private static Uri: string = "";
    private static UserId: string = "";
    private static Debug: boolean = false;

    public static SetDebug = (debug: boolean): void => {
        Loguf.Debug = debug;
    }

    private static LocalDebugLog = (text: string): void => {
        if (Loguf.Debug) {
            console.log(`Loguf: ${text}`);
        }
    }

    public static SetUri = (uri: string): void => {
        Loguf.Uri = uri;
    }

    public static SetUserId = (userId: string): void => {
        Loguf.LocalDebugLog(`logging for userId: ${userId}`);

        Loguf.UserId = userId;
    }

    private static CheckIfConnectionDataIsGood = (): boolean => {
        if (Loguf.Uri.length < 1)
            Loguf.LocalDebugLog("uri needs to be set. Use SetUri().");

        if (Loguf.UserId.length < 1)
            Loguf.LocalDebugLog("missing userId. Use SetUserId().");

        return (Loguf.Uri.length > 0 && Loguf.UserId.length > 0);
    }

    private static PublishLog = async (data: IPublishData): Promise<void> => {
        if (!Loguf.CheckIfConnectionDataIsGood()) {
            Loguf.LocalDebugLog(`${data.type} - ${data.event}\t${(data.properties) && `properties: ${data.properties}`}`);

            const res: IResponse = await (await fetch(Loguf.Uri, {
                method: "POST",
                body: JSON.stringify(data)
            })).json();

            if (!res.success)
                Loguf.LocalDebugLog(`failed to publish log: ${res.message} `);
        }
    }

    public static Event = async (event: string, properties?: any): Promise<void> => {
        const data: IPublishData = {
            userId: Loguf.UserId,
            type: DataType.Event,
            event: event,
            properties: properties
        };

        await Loguf.PublishLog(data);
    }

    public static Exception = async (event: string, properties?: any): Promise<void> => {
        const data: IPublishData = {
            userId: Loguf.UserId,
            type: DataType.Exception,
            event: event,
            properties: properties
        };

        await Loguf.PublishLog(data);
    }
}