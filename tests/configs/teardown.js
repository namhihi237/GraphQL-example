import { prisma } from "../../src/configs";
module.exports = async function () {
    await global.server.stop();
    await prisma.account.deleteMany();
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();
};
