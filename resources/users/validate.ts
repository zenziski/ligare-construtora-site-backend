module.exports = (app: any) => ({
    verb: "get",
    route: '/validate',
    handler: async (req: any, res: any) => {
        return res.status(200).json({ valid: true });
    }
});