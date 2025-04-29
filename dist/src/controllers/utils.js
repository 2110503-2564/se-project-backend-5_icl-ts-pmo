export function readPagination(req, defaultLimit = 25) {
    return { page: Number(req.query.page) || 0, limit: Number(req.query.limit) || defaultLimit };
}
export function validateRegex(value) {
    try {
        new RegExp(value);
    }
    catch {
        return "^$.";
    }
    return value;
}
