export function areNumbers (elements: any[]): boolean {
    for (const element of elements) {
        if (!element || isNaN(+element)) return false;
    }
    return true;
}

export function areNotNullOrEmpty (elements: any[]): boolean {
    for (const element of elements) {
        if (!element) return false;
    }
    return true;
}
