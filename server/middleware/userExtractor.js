// ─── Anonymous User Extractor Middleware ─────────────────
// Reads the anonymousUserId from the request header,
// validates its presence, and attaches it to req.userId
// so all downstream controllers can use it for data isolation.

const userExtractor = (req, res, next) => {
    const userId = req.headers["x-anonymous-user-id"];

    // Reject if header is missing or empty
    if (!userId || typeof userId !== "string" || userId.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Missing required header: x-user-id",
        });
    }

    // Attach the sanitized userId to the request object
    req.userId = userId.trim();

    next();
};

export default userExtractor;
