interface Response {
    status: string;
    code: number;
    timestamp: number;
}

export interface HttpResponse extends Response{
    data: Record<string, any> | null;
    error: Record<string, any> | null;
    message?: string | null;
}