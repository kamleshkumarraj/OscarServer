import fs from 'fs/promises'
export const deleteFile = async (files = []) => {
    try {
        const fileArr = files.map((file) => fs.unlink(file));
        await Promise.all(fileArr);
        return { success : true, data : "File deleted successfully" };
    } catch (error) {
        return {success : false, data : error.message};
    }

}