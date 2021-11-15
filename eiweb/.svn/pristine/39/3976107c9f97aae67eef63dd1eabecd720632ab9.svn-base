import http from "comp/http-common";


class UploadFilesService {
    upload(file, onUploadProgress) {
        let formData = new FormData();

        formData.append("uploadfile", file);

        return http.post("/file/upload ", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress,
        });
    }

    getFiles() {
        return http.get("/file/files");
    }
}

export default new UploadFilesService();