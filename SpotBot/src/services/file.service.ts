import { autoInjectable } from "tsyringe"

@autoInjectable()
class FileService {
    private fileName: string

    public constructor(name: string) {
        this.fileName = name
    }

    public getFileName(): string {
        return this.fileName
    }
}
