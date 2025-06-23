export const notFound = async (req, res) => {
    return res.status(404).send("route not found")
}