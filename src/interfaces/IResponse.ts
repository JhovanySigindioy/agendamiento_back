export interface IResponse<T> {
    success: boolean;
    data: T | T[] | null;
    error: string | null;
}